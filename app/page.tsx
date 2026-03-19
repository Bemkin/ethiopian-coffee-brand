'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FrameSequencer from '@/components/FrameSequencer';
import HorizontalSourceScroll from '@/components/HorizontalSourceScroll';
import FlavorMatrix from '@/components/FlavorMatrix';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main ref={containerRef} className="relative w-full">
      <FrameSequencer
        frameCount={192}
        baseUrl="/assets/hero-sequence/frame_"
        extension="_delay-0.041s.jpg"
      />

      {/* The Narrative Bridge (Task 28: Refined overlap to prevent collision) */}
      <section className="relative z-20 bg-[#FAF7F2] pt-[10vh] pb-24 md:pt-[15vh] md:pb-32 flex flex-col items-center justify-center -mt-[50vh]">
        <div className="overflow-hidden">
          <p className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-brand-navy/60 mb-6 text-center">
            Chapter 01
          </p>
        </div>
        <div className="overflow-hidden px-6">
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-brand-navy text-center leading-[1.1] tracking-tight">
            From the birthplace<br />of wild Arabica.
          </h2>
        </div>
      </section>

      {/* Horizontal Origin Gallery */}
      <HorizontalSourceScroll />

      {/* 3D Flavor Matrix Section */}
      <FlavorMatrix />

      {/* Footer / Contact Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center bg-brand-navy text-brand-cream px-8 py-32">
        <div className="max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-serif mb-8">From Addis to the World.</h2>
          <p className="text-xl font-sans opacity-70 mb-12">Join our journey and discover the true essence of coffee.</p>
          <div className="flex justify-center gap-8">
            <a href="#" className="uppercase tracking-widest text-sm font-bold border-b border-brand-cream pb-1 hover:opacity-50 transition-opacity">Instagram</a>
            <a href="#" className="uppercase tracking-widest text-sm font-bold border-b border-brand-cream pb-1 hover:opacity-50 transition-opacity">Wholesale</a>
          </div>
        </div>
      </section>
    </main>
  );
}
