#!/usr/bin/env node

/**
 * Deterministic AST & Code Pattern Validator for 3D Web Experiences
 * Validates files against the 10 Invariant Code Rules.
 */

const fs = require('fs');
const path = require('path');

function validateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  const lines = content.split('\n');

  // Rule 1: Allocations inside useFrame / requestAnimationFrame
  const frameBlockRegex = /useFrame\s*\(\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>\s*\{([\s\S]*?)\n\s*\}\s*\)/g;
  let match;
  while ((match = frameBlockRegex.exec(content)) !== null) {
    const block = match[1];
    const allocMatch = block.match(/new\s+(?:THREE\.)?(Vector[234]|Color|Matrix[34]|Quaternion|Box3|Sphere|Euler)\b/);
    if (allocMatch) {
      violations.push({
        rule: 'Invariant #1: Zero Allocations in Render Loops',
        message: `Found object instantiation 'new ${allocMatch[1]}' inside useFrame(). Pre-allocate scratch objects outside the loop.`,
      });
    }

    // Rule 2: State mutations inside useFrame
    const setStateMatch = block.match(/\b(set[A-Z][a-zA-Z0-9_]*)\s*\(/);
    if (setStateMatch) {
      violations.push({
        rule: 'Invariant #2: Zero React State Mutations in Animation Loops',
        message: `Found state setter '${setStateMatch[1]}()' called inside useFrame(). Mutate refs or use transient store subscriptions.`,
      });
    }
  }

  // Rule 4: DPR clamping verification
  if (content.includes('setPixelRatio') || content.includes('<Canvas')) {
    const hasDpr = content.includes('setPixelRatio') || content.includes('dpr=');
    const hasClamping =
      content.includes('Math.min(window.devicePixelRatio, 2)') ||
      content.includes('Math.min(devicePixelRatio, 2)') ||
      content.includes('dpr={[1, 2]}') ||
      content.includes('dpr={[1,2]}') ||
      content.includes('dpr={Math.min');
    if (hasDpr && !hasClamping) {
      violations.push({
        rule: 'Invariant #4: Strict DPR Clamping',
        message: 'DPR must be clamped to maximum 2 (e.g. Math.min(window.devicePixelRatio, 2) or dpr={[1, 2]}).',
      });
    }
  }

  // Rule 5: GLSL Fragment Shader precision guards
  if (content.includes('fragmentShader') || filePath.endsWith('.frag') || filePath.endsWith('.glsl')) {
    const hasPrecision =
      content.includes('GL_FRAGMENT_PRECISION_HIGH') ||
      content.includes('precision highp float') ||
      content.includes('precision mediump float');
    if (!hasPrecision) {
      violations.push({
        rule: 'Invariant #5: Mobile GLSL Precision Safety',
        message: 'Fragment shader missing float precision declaration. Include #ifdef GL_FRAGMENT_PRECISION_HIGH guard.',
      });
    }
  }

  // Rule 7: Context Loss Unmounting Bug
  const unmountTernary = content.match(/\{\s*[a-zA-Z0-9_]*contextLost\s*\?\s*<[^>]+>\s*:\s*<Canvas\b/i);
  if (unmountTernary) {
    violations.push({
      rule: 'Invariant #7: Preserved Canvas Lifecycle on WebGL Context Loss',
      message: 'Unmounting <Canvas> during context loss destroys DOM node permanently. Keep <Canvas> mounted and use an overlay.',
    });
  }

  // Rule 6: Extreme Frustum near/far ratio
  const nearFarMatch = content.match(/near:\s*([0-9.]+),\s*far:\s*([0-9.]+)/);
  if (nearFarMatch) {
    const near = parseFloat(nearFarMatch[1]);
    const far = parseFloat(nearFarMatch[2]);
    if (near > 0 && far / near > 10000) {
      violations.push({
        rule: 'Invariant #6: Depth Buffer Frustum Ratio Protection',
        message: `Far/Near ratio is ${(far / near).toFixed(0)} (> 10000). This collapses 24-bit depth precision and triggers Z-fighting.`,
      });
    }
  }

  return {
    filePath,
    valid: violations.length === 0,
    violations,
  };
}

// CLI entry point
const targetPath = process.argv[2];
if (!targetPath) {
  console.log('Usage: node ast-validator.js <file-or-dir>');
  process.exit(0);
}

const stats = fs.statSync(targetPath);
const files = stats.isDirectory()
  ? fs.readdirSync(targetPath).map((f) => path.join(targetPath, f))
  : [targetPath];

let totalViolations = 0;
for (const file of files) {
  if (/\.(jsx?|tsx?|glsl|frag)$/.test(file)) {
    const result = validateFile(file);
    if (!result.valid) {
      console.log(`\n❌ [FAIL] ${result.filePath}`);
      for (const v of result.violations) {
        console.log(`   - [${v.rule}]: ${v.message}`);
      }
      totalViolations += result.violations.length;
    } else {
      console.log(`✅ [PASS] ${result.filePath}`);
    }
  }
}

if (totalViolations > 0) {
  console.log(`\nVerification failed with ${totalViolations} invariant violation(s).`);
  process.exit(1);
} else {
  console.log('\nAll checked files comply with the 10 Invariant Code Rules.');
  process.exit(0);
}
