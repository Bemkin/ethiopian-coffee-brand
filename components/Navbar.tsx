'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <>
      {/* Fixed Header — Preserves the original hamburger icon */}
      <header className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-6 py-6 md:px-12 md:py-8 pointer-events-none">
        <div className="pointer-events-auto">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="group flex items-center gap-3 hover:opacity-70 transition-opacity interactive"
            data-cursor="OPEN"
          >
            <div className="flex flex-col gap-[5px] w-6">
              <span className="h-[1px] w-full bg-brand-navy transition-transform origin-left group-hover:scale-x-110"></span>
              <span className="h-[1px] w-4 bg-brand-navy transition-transform origin-left group-hover:scale-x-125"></span>
            </div>
            <span className="font-sans text-xs tracking-[0.2em] text-brand-navy uppercase hidden md:block">
              Menu
            </span>
          </button>
        </div>

        {/* Right spacer (Cart button lives in CheckoutDrawer) */}
        <div className="w-10 md:w-20" />
      </header>

      {/* The Full-Screen Overlay Menu */}
      <div 
        className={`fixed inset-0 z-[110] bg-[#003548] text-[#FAF7F2] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Close Button */}
        <div className="absolute top-6 left-6 md:top-8 md:left-12">
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="text-xs tracking-widest uppercase font-semibold hover:opacity-50 transition-opacity flex items-center gap-2 interactive"
            data-cursor="CLOSE"
          >
            [ Close ]
          </button>
        </div>

        {/* Centered Menu Content */}
        <div className="w-full h-full flex flex-col justify-center px-6 md:px-24">
          <nav className="flex flex-col gap-4 md:gap-8">
            {[
              { num: '01', label: 'The Origin' },
              { num: '02', label: 'Shop Coffee' },
              { num: '03', label: 'Our Story' },
              { num: '04', label: 'Journal' },
            ].map((link, i) => (
              <Link 
                key={link.num} 
                href="#"
                onClick={() => setIsMenuOpen(false)}
                className={`group flex items-baseline gap-4 md:gap-8 w-max interactive transition-all duration-700 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: isMenuOpen ? `${i * 100 + 200}ms` : '0ms' }}
              >
                <span className="text-sm md:text-lg font-mono opacity-50 group-hover:opacity-100 transition-opacity">{link.num}</span>
                <span className="text-5xl md:text-[6rem] font-serif leading-none tracking-tight group-hover:italic transition-all duration-500">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer Social Links */}
          <div 
            className={`absolute bottom-6 left-6 md:bottom-12 md:left-12 flex gap-8 text-xs tracking-widest uppercase transition-all duration-1000 ${isMenuOpen ? 'opacity-50 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: isMenuOpen ? '600ms' : '0ms' }}
          >
            <a href="#" className="hover:opacity-100 transition-opacity interactive">Instagram</a>
            <a href="#" className="hover:opacity-100 transition-opacity interactive">Twitter</a>
            <a href="#" className="hover:opacity-100 transition-opacity interactive">Contact</a>
          </div>
        </div>
      </div>
    </>
  );
}
