# WebGPU, TSL (Three Shading Language) & GLSL Reference

Comprehensive guide to modern shader development in Three.js r170+, bridging node-based TSL and portable GLSL.

---

## 1. The TSL (Three Shading Language) Paradigm Shift

In Three.js r170+, shader programming is unified through **TSL (Three Shading Language)**. Instead of writing brittle GLSL or WGSL strings with string interpolation, developers construct an abstract syntax node graph using JavaScript/TypeScript functions.

### Key Advantages of TSL:
1. **Zero-Code Cross-Compilation**: The identical TSL node graph compiles natively to **WGSL** on WebGPU renderers and transpiles to **GLSL ES 3.0** on WebGL 2 fallback renderers.
2. **Type Safety & Intellisense**: Node inputs and operations are type-checked at development time.
3. **Seamless Lighting Integration**: TSL materials extend `MeshStandardNodeMaterial` or `MeshPhysicalNodeMaterial`, automatically inheriting PBR environment lighting, shadows, and tonemapping.

---

## 2. Production TSL Wave Material Pattern

```javascript
// shaders/TSLWaveMaterial.js
import * as THREE from 'three/webgpu';
import {
  positionLocal,
  time,
  sin,
  cos,
  vec3,
  color,
  mix,
  uniform,
} from 'three/tsl';

/**
 * Creates a PBR wave displacement material using TSL.
 * Compiles to WGSL on WebGPU, and GLSL on WebGL 2.
 */
export function createTSLWaveMaterial() {
  const material = new THREE.MeshStandardNodeMaterial({
    roughness: 0.15,
    metalness: 0.85,
  });

  // Dynamic uniforms
  const uSpeed = uniform(1.5);
  const uFrequency = uniform(2.5);
  const uElevation = uniform(0.3);

  // Vertex position displacement node
  const waveX = sin(positionLocal.x.mul(uFrequency).add(time.mul(uSpeed)));
  const waveZ = cos(positionLocal.z.mul(uFrequency).add(time.mul(uSpeed)));
  const displacement = waveX.mul(waveZ).mul(uElevation);

  // Mutate positionNode: offset y by calculated displacement
  material.positionNode = positionLocal.add(vec3(0, displacement, 0));

  // Dynamic color ramp based on wave crests
  const deepColor = color('#0f172a');
  const crestColor = color('#38bdf8');
  material.colorNode = mix(deepColor, crestColor, displacement.add(uElevation).mul(1.5));

  return { material, uniforms: { uSpeed, uFrequency, uElevation } };
}
```

---

## 3. WebGPU Compute Particles (GPGPU with TSL)

In WebGPU, millions of particles can be simulated entirely on the GPU via compute shaders without CPU readback bottlenecks:

```javascript
// particles/TSLComputeParticles.js
import * as THREE from 'three/webgpu';
import {
  Fn,
  instancedArray,
  instanceIndex,
  vec3,
  time,
  sin,
  cos,
} from 'three/tsl';

export function createComputeParticleSystem(particleCount = 50000) {
  // Allocate compute storage buffers
  const positionBuffer = instancedArray(particleCount, 'vec3');
  const velocityBuffer = instancedArray(particleCount, 'vec3');

  // Define compute kernel function
  const computeParticles = Fn(() => {
    const index = instanceIndex;
    const pos = positionBuffer.element(index);
    const vel = velocityBuffer.element(index);

    // Curl noise simulation
    const angle = time.mul(0.5).add(index.toFloat().mul(0.01));
    vel.assign(vec3(sin(angle), cos(angle), sin(angle.mul(0.5))).mul(0.05));
    pos.addAssign(vel);
  })().compute(particleCount);

  // Render geometry driven by compute buffer
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.SpriteNodeMaterial();
  material.positionNode = positionBuffer.toAttribute();

  const particleMesh = new THREE.InstancedMesh(geometry, material, particleCount);

  return { particleMesh, computeParticles };
}
```

---

## 4. Invariant #5: Mobile GLSL Precision Guard Pattern

When authoring custom GLSL shaders (for legacy WebGL 1/2 systems), mobile chipsets default to `mediump` or lack hardware support for `highp` in fragment shaders.

### Mandatory Template for all Custom Fragment Shaders:

```glsl
// Invariant #5: Mobile GLSL Precision Safety Guard
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  precision highp int;
#else
  precision mediump float;
  precision mediump int;
#endif

uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Smooth fresnel rim lighting
  vec3 viewDirection = normalize(cameraPosition - vNormal);
  float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.0);

  vec3 finalColor = mix(uColor, vec3(1.0), fresnel * 0.7);
  gl_FragColor = vec4(finalColor, 1.0);
}
```
