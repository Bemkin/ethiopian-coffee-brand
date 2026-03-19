'use client';
import React from 'react';

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-6 py-6 md:px-[4vw] md:py-8 pointer-events-none">
      
      {/* LEFT: Menu Button */}
      <div className="pointer-events-auto">
        <button className="group flex items-center gap-3 hover:opacity-70 transition-opacity">
          <div className="flex flex-col gap-[5px] w-6">
            <span className="h-[1px] w-full bg-brand-navy transition-transform origin-left group-hover:scale-x-110"></span>
            <span className="h-[1px] w-4 bg-brand-navy transition-transform origin-left group-hover:scale-x-125"></span>
          </div>
          <span className="font-sans text-xs tracking-[0.2em] text-brand-navy uppercase hidden md:block">
            Menu
          </span>
        </button>
      </div>

      {/* RIGHT: Cart Button */}
      <div className="pointer-events-auto">
        <button className="font-sans text-xs tracking-[0.2em] text-brand-navy uppercase hover:opacity-70 transition-opacity">
          Cart (0)
        </button>
      </div>

    </header>
  );
}
