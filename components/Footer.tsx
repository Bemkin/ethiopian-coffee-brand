'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // The Unmasking Reveal for the massive text
      gsap.fromTo(
        textRef.current,
        { y: '120%', rotation: 2, opacity: 0 },
        {
          y: '0%',
          rotation: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 75%', // Triggers when the footer is 25% visible
          },
        }
      );

      // A subtle fade-up for the Shop button
      gsap.fromTo(
        buttonRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 75%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer 
      ref={footerRef} 
      className="relative w-full bg-[#003548] text-[#FAF7F2] pt-32 pb-12 px-6 md:px-12 flex flex-col justify-between min-h-[60vh] md:min-h-[80vh] rounded-t-[2rem] md:rounded-t-[4rem] -mt-10 md:-mt-16 z-20"
    >
      <div className="flex flex-col items-center justify-center flex-grow">
        <p className="text-sm md:text-lg tracking-[0.2em] uppercase text-[#FAF7F2]/70 mb-8 text-center">
          The Journey Ends, The Experience Begins
        </p>
        
        {/* The Magic "Unmasking" Wrapper */}
        <div className="overflow-hidden pb-4">
          <h1 
            ref={textRef} 
            className="text-5xl sm:text-7xl md:text-[9rem] leading-[0.9] font-serif text-center uppercase origin-bottom"
          >
            From Addis<br />To The World
          </h1>
        </div>

        <button 
          ref={buttonRef}
          className="mt-16 px-10 py-4 border border-[#FAF7F2]/30 rounded-full text-sm tracking-widest uppercase hover:bg-[#FAF7F2] hover:text-[#003548] transition-colors duration-500"
          data-cursor="SHOP"
        >
          Shop The Origin
        </button>
      </div>

      {/* Standard Footer Links / Copyright */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center mt-20 pt-8 border-t border-[#FAF7F2]/10 text-xs md:text-sm text-[#FAF7F2]/50">
        <p>© 2026 Kaffa Roasters. All Rights Reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-[#FAF7F2] transition-colors">Instagram</a>
          <a href="#" className="hover:text-[#FAF7F2] transition-colors">Twitter</a>
          <a href="#" className="hover:text-[#FAF7F2] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
