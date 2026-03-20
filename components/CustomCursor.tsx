'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isHoveringDrag, setIsHoveringDrag] = useState(false);

  useEffect(() => {
    if (!cursorRef.current || !textRef.current) return;

    // High-performance GSAP tracking
    const xMove = gsap.quickTo(cursorRef.current, 'x', { duration: 0.15, ease: 'power3' });
    const yMove = gsap.quickTo(cursorRef.current, 'y', { duration: 0.15, ease: 'power3' });

    const moveCursor = (e: MouseEvent) => {
      xMove(e.clientX);
      yMove(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over the drag area
      if (target.closest('.drag-cursor-zone')) {
        setIsHoveringDrag(true);
        // Scale ONLY the background dot (Task 34: Scale 7 for better framing)
        gsap.to('.cursor-bg', { scale: 7, backgroundColor: 'rgba(0, 53, 72, 0.9)', duration: 0.3 });
        // Fade in the unscaled text
        gsap.to(textRef.current, { opacity: 1, duration: 0.3 });
      } 
      // Add more states here later (e.g., links, buttons)
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.drag-cursor-zone')) {
        setIsHoveringDrag(false);
        gsap.to('.cursor-bg', { scale: 1, backgroundColor: '#003548', duration: 0.3 });
        gsap.to(textRef.current, { opacity: 0, duration: 0.3 });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ width: 0, height: 0 }}
    >
      {/* The perfectly square scaling background dot */}
      <div 
        className="cursor-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#003548]"
        style={{ width: '12px', height: '12px' }}
      />
      
      {/* The non-scaling text */}
      <div 
        ref={textRef} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FAF7F2] text-[10px] font-sans tracking-[0.2em] uppercase opacity-0 whitespace-nowrap"
      >
        Drag
      </div>
    </div>
  );
}
