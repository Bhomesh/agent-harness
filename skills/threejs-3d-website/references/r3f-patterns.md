# React Three Fiber (R3F) Patterns Reference

Production-grade patterns for React Three Fiber + Drei.

---

## Stack

```bash
npm install three @react-three/fiber @react-three/drei zustand @react-spring/three
```

---

## Pattern 1: Canvas Architecture

```tsx
// app/layout.tsx (Next.js App Router)
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Scene } from '@/components/Scene';

export default function RootLayout() {
  return (
    <html>
      <body>
        <div id="canvas-container" className="fixed inset-0 z-0">
          {/* Canvas is isolated — no re-render from UI state */}
          <Canvas
            camera={{ position: [0, 2, 8], fov: 75, near: 0.1, far: 1000 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
            dpr={[1, 2]} // equivalent to Math.min(devicePixelRatio, 2)
            shadows
            // Use 'demand' for static scenes to save GPU
            // frameloop="demand"
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
          {/* Loading progress overlay */}
          <Loader />
        </div>

        {/* UI sits above canvas */}
        <div id="ui-overlay" className="relative z-10 pointer-events-none">
          {/* children */}
        </div>
      </body>
    </html>
  );
}
```

---

## Pattern 2: Scene Component Structure

```tsx
// components/Scene.tsx
import { Environment, ContactShadows } from '@react-three/drei';
import { ProductModel } from './ProductModel';
import { ParticleField } from './ParticleField';
import { SceneLights } from './SceneLights';
import { CameraRig } from './CameraRig';

export function Scene() {
  return (
    <>
      {/* Declarative environment (handles PMREMGenerator internally) */}
      <Environment preset="studio" background={false} />

      <SceneLights />
      <CameraRig />

      {/* Each 3D entity is its own component */}
      <Suspense fallback={null}>
        <ProductModel position={[0, 0, 0]} />
      </Suspense>

      <ParticleField count={5000} />

      {/* Fake shadow on ground */}
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.7}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  );
}
```

---

## Pattern 3: useFrame Rules (Critical)

```tsx
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

// Pre-allocate reusable objects OUTSIDE component
const _tempVec3 = new THREE.Vector3();
const _tempQuat = new THREE.Quaternion();

export function AnimatedModel() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // ✅ Use delta for frame-rate-independent animation
    meshRef.current.rotation.y += delta * 0.5;

    // ✅ Reuse pre-allocated objects
    _tempVec3.set(
      Math.sin(state.clock.elapsedTime) * 0.1,
      0,
      0
    );
    meshRef.current.position.add(_tempVec3);

    // ❌ NEVER: setState inside useFrame
    // setRotation(mesh.rotation.y); // KILLS performance

    // ❌ NEVER: new objects inside useFrame
    // const v = new THREE.Vector3(); // GC nightmare
  });

  return <mesh ref={meshRef}><boxGeometry /><meshStandardMaterial /></mesh>;
}
```

---

## Pattern 4: Zustand for 3D State

```tsx
// store/sceneStore.ts
import { create } from 'zustand';

interface SceneState {
  selectedModel: string | null;
  scrollProgress: number;
  qualityTier: 0 | 1 | 2 | 3;
  setSelectedModel: (id: string | null) => void;
  setScrollProgress: (p: number) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  selectedModel: null,
  scrollProgress: 0,
  qualityTier: 2,
  setSelectedModel: (id) => set({ selectedModel: id }),
  setScrollProgress: (p) => set({ scrollProgress: p }),
}));

// ✅ In R3F component — subscribe only to what's needed
function Product() {
  const selectedModel = useSceneStore((s) => s.selectedModel);
  const isSelected = selectedModel === 'shoe-001';

  // Spring animation based on selection state
  // ...
}

// ✅ In scroll handler (outside Canvas)
function ScrollDriver() {
  useEffect(() => {
    const handleScroll = () => {
      const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      useSceneStore.getState().setScrollProgress(p); // Direct state update, no re-render
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
}
```

---

## Pattern 5: Asset Loading with useGLTF

```tsx
import { useGLTF, useTexture } from '@react-three/drei';

// Preload at module level (before component mounts)
useGLTF.preload('/models/product.glb');

export function ProductModel({ position }: { position: [number, number, number] }) {
  // Cached — won't re-fetch on re-render
  const { nodes, materials, animations } = useGLTF('/models/product.glb');

  return (
    <group position={position}>
      <mesh
        geometry={nodes.Body.geometry}
        material={materials.Material}
        castShadow
        receiveShadow
      />
    </group>
  );
}
```

---

## Pattern 6: On-Demand Rendering

For static or near-static scenes, stop wasting GPU:

```tsx
import { invalidate } from '@react-three/fiber';

// In Canvas
<Canvas frameloop="demand">
  <StaticScene />
</Canvas>

// Trigger a render when something changes
function InteractiveObject() {
  const meshRef = useRef<THREE.Mesh>(null);

  const handlePointerMove = () => {
    // Update object
    meshRef.current!.rotation.y += 0.1;
    // Request exactly one new frame
    invalidate();
  };

  return (
    <mesh ref={meshRef} onPointerMove={handlePointerMove}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

---

## Pattern 7: Imperative Escape Hatch

When declarative JSX is not enough:

```tsx
import { useThree, useFrame } from '@react-three/fiber';

function PostProcessingSetup() {
  const { gl, scene, camera, size } = useThree();

  useEffect(() => {
    // Access raw Three.js renderer
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);

  useFrame(({ gl, scene, camera }) => {
    // Custom render pass
    gl.render(scene, camera);
  }, 1); // priority > 0 overrides default render

  return null;
}
```

---

## Pattern 8: Responsive Canvas

```tsx
import { useThree } from '@react-three/fiber';

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      // Adjust FOV for mobile
      camera.fov = size.width < 768 ? 90 : 75;
      camera.updateProjectionMatrix();
    }
  }, [camera, size]);

  return null;
}
```

---

## Pattern 9: Disposal

R3F handles basic disposal, but custom assets need manual cleanup:

```tsx
function CustomMesh() {
  const geometryRef = useRef<THREE.BufferGeometry>();
  const materialRef = useRef<THREE.ShaderMaterial>();

  useEffect(() => {
    geometryRef.current = new THREE.BufferGeometry();
    materialRef.current = new THREE.ShaderMaterial({ /* ... */ });

    return () => {
      // CRITICAL: dispose on unmount
      geometryRef.current?.dispose();
      materialRef.current?.dispose();
    };
  }, []);

  return <primitive object={mesh} />;
}
```

---

## Drei Quick Reference

| Helper | Purpose |
|---|---|
| `<Environment preset="studio" />` | HDRI lighting without PMREMGenerator boilerplate |
| `<OrbitControls />` | Camera controls, auto-disposed |
| `<Float />` | Floating animation loop |
| `<ContactShadows />` | Fake soft shadow on ground plane |
| `<Text />` | 3D text via troika-three-text |
| `<Html />` | DOM elements in 3D space |
| `<Sparkles />` | Instanced particle sparkles |
| `<MeshTransmissionMaterial />` | Glass / transparent PBR material |
| `<PerspectiveCamera />` | Declarative camera with makeDefault |
| `useGLTF` | Cached GLTF loading with Draco support |
| `useTexture` | Cached texture loading |
| `useAnimations` | AnimationMixer integration |
| `useCursor` | CSS cursor state on hover |
| `useProgress` | Loading progress |
