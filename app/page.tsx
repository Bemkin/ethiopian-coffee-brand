'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FrameSequencer from '@/components/FrameSequencer';
import HorizontalSourceScroll from '@/components/HorizontalSourceScroll';
import VideoPortal from '@/components/VideoPortal';
import FlavorMatrix from '@/components/FlavorMatrix';
import KineticMarquee from '@/components/KineticMarquee';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLElement>(null);

  // Task 30: Staggered Scroll Reveal for Narrative Bridge
  useEffect(() => {
    const bridgeSubtitle = gsap.utils.toArray('.bridge-subtitle');
    const bridgeTitleLines = gsap.utils.toArray('.bridge-title-line');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bridgeRef.current,
        start: "top 60%", 
        toggleActions: "play none none reverse" 
      }
    });

    tl.to(bridgeSubtitle, {
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .to(bridgeTitleLines, {
      y: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out'
    }, "-=0.6");

  }, []);

  return (
    <main ref={containerRef} className="relative w-full">
      <FrameSequencer
        frameCount={192}
        baseUrl="/assets/hero-sequence/frame_"
        extension="_delay-0.041s.jpg"
      />

      {/* The Narrative Bridge (Task 30: Staggered Scroll Reveal) */}
      <section ref={bridgeRef} className="relative z-20 bg-[#FAF7F2] min-h-[50vh] py-20 md:pt-[15vh] md:pb-32 flex flex-col items-center justify-center -mt-[20vh] md:-mt-[50vh] px-4">
        <div className="overflow-hidden mb-6">
          <p className="bridge-subtitle font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-brand-navy/60 text-center translate-y-full">
            Chapter 01
          </p>
        </div>

        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-brand-navy text-center leading-[1.1] tracking-tight flex flex-col items-center">
          <span className="overflow-hidden pb-2">
            <span className="bridge-title-line block translate-y-full">From the birthplace</span>
          </span>
          <span className="overflow-hidden pb-2">
            <span className="bridge-title-line block translate-y-full">of wild Arabica.</span>
          </span>
        </h2>
      </section>

      {/* Horizontal Origin Gallery */}
      <HorizontalSourceScroll />

      {/* Cinematic Transition: Chapter 02 Portal (Task 35) */}
      <VideoPortal />

      {/* 3D Flavor Matrix Section */}
      <FlavorMatrix />

      {/* Kinetic Text Marquee (Task 48) */}
      <KineticMarquee />

      <Footer />
    </main>
  );
}
