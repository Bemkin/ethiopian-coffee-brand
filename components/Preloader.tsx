'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Task 79: Robust iOS Body Locking
    // 1. Instantly lock the scroll, but cache the exact scrollY to prevent iOS jumping.
    const scrollY = window.scrollY;
    
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Task 79: Unlock the page and meticulously restore the scroll position
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          
          window.scrollTo(0, scrollY);
          setIsFinished(true);
        }
      });

      // 2. The Loading Counter (0 to 100)
      let progress = { value: 0 };
      tl.to(progress, {
        value: 100,
        duration: 4.5, // Extended from 2.2s to 4.5s to give the browser drastically more time to download the 192 Hero canvas frames
        ease: "power2.out",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(progress.value).toString();
          }
        }
      });

      // 3. Fade and slide the text away
      tl.to(textRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut"
      }, "+=0.2");

      // 4. The Grand Reveal (Curtain slides up)
      tl.to(loaderRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut"
      });
    });

    return () => ctx.revert();
  }, []);

  // completely remove from DOM after animation completes
  if (isFinished) return null;

  return (
    <div 
      ref={loaderRef}
      className="fixed top-0 left-0 w-full h-screen-safe z-[99999] bg-[#003548] text-[#FAF7F2] flex flex-col items-center justify-center"
    >
      <div ref={textRef} className="flex flex-col items-center gap-4">
        <span className="text-xs tracking-[0.4em] uppercase text-[#FAF7F2]/50">
          Entering Kaffa
        </span>
        <div className="text-6xl md:text-8xl font-serif flex items-baseline gap-1">
          <span ref={counterRef}>0</span>
          <span className="text-3xl md:text-5xl text-[#FAF7F2]/50">%</span>
        </div>
      </div>
    </div>
  );
}
