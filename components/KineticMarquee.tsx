'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function KineticMarquee() {
  const skewContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current || !skewContainerRef.current) return;
    
    // 1. Seamless infinite horizontal loop (Targets the inner track)
    const loopTl = gsap.timeline({ repeat: -1 });
    loopTl.to(trackRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 15 
    });

    // 2. Velocity Skew Physics (Targets the outer container so they don't fight)
    const trigger = ScrollTrigger.create({
      trigger: skewContainerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        // Clamp the skew so it doesn't become unreadable
        const skewAmount = Math.max(-15, Math.min(15, velocity / -100)); 
        
        gsap.to(skewContainerRef.current, { 
          skewX: skewAmount, 
          duration: 0.2, 
          overwrite: "auto",
          ease: "power1.out"
        });
      }
    });

    return () => {
      loopTl.kill();
      trigger.kill();
    };
  }, []);

  const text = "SINGLE ORIGIN • KAFFA BIOSPHERE • HAND ROASTED • ";

  return (
    <div className="relative w-full overflow-hidden bg-[#003548] pt-4 pb-16 md:pb-24 border-y border-[#FAF7F2]/10 flex items-center z-10">
      {/* Target 1: Handles the velocity leaning/skewing */}
      <div ref={skewContainerRef} className="w-full flex">
        {/* Target 2: Handles the infinite horizontal scrolling */}
        <div 
          ref={trackRef} 
          className="flex whitespace-nowrap text-[#FAF7F2] font-sans text-xl md:text-2xl tracking-[0.2em] uppercase origin-center"
          style={{ width: "max-content" }}
        >
          <div className="flex-shrink-0 px-4">{text}{text}{text}{text}</div>
          <div className="flex-shrink-0 px-4">{text}{text}{text}{text}</div>
        </div>
      </div>
    </div>
  );
}
