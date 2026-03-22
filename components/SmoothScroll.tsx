'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { ReactNode } from 'react';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis 
      root 
      // @ts-ignore - explicitly enabling undocumented legacy flags for Safari iOS
      options={{ 
        lerp: 0.07, // The friction. Lower = smoother but heavier feeling
        duration: 1.5, 
        smoothWheel: true, 
        smoothTouch: false,
        syncTouch: false,
      }}
    >
      {children as any}
    </ReactLenis>
  );
}
