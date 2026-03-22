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
        smoothTouch: false,
        syncTouch: false,
      } as any}
    >
      {children as any}
    </ReactLenis>
  );
}
