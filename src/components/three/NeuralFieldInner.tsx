import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const { positions, basePositions, lineGeometry } = useMemo(() => {
    const COUNT = 1400;
    const positions = new Float32Array(COUNT * 3);
    const basePositions = new Float32Array(COUNT * 3);

    // Distribute on twin tori (looks like a neural / RAG topology)
    for (let i = 0; i < COUNT; i++) {
      const t = (i / COUNT) * Math.PI * 2;
      const ring = Math.floor(i / (COUNT / 5));
      const R = 2 + ring * 0.4;
      const r = 0.5 + Math.random() * 0.5;
      const u = Math.random() * Math.PI * 2;
      const x = (R + r * Math.cos(u)) * Math.cos(t * 3 + ring);
      const y = (R + r * Math.cos(u)) * Math.sin(t * 3 + ring) + (ring - 2) * 0.2;
      const z = r * Math.sin(u);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
    }

    // Build sparse "synapse" line connections
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    for (let i = 0; i < COUNT; i += 7) {
      const j = (i + Math.floor(Math.random() * 14) + 3) % COUNT;
      linePositions.push(
        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
      );
    }
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3),
    );

    return { positions, basePositions, lineGeometry };
  }, []);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    const pos = ref.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!pos) return;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      const bx = basePositions[i];
      const by = basePositions[i + 1];
      const bz = basePositions[i + 2];
      const wave = Math.sin(t * 0.5 + bx * 0.4 + by * 0.3) * 0.18;
      arr[i] = bx + wave;
      arr[i + 1] = by + Math.cos(t * 0.4 + bz * 0.5) * 0.18;
      arr[i + 2] = bz + Math.sin(t * 0.3 + bx * 0.2) * 0.18;
    }
    pos.needsUpdate = true;

    if (ref.current) {
      ref.current.rotation.y = t * 0.05 + pointer.x * 0.3;
      ref.current.rotation.x = pointer.y * 0.2;
    }
    if (lineRef.current) {
      lineRef.current.rotation.copy(ref.current!.rotation);
    }
  });

  return (
    <group>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
          color={new THREE.Color("#7ff0ff")}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={new THREE.Color("#8a2be2")}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function NeuralFieldInner() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.4} />
      <Particles />
    </Canvas>
  );
}
