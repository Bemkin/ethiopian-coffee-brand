'use client';

import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles, useTexture } from '@react-three/drei';
import { easing } from 'maath';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const flavorProfiles = [
  {
    id: 'yirgacheffe',
    name: 'Floral & Citrus',
    note: 'Jasmine, Bergamot, Sweet Lemon',
    color: '#E8D8A6', 
    textColor: '#003548', // Dark text for contrast on light yellow
    ambientIntensity: 1.5,
  },
  {
    id: 'harrar',
    name: 'Wild Berry & Wine',
    note: 'Blueberry, Dark Chocolate, Heavy Body',
    color: '#4A2545', 
    textColor: '#FAF7F2', // Light text for contrast on dark plum
    ambientIntensity: 0.8,
  },
  {
    id: 'sidamo',
    name: 'Stone Fruit & Spice',
    note: 'Peach, Cinnamon, Raw Honey',
    color: '#D48C70', 
    textColor: '#003548', // Dark text for contrast on peach
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
    // Only damping the light here. The background color is now handled by CSS on the outer section!
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
  const containerRef = useRef<HTMLElement>(null);
  const jebenaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !jebenaRef.current) return;

    // Task 48: 3D Parallax for the Jebena Centerpiece
    gsap.to(jebenaRef.current, {
      y: -80, // Moves the Jebena UP slightly as you scroll down
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen w-full overflow-hidden transition-colors duration-700 ease-in-out py-20 md:py-0 px-8 md:px-0"
      style={{ backgroundColor: activeFlavor.color }}
    >
      
      {/* 3D Canvas — Transparent background, allowing the full section color to shine through */}
      <div ref={jebenaRef} className="relative w-full h-[50vh] md:absolute md:inset-0 md:h-full z-0 pointer-events-none order-1 md:order-2 flex justify-center items-center">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          {/* Background color removed so the section wrapper color shows through */}
          <Scene activeFlavor={activeFlavor} />
        </Canvas>
      </div>

      {/* Content Container: 1-col mobile, 2-col desktop */}
      <div className="relative z-10 flex flex-col md:flex-row h-full w-full max-w-none mx-auto items-center justify-between gap-12 md:gap-24 md:min-h-screen px-8 md:px-16 lg:px-24 xl:px-40">
        
        {/* Text Content — Adapts text color for contrast based on background */}
        <div 
          className="w-full md:w-[40%] lg:w-[35%] xl:w-[30%] text-center md:text-left flex flex-col items-center md:items-start order-2 md:order-first transition-colors duration-700 ease-in-out"
          style={{ color: activeFlavor.textColor }}
        >
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-12 tracking-tight pr-4 md:pr-0 leading-tight">
            Discover the Origin
          </h2>
          
          <div className="flex flex-col gap-6 w-full items-center md:items-start" onMouseLeave={() => setActiveFlavor(flavorProfiles[0])}>
            {flavorProfiles.map((flavor) => (
              <button
                key={flavor.id}
                onMouseEnter={() => setActiveFlavor(flavor)}
                onClick={() => setActiveFlavor(flavor)}
                className={`text-center md:text-left group flex flex-col transition-all duration-500 border-l-0 md:border-l-2 ${
                  activeFlavor.id === flavor.id 
                    ? 'md:pl-6 md:translate-x-4 opacity-100' 
                    : 'md:pl-4 opacity-40 hover:opacity-80'
                }`}
                style={{
                  borderColor: activeFlavor.id === flavor.id ? activeFlavor.textColor : 'transparent'
                }}
                data-cursor="SHOP"
              >
                <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1">
                  {flavor.name}
                </span>
                <span className="font-sans text-sm md:text-base tracking-wide font-light">
                  {flavor.note}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Spacer for desktop 2-col alignment (canvas is the visual "right column") */}
        <div className="hidden md:block md:w-1/2" />
      </div>
    </section>
  );
}
