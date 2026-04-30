import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import portraitUrl from "@/assets/hero-card-portrait.jpg";

/* ──────────────────────────────────────────────────────────
   Phase: external state driven by IntroSequence
   0 = awakening (silhouette only)
   1 = assembly (shards arriving)
   2 = night-shift (env morph)
   3 = pull-back (camera pulls out, nodes ignite)
   4 = active (post-intro, faded)
────────────────────────────────────────────────────────── */
export type NeuralPhase = 0 | 1 | 2 | 3 | 4;

const SHARDS: { id: string; label: string; angle: number; color: string }[] = [
  { id: "rag", label: "RAG", angle: 0, color: "#00f0ff" },
  { id: "ai", label: "AI_SYS", angle: 60, color: "#7df9ff" },
  { id: "be", label: "BACKEND", angle: 120, color: "#00f0ff" },
  { id: "data", label: "DATA", angle: 180, color: "#7df9ff" },
  { id: "fe", label: "FRONTEND", angle: 240, color: "#00f0ff" },
  { id: "rl", label: "RL", angle: 300, color: "#7df9ff" },
];

function Silhouette({ phase }: { phase: NeuralPhase }) {
  const tex = useLoader(THREE.TextureLoader, portraitUrl);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uMap: { value: tex },
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uRim: { value: new THREE.Color("#00f0ff") },
    }),
    [tex],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uPhase.value = THREE.MathUtils.lerp(
      uniforms.uPhase.value,
      phase,
      0.05,
    );
    if (matRef.current) matRef.current.uniformsNeedUpdate = true;
  });

  return (
    <mesh position={[0, 0.2, 0]} scale={[2.4, 3.2, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        transparent
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform sampler2D uMap;
          uniform float uTime;
          uniform float uPhase;
          uniform vec3 uRim;

          float rand(vec2 p){return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453);}

          void main() {
            vec4 src = texture2D(uMap, vUv);
            float lum = dot(src.rgb, vec3(0.299,0.587,0.114));
            // High-contrast threshold => silhouette
            float sil = smoothstep(0.35, 0.55, lum);
            // Invert: dark areas become the silhouette body
            float body = 1.0 - sil;

            // Edge detection (cheap)
            float e = 0.0;
            float d = 0.004;
            e += abs(texture2D(uMap, vUv + vec2(d,0)).r - src.r);
            e += abs(texture2D(uMap, vUv + vec2(-d,0)).r - src.r);
            e += abs(texture2D(uMap, vUv + vec2(0,d)).r - src.r);
            e += abs(texture2D(uMap, vUv + vec2(0,-d)).r - src.r);
            float rim = smoothstep(0.04, 0.25, e);

            // Pulse
            float pulse = 0.5 + 0.5 * sin(uTime * 1.6);

            // Grain
            float g = rand(vUv * 800.0 + uTime * 50.0) * 0.08;

            // Color: deep void body + cyan rim that pulses
            vec3 col = vec3(0.02, 0.025, 0.04) * body;
            col += uRim * rim * (0.5 + 0.5 * pulse) * 0.9;
            col += vec3(g);

            float alpha = clamp(body * 0.95 + rim, 0.0, 1.0);
            // Fade out silhouette during pull-back (phase >= 3)
            float fade = 1.0 - smoothstep(2.4, 3.6, uPhase);
            gl_FragColor = vec4(col, alpha * fade);
          }
        `}
      />
    </mesh>
  );
}

function Shard({
  index,
  phase,
  config,
}: {
  index: number;
  phase: NeuralPhase;
  config: (typeof SHARDS)[number];
}) {
  const ref = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const radius = 1.7;
  const targetX = Math.cos((config.angle * Math.PI) / 180) * radius;
  const targetY = Math.sin((config.angle * Math.PI) / 180) * radius;

  // Off-screen origin (different per shard)
  const startX = Math.cos((config.angle * Math.PI) / 180) * 12;
  const startY = Math.sin((config.angle * Math.PI) / 180) * 12;

  useFrame(() => {
    if (!ref.current) return;
    // Per-shard staggered arrival between phase 1 (start) and phase 2
    const arrivalProgress = THREE.MathUtils.clamp(
      (phase - 1) * (SHARDS.length / (SHARDS.length + 0.5)) + 0.05 - index * 0.08,
      0,
      1,
    );
    const eased = 1 - Math.pow(1 - arrivalProgress, 3);
    const x = THREE.MathUtils.lerp(startX, targetX, eased);
    const y = THREE.MathUtils.lerp(startY, targetY, eased);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, x, 0.18);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, y, 0.18);
    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      eased * Math.PI * 0.05 + (config.angle * Math.PI) / 180,
      0.15,
    );

    // Fade after pull-back
    if (matRef.current) {
      const targetOpacity = phase >= 3 ? 0 : 0.9;
      matRef.current.opacity = THREE.MathUtils.lerp(
        matRef.current.opacity,
        targetOpacity,
        0.1,
      );
    }
  });

  return (
    <group ref={ref} position={[startX, startY, 0]}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.2}>
        {/* Glass plate */}
        <mesh>
          <boxGeometry args={[0.9, 0.32, 0.04]} />
          <meshBasicMaterial
            ref={matRef}
            color={config.color}
            transparent
            opacity={0.0}
            wireframe
          />
        </mesh>
        {/* Inner core */}
        <mesh>
          <boxGeometry args={[0.86, 0.28, 0.02]} />
          <meshBasicMaterial color="#020816" transparent opacity={0.7} />
        </mesh>
      </Float>
    </group>
  );
}

function NodeCloud({ phase }: { phase: NeuralPhase }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => {
    // 9 character-map nodes arranged loosely (matches the live map vibe)
    const pts: number[] = [];
    const layout = [
      [-3.5, 1.5, 0], [-1, 0.6, 0.5], [2.5, 1.2, -0.3],
      [-2, -1.4, 0.2], [0.8, -1.6, 0], [3.5, -0.4, 0.4],
      [-3.8, -2.6, -0.2], [0, 2.6, 0.1], [3.7, -2.6, 0.3],
    ];
    layout.forEach(([x, y, z]) => pts.push(x, y, z));
    return new Float32Array(pts);
  }, []);

  useFrame(() => {
    if (matRef.current) {
      const target = phase >= 3 ? 1 : 0;
      matRef.current.opacity = THREE.MathUtils.lerp(
        matRef.current.opacity,
        target,
        0.06,
      );
      matRef.current.size = THREE.MathUtils.lerp(
        matRef.current.size,
        phase >= 3 ? 0.45 : 0.0,
        0.05,
      );
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color="#00f0ff"
        size={0}
        transparent
        opacity={0}
        sizeAttenuation
      />
    </points>
  );
}

function EnvMorph({ phase }: { phase: NeuralPhase }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const colorVoid = useMemo(() => new THREE.Color("#020308"), []);
  const colorOzark = useMemo(() => new THREE.Color("#0a1c33"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    if (!matRef.current) return;
    const t = THREE.MathUtils.clamp((phase - 1.5) / 1.5, 0, 1);
    tmp.copy(colorVoid).lerp(colorOzark, t);
    matRef.current.color.copy(tmp);
    if (ref.current) {
      ref.current.rotation.z += 0.0008;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -8]} scale={[18, 18, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={matRef} color={colorVoid} />
    </mesh>
  );
}

function CameraRig({ phase }: { phase: NeuralPhase }) {
  useFrame(({ camera }) => {
    // Keyframed targets per phase
    const targets = {
      0: { z: 5.5, fov: 45, x: 0, y: 0 },
      1: { z: 4.6, fov: 48, x: 0, y: 0 },
      2: { z: 5.0, fov: 52, x: 1.2, y: 0.2 },
      3: { z: 12, fov: 70, x: 0, y: 0 },
      4: { z: 12, fov: 70, x: 0, y: 0 },
    } as const;
    const t = targets[phase];
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, t.x, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, t.y, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, t.z, 0.04);
    if ("fov" in camera) {
      const persp = camera as THREE.PerspectiveCamera;
      persp.fov = THREE.MathUtils.lerp(persp.fov, t.fov, 0.04);
      persp.updateProjectionMatrix();
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function NeuralLinkInner({ phase }: { phase: NeuralPhase }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#020308"]} />
      <Suspense fallback={null}>
        <EnvMorph phase={phase} />
        <Silhouette phase={phase} />
        {SHARDS.map((s, i) => (
          <Shard key={s.id} index={i} phase={phase} config={s} />
        ))}
        <NodeCloud phase={phase} />
      </Suspense>
      <CameraRig phase={phase} />
    </Canvas>
  );
}
