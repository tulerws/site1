import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import type { Object3DNode } from '@react-three/fiber'

// ─────────────────────────────────────────────────────────
// SHARED NOISE GLSL
// ─────────────────────────────────────────────────────────

const noiseGLSL = `
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * snoise(p);
      p *= 2.0;
      w *= 0.5;
    }
    return f;
  }
`

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// ─────────────────────────────────────────────────────────
// 1. ETHEREAL — Linen fabric waves, side perspective
// Luxury fashion brand: flowing waves of linen from the side
// ─────────────────────────────────────────────────────────

const EtherealMaterial = shaderMaterial(
  {
    uTime: 0,
    uHoverState: 0,
    uMouse: new THREE.Vector2(0, 0),
  },
  vertexShader,
  `
    uniform float uTime;
    uniform float uHoverState;
    uniform vec2 uMouse;
    varying vec2 vUv;

    ${noiseGLSL}

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.12;

      // === DIAGONAL PERSPECTIVE ===
      // Rotate UVs ~35° for diagonal fabric drape
      float angle = 0.61; // ~35 degrees
      float ca = cos(angle), sa = sin(angle);
      vec2 center = vec2(0.5);
      vec2 diagUv = mat2(ca, -sa, sa, ca) * (uv - center) + center;

      // Perspective foreshortening — fabric recedes toward top-right
      float perspective = 0.7 + 0.6 * (1.0 - diagUv.y * 0.5 + diagUv.x * 0.3);
      vec2 perspUv = mix(center, diagUv, perspective);

      // === WAVE DISPLACEMENT — diagonal flowing folds ===
      float diag = diagUv.x + diagUv.y * 0.5; // diagonal axis
      float wave1 = sin(diag * 4.0 - t * 2.0 + sin(diag * 2.0 + t * 0.8) * 0.6) * 0.08;
      float wave2 = sin(diag * 7.0 - t * 1.5 + cos(diag * 3.0 - t * 0.5) * 0.4) * 0.04;
      float wave3 = sin(diag * 12.0 - t * 2.5 + sin(diag * 5.0 + t * 1.2) * 0.3) * 0.02;
      float wave4 = sin(diag * 2.0 - t * 0.8) * 0.10;

      float totalWave = wave1 + wave2 + wave3 + wave4;

      // Displace along the perpendicular to create draped folds
      vec2 waveUv = perspUv;
      waveUv += vec2(-sa, ca) * totalWave;

      // Fine ripples
      float ripple = sin(waveUv.x * 25.0 - t * 3.0) * sin(waveUv.y * 20.0) * 0.004;
      waveUv += vec2(-sa, ca) * ripple;

      // Mouse interaction — push the fabric like wind
      vec2 mousePos = uMouse * 0.5 + 0.5;
      float mouseDist = length(uv - mousePos);
      float mouseWave = sin(diag * 8.0 - uTime * 2.0 + mouseDist * 10.0) * exp(-mouseDist * 3.0) * uHoverState * 0.04;
      waveUv += vec2(-sa, ca) * mouseWave;

      // === FABRIC SURFACE — linen weave texture ===
      // Warp and weft threads aligned to diagonal
      vec2 threadUv = mat2(ca, -sa, sa, ca) * waveUv;
      float warp = sin(threadUv.x * 120.0 + snoise(waveUv * 10.0) * 0.5) * 0.5 + 0.5;
      float weft = sin(threadUv.y * 100.0 + snoise(waveUv * 8.0 + 50.0) * 0.4) * 0.5 + 0.5;
      float weavePattern = warp * 0.5 + weft * 0.5;

      // FBM for natural fiber irregularity
      float fiber = fbm(waveUv * 20.0 + t * 0.03) * 0.5 + 0.5;

      // === LIGHTING — slope-based from diagonal wave ===
      float dd = 0.005;
      float waveHere = sin(diag * 4.0 - t * 2.0 + sin(diag * 2.0 + t * 0.8) * 0.6) * 0.08
                     + sin(diag * 7.0 - t * 1.5 + cos(diag * 3.0 - t * 0.5) * 0.4) * 0.04
                     + sin(diag * 2.0 - t * 0.8) * 0.10;
      float diagNext = diag + dd;
      float waveNext = sin(diagNext * 4.0 - t * 2.0 + sin(diagNext * 2.0 + t * 0.8) * 0.6) * 0.08
                     + sin(diagNext * 7.0 - t * 1.5 + cos(diagNext * 3.0 - t * 0.5) * 0.4) * 0.04
                     + sin(diagNext * 2.0 - t * 0.8) * 0.10;
      float slope = (waveNext - waveHere) / dd;

      // Light from upper-left, raking across the diagonal folds
      float lighting = 0.5 + slope * 3.5;
      lighting = clamp(lighting, 0.12, 1.0);

      // === COLOR PALETTE — NOVA greens & earth ===
      vec3 deepSage   = vec3(0.22, 0.30, 0.18);  // dark fold shadows
      vec3 forestWeave = vec3(0.35, 0.45, 0.28);  // mid-tone green fiber
      vec3 sageFiber  = vec3(0.54, 0.60, 0.42);  // #8A9A6C sage
      vec3 paleMoss   = vec3(0.62, 0.72, 0.50);  // light green fiber
      vec3 warmAccent = vec3(0.76, 0.64, 0.35);  // #C4A35A golden accent

      // Base color from fabric surface
      float surface = weavePattern * 0.4 + fiber * 0.3 + 0.3;
      vec3 color;
      if (surface < 0.35) {
        color = mix(deepSage, forestWeave, surface / 0.35);
      } else if (surface < 0.6) {
        color = mix(forestWeave, sageFiber, (surface - 0.35) / 0.25);
      } else {
        color = mix(sageFiber, paleMoss, (surface - 0.6) / 0.4);
      }

      // Apply wave lighting
      color *= lighting;

      // Thread lines — finer on hover
      float threads = abs(sin(threadUv.x * 180.0)) * abs(sin(threadUv.y * 150.0));
      threads = pow(threads, 0.6) * 0.08;
      color -= vec3(threads * 0.7, threads, threads * 0.5) * (0.2 + uHoverState * 0.3);

      // Green-gold glow on crests
      float crest = smoothstep(0.0, 0.08, totalWave + 0.04);
      color += warmAccent * crest * 0.05;

      // Deep shadow in troughs
      float trough = smoothstep(0.0, -0.06, totalWave);
      color *= 1.0 - trough * 0.3;

      // Hover: warm golden sunlight
      float sunGlow = exp(-mouseDist * 2.5) * uHoverState * 0.12;
      color += warmAccent * sunGlow;

      // Vignette with green tint
      float vig = smoothstep(0.0, 0.7, 1.0 - length((uv - 0.5) * 1.3));
      color *= vig * 0.85 + 0.15;

      gl_FragColor = vec4(color, 1.0);
    }
  `
)

