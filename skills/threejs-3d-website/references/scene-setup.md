# Scene Setup Reference

Canonical production-ready scene setup patterns for Three.js 3D websites.

---

## Pattern 1: Vanilla Three.js — Full Scene Class

```javascript
// scene-manager.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this._animationId = null;
    this._isVisible = true;

    this._initScene();
    this._initCamera();
    this._initRenderer();
    this._initControls();
    this._bindEvents();
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
  }

  _initCamera() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    this.camera.position.set(0, 2, 8);
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    // MANDATORY: correct color output
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // MANDATORY: DPR capped at 2 for performance
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    // Shadows (optional, costly on mobile)
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // MANDATORY: Handle context loss
    this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      cancelAnimationFrame(this._animationId);
    });

    this.renderer.domElement.addEventListener('webglcontextrestored', () => {
      this.start();
    });
  }

  _initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  _bindEvents() {
    // Resize
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);

    // Pause when hidden (saves battery)
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
    document.addEventListener('visibilitychange', this._onVisibilityChange);
  }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  _onVisibilityChange() {
    this._isVisible = document.visibilityState === 'visible';
    if (this._isVisible) {
      this.clock.getDelta(); // reset clock to avoid large delta on resume
      this._loop();
    }
  }

  _loop() {
    if (!this._isVisible) return;
    this._animationId = requestAnimationFrame(this._loop.bind(this));

    const delta = Math.min(this.clock.getDelta(), 0.1); // cap at 100ms
    this.controls.update();
    this.update(delta);
    this.renderer.render(this.scene, this.camera);
  }

  /** Override in subclass */
  update(delta) {}

  start() {
    this._loop();
  }

  /** MANDATORY: call this on page unload / route change */
  dispose() {
    cancelAnimationFrame(this._animationId);
    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('visibilitychange', this._onVisibilityChange);

    this.controls.dispose();
    this.renderer.setAnimationLoop(null);

    // Traverse and dispose all GPU resources
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => {
          Object.values(m).forEach((v) => {
            if (v?.isTexture) v.dispose();
          });
          m.dispose();
        });
      }
    });

    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
```

---

## Pattern 2: WebGPU Renderer (Three.js r171+)

```javascript
// webgpu-scene.js
import * as THREE from 'three/webgpu';

async function initWebGPUScene(container) {
  const renderer = new THREE.WebGPURenderer({
    antialias: true,
    alpha: true,
  });

  // WebGPU MUST be initialized asynchronously
  await renderer.init();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  container.appendChild(renderer.domElement);

  // setAnimationLoop is required for WebGPU (no raw requestAnimationFrame)
  renderer.setAnimationLoop((time, frame) => {
    renderer.render(scene, camera);
  });

  return renderer;
}
```

---

## Pattern 3: Environment Lighting (HDRI)

PBR materials (`MeshStandardMaterial`, `MeshPhysicalMaterial`) REQUIRE an environment map to look correct.

```javascript
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

async function setupEnvironment(scene, renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  const loader = new RGBELoader();
  const texture = await loader.loadAsync('/hdri/studio.hdr');

  const envMap = pmremGenerator.fromEquirectangular(texture).texture;

  // envMap lights PBR objects
  scene.environment = envMap;

  // Optional: show HDRI as background (separate from lighting)
  // scene.background = envMap;

  // Clean up CPU-side texture immediately
  texture.dispose();
  pmremGenerator.dispose();

  return envMap;
}
```

---

## Pattern 4: Monitor GPU Resources

```javascript
// In dev mode, log renderer stats
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const info = renderer.info;
    console.table({
      'Draw Calls': info.render.calls,
      Triangles: info.render.triangles,
      Geometries: info.memory.geometries,
      Textures: info.memory.textures,
      'Shader Programs': info.programs?.length,
    });
  }, 5000);
}
```
