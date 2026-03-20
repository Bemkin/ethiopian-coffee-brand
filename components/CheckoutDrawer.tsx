/**
 * @file CheckoutDrawer.tsx
 * @description A premium, physics-based slide-in cart drawer using Framer Motion.
 * Features a custom 'Success Burst' micro-interaction contained within the CTA button
 * to reward the user for subscribing.
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Simulates a checkout process
  const handleSubscribe = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setIsOpen(false);
      }, 3000);
    }, 1500);
  };

  return (
    <>
      {/* Floating Trigger Button — Task 60: Adjusted for mobile proportions */}
      <div className="fixed top-6 right-6 md:top-8 md:right-[4vw] z-[100]">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand-navy text-brand-cream px-4 py-2 text-xs md:px-8 md:py-4 rounded-full font-sans font-bold tracking-widest md:text-[11px] uppercase hover:bg-brand-navy/90 transition-all shadow-2xl hover:scale-105 active:scale-95"
        >
          Cart <span className="hidden md:inline">(1)</span>
        </button>
      </div>

      {/* Drawer Overlay & Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-navy/40 backdrop-blur-md z-[110]"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-brand-cream z-[120] shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-10 border-b border-brand-navy/10 flex justify-between items-center">
                <h2 className="font-serif text-3xl text-brand-navy uppercase tracking-tighter font-black">Your Selection</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-brand-navy text-3xl opacity-30 hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>

              {/* Drawer Body - Order Summary */}
              <div className="p-10 flex-grow flex flex-col gap-8 text-brand-navy">
                <div className="flex justify-between items-start pb-8 border-b border-brand-navy/10">
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-1 italic">Kaffa Highlands</h3>
                    <p className="font-sans text-xs uppercase tracking-widest opacity-60">Single Origin • 250g • Whole Bean</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-[#E8D8A6]/40 px-3 py-1.5 rounded-full">
                      <div className="w-1.5 h-1.5 bg-brand-navy rounded-full animate-pulse" />
                      <p className="text-[10px] font-sans font-bold uppercase tracking-widest">Ships every 14 days</p>
                    </div>
                  </div>
                  <p className="font-sans font-bold text-lg">$24.00</p>
                </div>
                
                <div className="mt-auto space-y-4 pt-8 border-t border-brand-navy/10">
                   <div className="flex justify-between text-xs uppercase tracking-[0.2em] opacity-60">
                     <span>Shipping</span>
                     <span>Calculated at next step</span>
                   </div>
                   <div className="flex justify-between text-2xl font-serif font-black uppercase">
                     <span>Total</span>
                     <span>$24.00</span>
                   </div>
                </div>
              </div>

              {/* Drawer Footer - The Interactive Button */}
              <div className="p-10 bg-white border-t border-brand-navy/10">
                <button
                  onClick={handleSubscribe}
                  disabled={status !== 'idle'}
                  className="relative w-full bg-brand-navy text-brand-cream py-6 rounded-sm overflow-hidden font-sans font-bold uppercase tracking-[0.2em] text-[12px] transition-all hover:bg-brand-navy/95 active:scale-[0.98] disabled:hover:scale-100 disabled:opacity-90"
                >
                  {/* Button Text / State */}
                  <span className={`relative z-10 transition-opacity duration-300 ${status === 'success' ? 'opacity-0' : 'opacity-100'}`}>
                    {status === 'idle' ? 'Confirm Subscription' : 'Processing...'}
                  </span>
                  
                  <span className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 ${status === 'success' ? 'opacity-100' : 'opacity-0'}`}>
                    Welcome to the Origin.
                  </span>

                  {/* The Success Burst (Framer Motion Particles) */}
                  <AnimatePresence>
                    {status === 'success' && (
                      <motion.div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                        {[...Array(16)].map((_, i) => {
                          const angle = (i / 16) * Math.PI * 2;
                          const distance = 100 + Math.sin(i * 123.45) * 50; 
                          const x = Math.cos(angle) * distance;
                          const y = Math.sin(angle) * distance;
                          
                          return (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                              animate={{ 
                                scale: [0, 1.5, 0],
                                x,
                                y,
                                opacity: [1, 1, 0]
                              }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="absolute w-1.5 h-1.5 bg-[#E8D8A6] rounded-full"
                            />
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
