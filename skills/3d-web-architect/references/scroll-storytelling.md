# Scroll-Driven 3D Storytelling Reference

Production-grade camera path choreography using Lenis smooth scrolling, GSAP ScrollTrigger, and Three.js spline math.

---

## 1. The Scrollytelling Choreography Problem

Naive 3D scrollytelling implementations suffer from two common flaws:
1. **Gimbal lock & whipping**: Directing the camera at a fixed point (e.g., origin `(0,0,0)`) while moving along a curve causes violent camera spins whenever the path comes near that point.
2. **Jerky motion**: Directly mapping raw scroll offsets to camera positions produces jitter on low-refresh rate mice or high-speed touch drags.

### The Solution: Tangent Look-Ahead & Quaternion Damping
- Sample position on a `CatmullRomCurve3` at $t$.
- Sample forward point at $t + \Delta t$ or calculate curve tangent vector $T(t) = \text{curve.getTangentAt}(t)$.
- Construct the forward-looking target: $\text{target} = P(t) + T(t) \cdot L$, where $L$ is look-ahead distance.
- Blend with the focal point of interest using linear interpolation (`lerp`).
- Apply `MathUtils.damp3` or quaternion slerp for frame-independent buttery-smooth tracking.

---

## 2. Production Scrollytelling Implementation

```typescript
// utils/scrollChoreography.ts
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollStoryOptions {
  camera: THREE.PerspectiveCamera;
  splinePath: THREE.CatmullRomCurve3;
  triggerElement: HTMLElement;
  focalTarget?: THREE.Vector3;
  lookAheadDist?: number;
  focalWeight?: number; // 0.0 = pure forward look-ahead, 1.0 = locked onto focalTarget
}

export function setupScrollStory({
  camera,
  splinePath,
  triggerElement,
  focalTarget = new THREE.Vector3(0, 0, 0),
  lookAheadDist = 3.0,
  focalWeight = 0.35,
}: ScrollStoryOptions) {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // 2. Synchronize Lenis with GSAP Ticker
  lenis.on('scroll', ScrollTrigger.update);
  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  // 3. Invariant #1: Pre-allocate scratch vectors outside render ticks
  const _currentPos = new THREE.Vector3();
  const _targetPos = new THREE.Vector3();
  const _tangent = new THREE.Vector3();
  const _computedLookAt = new THREE.Vector3();
  const _smoothedCameraPos = new THREE.Vector3().copy(camera.position);

  const scrollProxy = { progress: 0 };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2, // Smooth interpolation lag
      onUpdate: (self) => {
        scrollProxy.progress = self.progress;
      },
    },
  });

  // 4. Per-frame RAF update with tangent look-ahead and damping
  const updateCamera = () => {
    const t = THREE.MathUtils.clamp(scrollProxy.progress, 0, 1);

    // Sample spline position at t
    splinePath.getPointAt(t, _currentPos);

    // Smoothly damp camera position toward spline point (eliminates micro-stutters)
    _smoothedCameraPos.lerp(_currentPos, 0.15);
    camera.position.copy(_smoothedCameraPos);

    // Sample forward tangent vector along curve
    splinePath.getTangentAt(t, _tangent);

    // Forward target based on tangent vector
    _computedLookAt.copy(_smoothedCameraPos).addScaledVector(_tangent, lookAheadDist);

    // Blend forward trajectory with primary focal target (e.g., product model)
    _computedLookAt.lerp(focalTarget, focalWeight);

    camera.lookAt(_computedLookAt);
  };

  gsap.ticker.add(updateCamera);

  // Return complete teardown method
  return {
    destroy: () => {
      gsap.ticker.remove(tickerCallback);
      gsap.ticker.remove(updateCamera);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    },
    timeline: tl,
  };
}
```

---

## 3. React Three Fiber Hook Integration

```tsx
// hooks/useScrollSpline.ts
import { useLayoutEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollSpline(
  spline: THREE.CatmullRomCurve3,
  triggerRef: React.RefObject<HTMLElement>,
  focalPoint = new THREE.Vector3(0, 0, 0)
) {
  const { camera } = useThree();
  const progressRef = useRef(0);

  // Scratch vectors pre-allocated (Invariant #1)
  const _pos = useRef(new THREE.Vector3());
  const _tangent = useRef(new THREE.Vector3());
  const _lookAt = useRef(new THREE.Vector3());

  useLayoutEffect(() => {
    if (!triggerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.0,
      onUpdate: (self) => {
        // Invariant #2: Mutate ref, never call useState inside scroll listener
        progressRef.current = self.progress;
      },
    });

    return () => st.kill();
  }, [triggerRef]);

  useFrame((_, delta) => {
    const t = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    spline.getPointAt(t, _pos.current);
    spline.getTangentAt(t, _tangent.current);

    // Frame-rate independent damping
    camera.position.damp(_pos.current, 0.2, delta);

    _lookAt.current.copy(camera.position).addScaledVector(_tangent.current, 2.5);
    _lookAt.current.lerp(focalPoint, 0.4);

    camera.lookAt(_lookAt.current);
  });
}
```
