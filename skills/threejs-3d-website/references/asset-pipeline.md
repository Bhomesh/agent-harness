# Asset Pipeline Reference

Model optimization, texture compression, and loading patterns for production 3D websites.

---

## Optimization Pipeline

```
Blender → Export GLB → gltf-transform optimize → KTX2 textures → CDN/serve
```

---

## Blender Export Checklist

Before exporting from Blender:
- [ ] Apply all modifiers (`Ctrl+A → All Modifiers`)
- [ ] Merge objects sharing same material
- [ ] Triangulate mesh (`Ctrl+T` or Auto-Triangulate in export)
- [ ] Remove unused vertex groups and shape keys
- [ ] Use PBR materials: Base Color, Metalness, Roughness (not Specular)
- [ ] Texture maps: max 2048×2048 for mobile, 4096×4096 for desktop
- [ ] Join small meshes to reduce draw calls
- [ ] Apply scale (`Ctrl+A → Scale`)

**Export settings:**
- Format: glTF 2.0 (`.glb` — single file, preferred)
- Include: All textures, UVs, Normals, Materials
- Lighting: Standard
- Compression: None (we compress separately)

---

## gltf-transform CLI Optimization

```bash
npm install -g @gltf-transform/cli

# ── Basic: Draco mesh + WebP textures ──────────────────────────────────────
gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp \
  --texture-resize 2048

# ── Better for animated meshes (preserves deformations) ────────────────────
gltf-transform optimize input.glb output.glb \
  --compress meshopt \
  --texture-compress webp

# ── Maximum: KTX2 textures (stays compressed in GPU VRAM) ──────────────────
gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress ktx2 \
  --texture-resize 2048

# ── Inspect file stats ──────────────────────────────────────────────────────
gltf-transform inspect output.glb

# ── Separate mesh and texture optimization steps ───────────────────────────
# Step 1: Compress mesh
gltf-transform draco input.glb compressed.glb

# Step 2: Resize and convert textures
gltf-transform resize --width 2048 --height 2048 compressed.glb resized.glb
gltf-transform webp resized.glb final.glb

# ── Simplify (reduce polygon count) ─────────────────────────────────────────
gltf-transform simplify input.glb simplified.glb --ratio 0.5
```

---

## Texture Formats

| Format | VRAM | Load Time | Quality | Support |
|---|---|---|---|---|
| PNG/JPG | Uncompressed | Slow | Best | All |
| WebP | Uncompressed | Fast | Good | All modern |
| KTX2 / Basis | Compressed | Fast | Good | WebGL2+ |
| KTX2 + UASTC | Compressed | Fast | Best | WebGL2+ |

**Rule**: Use WebP for dev/preview, KTX2 for production.

---

## Three.js Asset Loaders

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

class AssetLoader {
  constructor(renderer) {
    this._renderer = renderer;
    this._cache = new Map();
    this._manager = new THREE.LoadingManager();

    this._gltfLoader = this._buildGLTFLoader();
    this._textureLoader = new THREE.TextureLoader(this._manager);
  }

  _buildGLTFLoader() {
    const loader = new GLTFLoader(this._manager);

    // Draco decoder
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    dracoLoader.preload();
    loader.setDRACOLoader(dracoLoader);

    // Meshopt decoder
    loader.setMeshoptDecoder(MeshoptDecoder);

    // KTX2 texture decompressor
    const ktx2Loader = new KTX2Loader(this._manager);
    ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.171/examples/jsm/libs/basis/');
    ktx2Loader.detectSupport(this._renderer);
    loader.setKTX2Loader(ktx2Loader);

    return loader;
  }

  async loadModel(url, options = {}) {
    if (this._cache.has(url)) {
      return this._cache.get(url).scene.clone();
    }

    const gltf = await this._gltfLoader.loadAsync(url);

    // Set up shadows and material fixes
    gltf.scene.traverse((node) => {
      if (!node.isMesh) return;

      node.castShadow    = options.castShadow    ?? true;
      node.receiveShadow = options.receiveShadow ?? true;
      node.frustumCulled = true;

      // Fix color space for textures
      if (node.material?.map) {
        node.material.map.colorSpace = THREE.SRGBColorSpace;
      }
    });

    this._cache.set(url, gltf);
    return gltf.scene.clone();
  }

  async loadTexture(url, colorSpace = THREE.SRGBColorSpace) {
    if (this._cache.has(url)) return this._cache.get(url);

    const texture = await this._textureLoader.loadAsync(url);
    texture.colorSpace = colorSpace;
    texture.generateMipmaps = true;
    texture.anisotropy = this._renderer.capabilities.getMaxAnisotropy();

    this._cache.set(url, texture);
    return texture;
  }

  // Load with progress tracking
  loadWithProgress(url, onProgress) {
    return new Promise((resolve, reject) => {
      this._gltfLoader.load(
        url,
        resolve,
        (xhr) => onProgress?.(xhr.loaded / xhr.total),
        reject
      );
    });
  }

  dispose() {
    this._cache.forEach((value) => {
      if (value?.scene) {
        value.scene.traverse((obj) => {
          obj.geometry?.dispose();
          if (obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => {
              Object.values(m).forEach((v) => v?.isTexture && v.dispose());
              m.dispose();
            });
          }
        });
      } else if (value?.isTexture) {
        value.dispose();
      }
    });
    this._cache.clear();
  }
}
```

---

## useGLTF with R3F (Simplest)

```tsx
import { useGLTF } from '@react-three/drei';

// Preload before component mounts (put at module level)
useGLTF.preload('/models/product.glb');

export function ProductModel() {
  const { nodes, materials, animations } = useGLTF('/models/product.glb');

  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Body.geometry}
        material={materials['Material.001']}
      />
    </group>
  );
}
```

---

## Loading Screen Pattern

```tsx
import { useProgress, Html } from '@react-three/drei';

function LoadingScreen() {
  const { active, progress, errors, item, loaded, total } = useProgress();

  return (
    <Html center>
      {active && (
        <div className="loading-screen">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p>{Math.floor(progress)}%</p>
        </div>
      )}
    </Html>
  );
}

// In Canvas
<Suspense fallback={<LoadingScreen />}>
  <Scene />
</Suspense>
```

---

## File Size Targets

| Asset Type | Dev Budget | Prod Budget |
|---|---|---|
| Hero model (GLB) | 5MB | < 1MB compressed |
| Background model | 2MB | < 500KB |
| Each texture (WebP) | 1MB | < 200KB |
| Total JS bundle | 2MB | < 500KB gzipped |
| Total 3D assets (first load) | 10MB | < 3MB |
