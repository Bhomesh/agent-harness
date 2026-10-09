# Post-Processing Reference

Bloom, ambient occlusion, SSR, and full effect pipelines for Three.js 3D websites.

---

## Architecture Choice

| Approach | When to Use | Notes |
|---|---|---|
| **pmndrs/postprocessing** | R3F projects | Uber-shader merges passes, best perf |
| **EffectComposer** (three/addons) | Vanilla Three.js | Standard, well-documented |
| **RenderPipeline** (r183+) | WebGPU / TSL projects | Future-proof, node-based |

---

## Pattern 1: pmndrs/postprocessing (Recommended for R3F)

```bash
npm install @react-three/postprocessing postprocessing
```

```tsx
// components/PostFX.tsx
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  SSAO,
  N8AO,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { useSceneStore } from '@/store/sceneStore';

export function PostFX() {
  const tier = useSceneStore((s) => s.qualityTier);

  // Disable on low-end devices
  if (tier < 2) return null;

  return (
    <EffectComposer multisampling={tier >= 3 ? 8 : 0}>
      {/* Bloom — glow on bright surfaces */}
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.2}
        mipmapBlur
      />

      {/* N8AO — efficient ambient occlusion */}
      <N8AO
        aoRadius={0.5}
        intensity={2.0}
        distanceFalloff={1.0}
        quality="medium"
      />

      {/* Only on high-end */}
      {tier >= 3 && (
        <>
          <ChromaticAberration
            offset={new Vector2(0.001, 0.001)}
            blendFunction={BlendFunction.NORMAL}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.6} />
        </>
      )}
    </EffectComposer>
  );
}

// Add to Scene
function Scene() {
  return (
    <>
      {/* 3D content */}
      <mesh>...</mesh>

      {/* Post-processing last */}
      <PostFX />
    </>
  );
}
```

---

## Pattern 2: EffectComposer (Vanilla Three.js)

```javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import * as THREE from 'three';

function setupPostProcessing(renderer, scene, camera, width, height) {
  // IMPORTANT: Use HalfFloat for HDR workflow (avoids banding with bloom)
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(
    width, height, { type: THREE.HalfFloatType }
  ));

  // Pass 1: Render scene
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Pass 2: SSAO (ambient occlusion)
  const ssaoPass = new SSAOPass(scene, camera, width, height);
  ssaoPass.kernelRadius = 0.5;
  ssaoPass.minDistance = 0.001;
  ssaoPass.maxDistance = 0.1;
  composer.addPass(ssaoPass);

  // Pass 3: Bloom
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    /* strength */ 0.8,
    /* radius   */ 0.4,
    /* threshold */ 0.85
  );
  composer.addPass(bloomPass);

  // Pass 4: Output (tone mapping + color space — replaces renderer settings)
  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // Handle resize
  function onResize(w, h) {
    composer.setSize(w, h);
    ssaoPass.setSize(w, h);
    bloomPass.resolution.set(w, h);
  }

  // Render via composer (NOT renderer.render directly)
  function render() {
    composer.render();
  }

  return { composer, render, onResize };
}
```

---

## Pattern 3: Selective Bloom (Mask Layer)

Apply bloom only to specific objects, not the whole scene.

```javascript
const BLOOM_LAYER = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_LAYER);

// Mark objects that should glow
glowMesh.layers.enable(BLOOM_LAYER);

// Two-pass technique:
// 1. Render only bloom layer with bloom effect
// 2. Render full scene normally
// 3. Blend together

const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
const materials = {};

function darkenNonBloomed(obj) {
  if (obj.isMesh && !bloomLayer.test(obj.layers)) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterials(obj) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}

function render() {
  // 1. Render bloom-only scene
  scene.traverse(darkenNonBloomed);
  bloomComposer.render();

  // 2. Restore and render final
  scene.traverse(restoreMaterials);
  finalComposer.render();
}
```

---

## Pattern 4: RenderPipeline (Three.js r183+ / WebGPU)

```javascript
import * as THREE from 'three/webgpu';
import { bloom, ao, antiAliasing } from 'three/tsl';

async function setupWebGPUPostProcessing(renderer, scene, camera) {
  const postProcessing = new THREE.PostProcessing(renderer);

  // Node-based effects
  const scenePass = pass(scene, camera);
  const bloomEffect = bloom(scenePass.getTextureNode(), 0.8, 0.3, 0.9);
  const aoEffect = ao(scenePass.getDepthNode(), camera);

  // Compose final output
  postProcessing.outputNode = bloomEffect.add(aoEffect);

  // Render loop
  renderer.setAnimationLoop(() => {
    postProcessing.render();
  });
}
```

---

## Performance Tips for Post-Processing

1. **Limit passes** — every EffectComposer pass is another full scene render
2. **Use pmndrs/postprocessing uber-shader** — merges multiple effects into one pass
3. **Disable on mobile** — detect tier and conditionally render
4. **Use `HalfFloatType` framebuffer** — required for correct HDR bloom
5. **Downscale SSAO** — render AO at half resolution, upscale with bilateral filter
6. **Prefer N8AO over SSAO** — N8AO is 3–5× faster with better quality

---

## Effect Quick Reference

| Effect | Class | Cost | Notes |
|---|---|---|---|
| Bloom | `UnrealBloomPass` / `<Bloom />` | Medium | Always use `mipmapBlur` for performance |
| SSAO | `SSAOPass` / `<SSAO />` | High | Use N8AO instead in 2025+ |
| N8AO | `N8AOPass` / `<N8AO />` | Medium-Low | Best perf AO, community lib |
| SSR | `SSRPass` | Very High | Only Tier 3 devices |
| Chromatic Aberration | `<ChromaticAberration />` | Low | Pure fragment, very cheap |
| Vignette | `<Vignette />` | Very Low | Pure fullscreen quad |
| DOF | `BokehPass` / `<DepthOfField />` | High | Use for hero product shots |
| Motion Blur | `<MotionBlur />` | Medium | Camera shake effects |
| FXAA | `<FXAA />` | Very Low | Fast AA, good for mobile |
| SMAA | `<SMAA />` | Low | Better quality than FXAA |
