import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function MoneyModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={1.5} // xyz rotation intensity
      floatIntensity={2} // Up/down float intensity
    >
      <Center>
        <mesh ref={meshRef} castShadow receiveShadow>
          <cylinderGeometry args={[2.5, 2.5, 0.4, 64]} />
          <meshPhysicalMaterial
            color="#fbbf24" // Gold color
            emissive="#b45309"
            emissiveIntensity={0.2}
            roughness={0.1}
            metalness={1}
            reflectivity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Inner circle of the coin */}
        <mesh position={[0, 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
        </mesh>

        <mesh position={[0, -0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2, 64]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Floating particles around the coin */}
        <Sparkles
          count={50}
          scale={10}
          size={4}
          speed={0.4}
          opacity={0.5}
          color="#fdf6e3"
        />
      </Center>
    </Float>
  );
}
