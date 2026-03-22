'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { ReactNode } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
      <ReactLenis 
      root 
      options={{ 
        lerp: 0.07, // The friction. Lower = smoother but heavier feeling
        duration: 1.5, 
        smoothWheel: true, 
        // Task 79: Completely disable Lenis interference on touch devices 
        // to let the native iOS momentum scrolling take over without Double-Scroll fights.
        syncTouch: false,
        touchMultiplier: 0
      }}
    >
      {children as any}
    </ReactLenis>
  );
}
