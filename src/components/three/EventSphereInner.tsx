import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Sphere() {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.1;
      const s = 1 + Math.sin(t * 0.6) * 0.04;
      ref.current.scale.set(s, s, s);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.1;
    }
  });

  return (
    <group position={[0, -1.5, 0]}>
      <mesh ref={ref}>
        <sphereGeometry args={[2.6, 64, 64]} />
        <meshStandardMaterial
          color="#0a0a18"
          roughness={0.2}
          metalness={0.8}
          emissive="#1a0030"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[3.2, 0.02, 16, 200]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0.4, 0]}>
        <torusGeometry args={[3.6, 0.015, 16, 200]} />
        <meshBasicMaterial color="#8a2be2" transparent opacity={0.5} />
      </mesh>
      {/* glow */}
      <mesh>
        <sphereGeometry args={[2.7, 32, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

export default function EventSphereInner() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 55 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#00f0ff" />
      <pointLight position={[-5, -2, -3]} intensity={2} color="#8a2be2" />
      <Sphere />
    </Canvas>
  );
}
