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
  extension,
  stepMultiplier = 1
}: { 
  frameCount: number, 
  baseUrl: string, 
  extension: string,
  stepMultiplier?: number 
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
      // Task 79: If on mobile (96 frames, step = 2), i=1 maps to file `002.jpg`, compressing the sequence visually over the exact same time
      const actualFileIndex = Math.floor(i * stepMultiplier);
      const frameIndex = actualFileIndex.toString().padStart(3, '0');
      
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
  }, [frameCount, baseUrl, extension, stepMultiplier]);

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

      // Fades OUT Phase 1 as the user scrolls down (Task 29: Entrance moved to page-load)
      textTl.to([phase1Left.current, phase1Right.current], 
        { opacity: 0, y: -30, duration: 0.15, ease: 'power2.in' }, 0.15)

        // Phase 2 text stays visible longer, fading out between 80% and 90%
        .fromTo([phase2Left.current, phase2Right.current], 
          { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.5)
        .to([phase2Left.current, phase2Right.current], 
          { opacity: 0, y: -30, duration: 0.1, ease: 'power2.in' }, 0.8)
          
        // Fade out the Bean AND the Masthead simultaneously (Task 28)
        // Starts at 75% and takes a full 25% of the scroll duration to fade
        .to(['#hero-canvas-wrapper', '#hero-masthead', '#hero-subtext'], {
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
      }, "-=0.8")
      // NEW: Fade in Phase 1 text on load (Task 29)
      .fromTo([phase1Left.current, phase1Right.current], 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 
        "-=0.6"
      );
    });

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="relative w-full h-[250vh] md:h-[400vh] bg-[#FAF7F2]" suppressHydrationWarning>
      {/* Pinned Container */}
      <div ref={innerRef} className="relative h-screen-safe w-full flex items-center justify-center overflow-hidden">
        {/* The existing Canvas Wrapper (Task 63: Feathered Edges) */}
        <div id="hero-canvas-wrapper" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60vh] md:h-[80vh] lg:h-screen-safe z-0">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover object-center transition-transform duration-75 mix-blend-multiply brightness-[1.1] contrast-[1.1] md:mix-blend-normal md:brightness-100 md:contrast-100" 
          />
          {/* Seamless Edge Gradients (Mobile Only) */}
          <div className="md:hidden absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none z-10" />
          <div className="md:hidden absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-[#FAF7F2] to-transparent pointer-events-none z-10" />
        </div>

        {/* Task 15: Editorial Masthead Typography Overlay (Refined Eyebrow Pattern) */}
        <div className="absolute top-0 inset-x-0 z-20 pointer-events-none flex flex-col items-center pt-[7vh] md:pt-[6vh]">
          {/* Main Title Wrapper (Mask) */}
          <div className="overflow-hidden pb-2 order-1 md:order-2">
            <h1 
              id="hero-masthead" 
              className="font-serif text-5xl sm:text-7xl md:text-[8vw] leading-none text-brand-navy tracking-tight translate-y-full"
            >
              THE ORIGIN.
            </h1>
          </div>

          {/* Subtitle Wrapper (Mask) - Below on mobile to avoid cart collision (Task 62) */}
          <div className="overflow-hidden mb-1 md:mb-2 order-2 md:order-1 mt-1 md:mt-0">
            <p 
              id="hero-subtext" 
              className="font-sans text-[10px] md:text-sm tracking-[0.3em] uppercase text-brand-navy/60 translate-y-full text-center"
            >
              Specialty Roasters • Addis Ababa
            </p>
          </div>
        </div>

        {/* The Stage Layout Typography Overlay — Bottom-pinned on mobile, full viewport on desktop */}
        <div className="absolute bottom-12 left-0 right-0 md:top-0 md:bottom-0 px-6 md:px-[8vw] flex justify-between z-20 md:z-10 pointer-events-none md:items-center">
          {/* LEFT COLUMN */}
          <div className="flex flex-col justify-end md:relative md:w-1/3 md:flex md:flex-col md:justify-center md:items-start md:h-full">
            <div ref={phase1Left} className="text-brand-navy opacity-100 md:opacity-0 md:absolute md:left-0 text-left">
              <p className="font-sans text-[10px] md:text-sm tracking-[0.2em] uppercase mb-1 md:mb-2 text-brand-navy/50">Origin</p>
              <h2 className="font-serif text-sm md:text-5xl leading-snug md:leading-tight text-brand-navy">Kaffa Biosphere,<br/>1,900m</h2>
            </div>
            <div ref={phase2Left} className="text-brand-navy opacity-0 md:absolute md:left-0 text-left">
              <p className="font-sans text-[10px] md:text-sm tracking-[0.2em] uppercase mb-1 md:mb-2 text-brand-navy/50">Profile</p>
              <h2 className="font-serif text-sm md:text-5xl leading-snug md:leading-tight text-brand-navy">Wild Berry &<br/>Heavy Body</h2>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col justify-end items-end md:relative md:w-1/3 md:flex md:flex-col md:justify-center md:items-end md:h-full">
            <div ref={phase1Right} className="text-brand-navy opacity-100 md:opacity-0 md:absolute md:right-0 text-right">
              <p className="font-sans text-[10px] md:text-sm tracking-[0.2em] uppercase mb-1 md:mb-2 text-brand-navy/50">Process</p>
              <h2 className="font-serif text-sm md:text-5xl leading-snug md:leading-tight text-brand-navy">72-Hour<br/>Anaerobic</h2>
            </div>
            <div ref={phase2Right} className="text-brand-navy opacity-0 md:absolute md:right-0 text-right">
              <p className="font-sans text-[10px] md:text-sm tracking-[0.2em] uppercase mb-1 md:mb-2 text-brand-navy/50">Roast</p>
              <h2 className="font-serif text-sm md:text-5xl leading-snug md:leading-tight text-brand-navy">Hand-crafted in<br/>Addis Ababa</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
