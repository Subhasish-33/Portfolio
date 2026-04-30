import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Shapes() {
  const g1 = useRef<THREE.Mesh>(null);
  const g2 = useRef<THREE.Mesh>(null);
  const g3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (g1.current) {
      g1.current.rotation.x = t * 0.3;
      g1.current.rotation.y = t * 0.4;
      g1.current.position.x = Math.cos(t * 0.4) * 2.5;
      g1.current.position.y = Math.sin(t * 0.5) * 1.2;
    }
    if (g2.current) {
      g2.current.rotation.x = -t * 0.25;
      g2.current.rotation.z = t * 0.3;
      g2.current.position.x = Math.cos(t * 0.3 + 2) * 3;
      g2.current.position.y = Math.sin(t * 0.4 + 2) * -1.4;
    }
    if (g3.current) {
      g3.current.rotation.y = t * 0.5;
      g3.current.position.x = Math.cos(t * 0.2 + 4) * 1.5;
      g3.current.position.y = Math.sin(t * 0.3 + 4) * 1.8;
    }
  });

  return (
    <group>
      <mesh ref={g1}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color="#00f0ff"
          wireframe
          emissive="#00f0ff"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={g2}>
        <torusGeometry args={[0.5, 0.15, 16, 32]} />
        <meshStandardMaterial
          color="#8a2be2"
          wireframe
          emissive="#8a2be2"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh ref={g3}>
        <octahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

export default function OrbitGeometryInner() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00f0ff" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#8a2be2" />
      <Shapes />
    </Canvas>
  );
}
