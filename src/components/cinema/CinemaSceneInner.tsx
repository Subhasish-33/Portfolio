import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTimelineStore } from "./useTimelineStore";

// ── Dr. Strange sling-ring portal ──────────────────────────────────────────

/** Inner void — shader shifts per act: cosmos → blood chaos → cold void */
function PortalVoid() {
  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uChaos: { value: 0 },
    uHeal:  { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    const t = useTimelineStore.getState().currentTime;
    uniforms.uTime.value = clock.elapsedTime;
    const chaos = t >= 60_000 && t < 120_000 ? Math.min(1, (t - 60_000) / 7_000) : 0;
    const heal  = t >= 120_000 ? Math.min(1, (t - 120_000) / 5_000) : 0;
    uniforms.uChaos.value += (chaos - uniforms.uChaos.value) * 0.05;
    uniforms.uHeal.value  += (heal  - uniforms.uHeal.value)  * 0.04;
  });

  return (
    <mesh>
      <circleGeometry args={[1.05, 128]} />
      <shaderMaterial
        transparent
        side={THREE.DoubleSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uChaos;
          uniform float uHeal;
          varying vec2 vUv;

          float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
          float noise(vec2 p){
            vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
          }

          void main(){
            vec2 uv = vUv - 0.5;
            float r  = length(uv);
            float a  = atan(uv.y, uv.x);

            // mask — hard circle edge
            float mask = smoothstep(0.52, 0.48, r);
            if(mask < 0.01) discard;

            // ── Act I: deep cosmos — star field + nebula swirl ──
            float swirl = a + uTime * 0.18 + r * 4.2;
            float nebula = noise(vec2(cos(swirl)*r*3.5 + uTime*0.12, sin(swirl)*r*3.5 - uTime*0.09));
            nebula = pow(nebula, 1.6);

            // star field
            vec2 starUv = uv * 14.0;
            starUv.x += uTime * 0.04; starUv.y += uTime * 0.06;
            float star = step(0.97, hash(floor(starUv)));
            float starBright = star * (0.6 + 0.4 * sin(uTime * 3.0 + hash(floor(starUv)) * 6.28));

            // clock face ghost — time uncertainty
            float clockR = smoothstep(0.005, 0.0, abs(r - 0.38)) * 0.35;
            float hourAngle = uTime * 0.5;
            float minAngle  = uTime * 6.0;
            vec2 hourHand = vec2(cos(hourAngle), sin(hourAngle)) * 0.22;
            vec2 minHand  = vec2(cos(minAngle),  sin(minAngle))  * 0.34;
            float hLine = smoothstep(0.012, 0.0, abs(dot(normalize(hourHand), uv) - length(uv)*cos(a - hourAngle)) ) * step(r, 0.22);
            float mLine = smoothstep(0.008, 0.0, abs(dot(normalize(minHand),  uv) - length(uv)*cos(a - minAngle))  ) * step(r, 0.34);

            vec3 cosmosCol = vec3(0.04, 0.02, 0.12)
              + vec3(0.18, 0.08, 0.55) * nebula * 0.7
              + vec3(0.55, 0.22, 0.88) * nebula * nebula * 0.5
              + vec3(1.0) * starBright * 0.9
              + vec3(0.7, 0.85, 1.0) * (clockR + hLine * 0.5 + mLine * 0.4);

            // ── Act II: blood chaos — fractal red distortion ──
            float t2 = uTime * 1.4;
            float chaos1 = noise(uv * 5.0 + vec2(t2 * 0.3, -t2 * 0.2));
            float chaos2 = noise(uv * 11.0 - vec2(t2 * 0.5, t2 * 0.4));
            float fractal = chaos1 * 0.6 + chaos2 * 0.4;
            // shatter lines
            float shatter = step(0.88, noise(vec2(a * 3.0 + t2, r * 8.0)));
            vec3 chaosCol = vec3(0.55, 0.02, 0.04)
              + vec3(0.9, 0.1, 0.05) * fractal
              + vec3(1.0, 0.3, 0.1) * shatter * 0.6
              + vec3(1.0, 0.8, 0.2) * pow(fractal, 3.0) * 0.4;

            // ── Act III: cold void — deep blue with slow aurora ──
            float aurora = noise(vec2(uv.x * 3.0 + uTime * 0.07, uv.y * 6.0 - uTime * 0.05));
            aurora = pow(aurora, 2.2);
            vec3 voidCol = vec3(0.01, 0.04, 0.14)
              + vec3(0.05, 0.25, 0.65) * aurora
              + vec3(0.2, 0.6, 1.0) * aurora * aurora * 0.6;

            // blend acts
            vec3 col = mix(cosmosCol, chaosCol, uChaos);
            col = mix(col, voidCol, uHeal);

            // depth vignette inside portal
            col *= 0.5 + 0.5 * (1.0 - r * 1.8);

            gl_FragColor = vec4(col, mask * 0.97);
          }
        `}
      />
    </mesh>
  );
}

/** Sling-ring: spinning golden spark ring */
function SlingRing({ radius, speed, sparkCount, width }: { radius: number; speed: number; sparkCount: number; width: number }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    const ph  = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) {
      const a = (i / sparkCount) * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * width;
      pos[i*3]   = Math.cos(a) * (radius + jitter);
      pos[i*3+1] = Math.sin(a) * (radius + jitter);
      pos[i*3+2] = (Math.random() - 0.5) * 0.04;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, [radius, sparkCount, width]);

  useFrame(({ clock }) => {
    const t = useTimelineStore.getState().currentTime;
    if (!ref.current || !matRef.current) return;
    const elapsed = clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const chaos = t >= 60_000 && t < 120_000 ? Math.min(1, (t - 60_000) / 7_000) : 0;
    const heal  = t >= 120_000 ? Math.min(1, (t - 120_000) / 5_000) : 0;

    for (let i = 0; i < sparkCount; i++) {
      const baseAngle = (i / sparkCount) * Math.PI * 2;
      const angle = baseAngle + elapsed * speed + chaos * Math.sin(elapsed * 2.1 + phases[i]) * 0.3;
      const r = radius + Math.sin(elapsed * 3.0 + phases[i]) * width * 0.5 * (1 + chaos * 1.5);
      pos[i*3]   = Math.cos(angle) * r;
      pos[i*3+1] = Math.sin(angle) * r;
      pos[i*3+2] = Math.sin(elapsed * 4.0 + phases[i]) * 0.06 * (1 + chaos);
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    // color: gold → blood orange → cold blue
    const goldColor  = new THREE.Color(1.0, 0.72, 0.1);
    const chaosColor = new THREE.Color(1.0, 0.22, 0.05);
    const healColor  = new THREE.Color(0.35, 0.75, 1.0);
    const col = goldColor.clone().lerp(chaosColor, chaos).lerp(healColor, heal);
    matRef.current.color.copy(col);
    matRef.current.size = 0.028 + chaos * 0.018 + Math.sin(elapsed * 2.0) * 0.004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={sparkCount} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} color="#ffb81a" size={0.028} transparent opacity={0.92} sizeAttenuation />
    </points>
  );
}

/** Outer glow ring — torus */
function PortalRim() {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = useTimelineStore.getState().currentTime;
    const chaos = t >= 60_000 && t < 120_000 ? Math.min(1, (t - 60_000) / 7_000) : 0;
    const heal  = t >= 120_000 ? Math.min(1, (t - 120_000) / 5_000) : 0;
    if (!matRef.current || !meshRef.current) return;
    const gold  = new THREE.Color(1.0, 0.65, 0.08);
    const blood = new THREE.Color(0.9, 0.15, 0.05);
    const blue  = new THREE.Color(0.3, 0.7, 1.0);
    matRef.current.color.copy(gold).lerp(blood, chaos).lerp(blue, heal);
    // subtle pulse
    const pulse = 0.85 + 0.15 * Math.sin(clock.elapsedTime * 2.8);
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1.08, 0.028, 16, 160]} />
      <meshBasicMaterial ref={matRef} color="#ffaa10" transparent opacity={0.9} />
    </mesh>
  );
}

/** Floating spark embers that fly outward from the ring */
function PortalEmbers() {
  const ref = useRef<THREE.Points>(null);
  const N = 180;
  const data = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const life = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      pos[i*3]   = Math.cos(a) * 1.08;
      pos[i*3+1] = Math.sin(a) * 1.08;
      pos[i*3+2] = 0;
      vel[i*3]   = (Math.random() - 0.5) * 0.006;
      vel[i*3+1] = (Math.random() - 0.5) * 0.006;
      vel[i*3+2] = (Math.random() - 0.5) * 0.004;
      life[i] = Math.random();
    }
    return { pos, vel, life };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < N; i++) {
      data.life[i] += 0.008;
      if (data.life[i] > 1) {
        // respawn on ring
        const a = Math.random() * Math.PI * 2;
        pos[i*3]   = Math.cos(a) * 1.08;
        pos[i*3+1] = Math.sin(a) * 1.08;
        pos[i*3+2] = 0;
        data.vel[i*3]   = (Math.random() - 0.5) * 0.007;
        data.vel[i*3+1] = (Math.random() - 0.5) * 0.007;
        data.vel[i*3+2] = (Math.random() - 0.5) * 0.005;
        data.life[i] = 0;
      } else {
        pos[i*3]   += data.vel[i*3];
        pos[i*3+1] += data.vel[i*3+1];
        pos[i*3+2] += data.vel[i*3+2];
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={N} array={data.pos} itemSize={3} args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffd060" size={0.014} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

/** Portal group — floats gently, tilts slightly for 3D depth */
function StrangePortal() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    // gentle float + slight tilt for 3D feel
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.06;
    groupRef.current.rotation.x = Math.sin(t * 0.25) * 0.06;
    groupRef.current.rotation.z = Math.sin(t * 0.18) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <PortalVoid />
      <PortalRim />
      <SlingRing radius={1.08} speed={1.4}  sparkCount={320} width={0.055} />
      <SlingRing radius={1.08} speed={-0.9} sparkCount={200} width={0.04}  />
      <PortalEmbers />
    </group>
  );
}

function LossCurve() {
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 1.6 - 0.8;
      const y = 0.55 * Math.exp(-i / 16) + 0.02 * Math.sin(i * 0.8) - 0.22;
      pts.push(new THREE.Vector3(x, y, 0.01));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  useFrame(() => {
    const t = useTimelineStore.getState().currentTime;
    if (matRef.current) {
      matRef.current.opacity = t < 60_000
        ? Math.min(1, t / 3_000)
        : Math.max(0, 1 - (t - 60_000) / 3_500);
    }
  });

  return (
    <line geometry={geo}>
      <lineBasicMaterial ref={matRef} color="#ffffff" transparent opacity={0} />
    </line>
  );
}

function KeyboardGrid() {
  const grpRef = useRef<THREE.Group>(null);
  const keys = useMemo(() => {
    const arr: [number,number][] = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) arr.push([c,r]);
    return arr;
  }, []);

  useFrame(() => {
    const t = useTimelineStore.getState().currentTime;
    if (!grpRef.current) return;
    const op = t < 3_000 ? 0 : t < 12_000 ? Math.min(0.85, (t - 3_000) / 4_000 * 0.85)
              : t < 22_000 ? 0.85 : Math.max(0, 1 - (t - 22_000) / 6_000);
    const y = -2.4 + Math.min(0.9, t / 10_000);
    grpRef.current.position.y = y;
    grpRef.current.children.forEach((c, i) => {
      const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (m) m.opacity = op * (0.5 + 0.5 * Math.sin(t / 300 + i * 0.4));
    });
  });

  return (
    <group ref={grpRef} position={[0, -2.4, -0.8]} rotation={[-0.5, 0, 0]}>
      {keys.map(([c, r], i) => (
        <mesh key={i} position={[(c - 6.5) * 0.19, (r - 2) * 0.19, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.055]} />
          <meshBasicMaterial color="#e8f0ff" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

function ChaosField() {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const velocities = useRef<Float32Array>(new Float32Array(0));
  const positions = useMemo(() => {
    const N = 3200;
    const arr = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i*3]   = (Math.random()-0.5)*9;
      arr[i*3+1] = (Math.random()-0.5)*6;
      arr[i*3+2] = (Math.random()-0.5)*7;
      vel[i*3]   = (Math.random()-0.5)*0.008;
      vel[i*3+1] = (Math.random()-0.5)*0.008;
      vel[i*3+2] = (Math.random()-0.5)*0.006;
    }
    velocities.current = vel;
    return arr;
  }, []);

  useFrame(() => {
    const t = useTimelineStore.getState().currentTime;
    const target = t >= 60_000 && t < 120_000 ? Math.min(0.85, (t-60_000)/5_000) : 0;
    if (matRef.current) {
      matRef.current.opacity += (target - matRef.current.opacity) * 0.05;
      matRef.current.color.lerp(
        new THREE.Color(t < 100_000 ? "#ff2233" : "#3fa8ff"), 0.04
      );
    }
    if (ref.current && matRef.current.opacity > 0.02) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i++) {
        pos[i] += velocities.current[i];
        if (Math.abs(pos[i]) > 5) velocities.current[i] *= -1;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.rotation.y += 0.0008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length/3} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={matRef} color="#ff2233" size={0.022} transparent opacity={0} sizeAttenuation />
    </points>
  );
}

function ProjectRing() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = useTimelineStore.getState().currentTime;
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const prog = t >= 122_000 ? Math.min(1, (t - 122_000 - i*400) / 900) : 0;
      const eased = prog < 0.5 ? 2*prog*prog : 1 - Math.pow(-2*prog+2,2)/2;
      const angle = (i/3)*Math.PI*2 - Math.PI/2;
      const r = 2.6;
      child.position.x += (Math.cos(angle)*r*eased - child.position.x) * 0.14;
      child.position.y += (Math.sin(angle)*r*0.5*eased - child.position.y) * 0.14;
      child.position.z += (-10 + 10*eased - child.position.z) * 0.14;
      const mesh = child.children[0] as THREE.Mesh;
      if (mesh?.material) (mesh.material as THREE.MeshBasicMaterial).opacity += (eased*0.9 - (mesh.material as THREE.MeshBasicMaterial).opacity)*0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {[0,1,2].map(i => (
        <group key={i} position={[0,0,-10]}>
          <mesh>
            <planeGeometry args={[1.5, 0.96]} />
            <meshBasicMaterial color="#7df9ff" transparent opacity={0} wireframe />
          </mesh>
          <mesh position={[0,0,-0.01]}>
            <planeGeometry args={[1.45, 0.92]} />
            <meshBasicMaterial color="#020a18" transparent opacity={0.75} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function EnvGradient() {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const sterile = useMemo(() => new THREE.Color("#020508"), []);
  const red     = useMemo(() => new THREE.Color("#130204"), []);
  const ozark   = useMemo(() => new THREE.Color("#030d1e"), []);
  useFrame(() => {
    const t = useTimelineStore.getState().currentTime;
    if (!matRef.current) return;
    const target = t >= 60_000 && t < 120_000 ? red : t >= 120_000 ? ozark : sterile;
    matRef.current.color.lerp(target, 0.04);
  });
  return (
    <mesh position={[0,0,-10]} scale={[28,18,1]}>
      <planeGeometry args={[1,1]} />
      <meshBasicMaterial ref={matRef} color={sterile} />
    </mesh>
  );
}

function CameraRig() {
  useFrame(({ camera }) => {
    const t = useTimelineStore.getState().currentTime;
    let tx = 0, ty = 0, tz = 4.6, fov = 38;
    if (t < 3_500)       { tz = 2.8; ty = -0.5; fov = 28; }
    else if (t < 22_000) { tz = 3.8 + t/120_000; ty = -0.1; fov = 36; }
    else if (t < 60_000) { tz = 4.5; fov = 42; }
    else if (t < 120_000){ tx = Math.sin(t/9_000)*0.5; tz = 3.9; fov = 52; }
    else if (t < 168_000){ tz = 5.2; fov = 46; }
    camera.position.x += (tx - camera.position.x) * 0.035;
    camera.position.y += (ty - camera.position.y) * 0.035;
    camera.position.z += (tz - camera.position.z) * 0.035;
    (camera as THREE.PerspectiveCamera).fov += (fov - (camera as THREE.PerspectiveCamera).fov) * 0.035;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function CinemaSceneInner() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0,0,4.6], fov: 38 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
      <color attach="background" args={["#020508"]} />
      <Suspense fallback={null}>
        <EnvGradient />
        <KeyboardGrid />
        <StrangePortal />
        <LossCurve />
        <ChaosField />
        <ProjectRing />
      </Suspense>
      <CameraRig />
    </Canvas>
  );
}
