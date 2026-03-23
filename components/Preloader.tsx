'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const [readyComponents, setReadyComponents] = useState<Set<string>>(new Set());
  const REQUIRED_COMPONENTS = ['hero', 'gallery', 'matrix', 'portal'];

  // Global handler to lock scroll
  const blockScrollRef = useRef<(e: Event) => void>(() => {});

  useEffect(() => {
    // 1. Instantly lock the scroll so the user can't break the layout
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // 1.5. Aggressively intercept DOM scroll events
    blockScrollRef.current = (e: Event) => e.preventDefault();
    window.addEventListener('wheel', blockScrollRef.current, { passive: false });
    window.addEventListener('touchmove', blockScrollRef.current, { passive: false });

    // 2. Safety timeout: proceed anyway after 30 seconds if some component hangs
    const timer = setTimeout(() => {
      setIsTimedOut(true);
      console.warn('Preloader timed out waiting for assets.');
    }, 30000);

    // 3. Listener for component readiness
    const handleReady = (e: any) => {
      setReadyComponents(prev => new Set(prev).add(e.detail.id));
    };
    window.addEventListener('app-component-ready', handleReady as EventListener);

    const ctx = gsap.context(() => {
      const mainTl = gsap.timeline();
      
      // 4. The Loading Counter (0 to 99 based on time)
      let progress = { value: 0 };
      mainTl.to(progress, {
        value: 99,
        duration: 8.0, 
        ease: "power2.out",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(progress.value).toString();
          }
        }
      });
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', blockScrollRef.current);
      window.removeEventListener('touchmove', blockScrollRef.current);
      window.removeEventListener('app-component-ready', handleReady as EventListener);
      ctx.revert();
    }
  }, []);

  // Task 121: Synchronized Finishing Sequence
  useEffect(() => {
    const allReady = REQUIRED_COMPONENTS.every(id => readyComponents.has(id));

    if ((allReady || isTimedOut) && !isFinished) {
      const finishTl = gsap.timeline({
        onComplete: () => {
          // Task 123: CRITICAL FIX - Explicitly unlock scroll and remove blockers
          document.body.style.overflow = 'unset';
          window.removeEventListener('wheel', blockScrollRef.current);
          window.removeEventListener('touchmove', blockScrollRef.current);
          setIsFinished(true);
        }
      });

      // Quick jump to 100%
      let progress = { value: 99 };
      finishTl.to(progress, {
        value: 100,
        duration: 0.4,
        ease: "none",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.innerText = Math.round(progress.value).toString();
          }
        }
      })
      // Fade and slide the text away
      .to(textRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut"
      }, "+=0.2")
      // The Grand Reveal
      .to(loaderRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut"
      });
    }
  }, [readyComponents, isTimedOut, isFinished]);

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
