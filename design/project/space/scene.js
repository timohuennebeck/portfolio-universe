// The space scene: baked sky, travelling star field, far stars, and one particle galaxy per destination.
import * as T from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { STAR_VS, STAR_FS, FAR_VS, FAR_FS, QUAD_VS, SKY_BAKE_FS, HOLE_VS, HOLE_FS, SUN_FS } from './shaders.js';
import { shapeFor } from './shapes.js';

const BOX = 1100;                      // size of the wrapping star-field cube around the camera
const GALAXY_VISIBLE = 1600;           // beyond this distance a galaxy is faded out by the shader, so skip drawing it
const TINTS = ['#dbe7ff', '#dbe7ff', '#ffffff', '#ffffff', '#c4d6ff', '#ffc99a', '#ffb27a'];
const UP = new T.Vector3(0, 1, 0);
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// Route layout and camera framing for destination i
export const routePosition = i => { const a = i * 1.7; return [Math.sin(a) * 900, Math.cos(a * 0.7) * 320, -i * 2600]; };
// Park on the side the camera arrives from (fromPos) so no warp flies through or swings around its destination
export function arrival(nodes, i, fromPos) {
  const p = new T.Vector3(...nodes[i].pos), prev = fromPos ? fromPos.clone() : nodes[i - 1] ? new T.Vector3(...nodes[i - 1].pos) : p.clone().add(new T.Vector3(0, 0, 400));
  // billboards (hole, sun) are framed further back and aimed nearer their centre; up close the idle sway reads as shake
  const fx = nodes[i].blackhole || nodes[i].star;
  const pos = p.clone().addScaledVector(prev.sub(p).normalize(), 84).add(new T.Vector3(0, 2, 0));
  const quat = new T.Quaternion().setFromRotationMatrix(new T.Matrix4().lookAt(pos, new T.Vector3(p.x, p.y - 17, p.z), UP));
  return { pos, quat };
}

function radialTexture(stops) { const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x = cv.getContext('2d'); const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); stops.forEach(([o, c]) => g.addColorStop(o, c)); x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new T.CanvasTexture(cv); }

function instancedStars(count, fill) {
  const geo = new T.InstancedBufferGeometry(); geo.copy(new T.PlaneGeometry(1, 1)); geo.instanceCount = count;
  const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), size = new Float32Array(count), seed = new Float32Array(count), c = new T.Color();
  for (let i = 0; i < count; i++) { const s = fill(c); pos.set(s.p, i * 3); col.set([c.r, c.g, c.b], i * 3); size[i] = s.size; seed[i] = Math.random() * 100; }
  geo.setAttribute('aPos', new T.InstancedBufferAttribute(pos, 3)); geo.setAttribute('aCol', new T.InstancedBufferAttribute(col, 3));
  geo.setAttribute('aSize', new T.InstancedBufferAttribute(size, 1)); geo.setAttribute('aSeed', new T.InstancedBufferAttribute(seed, 1));
  return geo;
}

// Render the procedural sky once into an equirect texture and wrap it on a sphere.
function bakeSky(renderer) {
  const rt = new T.WebGLRenderTarget(1024, 512, { type: T.HalfFloatType, depthBuffer: false });
  const s = new T.Scene(), cam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  s.add(new T.Mesh(new T.PlaneGeometry(2, 2), new T.ShaderMaterial({ vertexShader: QUAD_VS, fragmentShader: SKY_BAKE_FS })));
  renderer.setRenderTarget(rt); renderer.render(s, cam); renderer.setRenderTarget(null);
  return new T.Mesh(new T.SphereGeometry(5000, 32, 24), new T.MeshBasicMaterial({ map: rt.texture, side: T.BackSide, depthWrite: false }));
}

