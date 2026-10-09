# Shader Patterns Reference

GLSL ShaderMaterial patterns, TSL (Three Shader Language) for WebGPU, and GPU particle techniques.

---

## Part 1: GLSL ShaderMaterial Patterns

### Pattern 1.1: Animated Gradient with Noise

```javascript
import * as THREE from 'three';

const WaveShader = {
  uniforms: {
    uTime:       { value: 0 },
    uColorA:     { value: new THREE.Color('#1a1a2e') },
    uColorB:     { value: new THREE.Color('#e94560') },
    uNoiseScale: { value: 2.5 },
    uSpeed:      { value: 0.4 },
    uWaveAmp:    { value: 0.15 },
  },

  vertexShader: /* glsl */`
    uniform float uTime;
    uniform float uNoiseScale;
    uniform float uWaveAmp;
    uniform float uSpeed;

    varying vec2  vUv;
    varying float vElevation;

    // Classic 2D Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+10.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                               dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x * x0.x  + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vUv = uv;

      // Vertex displacement
      float elevation = snoise(position.xz * uNoiseScale + uTime * uSpeed);
      elevation *= uWaveAmp;
      vElevation = elevation;

      vec3 displaced = position;
      displaced.y += elevation;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `,

  fragmentShader: /* glsl */`
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif

    uniform vec3 uColorA;
    uniform vec3 uColorB;

    varying vec2  vUv;
    varying float vElevation;

    void main() {
      // Blend color by elevation
      float t = (vElevation + 0.15) / 0.3; // normalize 0→1
      t = clamp(t, 0.0, 1.0);

      vec3 color = mix(uColorA, uColorB, t);

      // Add vertical gradient
      color = mix(color, color * 1.3, vUv.y);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

// Usage
export function createWaveMesh() {
  const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(WaveShader.uniforms),
    vertexShader: WaveShader.vertexShader,
    fragmentShader: WaveShader.fragmentShader,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.update = (time) => {
    material.uniforms.uTime.value = time;
  };

  return mesh;
}
```

---

### Pattern 1.2: Fresnel / Hologram Shader

```glsl
// Fresnel effect: glow at edges when viewed at grazing angle
// Vertex shader
varying vec3 vWorldNormal;
varying vec3 vViewDirection;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vViewDirection = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}

// Fragment shader
uniform float uFresnelPower;  // default: 3.0
uniform vec3  uGlowColor;     // default: #00ffff

varying vec3 vWorldNormal;
varying vec3 vViewDirection;

void main() {
  float fresnel = pow(1.0 - dot(vWorldNormal, vViewDirection), uFresnelPower);
  vec3 color = uGlowColor * fresnel;
  gl_FragColor = vec4(color, fresnel);
}
```

---

### Pattern 1.3: Dissolve / Burn Effect

```glsl
// Fragment shader — dissolve with noise threshold
uniform sampler2D uNoiseTexture;
uniform float uDissolveProgress;  // 0 = intact, 1 = dissolved
uniform vec3  uBurnColor;
uniform float uBurnWidth;         // default: 0.05

varying vec2 vUv;

void main() {
  float noise = texture2D(uNoiseTexture, vUv).r;

  // Discard pixels beyond dissolve threshold
  if (noise < uDissolveProgress) discard;

  // Burn edge glow
  float burnEdge = smoothstep(uDissolveProgress, uDissolveProgress + uBurnWidth, noise);
  vec3 burnGlow = mix(uBurnColor, vec3(1.0), burnEdge);

  // Mix burn with base color at edge
  vec3 finalColor = mix(burnGlow, baseColor, step(uDissolveProgress + uBurnWidth, noise));
  gl_FragColor = vec4(finalColor, 1.0);
}
```

---

### Pattern 1.4: GPU Particle System (FBO Technique)

Store particle state (position, velocity) in render targets and update on GPU each frame.

```javascript
import * as THREE from 'three';

class GPUParticleSystem {
  constructor(renderer, count = 65536) {
    this.renderer = renderer;
    this.count = count;
    this.size = Math.sqrt(count); // texture dimensions

    this._initRenderTargets();
    this._initSimulationMaterial();
    this._initRenderMaterial();
    this._initGeometry();
  }

  _initRenderTargets() {
    const opts = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    };

    // Double-buffer: ping-pong between two render targets
    this.rts = [
      new THREE.WebGLRenderTarget(this.size, this.size, opts),
      new THREE.WebGLRenderTarget(this.size, this.size, opts),
    ];

    this._pingPong = 0;

    // Initialize positions in a texture
    const data = new Float32Array(this.count * 4);
    for (let i = 0; i < this.count; i++) {
      data[i * 4 + 0] = (Math.random() - 0.5) * 10; // x
      data[i * 4 + 1] = (Math.random() - 0.5) * 10; // y
      data[i * 4 + 2] = (Math.random() - 0.5) * 10; // z
      data[i * 4 + 3] = Math.random();               // life
    }