// ─────────────────────────────────────────────────────────
// 2. SYNAPSE — Neural network, electric connections
// AI platform that feels alive: pulsating nodes, synaptic energy
// ─────────────────────────────────────────────────────────

const SynapseMaterial = shaderMaterial(
  {
    uTime: 0,
    uHoverState: 0,
    uMouse: new THREE.Vector2(0, 0),
  },
  vertexShader,
  `
    uniform float uTime;
    uniform float uHoverState;
    uniform vec2 uMouse;
    varying vec2 vUv;

    ${noiseGLSL}

    // Hash for pseudo-random node positions
    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453);
    }

    // Voronoi for neural nodes
    float voronoi(vec2 p, out vec2 nearestPoint, out vec2 nearestCell) {
      vec2 ip = floor(p);
      vec2 fp = fract(p);
      float d = 1e10;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 nb = vec2(float(x), float(y));
          vec2 rnd = hash2(ip + nb);
          // Animate nodes subtly
          rnd = 0.5 + 0.4 * sin(uTime * 0.25 + 6.2831 * rnd);
          vec2 diff = nb + rnd - fp;
          float dist = length(diff);
          if (dist < d) {
            d = dist;
            nearestPoint = ip + nb + rnd;
            nearestCell = ip + nb;
          }
        }
      }
      return d;
    }

    void main() {
      vec2 uv = vUv;

      // Scale for node density
      float scale = 5.0 + uHoverState * 2.0;
      vec2 p = uv * scale;

      vec2 nearPt, nearCell;
      float dist = voronoi(p, nearPt, nearCell);

      // Neural connections — lines between nodes
      float edge = 1.0 - smoothstep(0.0, 0.06, dist);
      float glow = exp(-dist * 6.0);

      // Pulsating energy along connections
      float pulse = sin(dist * 30.0 - uTime * 2.0) * 0.5 + 0.5;
      float energy = glow * pulse;

      // Node glow
      float nodeGlow = exp(-dist * 12.0) * (0.6 + 0.4 * sin(uTime * 1.5 + nearCell.x * 5.0));

      // Colors: NOVA greens & sage
      vec3 bgColor    = vec3(0.03, 0.04, 0.03);
      vec3 primary    = vec3(0.50, 0.65, 0.33);  // #7FA653
      vec3 primaryLt  = vec3(0.60, 0.80, 0.52);  // #99CD85
      vec3 sage       = vec3(0.54, 0.60, 0.42);  // #8A9A6C
      vec3 bright     = vec3(0.81, 0.88, 0.74);  // #CFE0BC

      vec3 color = bgColor;

      // Connection lines with flowing energy
      float connectionLine = smoothstep(0.04, 0.0, abs(dist - 0.3)) * 0.5;
      connectionLine += smoothstep(0.03, 0.0, abs(dist - 0.5)) * 0.3;
      color += primary * connectionLine * (0.5 + 0.5 * pulse);

      // Neural glow
      color += mix(primary, sage, sin(nearCell.y * 3.0 + uTime * 0.5) * 0.5 + 0.5) * glow * 0.6;

      // Bright nodes
      color += bright * nodeGlow * 0.8;
      color += primaryLt * edge * 0.5;

      // Synaptic flash on hover
      float mouseD = length(uv - (uMouse * 0.5 + 0.5));
      float mouseFlash = exp(-mouseD * 8.0) * uHoverState;
      color += bright * mouseFlash * 0.4;

      // Subtle background noise
      float bgNoise = fbm(uv * 8.0 + uTime * 0.05) * 0.03;
      color += vec3(bgNoise * 0.4, bgNoise * 0.6, bgNoise * 0.3);

      // Vignette
      float vig = smoothstep(0.0, 0.6, 1.0 - length((uv - 0.5) * 1.5));
      color *= vig * 0.9 + 0.1;

      gl_FragColor = vec4(color, 1.0);
    }
  `
)

