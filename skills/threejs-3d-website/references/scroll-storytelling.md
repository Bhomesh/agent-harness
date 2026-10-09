# Scroll Storytelling Reference

Patterns for building scroll-driven 3D narrative experiences using GSAP ScrollTrigger, Lenis, and Three.js.

---

## Architecture Overview

```
Lenis (smooth scroll) → fires scroll events with inertia
    ↓
GSAP ScrollTrigger reads progress (0 → 1)
    ↓
Timeline maps progress → Three.js uniforms, camera, animations
    ↓
requestAnimationFrame → renderer.render(scene, camera)
```

**Key rule**: NEVER drive Three.js directly from scroll events. Always read scroll state inside `requestAnimationFrame` to avoid tearing and jank.

---

## Pattern 1: Lenis + GSAP ScrollTrigger Integration

```javascript
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

// 2. Connect Lenis to GSAP ticker (critical step)
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// 3. Now use ScrollTrigger normally
ScrollTrigger.create({
  trigger: '#section-1',
  start: 'top top',
  end: 'bottom top',
  scrub: 1.5, // smooth scrubbing
  onUpdate: (self) => {
    // self.progress: 0 → 1
    updateThreeScene(self.progress);
  },
});
```

---

## Pattern 2: Camera Path Animation Along Curve

Map scroll progress to camera position along a 3D spline path.

```javascript
import * as THREE from 'three';

// Define camera path as CatmullRom spline
const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2, 10),
  new THREE.Vector3(5, 3, 5),
  new THREE.Vector3(10, 1, 0),
  new THREE.Vector3(8, 2, -5),
  new THREE.Vector3(0, 5, -10),
]);

// Focus points corresponding to each "scene"
const lookAtTargets = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(3, 1, 0),
  new THREE.Vector3(8, 0, -2),
];

const _lookAt = new THREE.Vector3();
const _cameraPos = new THREE.Vector3();

function updateCameraOnScroll(progress) {
  // Move camera along path
  cameraPath.getPointAt(progress, _cameraPos);
  camera.position.copy(_cameraPos);

  // Smoothly interpolate look-at target
  const targetIndex = Math.floor(progress * (lookAtTargets.length - 1));
  const t = (progress * (lookAtTargets.length - 1)) % 1;
  const from = lookAtTargets[targetIndex] || lookAtTargets[0];
  const to = lookAtTargets[targetIndex + 1] || lookAtTargets[lookAtTargets.length - 1];

  _lookAt.lerpVectors(from, to, t);
  camera.lookAt(_lookAt);
}
```

---

## Pattern 3: GSAP Timeline Controlling Three.js Uniforms

```javascript
// Proxy object for GSAP to animate
const shaderProxy = {
  progress: 0,
  colorMix: 0,
  noiseScale: 1.0,
};

// GSAP timeline — scrub drives all values
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#canvas-container',
    start: 'top top',
    end: '500% top', // 5 viewport heights of scroll
    scrub: 2,
    pin: true, // pin container while scrolling
  },
});

tl
  .to(shaderProxy, { progress: 1, duration: 1 })
  .to(shaderProxy, { colorMix: 1, duration: 0.5 }, '<0.3')
  .to(shaderProxy, { noiseScale: 5.0, duration: 0.8 }, '-=0.2');

// Read proxy values inside animation loop (not in onUpdate)
function animate() {
  requestAnimationFrame(animate);

  // Sync proxy values to shader uniforms
  material.uniforms.uProgress.value = shaderProxy.progress;
  material.uniforms.uColorMix.value = shaderProxy.colorMix;
  material.uniforms.uNoiseScale.value = shaderProxy.noiseScale;

  renderer.render(scene, camera);
}
```

---

## Pattern 4: Section-Based Scene State Machine

```javascript
// Each scroll section triggers a different 3D "state"
const sections = [
  {
    id: 'hero',
    enter: () => loadHeroModel(),
    leave: () => fadeOutHeroModel(),
    cameraPosition: new THREE.Vector3(0, 2, 10),
  },
  {
    id: 'product',
    enter: () => loadProductModel(),
    leave: () => disposeProductModel(),
    cameraPosition: new THREE.Vector3(3, 1, 5),
  },
  {
    id: 'features',
    enter: () => spawnParticles(),
    leave: () => removeParticles(),
    cameraPosition: new THREE.Vector3(-2, 3, 8),
  },
];

sections.forEach((section, i) => {
  ScrollTrigger.create({
    trigger: `#section-${section.id}`,
    start: 'top center',
    end: 'bottom center',
    onEnter: section.enter,
    onLeave: section.leave,
    onEnterBack: section.enter,
    onLeaveBack: i > 0 ? sections[i - 1].enter : undefined,
  });

  // Animate camera to section position
  ScrollTrigger.create({
    trigger: `#section-${section.id}`,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(camera.position, {
        x: section.cameraPosition.x,
        y: section.cameraPosition.y,
        z: section.cameraPosition.z,
        duration: 1.5,
        ease: 'power2.inOut',
      });
    },
  });
});
```

---

## Pattern 5: Mouse Parallax / Hover Effect

```javascript
const mouse = new THREE.Vector2();
const targetRotation = new THREE.Vector2();
const currentRotation = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  // Normalize to -1 → 1
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);

  // Smooth lerp toward target (not in event handler)
  targetRotation.x = mouse.y * 0.3;
  targetRotation.y = mouse.x * 0.3;

  currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
  currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

  // Apply to group/camera
  modelGroup.rotation.x = currentRotation.x;
  modelGroup.rotation.y = currentRotation.y;

  renderer.render(scene, camera);
}
```

---

## Pattern 6: Page Transition — Keep Canvas Alive (Barba.js)

```javascript
import barba from '@barba/core';

// Canvas persists across page transitions
const canvas = document.getElementById('gl-canvas');
document.body.appendChild(canvas); // Move to body root

barba.init({
  transitions: [{
    name: 'default',
    async leave({ current }) {
      // Fade out current content (not canvas)
      await gsap.to(current.container, { opacity: 0, duration: 0.4 }).then();
    },
    async enter({ next }) {
      // Reinitialize ScrollTrigger for new page
      ScrollTrigger.getAll().forEach(st => st.kill());
      initScrollTriggersForPage(next.namespace);

      await gsap.from(next.container, { opacity: 0, duration: 0.4 }).then();
    },
  }],
});
```

---

## Anti-patterns

❌ **Never** update Three.js state directly in scroll event handlers — causes tearing  
❌ **Never** create new objects (`new THREE.Vector3`) inside the animation loop — causes GC jank  
❌ **Never** use `transform: translate3d` on the canvas — break compositor hints  
❌ **Never** run GSAP animations without `scrub` for scroll-linked motion — will feel jerky  
✅ **Always** read GSAP proxy values inside `requestAnimationFrame`  
✅ **Always** use `lenis.raf()` inside GSAP ticker for synchronized timing  