    const initTexture = new THREE.DataTexture(
      data, this.size, this.size,
      THREE.RGBAFormat, THREE.FloatType
    );
    initTexture.needsUpdate = true;

    // Write initial state to both buffers
    this.initialTexture = initTexture;
  }

  _initSimulationMaterial() {
    this.simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPositions: { value: this.initialTexture },
        uTime:      { value: 0 },
        uDelta:     { value: 0 },
        uAttractor: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */`
        precision highp float;
        uniform sampler2D uPositions;
        uniform float uTime;
        uniform float uDelta;
        uniform vec3 uAttractor;
        varying vec2 vUv;

        void main() {
          vec4 pos = texture2D(uPositions, vUv);
          vec3 position = pos.xyz;
          float life = pos.w;

          // Simple gravity toward attractor
          vec3 dir = uAttractor - position;
          float dist = length(dir);
          vec3 force = normalize(dir) * (1.0 / (dist * dist + 0.01)) * 0.5;

          position += force * uDelta;
          life -= uDelta * 0.1;

          // Respawn dead particles
          if (life <= 0.0) {
            position = vec3(
              (fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 10.0,
              (fract(sin(dot(vUv, vec2(63.7264, 10.873))) * 43758.5453) - 0.5) * 10.0,
              (fract(sin(dot(vUv, vec2(95.1234, 35.752))) * 43758.5453) - 0.5) * 10.0
            );
            life = 1.0;
          }

          gl_FragColor = vec4(position, life);
        }
      `,
    });
  }

  update(delta, time) {
    const current = this._pingPong;
    const next = 1 - current;

    // Update simulation uniforms
    this.simMaterial.uniforms.uPositions.value = this.rts[current].texture;
    this.simMaterial.uniforms.uTime.value = time;
    this.simMaterial.uniforms.uDelta.value = delta;

    // Render simulation to next buffer (ping-pong)
    this.renderer.setRenderTarget(this.rts[next]);
    this.renderer.render(this.simScene, this.simCamera);
    this.renderer.setRenderTarget(null);

    // Feed new positions to point cloud material
    this.pointsMaterial.uniforms.uPositions.value = this.rts[next].texture;

    this._pingPong = next;
  }
}
```

---

## Part 2: TSL (Three Shader Language) — WebGPU

TSL replaces GLSL with JavaScript node composition. Works on both WebGPU and WebGL.

### Pattern 2.1: Basic TSL Color + Animation

```javascript
import * as THREE from 'three/webgpu';
import {
  vec3, color, uniform, time, sin, mix,
  uv, float, positionLocal, normalLocal
} from 'three/tsl';

// Uniforms (update .value, no shader recompile)
const uColorA = uniform(new THREE.Color('#1a1a2e'));
const uColorB = uniform(new THREE.Color('#e94560'));
const uSpeed  = uniform(float(0.5));

// Node-based color expression
const animatedColor = mix(
  uColorA,
  uColorB,
  sin(time.mul(uSpeed).add(uv().y)).remapClamp(-1, 1, 0, 1)
);

// Apply to NodeMaterial
const material = new THREE.MeshStandardNodeMaterial();
material.colorNode = animatedColor;

// Update uniform without shader recompile:
// uColorA.value.set('#ff0000');
```

### Pattern 2.2: TSL Vertex Displacement

```javascript
import { positionLocal, normalLocal, time, uniform, float, sin, cos } from 'three/tsl';

const uDisplacement = uniform(float(0.3));

// Displace position along normal
const displacement = sin(
  positionLocal.x.mul(5.0).add(time)
).mul(
  cos(positionLocal.z.mul(5.0).add(time))
).mul(uDisplacement);

const displacedPosition = positionLocal.add(
  normalLocal.mul(displacement)
);

material.positionNode = displacedPosition;
```

### Pattern 2.3: TSL Fresnel

```javascript
import {
  normalView, positionViewDirection, dot, pow, uniform, float, vec3
} from 'three/tsl';

const uFresnelPower = uniform(float(3.0));
const uGlowColor    = uniform(vec3(0, 1, 1));

const fresnel = pow(
  float(1.0).sub(dot(normalView, positionViewDirection).abs()),
  uFresnelPower
);

material.colorNode = uGlowColor.mul(fresnel);
material.transparent = true;
material.opacityNode = fresnel;
```

---

## Shader Precision Quick Reference

```glsl
// ALWAYS use this pattern for mobile compatibility:
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
```

## Common Uniform Types

```javascript
uniforms: {
  uTime:     { value: 0 },                          // float
  uResolution: { value: new THREE.Vector2(w, h) },  // vec2
  uMouse:    { value: new THREE.Vector2(0.5, 0.5) }, // vec2
  uColor:    { value: new THREE.Color('#ff0000') },  // vec3
  uTexture:  { value: someTexture },                 // sampler2D
  uProgress: { value: 0.0 },                        // float 0→1
}
```