// ─────────────────────────────────────────────────────────
// 3. VOID — Mountain landscape, serene & vast
// Immersive experience: layered mountain silhouettes with atmosphere
// ─────────────────────────────────────────────────────────

const VoidMaterial = shaderMaterial(
  {
    uTime: 0,
    uHoverState: 0,
    uMouse: new THREE.Vector2(0, 0),
  },
  vertexShader,
  `
    uniform float uTime;
    uniform float uHoverState;
    uniform vec2 uMouse;
    varying vec2 vUv;

    ${noiseGLSL}

    // Generate mountain silhouette line
    float mountainLine(float x, float baseHeight, float scale, float detail, float seed, float time) {
      float h = baseHeight;
      h += snoise(vec2(x * scale + seed + time, seed)) * 0.15;
      h += snoise(vec2(x * scale * 2.0 + seed + time * 1.5, seed + 50.0)) * 0.08 * detail;
      h += snoise(vec2(x * scale * 4.0 + seed + time * 0.8, seed + 100.0)) * 0.04 * detail;
      h += snoise(vec2(x * scale * 8.0 + seed + time * 0.5, seed + 150.0)) * 0.02 * detail;
      // Sharp peaks
      float peak = snoise(vec2(x * scale * 0.5 + seed + time * 0.3, seed + 200.0));
      h += max(0.0, peak) * 0.12;
      return h;
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.06;

      // === SKY ===
      // Gradient sky — dark green atmosphere
      vec3 skyTop     = vec3(0.02, 0.04, 0.03);   // deep dark green
      vec3 skyMid     = vec3(0.05, 0.08, 0.05);   // muted green night
      vec3 skyHorizon = vec3(0.12, 0.16, 0.10);   // warm sage horizon
      vec3 skyGlow    = vec3(0.20, 0.22, 0.12);   // earthy horizon glow

      float skyGrad = uv.y;
      vec3 sky;
      if (skyGrad > 0.7) {
        sky = mix(skyMid, skyTop, (skyGrad - 0.7) / 0.3);
      } else if (skyGrad > 0.45) {
        sky = mix(skyHorizon, skyMid, (skyGrad - 0.45) / 0.25);
      } else {
        sky = mix(skyGlow, skyHorizon, skyGrad / 0.45);
      }

      // Stars in upper sky
      float starField = pow(max(0.0, snoise(uv * 80.0 + 300.0)), 16.0) * smoothstep(0.5, 0.9, uv.y);
      sky += vec3(0.7, 0.8, 0.65) * starField * 1.2;

      // Subtle mist wisps
      float wisps = fbm(vec2(uv.x * 3.0 + t * 0.5, uv.y * 1.5 + t * 0.1)) * 0.5 + 0.5;
      wisps = smoothstep(0.4, 0.7, wisps) * smoothstep(0.4, 0.85, uv.y) * 0.08;
      sky += vec3(0.15, 0.20, 0.10) * wisps;

      vec3 color = sky;

      // === MOUNTAINS — Back to front layers ===
      // Mountain colors — NOVA greens, darker layers
      vec3 mtFar    = vec3(0.06, 0.10, 0.06);  // far range — dark sage
      vec3 mtMid    = vec3(0.04, 0.07, 0.04);  // mid range — forest
      vec3 mtNear   = vec3(0.03, 0.04, 0.03);  // near range — deepest
      vec3 mtSnow   = vec3(0.40, 0.50, 0.35);  // muted green highlights

      // Far mountain range (background)
      float farMtn = mountainLine(uv.x, 0.55, 2.0, 0.8, 0.0, t * 0.4);
      float farMask = smoothstep(farMtn, farMtn - 0.008, uv.y);
      // Atmospheric fog on far mountains
      vec3 farColor = mix(mtFar, skyHorizon * 0.6, smoothstep(farMtn - 0.15, farMtn, uv.y) * 0.5);
      color = mix(color, farColor, farMask);
      // Snow on far peaks
      float farSnow = smoothstep(farMtn - 0.015, farMtn, uv.y) * smoothstep(0.6, 0.58, uv.y);
      color += mtSnow * farSnow * farMask * 0.15;

      // Mid mountain range
      float midMtn = mountainLine(uv.x, 0.42, 3.0, 1.0, 42.0, t * 0.7);
      float midMask = smoothstep(midMtn, midMtn - 0.006, uv.y);
      vec3 midColor = mix(mtMid, skyHorizon * 0.3, smoothstep(midMtn - 0.12, midMtn, uv.y) * 0.3);
      color = mix(color, midColor, midMask);
      // Snow on mid peaks
      float midSnow = smoothstep(midMtn - 0.01, midMtn, uv.y) * smoothstep(0.5, 0.47, uv.y);
      color += mtSnow * midSnow * midMask * 0.12;

      // Near mountain range (foreground)
      float nearMtn = mountainLine(uv.x, 0.28, 4.0, 1.2, 99.0, t * 1.0);
      float nearMask = smoothstep(nearMtn, nearMtn - 0.004, uv.y);
      color = mix(color, mtNear, nearMask);
      // Ridge detail on near mountains
      float ridgeDetail = fbm(vec2(uv.x * 20.0, uv.y * 15.0) + t * 0.05);
      color += vec3(0.04, 0.06, 0.03) * ridgeDetail * nearMask * 0.3;

      // === FOREGROUND — dark ground with subtle texture ===
      float ground = smoothstep(0.18, 0.12, uv.y);
      vec3 groundColor = vec3(0.02, 0.02, 0.03);
      color = mix(color, groundColor, ground);

      // === ATMOSPHERE ===
      // Mist between layers
      float mist = fbm(vec2(uv.x * 5.0 + t * 0.3, uv.y * 2.0 + t * 0.08));
      mist = smoothstep(0.3, 0.7, mist) * smoothstep(0.15, 0.35, uv.y) * smoothstep(0.55, 0.35, uv.y);
      color += vec3(0.08, 0.12, 0.06) * mist * 0.15;

      // Moon / glow
      vec2 moonPos = vec2(0.72, 0.78);
      float moonDist = length(uv - moonPos);
      float moonGlow = exp(-moonDist * 8.0) * 0.2;
      float moonDisc = smoothstep(0.025, 0.02, moonDist);
      color += vec3(0.45, 0.55, 0.35) * moonGlow;
      color += vec3(0.70, 0.78, 0.60) * moonDisc * 0.6;

      // Mouse interaction — subtle light on landscape
      float mouseDist = length(uv - (uMouse * 0.5 + 0.5));
      float mouseLight = exp(-mouseDist * 4.0) * uHoverState * 0.15;
      color += vec3(0.20, 0.25, 0.15) * mouseLight;

      // Hover reveals more mist & atmosphere
      color += vec3(0.06, 0.10, 0.04) * mist * uHoverState * 0.2;

      // Vignette
      float vig = smoothstep(0.0, 0.6, 1.0 - length((uv - 0.5) * 1.4));
      color *= vig * 0.9 + 0.1;

      gl_FragColor = vec4(color, 1.0);
    }
  `
)

