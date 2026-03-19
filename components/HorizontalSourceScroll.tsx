/**
 * @file HorizontalSourceScroll.tsx
 * @description A high-performance horizontal scroll section using GSAP ScrollTrigger.
 * It pins the container and moves child cards horizontally, simulating a gallery walk
 * through the Ethiopian coffee highlands.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const sourceCards = [
  {
    id: 1,
    title: 'The Kaffa Highlands',
    description: 'Born in the biosphere reserves where wild Arabica originated. Altitude: 1,900m.',
    videoSrc: '/assets/Coffee_trees_in_202603191502.mp4',
  },
  {
    id: 2,
    title: 'Anaerobic Processing',
    description: 'Modern science meets ancient soil. 72-hour controlled fermentation for complex berry notes.',
    videoSrc: '/assets/Flow_202603191504.mp4',
  },
  {
    id: 3,
    title: 'Sun Dried',
    description: 'Turned by hand on raised African beds for perfect moisture content.',
    videoSrc: '/assets/Coffee_poured_from_202603191557.mp4',
  },
  {
    id: 4,
    title: 'The Ceremony',
    description: "Coffee isn't just a drink; it's our heritage. Crafted to honor the centuries-old Buna Tetu tradition.",
    videoSrc: '/assets/ceremony.mp4',
  }
];

export default function HorizontalSourceScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const bgText = bgTextRef.current;

    if (!section || !track || !bgText) return;

    // Calculate how far the track needs to move (as a positive value for end trigger)
    const getScrollDistance = () => track.scrollWidth - window.innerWidth;

    // 1. The Main Horizontal Movement
    const tween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`, // Scroll duration based on total width
        pin: true,
        scrub: 1, // Smooth scrub matching Lenis
        invalidateOnRefresh: true,
      },
    });

    // 2. Inner Media Parallax (Task 18)
    // Moves the oversized videos in the opposite direction
    const videos = gsap.utils.toArray('.parallax-video');
    gsap.to(videos, {
      xPercent: -15, // Pans the oversized video backwards as the card moves forwards
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        scrub: true,
      }
    });

    // 3. Giant Background Parallax (Task 18)
    gsap.to('.giant-bg-text', {
      x: () => -getScrollDistance() * 0.3, // Moves at 30% the speed of the cards
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        scrub: true,
      }
    });

    // 4. Progress Bar Fill (Task 19)
    gsap.to('.progress-fill', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        scrub: true,
      }
    });

    // 5. Ambient Light Leak Parallax (Task 21)
    gsap.to('.ambient-glow', {
      x: () => window.innerWidth * 0.8, // Pans the glow across the screen
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        scrub: true,
      }
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-full overflow-hidden bg-[#FAF7F2] text-brand-navy"
    >
      {/* 1. Cinematic Film Grain Overlay (Task 21) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] mix-blend-multiply"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* 2. Ambient Light Leak / Blurred Orb (Task 21) */}
      <div className="absolute top-1/2 left-0 w-[60vw] h-[60vw] bg-[#E8D8A6]/20 rounded-full blur-[120px] -translate-y-1/2 z-0 pointer-events-none ambient-glow" />

      {/* Massive Parallax Background Text (Task 18) */}
      <div 
        ref={bgTextRef}
        className="giant-bg-text absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap opacity-5 pointer-events-none z-0"
      >
        <h2 className="font-serif text-[20vw] font-black uppercase tracking-tighter">
          ORIGIN KAFFA • ADDIS ABABA • ETHIOPIA
        </h2>
      </div>

      {/* The Sliding Track */}
      <div 
        ref={trackRef} 
        className="absolute top-0 left-0 h-full flex items-center pl-[10vw] pr-[20vw] gap-[10vw] z-10"
      >
        {sourceCards.map((card, index) => (
          <div 
            key={card.id} 
            className={`source-card relative w-[80vw] md:w-[52vw] h-[65vh] shrink-0 flex flex-col justify-end overflow-hidden group transition-all duration-700 ${
              hoveredIndex !== null && hoveredIndex !== index 
                ? 'opacity-30 scale-[0.98]' 
                : 'opacity-100 scale-100'
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Video Background with Parallax (Task 18) */}
            <video 
              src={card.videoSrc}
              className="parallax-video absolute inset-0 w-[120%] max-w-none h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              autoPlay
              muted
              loop
              playsInline
            />
            
            {/* Premium Gradient Scrim for text readability (Task 18) */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent pointer-events-none z-10" />
            
            {/* Card Content (Task 18: z-20) */}
            <div className="relative z-20 p-8 md:p-12 text-[#FAF7F2]">
              <h3 className="font-serif text-3xl md:text-5xl mb-4">{card.title}</h3>
              <p className="font-sans text-sm md:text-lg max-w-md font-light tracking-wide opacity-90">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Progress Indicator (Task 19) */}
      <div className="absolute bottom-8 md:bottom-12 left-8 md:left-[10vw] right-8 md:right-[10vw] flex items-center gap-6 z-30 pointer-events-none">
        <span className="font-sans text-xs md:text-sm text-brand-navy tracking-[0.2em]">01</span>
        <div className="h-[1px] flex-1 bg-brand-navy/20 relative overflow-hidden">
          <div className="progress-fill absolute top-0 left-0 h-full bg-brand-navy w-0" />
        </div>
        <span className="font-sans text-xs md:text-sm text-brand-navy tracking-[0.2em]">
          0{sourceCards.length}
        </span>
      </div>
    </section>
  );
}
