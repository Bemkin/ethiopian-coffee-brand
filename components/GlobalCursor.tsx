'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GlobalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Exit immediately on touch devices — custom cursors are a UX error on mobile
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // 1. Setup QuickSetters for maximum performance (bypasses GSAP overhead)
    const xSet = gsap.quickSetter(cursorRef.current, "x", "px");
    const ySet = gsap.quickSetter(cursorRef.current, "y", "px");
    
    const xFollowerSet = gsap.quickSetter(followerRef.current, "x", "px");
    const yFollowerSet = gsap.quickSetter(followerRef.current, "y", "px");

    // 2. The Move Function
    const handleMove = (e: MouseEvent) => {
      // Immediate position for the center dot
      xSet(e.clientX);
      ySet(e.clientY);

      // Silky smooth lag for the outer ring
      gsap.to({}, {
        duration: 0.4,
        onUpdate: () => {
          xFollowerSet(e.clientX);
          yFollowerSet(e.clientY);
        }
      });
    };

    // 3. Hover Interactions & Morphing Logic (Event Delegation)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const cursorTarget = target.closest('[data-cursor]');
      const cursorText = cursorTarget?.getAttribute('data-cursor');
      const isFooter = target.closest('footer') !== null;
      const isInteractive = target.closest('a, button, .interactive') !== null;

      // Logic for Data-Cursor (Morphing Bubble)
      if (cursorText) {
        if (textRef.current) textRef.current.innerText = cursorText;
        
        gsap.to(followerRef.current, { 
          scale: 2.2, // Refined small bubble for elegant affordance
          backgroundColor: isFooter ? '#FAF7F2' : '#003548',
          borderColor: 'transparent',
          mixBlendMode: 'normal',
          duration: 0.3,
          overwrite: "auto"
        });
        
        gsap.to(textRef.current, { 
          opacity: 1, 
          scale: 0.8, // Shrunk text to fit the elegant bubble
          color: isFooter ? '#003548' : '#FAF7F2',
          duration: 0.3, 
          delay: 0.1,
          overwrite: "auto"
        });
        
        gsap.to(cursorRef.current, { opacity: 0, scale: 0.2, duration: 0.2, overwrite: "auto" });
        return; 
      }

      // Revert from Morphing if we've left a data-cursor zone
      gsap.to(textRef.current, { opacity: 0, scale: 0.5, duration: 0.2, overwrite: "auto" });
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.2, overwrite: "auto" });

      // Color Inversion Logic (Cream on Footer, Navy elsewhere)
      if (isFooter) {
        gsap.to(cursorRef.current, { backgroundColor: '#FAF7F2', duration: 0.3, overwrite: "auto" });
        gsap.to(followerRef.current, { borderColor: 'rgba(250, 247, 242, 0.5)', duration: 0.3, overwrite: "auto" });
      } else {
        gsap.to(cursorRef.current, { backgroundColor: '#003548', duration: 0.3, overwrite: "auto" });
        gsap.to(followerRef.current, { borderColor: 'rgba(0, 53, 72, 0.3)', duration: 0.3, overwrite: "auto" });
      }

      // Magnetic Scale Logic for Links
      if (isInteractive) {
        const hoverBg = isFooter ? 'rgba(250, 247, 242, 0.1)' : 'rgba(0, 53, 72, 0.1)';
        gsap.to(followerRef.current, { 
          scale: 2.5, 
          backgroundColor: hoverBg, 
          borderColor: isFooter ? 'rgba(250, 247, 242, 0.5)' : 'rgba(0, 53, 72, 0.3)',
          mixBlendMode: 'difference',
          duration: 0.3, 
          overwrite: "auto" 
        });
        gsap.to(cursorRef.current, { scale: 0.5, duration: 0.3, overwrite: "auto" });
      } else {
        gsap.to(followerRef.current, { 
          scale: 1, 
          backgroundColor: 'transparent', 
          mixBlendMode: 'difference',
          duration: 0.3, 
          overwrite: "auto" 
        });
        gsap.to(cursorRef.current, { scale: 1, duration: 0.3, overwrite: "auto" });
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* The Center Dot: High Precision */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#003548] rounded-full z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      />
      {/* The Follower Ring: Silky Lag */}
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-[#003548]/30 rounded-full z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-difference origin-center"
      >
        <span 
          ref={textRef} 
          className="text-[#FAF7F2] text-[8px] font-bold tracking-[0.2em] opacity-0 uppercase origin-center absolute pointer-events-none leading-none"
        ></span>
      </div>
    </>
  );
}