// ─────────────────────────────────────────────────────────
// 4. PULSE — Fintech data poetry
// Dashboard: rhythmic waves, data streams, flowing metrics
// ─────────────────────────────────────────────────────────

const PulseMaterial = shaderMaterial(
  {
    uTime: 0,
    uHoverState: 0,
    uMouse: new THREE.Vector2(0, 0),
  },
  vertexShader,
  `
    uniform float uTime;
    uniform float uHoverState;
    uniform vec2 uMouse;
    varying vec2 vUv;

    ${noiseGLSL}

    float waveLine(vec2 uv, float freq, float amp, float speed, float offset, float thickness) {
      float wave = sin(uv.x * freq + uTime * speed + offset) * amp;
      wave += snoise(vec2(uv.x * 3.0 + uTime * speed * 0.3, offset)) * amp * 0.3;
      float dist = abs(uv.y - 0.5 - wave);
      return smoothstep(thickness, 0.0, dist);
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.5;

      // Dark background — NOVA palette
      vec3 bgDark = vec3(0.03, 0.04, 0.03);
      vec3 color = bgDark;

      // Grid pattern — subtle data grid
      float gridX = smoothstep(0.98, 1.0, sin(uv.x * 60.0) * 0.5 + 0.5);
      float gridY = smoothstep(0.98, 1.0, sin(uv.y * 40.0) * 0.5 + 0.5);
      float grid = max(gridX, gridY);
      color += vec3(0.04, 0.06, 0.04) * grid;

      // Wave lines — NOVA greens & earth tones
      vec3 primary   = vec3(0.50, 0.65, 0.33);  // #7FA653
      vec3 sage      = vec3(0.54, 0.60, 0.42);  // #8A9A6C
      vec3 primaryLt = vec3(0.60, 0.80, 0.52);  // #99CD85
      vec3 stone     = vec3(0.61, 0.56, 0.48);  // #9C8E7A

      // Multiple wave lines at different frequencies
      float w1 = waveLine(uv, 8.0, 0.12, 0.8, 0.0, 0.008 + uHoverState * 0.004);
      float w2 = waveLine(uv, 12.0, 0.08, -1.0, 2.0, 0.006 + uHoverState * 0.003);
      float w3 = waveLine(uv, 6.0, 0.15, 0.5, 4.0, 0.007 + uHoverState * 0.003);
      float w4 = waveLine(uv, 15.0, 0.05, -1.2, 6.0, 0.005 + uHoverState * 0.002);
      float w5 = waveLine(uv, 10.0, 0.10, 0.9, 8.0, 0.006 + uHoverState * 0.003);

      // Pulse effect — traveling bright spots along waves
      float pulse1 = exp(-pow(mod(uv.x - t * 0.08, 1.0) - 0.5, 2.0) * 40.0);
      float pulse2 = exp(-pow(mod(uv.x + t * 0.06, 1.0) - 0.3, 2.0) * 50.0);

      color += primary   * w1 * (0.6 + pulse1 * 0.4);
      color += sage      * w2 * 0.5;
      color += primaryLt * w3 * (0.5 + pulse2 * 0.3);
      color += stone     * w4 * 0.4;
      color += primary   * w5 * 0.3;

      // Glow under waves
      float glowArea = 0.0;
      for (float i = 0.0; i < 5.0; i++) {
        float freq = 6.0 + i * 3.0;
        float speed = 1.0 + i * 0.5;
        float offset = i * 2.0;
        float wave = sin(uv.x * freq + t * speed * (mod(i, 2.0) == 0.0 ? 1.0 : -1.0) + offset) * (0.12 - i * 0.015);
        wave += snoise(vec2(uv.x * 3.0 + t * speed * 0.3, offset)) * 0.03;
        float below = smoothstep(0.0, -0.15, uv.y - 0.5 - wave);
        glowArea += below * 0.04;
      }
      color += primary * glowArea * 0.3;

      // Data points / particles
      float dataPoints = pow(max(0.0, snoise(uv * vec2(30.0, 20.0) + t * 0.3)), 12.0);
      color += primaryLt * dataPoints * 1.5;

      // Mouse — ripple effect
      float mouseDist = length(uv - (uMouse * 0.5 + 0.5));
      float ripple = sin(mouseDist * 30.0 - t * 2.5) * exp(-mouseDist * 6.0) * uHoverState;
      color += primaryLt * max(0.0, ripple) * 0.3;

      // Heartbeat pulse in center
      float heartbeat = exp(-pow(mod(t, 3.0) - 0.3, 2.0) * 20.0) * 0.15;
      float centerDist = length(uv - 0.5);
      color += primary * heartbeat * exp(-centerDist * 4.0) * uHoverState;

      // Vignette
      float vig = smoothstep(0.0, 0.6, 1.0 - length((uv - 0.5) * 1.5));
      color *= vig * 0.85 + 0.15;

      gl_FragColor = vec4(color, 1.0);
    }
  `
)

