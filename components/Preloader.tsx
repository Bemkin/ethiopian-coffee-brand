'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // 1. Instantly lock the scroll so the user can't break the layout
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // 1.5. Aggressively intercept DOM scroll events to definitively bypass Lenis/Safari wheel passthrough
    const blockScroll = (e: Event) => e.preventDefault();
    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockScroll, { passive: false });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Unlock the page, detach listeners, and unmount component
          document.body.style.overflow = 'unset';
          window.removeEventListener('wheel', blockScroll);
          window.removeEventListener('touchmove', blockScroll);
          setIsFinished(true);
        }
      });

      // 2. The Loading Counter (0 to 100)
      let progress = { value: 0 };
      tl.to(progress, {
        value: 100,
        duration: 7.0, // Drastically extended to mask 50MB background video negotiations
        ease: "power2.out",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(progress.value).toString();
          }
        }
      });

      // 3. Fade and slide the text away (With added breathing room)
      tl.to(textRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut"
      }, "+=0.5");

      // 4. The Grand Reveal (Curtain slides up)
      tl.to(loaderRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut"
      });
    });

    return () => {
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
      ctx.revert();
    }
  }, []);

  // completely remove from DOM after animation completes
  if (isFinished) return null;

  return (
    <div 
      ref={loaderRef}
      className="fixed inset-0 z-[99999] bg-[#003548] text-[#FAF7F2] flex flex-col items-center justify-center touch-none"
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
