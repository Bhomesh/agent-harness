# Performance Reference

Draw call budgets, instancing, LOD, mobile tiers, and asset pipeline for 60fps 3D websites.

---

## Performance Budget by Device Tier

| Metric | Tier 3 (High) | Tier 2 (Medium) | Tier 1 (Low) | Tier 0 (Blacklisted) |
|---|---|---|---|---|
| Draw calls | < 200 | < 100 | < 50 | Fallback UI |
| Visible triangles | < 1M | < 300k | < 100k | — |
| Texture memory | < 256MB | < 128MB | < 64MB | — |
| Post-processing | Full | Bloom only | None | — |
| Real-time shadows | Yes | Yes | Baked only | — |
| Particle count | 50,000+ | 10,000 | 1,000 | — |
| Pixel ratio | 2.0 | 1.5 | 1.0 | — |

---

## Pattern 1: GPU Tier Detection

```javascript
import { getGPUTier } from 'detect-gpu';

export async function detectQualityTier() {
  const gpuTier = await getGPUTier();
  
  // gpuTier.tier: 0 (blacklist) | 1 (low) | 2 (mid) | 3 (high)
  return {
    tier: gpuTier.tier,
    isMobile: gpuTier.isMobile,
    gpu: gpuTier.gpu,
    fps: gpuTier.fps,
  };
}

// Apply quality settings
export function applyQualitySettings(renderer, scene, tier) {
  const settings = [
    // Tier 0: Fallback
    { dpr: 1, shadows: false, postFX: false, particles: 0 },
    // Tier 1: Low
    { dpr: 1, shadows: false, postFX: false, particles: 500 },
    // Tier 2: Medium
    { dpr: 1.5, shadows: true, postFX: true, particles: 5000 },
    // Tier 3: High
    { dpr: 2, shadows: true, postFX: true, particles: 50000 },
  ][tier];

  renderer.setPixelRatio(settings.dpr);
  renderer.shadowMap.enabled = settings.shadows;

  return settings;
}
```

---

## Pattern 2: InstancedMesh — Many Objects, One Draw Call

```javascript
import * as THREE from 'three';

// ✅ 10,000 objects = 1 draw call
function createInstancedParticles(count = 10000) {
  const geometry = new THREE.SphereGeometry(0.05, 4, 4); // low-poly for particles
  const material = new THREE.MeshStandardMaterial({ color: '#ffffff' });
  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

  // Pre-allocate dummy for matrix transforms
  const dummy = new THREE.Object3D();
  const color  = new THREE.Color();

  for (let i = 0; i < count; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    );
    dummy.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    dummy.scale.setScalar(0.5 + Math.random() * 1.5);
    dummy.updateMatrix();

    instancedMesh.setMatrixAt(i, dummy.matrix);

    // Per-instance color
    color.setHSL(Math.random(), 0.8, 0.6);
    instancedMesh.setColorAt(i, color);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.instanceColor!.needsUpdate = true;

  return instancedMesh;
}

// Update individual instance at runtime
function updateInstance(instancedMesh, index, position) {
  const dummy = new THREE.Object3D();
  dummy.position.copy(position);
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(index, dummy.matrix);
  instancedMesh.instanceMatrix.needsUpdate = true;
}
```

---

## Pattern 3: Level of Detail (LOD)

```javascript
function createLODTree() {
  const lod = new THREE.LOD();

  // High detail: 0–20 units
  lod.addLevel(new THREE.Mesh(
    new THREE.ConeGeometry(1, 3, 12),
    new THREE.MeshStandardMaterial({ color: '#2d5a27' })
  ), 0);

  // Medium detail: 20–80 units
  lod.addLevel(new THREE.Mesh(
    new THREE.ConeGeometry(1, 3, 6),
    new THREE.MeshStandardMaterial({ color: '#2d5a27' })
  ), 20);

  // Low detail (impostor billboard): 80+ units
  lod.addLevel(new THREE.Mesh(
    new THREE.PlaneGeometry(2, 3),
    new THREE.MeshBasicMaterial({
      map: treeSprite,
      alphaTest: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
    })
  ), 80);

  // Too far: invisible
  lod.addLevel(new THREE.Object3D(), 200);

  return lod;
}
```

---

## Pattern 4: Geometry Merging for Static Scenes

```javascript
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Static objects sharing a material → 1 draw call
function mergeStaticObjects(objects) {
  // All objects must share the same material
  const geometries = objects.map((obj) => {
    obj.updateMatrixWorld();
    const geo = obj.geometry.clone();
    geo.applyMatrix4(obj.matrixWorld);
    return geo;
  });

  const merged = mergeGeometries(geometries, false);
  return new THREE.Mesh(merged, objects[0].material);
}
```

---

## Pattern 5: Asset Compression Pipeline

### GLTF Optimization Commands

```bash
# Install CLI tools
npm install -g @gltf-transform/cli

# Full optimization: Draco mesh + WebP textures + resize
gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp \
  --texture-resize 2048

# Meshopt (better for deformed/animated meshes)
gltf-transform optimize input.glb output.glb \
  --compress meshopt \
  --texture-compress ktx2

# Inspect result
gltf-transform inspect output.glb
```

### Texture to KTX2 (GPU-compressed, stays compressed in VRAM)

```bash
# Install: brew install ktx-software (macOS) or apt install ktx-software (Linux)
toktx --t2 --bcmp output.ktx2 input.png

# For normal maps (linear space, not sRGB)
toktx --t2 --bcmp --linear output_normal.ktx2 input_normal.png
```

### Loading in Three.js

```javascript
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

const ktx2Loader = new KTX2Loader();
ktx2Loader.setTranscoderPath('/basis/');
ktx2Loader.detectSupport(renderer);

// Use with GLTFLoader
gltfLoader.setKTX2Loader(ktx2Loader);
```

---

## Pattern 6: Monitor Performance in Dev

```javascript
// Stats overlay
import Stats from 'stats.js';

const stats = new Stats();
stats.showPanel(0); // 0: FPS, 1: MS, 2: MB
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(animate);
}

// Renderer info
function logRendererInfo(renderer) {
  const { render, memory, programs } = renderer.info;
  console.table({
    'Draw calls': render.calls,
    Triangles: render.triangles,
    Geometries: memory.geometries,
    Textures: memory.textures,
    'Shader programs': programs?.length,
  });
}
```

---

## Pattern 7: Pause When Hidden

```javascript
let isVisible = true;

document.addEventListener('visibilitychange', () => {
  isVisible = document.visibilityState === 'visible';
});

function animate() {
  if (!isVisible) return; // don't schedule next frame
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
```

---

## Optimization Checklist

- [ ] Draw calls < 100 on mobile (check `renderer.info.render.calls`)
- [ ] `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` set
- [ ] Models compressed with Draco/Meshopt
- [ ] Textures converted to KTX2 or WebP
- [ ] LOD added for complex objects
- [ ] InstancedMesh used for repeated objects
- [ ] Shadow casting enabled only on key meshes
- [ ] Post-processing disabled on Tier 1 devices
- [ ] Geometry disposed when removed from scene
- [ ] Tab visibility handling stops the render loop
- [ ] No `new THREE.Vector3()` or similar inside render loop