// ─────────────────────────────────────────────────────────
// EXTEND MATERIALS
// ─────────────────────────────────────────────────────────

extend({ EtherealMaterial, SynapseMaterial, VoidMaterial, PulseMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    etherealMaterial: Object3DNode<any, typeof EtherealMaterial> & {
      uTime?: number; uHoverState?: number; uMouse?: THREE.Vector2
    }
    synapseMaterial: Object3DNode<any, typeof SynapseMaterial> & {
      uTime?: number; uHoverState?: number; uMouse?: THREE.Vector2
    }
    voidMaterial: Object3DNode<any, typeof VoidMaterial> & {
      uTime?: number; uHoverState?: number; uMouse?: THREE.Vector2
    }
    pulseMaterial: Object3DNode<any, typeof PulseMaterial> & {
      uTime?: number; uHoverState?: number; uMouse?: THREE.Vector2
    }
  }
}

// ─────────────────────────────────────────────────────────
// ANIMATION MESH COMPONENT
// ─────────────────────────────────────────────────────────

function AnimationMesh({ type, isHovered }: { type: number; isHovered: boolean }) {
  const materialRef = useRef<any>(null)
  const { viewport } = useThree()

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta
      const targetHover = isHovered ? 1.0 : 0.0
      materialRef.current.uHoverState += (targetHover - materialRef.current.uHoverState) * 0.08
      materialRef.current.uMouse.x += (state.pointer.x - materialRef.current.uMouse.x) * 0.08
      materialRef.current.uMouse.y += (state.pointer.y - materialRef.current.uMouse.y) * 0.08
    }
  })

  const materialElement = (() => {
    switch (type) {
      case 0: return <etherealMaterial ref={materialRef} />
      case 1: return <synapseMaterial ref={materialRef} />
      case 2: return <voidMaterial ref={materialRef} />
      case 3: return <pulseMaterial ref={materialRef} />
      default: return <etherealMaterial ref={materialRef} />
    }
  })()

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      {materialElement}
    </mesh>
  )
}

// ─────────────────────────────────────────────────────────
// EXPORTED COMPONENT
// ─────────────────────────────────────────────────────────

interface ProjectAnimationProps {
  projectIndex: number
  isHovered: boolean
}

export default function ProjectAnimation({ projectIndex, isHovered }: ProjectAnimationProps) {
  return <AnimationMesh type={projectIndex} isHovered={isHovered} />
}
