# Accessibility (a11y) & Fallback Systems for 3D Web

Guidelines and code patterns to guarantee full WCAG 2.1 AA compliance, motion-sensitivity safeguards, and Tier-0 progressive degradation.

---

## 1. The 3D Accessibility Dilemma

Canvas elements are inherently opaque bitmap surfaces to assistive technology. Without explicit architectural intervention, a 3D web experience is completely invisible to screen readers and unusable for keyboard-only or motion-sensitive users.

### The Three Pillars of Accessible 3D Web:
1. **Semantic HTML DOM Mirroring**: Providing an accessible HTML overlay that exposes interactive 3D objects as real buttons, links, or dialogs.
2. **Motion Sensitivity Orchestration (`prefers-reduced-motion`)**: Replacing high-speed camera transitions and continuous spinning with subtle fades or static viewpoints.
3. **Hardware Tier-0 Fallback**: Automatically unmounting 3D rendering for blacklisted or under-powered GPUs and substituting a lightweight, interactive WebP/CSS product viewer.

---

## 2. Semantic DOM Mirror Pattern

```tsx
// components/Accessible3DExperience.tsx
import React, { useState } from 'react';
import { CanvasContainer } from './CanvasContainer';

interface Hotspot {
  id: string;
  label: string;
  description: string;
  position: [number, number, number];
}

const HOTSPOTS: Hotspot[] = [
  { id: 'engine', label: 'Rotary Motor', description: 'Ultra-low vibration electric powertrain with 450kW output.', position: [0, 1, 0] },
  { id: 'battery', label: 'Solid-State Battery Pack', description: '95kWh density delivering up to 600km range.', position: [0, -0.5, 0] },
];

export function Accessible3DExperience() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  return (
    <section className="relative w-full h-[600px]" aria-label="Interactive 3D Product Explorer">
      {/* 1. Visual 3D Canvas */}
      <CanvasContainer fallbackImage="/product-static.webp">
        {/* 3D Scene Components */}
      </CanvasContainer>

      {/* 2. Accessible DOM Screen Reader Tree & Keyboard Navigation Rig */}
      <nav aria-label="3D Product Features" className="sr-only focus-within:not-sr-only absolute top-4 left-4 z-30 bg-black/90 p-4 rounded-lg text-white">
        <h2>Features available in 3D View:</h2>
        <ul className="space-y-2 mt-2">
          {HOTSPOTS.map((spot) => (
            <li key={spot.id}>
              <button
                type="button"
                className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-500 focus:ring-2 focus:ring-white"
                onClick={() => setActiveHotspot(spot)}
                aria-expanded={activeHotspot?.id === spot.id}
              >
                Inspect {spot.label}
              </button>
              {activeHotspot?.id === spot.id && (
                <p className="mt-1 text-xs text-gray-300" role="status">
                  {spot.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
```

---

## 3. Motion Sensitivity (`prefers-reduced-motion`)

```typescript
// hooks/useReducedMotion3D.ts
import { useState, useEffect } from 'react';

export function useReducedMotion3D(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReduced;
}
```

When `prefersReduced` is `true`:
- Disable camera fly-throughs; jump directly to target coordinates.
- Set continuous rotation speeds to `0`.
- Disable particle drift and fluid shader wobbles.

---

## 4. Hardware Tier-0 Progressive Degradation

```tsx
// components/Adaptive3DViewer.tsx
import React, { useEffect, useState } from 'react';
import { getGPUTier } from 'detect-gpu';
import { CanvasContainer } from './CanvasContainer';

export function Adaptive3DViewer({ children }: { children: React.ReactNode }) {
  const [isTier0, setIsTier0] = useState<boolean | null>(null);

  useEffect(() => {
    async function evaluateHardware() {
      const gpu = await getGPUTier();
      // Tier 0 indicates low memory, blacklisted GPU, or disabled WebGL
      setIsTier0(gpu.tier === 0 || gpu.isMobile && gpu.tier < 1);
    }
    evaluateHardware();
  }, []);

  if (isTier0 === null) {
    return <div className="w-full h-96 bg-[#0a0a0f] animate-pulse" />;
  }

  // Gracefully degrade to static 2D high-res interactive image stack
  if (isTier0) {
    return (
      <div className="relative w-full h-[500px] flex items-center justify-center bg-gray-900">
        <img
          src="/product-fallback-360.webp"
          alt="Product 2D Preview"
          className="max-h-full object-contain"
        />
        <span className="absolute bottom-4 right-4 text-xs text-gray-500">
          Standard 2D Mode Active
        </span>
      </div>
    );
  }

  return <CanvasContainer>{children}</CanvasContainer>;
}
```
