// Post-processing: two-scale bloom + composite. No MSAA (everything is additive sprites, so aliasing is invisible).
import * as T from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { QUAD_VS, BRIGHT_FS, BLUR_FS, FINAL_FS } from './shaders.js';

export function createPost(renderer) {
  const scene = new T.Scene(), cam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1), quad = new T.Mesh(new T.PlaneGeometry(2, 2)); scene.add(quad);
  const rt = () => new T.WebGLRenderTarget(4, 4, { type: T.HalfFloatType, depthBuffer: false });
  const rtScene = rt(), half = rt(), halfTmp = rt(), quarter = rt(), quarterTmp = rt();
  const mat = (fs, uniforms) => new T.ShaderMaterial({ uniforms, vertexShader: QUAD_VS, fragmentShader: fs, depthTest: false, depthWrite: false });
  const bright = mat(BRIGHT_FS, { tDiffuse: { value: null }, uThresh: { value: 0.85 } });
  const blur = mat(BLUR_FS, { tDiffuse: { value: null }, uDir: { value: new T.Vector2() } });
  const final = mat(FINAL_FS, { tScene: { value: rtScene.texture }, tBloomA: { value: half.texture }, tBloomB: { value: quarter.texture }, uTime: { value: 0 }, uBloom: { value: 1 }, uCA: { value: 0.01 }, uGrain: { value: 0.03 }, uWarp: { value: 0 }, uDim: { value: 0 }, uHole: { value: new T.Vector4(0.5, 0.5, 0, 0) }, uAspect: { value: 1 } });
  const blit = (m, target) => { quad.material = m; renderer.setRenderTarget(target); renderer.render(scene, cam); };
  const blurPass = (src, tmp, iters) => { for (let i = 0; i < iters; i++) {
    blur.uniforms.tDiffuse.value = src.texture; blur.uniforms.uDir.value.set((1 + i) / src.width, 0); blit(blur, tmp);
    blur.uniforms.tDiffuse.value = tmp.texture; blur.uniforms.uDir.value.set(0, (1 + i) / src.height); blit(blur, src); } };
  return {
    resize(W, H) { rtScene.setSize(W, H); half.setSize(W >> 1, H >> 1); halfTmp.setSize(W >> 1, H >> 1); quarter.setSize(W >> 2, H >> 2); quarterTmp.setSize(W >> 2, H >> 2); },
    render(worldScene, camera, { time, bloom, warp, dim, grain = 0.03, hole }) {
      renderer.setRenderTarget(rtScene); renderer.render(worldScene, camera);
      bright.uniforms.tDiffuse.value = rtScene.texture; blit(bright, half); blurPass(half, halfTmp, 1);
      blur.uniforms.tDiffuse.value = half.texture; blur.uniforms.uDir.value.set(0, 0); blit(blur, quarter); blurPass(quarter, quarterTmp, 2);
      const u = final.uniforms; u.uTime.value = time; u.uBloom.value = bloom; u.uWarp.value = warp; u.uDim.value = dim; u.uGrain.value = grain; u.uAspect.value = rtScene.width / Math.max(1, rtScene.height); if (hole) u.uHole.value.set(hole.x, hole.y, hole.r, hole.k); else u.uHole.value.w = 0;
      blit(final, null);
    },
    dispose() { [rtScene, half, halfTmp, quarter, quarterTmp].forEach(r => r.dispose()); [bright, blur, final].forEach(m => m.dispose()); quad.geometry.dispose(); },
  };
}
