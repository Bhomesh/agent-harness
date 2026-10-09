# 3D Web Asset Optimization & Transcoding Pipeline

Production asset preparation recipes, correct CLI commands, compression trade-offs, and draw call batching patterns.

---

## 1. Critical Tooling Correction: `@gltf-transform/cli` Syntax

### The Common Hallucination
Many LLMs and tutorials combine simplification into the `optimize` command:
```bash
# ❌ INVALID CLI COMMAND - DOES NOT EXIST:
gltf-transform optimize input.glb output.glb --simplify 0.75
```
**Why it fails**: In `@gltf-transform/cli`, `simplify` is a **standalone command** backed by the `meshoptimizer` simplification algorithm. It cannot be passed as a flag to `optimize`.

### Correct Multi-Step Sequential Pipeline

```bash
#!/usr/bin/env bash
# scripts/optimize-asset.sh
set -euo pipefail

INPUT="$1"
OUTPUT="$2"
INTERMEDIATE="temp_decimated.glb"

echo "=== Step 1: Geometry Simplification (Standalone Command) ==="
# Reduces triangle count by 40% while preserving UV boundaries and normal seams
npx @gltf-transform/cli simplify "$INPUT" "$INTERMEDIATE" \
  --ratio 0.60 \
  --error 0.001

echo "=== Step 2: Meshopt Compression & WebP Texture Transcoding ==="
# Merges duplicate vertices, strips unused attributes, quantizes geometry, and transcodes textures
npx @gltf-transform/cli optimize "$INTERMEDIATE" "$OUTPUT" \
  --compress meshopt \
  --texture-compress webp \
  --texture-resize 2048

# Clean up scratch intermediate
rm -f "$INTERMEDIATE"

echo "=== Step 3: Asset Inspection & VRAM Budget Audit ==="
npx @gltf-transform/cli inspect "$OUTPUT"
```

---

## 2. Meshopt vs Draco Compression

| Feature | Draco (`--compress draco`) | Meshopt (`--compress meshopt`) |
|---|---|---|
| **Compression Ratio** | Maximum (smallest file on disk) | Very High (within 10-15% of Draco) |
| **CPU Decompression Speed**| Slower (30ms – 150ms on mobile CPU) | Instant (WASM SIMD, 1ms – 5ms) |
| **GPU Upload Speed** | Reconstructed uncompressed in RAM | Direct fast upload via quantization |
| **Recommendation** | Bandwidth-limited static models | **Default for 60fps web apps & mobile** |

---

## 3. High-Performance Texture Compression: KTX2 / Basis Universal

For ultra-demanding scenes, GPU texture memory (VRAM) is the primary bottleneck. Standard PNG/JPEG/WebP files must be fully decompressed in GPU memory into raw uncompressed RGBA8 (a 2048x2048 texture takes 16MB of VRAM). 

**KTX2 with Basis Universal** remains compressed directly inside GPU VRAM, reducing texture memory by 75–85% and eliminating frame drops during texture uploads.

```bash
# Compress textures to KTX2 UASTC/ETC1S
npx @gltf-transform/cli optimize input.glb output.glb \
  --texture-compress ktx2 \
  --slots "baseColorTexture" \
  --ktx2-quality 128
```

---

## 4. Draw Call Elimination: `InstancedMesh` & `BatchedMesh`

When rendering multiple identical or heterogeneous meshes, separate draw calls degrade performance.

### InstancedMesh (Identical Geometries)
```tsx
import { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

export function Forest({ count = 1000 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = new THREE.Object3D();

  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 100,
        0,
        (Math.random() - 0.5) * 100
      );
      dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <coneGeometry args={[1, 3, 5]} />
      <meshStandardMaterial color="#2d6a4f" roughness={0.7} />
    </instancedMesh>
  );
}
```

### BatchedMesh (Three.js r159+ Heterogeneous Geometries)
For combining different meshes into a single draw call without merging geometries into one monolithic buffer:
```javascript
import * as THREE from 'three';

// Allocate buffer for 500 instances and up to 100k vertices
const batchedMesh = new THREE.BatchedMesh(500, 100000, 150000, sharedMaterial);

const geomIdA = batchedMesh.addGeometry(boxGeometry);
const geomIdB = batchedMesh.addGeometry(sphereGeometry);

const instanceA = batchedMesh.addInstance(geomIdA);
const instanceB = batchedMesh.addInstance(geomIdB);

batchedMesh.setMatrixAt(instanceA, matrixA);
batchedMesh.setMatrixAt(instanceB, matrixB);

scene.add(batchedMesh); // Renders both distinct geometries in 1 single draw call
```

---

## 5. Performance Budget Gates

| Metric | High-End Desktop Target | Mobile / Low-Power Target |
|---|---|---|
| **Total Draw Calls** | < 150 | < 50 |
| **Total Triangles** | < 800,000 | < 120,000 |
| **Total Model Weight** | < 8MB | < 1.5MB |
| **Total Texture VRAM** | < 128MB | < 32MB |
| **Max Individual Texture** | 2048 x 2048 | 1024 x 1024 |
