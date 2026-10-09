# Scene Setup & Resilient Lifecycle Reference

Canonical production-ready scene setup, non-destructive WebGL context loss recovery, and responsive camera framing math.

---

## 1. Resilient React Three Fiber Canvas Container

### The Critical Context Loss Pitfall
In typical React patterns, developers conditionally render the Canvas on context loss:
```tsx
// ❌ BROKEN PATTERN: Destroys the canvas element permanently
{contextLost ? <Fallback /> : <Canvas>...</Canvas>}
```
**Why it fails**: When `<Canvas>` is unmounted, React removes the `<canvas>` DOM node from the document. The browser's native `webglcontextrestored` event fires **on that specific canvas element**. Because the node has been destroyed, the event is permanently lost, leaving the user with an unrecoverable crash.

### Correct Non-Destructive Pattern
Keep `<Canvas>` permanently mounted. Overlay an accessible, non-destructive status UI while the GPU driver recovers.

```tsx
// components/CanvasContainer.tsx
import React, { Suspense, useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader } from '@react-three/drei';
import * as THREE from 'three';

interface CanvasContainerProps {
  children: React.ReactNode;
  fallbackImage?: string;
  className?: string;
}

export function CanvasContainer({
  children,
  fallbackImage = '/fallback-preview.webp',
  className = 'relative w-full h-full min-h-[500px]',
}: CanvasContainerProps) {
  const [contextLost, setContextLost] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Preserve Canvas DOM element while toggling interactive fallback overlay
  const handleContextLost = useCallback((event: Event) => {
    event.preventDefault(); // Prevents browser from permanently disabling context
    setContextLost(true);
    console.warn('[WebGL] Context lost. Canvas preserved, awaiting GPU restoration...');
  }, []);

  const handleContextRestored = useCallback(() => {
    setContextLost(false);
    console.info('[WebGL] Context restored successfully. Resuming rendering.');
  }, []);

  return (
    <div className={`overflow-hidden bg-[#0a0a0f] ${className}`}>
      {/* 
        CRITICAL: Canvas MUST remain mounted in DOM for 'webglcontextrestored' to fire.
        Tone mapping and SRGBColorSpace are automatically configured in modern R3F.
      */}
      <Canvas
        ref={canvasRef}
        dpr={[1, 2]} // Invariant #4: Strictly clamp DPR between 1 and 2
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0, 1.5, 5], fov: 45, near: 0.1, far: 100 }}
        onCreated={({ gl }) => {
          const dom = gl.domElement;
          dom.addEventListener('webglcontextlost', handleContextLost, false);
          dom.addEventListener('webglcontextrestored', handleContextRestored, false);
        }}
      >
        <Suspense fallback={null}>
          {/* Invariant #9: PBR materials require an Environment */}
          <Environment preset="city" />
          {children}
        </Suspense>
      </Canvas>

      {/* Non-destructive Fallback Overlay (Active only while context is lost) */}
      {contextLost && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 p-6 text-center text-white backdrop-blur-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 mb-3">
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
          <p className="text-lg font-semibold">Graphics Connection Interrupted</p>
          <p className="mt-1 text-sm text-gray-400 max-w-sm">
            Your browser GPU context was reset. Reconnecting automatically...
          </p>
          <img
            src={fallbackImage}
            alt="Scene Preview"
            className="mt-4 max-h-48 rounded-lg object-contain opacity-75 border border-white/10"
          />
        </div>
      )}

      {/* Accessible Loading Indicator */}
      <Loader dataInterpolation={(p) => `Loading 3D Experience: ${p.toFixed(0)}%`} />
    </div>
  );
}
```

---

## 2. Universal Responsive Auto-Framing Math

Mobile devices in portrait orientation have an aspect ratio $< 1.0$, which cuts off models framed for desktop ($16:9$).

```typescript
// utils/cameraMath.ts
import * as THREE from 'three';

/**
 * Fits a PerspectiveCamera dynamically to frame any 3D object without clipping on any screen aspect.
 */
export function fitCameraToObject(
  camera: THREE.PerspectiveCamera,
  object: THREE.Object3D,
  offsetMultiplier: number = 1.2
): { targetPosition: THREE.Vector3; center: THREE.Vector3; distance: number } {
  // 1. Calculate bounding box and bounding sphere
  const box = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const sphere = new THREE.Sphere();
  box.getBoundingSphere(sphere);
  const radius = sphere.radius;

  // 2. Compute base distance from vertical FOV
  const fovRad = (camera.fov * Math.PI) / 180;
  let distance = radius / Math.sin(fovRad / 2);

  // 3. Compensate for narrow aspect ratios (Mobile portrait)
  const aspect = camera.aspect;
  if (aspect < 1.0) {
    // Multiply distance by inverse aspect so horizontal FOV does not clip the model
    distance = distance / aspect;
  }

  distance *= offsetMultiplier;

  // 4. Position camera along current view direction
  const direction = new THREE.Vector3(0, 0.2, 1).normalize();
  const targetPosition = center.clone().add(direction.multiplyScalar(distance));

  return { targetPosition, center, distance };
}
```

---

## 3. Vanilla Three.js Production Lifecycle & Visibility Handling

```javascript
// scene/SceneEngine.js
import * as THREE from 'three';

export class SceneEngine {
  constructor(container) {
    this.container = container;
    this._rafId = null;
    this._isPaused = false;
    this._clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this._initCamera();
    this._initRenderer();
    this._bindLifecycleEvents();
  }

  _initCamera() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(0, 2, 6);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Invariant #4
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(this.renderer.domElement);
  }

  _bindLifecycleEvents() {
    // 1. Invariant #10: Pause on tab switch to preserve battery & GPU
    this._handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        this.pause();
      } else {
        this.resume();
      }
    };
    document.addEventListener('visibilitychange', this._handleVisibility);

    // 2. Invariant #7: Handle context loss without page crash
    this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.pause();
      console.warn('[WebGL] Context lost. Paused RAF.');
    });

    this.renderer.domElement.addEventListener('webglcontextrestored', () => {
      console.info('[WebGL] Context restored. Resuming RAF.');
      this.resume();
    });

    // 3. Resize handling with Debounce
    this._handleResize = () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', this._handleResize);
  }

  start() {
    this.resume();
  }

  pause() {
    this._isPaused = true;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  resume() {
    if (!this._isPaused && this._rafId) return;
    this._isPaused = false;
    this._clock.start();
    const tick = () => {
      if (this._isPaused) return;
      const delta = this._clock.getDelta();
      this.update(delta);
      this.renderer.render(this.scene, this.camera);
      this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  update(delta) {
    // Override in subclass. Invariant #1: Never allocate new objects here!
  }

  destroy() {
    this.pause();
    document.removeEventListener('visibilitychange', this._handleVisibility);
    window.removeEventListener('resize', this._handleResize);

    // Invariant #3: Recursive resource disposal
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
```