export function createSpace(renderer, { hq, PR, nodes }) {
  const scene = new T.Scene();
  const shared = { uBurst: { value: 0 }, uMouse: { value: new T.Vector2(9, 9) }, uPush: { value: 0 }, uCam: { value: new T.Vector3() }, uVel: { value: new T.Vector3() }, uRes: { value: new T.Vector2(1, 1) }, uTime: { value: 0 }, uFocus: { value: 84 }, uPR: { value: PR }, uSpeed: { value: 0 } };
  const starMat = (own) => new T.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: T.AdditiveBlending, vertexShader: STAR_VS, fragmentShader: STAR_FS,
    uniforms: { ...shared, uBox: { value: BOX }, uStretch: { value: 0.055 }, uWrap: { value: 0 }, uCenter: { value: new T.Vector3() }, uAxis: { value: UP }, uSpin: { value: 0 }, ...own } });

  const sky = bakeSky(renderer); scene.add(sky);

  const field = new T.Mesh(instancedStars(hq ? 6000 : 3500, c => { c.set(pick(TINTS)).multiplyScalar(rnd(0.3, 0.8)); return { p: [rnd(-.5, .5) * BOX, rnd(-.5, .5) * BOX, rnd(-.5, .5) * BOX], size: 0.5 + Math.pow(Math.random(), 4) * 2.2 }; }), starMat({ uWrap: { value: 1 } }));
  field.frustumCulled = false; scene.add(field);

  const far = (() => { const M = 4000, pos = new Float32Array(M * 3), col = new Float32Array(M * 3), c = new T.Color();
    for (let i = 0; i < M; i++) { const th = Math.random() * 6.283, u = Math.random() * 2 - 1, s = Math.sqrt(1 - u * u); pos.set([4200 * s * Math.cos(th), 4200 * u, 4200 * s * Math.sin(th)], i * 3); c.set(pick(TINTS)).multiplyScalar(rnd(0.25, 0.75)); col.set([c.r, c.g, c.b], i * 3); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('aColor', new T.BufferAttribute(col, 3));
    return new T.Points(g, new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: { uPR: { value: PR } }, vertexShader: FAR_VS, fragmentShader: FAR_FS })); })();
  scene.add(far);

  const glowTex = radialTexture([[0, 'rgba(255,255,255,.7)'], [0.3, 'rgba(255,255,255,.18)'], [1, 'rgba(255,255,255,0)']]);
  const sprite = (color, opacity) => new T.Sprite(new T.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: T.AdditiveBlending, depthWrite: false }));
  const holeMat = new T.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, vertexShader: HOLE_VS, fragmentShader: HOLE_FS, uniforms: { uTime: shared.uTime, uSpeed: shared.uSpeed, uFade: { value: 0 }, uHover: { value: new T.Vector2() }, uHov: { value: 0 } },
    blending: T.CustomBlending, blendSrc: T.OneFactor, blendDst: T.OneMinusSrcAlphaFactor, blendSrcAlpha: T.ZeroFactor, blendDstAlpha: T.OneFactor });
  const sunMat = new T.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, vertexShader: HOLE_VS, fragmentShader: SUN_FS, uniforms: { uTime: shared.uTime, uSpeed: shared.uSpeed, uFade: { value: 0 }, uHov: { value: 0 }, uOrbit: { value: new T.Vector2() } },
    blending: T.CustomBlending, blendSrc: T.OneFactor, blendDst: T.OneMinusSrcAlphaFactor, blendSrcAlpha: T.ZeroFactor, blendDstAlpha: T.OneFactor });
  const galaxies = nodes.map((n, i) => {
    const center = new T.Vector3(...n.pos), tint = new T.Color(n.tint);
    if (n.blackhole) {
      const mesh = new T.Mesh(new T.PlaneGeometry(64, 64), holeMat); mesh.position.copy(center); mesh.renderOrder = -1; mesh.frustumCulled = false; scene.add(mesh);
      const glow = sprite('#6f9cff', 0); glow.visible = false; scene.add(glow);
      return { mesh, glow, center, phase: Math.random() * 6.283, hole: true, fx: holeMat };
    }
    if (n.star) {
      const mesh = new T.Mesh(new T.PlaneGeometry(64, 64), sunMat); mesh.position.copy(center); mesh.renderOrder = -1; mesh.frustumCulled = false; scene.add(mesh);
      const glow = sprite('#ffb066', 0); glow.visible = false; scene.add(glow);
      return { mesh, glow, center, phase: Math.random() * 6.283, star: true, fx: sunMat, noHover: true };
    }
    const shape = shapeFor(i), tilt = new T.Euler(rnd(-.5, .5), rnd(0, 6.283), rnd(-.4, .4));
    const geo = instancedStars(hq ? 2600 : 1800, c => { const [p, rel] = shape(); p.applyEuler(tilt); const wm = Math.random();
      c.set(rel < 0.3 ? (wm < 0.6 ? '#ffd9b0' : '#ffffff') : (wm < 0.3 ? '#ffc9a0' : wm < 0.7 ? '#c6d8ff' : '#ffffff')); if (Math.random() < 0.3) c.lerp(tint, 0.45);
      const big = Math.random() < 0.1; c.multiplyScalar((big ? 0.55 : 0.3) + Math.random() * 0.45);
      return { p: [p.x, p.y, p.z], size: big ? 0.55 + Math.pow(Math.random(), 2) * 0.7 : 0.16 + Math.pow(Math.random(), 2.5) * 0.4 }; });
    const mesh = new T.Mesh(geo, starMat({ uCenter: { value: center }, uAxis: { value: UP.clone().applyEuler(tilt) }, uSpin: { value: rnd(0.05, 0.1) } })); mesh.frustumCulled = false; scene.add(mesh);
    const glow = sprite(tint.clone().lerp(new T.Color('#ffd9b0'), 0.5), 0.16); glow.position.copy(center); scene.add(glow);
    for (let k = 0; k < 2; k++) { const haze = sprite(k ? '#ff9a5c' : '#3f6fff', 0.02); haze.position.set(n.pos[0] + rnd(-250, 250), n.pos[1] + rnd(-150, 150), n.pos[2] - rnd(200, 600)); const s = rnd(500, 1000); haze.scale.set(s, s * 0.6, 1); scene.add(haze); }
    return { mesh, glow, center, phase: Math.random() * 6.283 };
  });

  const ray = new T.Raycaster(), hitV = new T.Vector2(), hc = new T.Vector3(), he = new T.Vector3(), hx = new T.Vector3(), hy = new T.Vector3(), hz = new T.Vector3();
  const smooth01 = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  return {
    scene, shared, galaxies,
    setResolution(W, H) { shared.uRes.value.set(W, H); },
    setOrbit(yaw, pitch) { sunMat.uniforms.uOrbit.value.set(yaw, pitch); },
    setPixelRatio(pr) { shared.uPR.value = pr; far.material.uniforms.uPR.value = pr; },
    // Per-frame: follow the camera with sky/far stars, animate galaxy cores, cull galaxies out of range
    update(time, camera, burst) {
      sky.position.copy(camera.position); far.position.copy(camera.position);
      shared.uTime.value = time; shared.uBurst.value = burst;
      for (const g of galaxies) {
        const d = camera.position.distanceTo(g.center);
        if (g.fx) { const f = smooth01((GALAXY_VISIBLE - d) / 500); g.fx.uniforms.uFade.value = f; g.mesh.visible = f > 0.001; g.mesh.quaternion.copy(camera.quaternion); continue; }
        g.mesh.visible = d < GALAXY_VISIBLE;
        const s = 30 * (1 + 0.08 * Math.sin(time * 0.5 + g.phase)) * (1 + burst * 2.2); g.glow.scale.set(s, s, 1);
        g.glow.material.opacity = (0.14 + 0.04 * Math.sin(time * 0.7 + g.phase)) * smooth01((1500 - d) / 800) * (1 - burst * 0.85);
      }
    },
    // Screen-space shadow for the composite lens: {x,y} uv centre, r radius in uv (y units), k strength (fades with distance, off while hidden)
    holeScreen(camera) {
      for (const g of galaxies) { if (!g.hole) continue;
        const d = camera.position.distanceTo(g.center);
        hc.copy(g.center).project(camera); if (hc.z > 1) return null;
        camera.matrixWorld.extractBasis(hx, hy, hz);
        he.copy(g.center).addScaledVector(hy, 64 * 0.5 * (0.17 / 0.55)).project(camera);
        const r = Math.abs(he.y - hc.y) * 0.5 * 0.9, k = smooth01((900 - d) / 500) * (1 + 0.35 * holeMat.uniforms.uHov.value);
        return { x: hc.x * 0.5 + 0.5, y: hc.y * 0.5 + 0.5, r, k }; }
      return null;
    },
    // pointer in NDC (x,y in -1..1); eases the hover uniforms toward the cursor position on the black hole plane
    hover(camera, ndc, inside, dt) {
      const k = Math.min(1, dt * 6);
      for (const g of galaxies) { if (!g.fx || g.noHover) continue; let hit = null;
        if (inside && g.mesh.visible) { ray.setFromCamera(ndc, camera); const h = ray.intersectObject(g.mesh, false)[0]; if (h && h.uv) hit = h.uv; }
        const u = g.fx.uniforms;
        if (hit) { u.uHover && u.uHover.value.lerp(hitV.set(hit.x - .5, hit.y - .5), k); u.uHov.value += (1 - u.uHov.value) * k; } else u.uHov.value += (0 - u.uHov.value) * k; }
    },
    dispose() { scene.traverse(o => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose(); }); glowTex.dispose(); },
  };
}
