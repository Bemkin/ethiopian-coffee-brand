/**
 * @file FlavorMatrix.tsx
 * @description React Three Fiber section that reacts to user hover.
 * Now updated to feature the custom Jebena centerpiece that catches 
 * the stateful ambient lighting shifts.
 */

'use client';

import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles, useTexture } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';

const flavorProfiles = [
  {
    id: 'yirgacheffe',
    name: 'Floral & Citrus',
    note: 'Jasmine, Bergamot, Sweet Lemon',
    color: '#E8D8A6', 
    ambientIntensity: 1.5,
  },
  {
    id: 'harrar',
    name: 'Wild Berry & Wine',
    note: 'Blueberry, Dark Chocolate, Heavy Body',
    color: '#4A2545', 
    ambientIntensity: 0.8,
  },
  {
    id: 'sidamo',
    name: 'Stone Fruit & Spice',
    note: 'Peach, Cinnamon, Raw Honey',
    color: '#D48C70', 
    ambientIntensity: 1.2,
  }
];

// The Jebena Model Component
function JebenaCenterpiece() {
  // Load the transparent PNG generated from Google Flow
  const texture = useTexture('/assets/jebena-centerpiece-removebg-preview.png');
  
  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.8}>
      <mesh>
        {/* A flat plane to hold the image, sized to look imposing */}
        <planeGeometry args={[4, 4]} />
        {/* Standard material allows the image to react to our lighting shifts */}
        <meshStandardMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
      </mesh>
    </Float>
  );
}

function Scene({ activeFlavor }: { activeFlavor: typeof flavorProfiles[0] }) {
  const lightRef = useRef<THREE.AmbientLight>(null);

  useFrame((state, delta) => {
    easing.dampC(state.scene.background as THREE.Color, activeFlavor.color, 0.4, delta);
    if (lightRef.current) {
      easing.damp(lightRef.current, 'intensity', activeFlavor.ambientIntensity, 0.4, delta);
    }
  });

  return (
    <>
      <ambientLight ref={lightRef} intensity={1} />
      <Environment preset="city" />
      
      <Suspense fallback={null}>
        <JebenaCenterpiece />
      </Suspense>

      <Sparkles count={150} scale={8} size={2} speed={0.4} opacity={0.4} />
    </>
  );
}

export default function FlavorMatrix() {
  const [activeFlavor, setActiveFlavor] = useState(flavorProfiles[0]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#003548]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <color attach="background" args={['#003548']} />
          <Scene activeFlavor={activeFlavor} />
        </Canvas>
      </div>

      <div className="relative z-10 flex h-full items-center px-8 md:px-[10vw]">
        <div className="max-w-xl text-[#FAF7F2]">
          <h2 className="font-serif text-5xl md:text-7xl mb-12 tracking-tight">
            Discover the Origin
          </h2>
          
          <div className="flex flex-col gap-6" onMouseLeave={() => setActiveFlavor(flavorProfiles[0])}>
            {flavorProfiles.map((flavor) => (
              <button
                key={flavor.id}
                onMouseEnter={() => setActiveFlavor(flavor)}
                className={`text-left group flex flex-col transition-all duration-500 border-l-2 ${
                  activeFlavor.id === flavor.id 
                    ? 'border-[#FAF7F2] pl-6 translate-x-4 opacity-100' 
                    : 'border-transparent pl-4 opacity-40 hover:opacity-80'
                }`}
              >
                <span className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-1">
                  {flavor.name}
                </span>
                <span className="font-sans text-sm md:text-base tracking-wide font-light">
                  {flavor.note}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
