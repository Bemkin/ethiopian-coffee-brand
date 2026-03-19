'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * @file FrameSequencer.tsx
 * @description Highly performant canvas-based image sequencer for scroll-scrubbing.
 * Optimized for 1920x1080 frames.
 */
export default function FrameSequencer({ 
  frameCount, 
  baseUrl, 
  extension 
}: { 
  frameCount: number, 
  baseUrl: string, 
  extension: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  
  // Stage Layout Text Refs
  const phase1Left = useRef<HTMLDivElement>(null);
  const phase1Right = useRef<HTMLDivElement>(null);
  const phase2Left = useRef<HTMLDivElement>(null);
  const phase2Right = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload images into memory
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];
    
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameIndex = i.toString().padStart(3, '0');
      img.src = `${baseUrl}${frameIndex}${extension}`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setIsLoaded(true);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, [frameCount, baseUrl, extension]);

  useEffect(() => {
    if (!isLoaded || images.length < frameCount || !canvasRef.current || !containerRef.current || !innerRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const render = (index: number) => {
      const img = images[index];
      if (img) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    const sequence = { frame: 0 };
    const ctx = gsap.context(() => {
      // THE DEFINITIVE PINNING & SCRUBBING
      gsap.to(sequence, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: innerRef.current,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
        onUpdate: () => render(Math.round(sequence.frame)),
      });

      // Independent timeline for text animations
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          pin: false, // Parent is already pinned by the canvas trigger
        }
      });

      // Phase 1: Fades in early, fades out at 35%
      textTl.fromTo([phase1Left.current, phase1Right.current], 
        { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.05)
        .to([phase1Left.current, phase1Right.current], 
        { opacity: 0, y: -30, duration: 0.15, ease: 'power2.in' }, 0.35)

        // Phase 2 text stays visible longer, fading out between 80% and 90%
        .fromTo([phase2Left.current, phase2Right.current], 
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.5)
        .to([phase2Left.current, phase2Right.current], 
          { opacity: 0, y: -30, duration: 0.1, ease: 'power2.in' }, 0.8)
          
        // Fade out the Bean AND the Masthead simultaneously (Task 28)
        // Starts at 75% and takes a full 25% of the scroll duration to fade
        .to([canvasRef.current, '#hero-masthead', '#hero-subtext'], {
          opacity: 0,
          duration: 0.25, 
          ease: 'none'
        }, 0.75);

    }, containerRef);

    render(0);
    
    return () => ctx.revert();
  }, [isLoaded, images, frameCount]);

  // Task 15: Editorial Masthead Entrance Animation
  useEffect(() => {
    if (!isLoaded) return;
    
    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline({ delay: 0.2 });

      entranceTl.to('#hero-subtext', {
        y: 0,
        duration: 1,
        ease: 'power3.out',
      })
      .to('#hero-masthead', {
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
      }, "-=0.8");
    });

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#FAF7F2]" suppressHydrationWarning>
      {/* Pinned Container */}
      <div ref={innerRef} className="h-screen w-full flex items-center justify-center overflow-hidden">
        {/* The existing Canvas (Task 23: transition-transform duration-75) */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-75" />

        {/* Task 15: Editorial Masthead Typography Overlay (Refined Eyebrow Pattern) */}
        <div className="absolute top-0 inset-x-0 z-20 pointer-events-none flex flex-col items-center pt-[5vh] md:pt-[6vh]">
          {/* Subtitle Wrapper (Mask) - Now on Top for legibility */}
          <div className="overflow-hidden mb-2">
            <p 
              id="hero-subtext" 
              className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-brand-navy/60 translate-y-full"
            >
              Specialty Roasters • Addis Ababa
            </p>
          </div>

          {/* Main Title Wrapper (Mask) */}
          <div className="overflow-hidden pb-2">
            <h1 
              id="hero-masthead" 
              className="font-serif text-6xl md:text-[8vw] leading-none text-brand-navy tracking-tight translate-y-full"
            >
              THE ORIGIN.
            </h1>
          </div>
        </div>

        {/* The Stage Layout Typography Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none flex justify-between items-center px-8 md:px-[8vw]">
          {/* LEFT COLUMN */}
          <div className="relative w-1/3 flex flex-col justify-center h-full">
            <div ref={phase1Left} className="absolute left-0 text-brand-navy opacity-0">
              <p className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase mb-2 text-brand-navy/60">Origin</p>
              <h2 className="font-serif text-3xl md:text-5xl leading-tight text-brand-navy">Kaffa Biosphere,<br/>1,900m</h2>
            </div>
            <div ref={phase2Left} className="absolute left-0 text-brand-navy opacity-0">
              <p className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase mb-2 text-brand-navy/60">Profile</p>
              <h2 className="font-serif text-3xl md:text-5xl leading-tight text-brand-navy">Wild Berry &<br/>Heavy Body</h2>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative w-1/3 flex flex-col justify-center items-end text-right h-full">
            <div ref={phase1Right} className="absolute right-0 text-brand-navy opacity-0">
              <p className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase mb-2 text-brand-navy/60">Process</p>
              <h2 className="font-serif text-3xl md:text-5xl leading-tight text-brand-navy">72-Hour<br/>Anaerobic</h2>
            </div>
            <div ref={phase2Right} className="absolute right-0 text-brand-navy opacity-0">
              <p className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase mb-2 text-brand-navy/60">Roast</p>
              <h2 className="font-serif text-3xl md:text-5xl leading-tight text-brand-navy">Hand-crafted in<br/>Addis Ababa</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
