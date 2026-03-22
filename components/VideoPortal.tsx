'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VideoPortal() {
  const containerRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !videoWrapperRef.current || !textRef.current) return;

    // ONE unified animation for ALL sizes — the card-expansion always works
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%", 
        scrub: true,
        pin: true,
      }
    });

    tl.to(videoWrapperRef.current, {
      width: "100vw",
      height: "100vh",
      borderRadius: "0px",
      force3D: "auto",
      ease: "power2.inOut",
      duration: 1
    }, 0)
    .to('.watermark-text', { 
      opacity: 0, 
      scale: 1.1,
      duration: 0.8, 
      ease: 'power2.out'
    }, 0) 
    .fromTo(textRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      "-=0.2" 
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Task 79: iOS Video Autoplay Hardening
  useEffect(() => {
    const videos = containerRef.current?.querySelectorAll('video');
    if (!videos) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const vid = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      });
    }, { threshold: 0.1 });

    videos.forEach(vid => observer.observe(vid));

    return () => {
      videos.forEach(vid => observer.unobserve(vid));
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-[#FAF7F2] flex items-center justify-center overflow-hidden mt-0 md:mt-[15vh]">
      
      {/* 1. The Floating Chapter Label */}
      <div className="absolute top-[15vh] w-full text-center z-10 pointer-events-none">
        <p className="font-sans text-xs md:text-sm tracking-[0.4em] uppercase text-[#003548]/60">
          Chapter 02
        </p>
      </div>

      {/* 2. Massive Background Watermark */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2 className="watermark-text font-serif text-[18vw] text-[#003548] opacity-10 tracking-tighter leading-none whitespace-nowrap select-none">
          The Alchemy
        </h2>
      </div>

      {/* 3. The Portal Card — ONE wrapper, unified GSAP for all sizes */}
      <div 
        ref={videoWrapperRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
        style={{ 
          width: "25vw", 
          height: "55vh", 
          borderRadius: "24px" 
        }}
        data-cursor="PLAY"
      >
        {/* Desktop Video */}
        <video 
          src="/assets/ceremony2.mp4"
          poster="/assets/ceremony2-poster.jpg"
          muted loop playsInline
          {...{"webkit-playsinline": "true"}}
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hidden md:block"
        />

        {/* Mobile Video (Native Vertical) */}
        <video 
          src="/assets/VID_20260320_205834_999.mp4"
          poster="/assets/VID_20260320_205834_999-poster.jpg"
          muted loop playsInline
          {...{"webkit-playsinline": "true"}}
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 md:hidden"
        />
        
        {/* Text overlay */}
        <div 
          ref={textRef}
          className="relative z-30 text-center text-[#FAF7F2] px-4"
        >
          <h3 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight">
            Roasted to<br/>Perfection.</h3>
          <p className="font-sans text-xs md:text-sm tracking-[0.4em] uppercase text-[#FAF7F2]/80">
            Unlocking the wild matrix
          </p>
        </div>
      </div>
    </section>
  );
}
