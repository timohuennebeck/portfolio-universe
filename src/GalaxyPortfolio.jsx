import React from 'react';
import { PROJECTS, ABOUT, UI_STRINGS } from './content.js';
import { AMBIENCE, QUALITY, BLOOM } from './config.js';
import { layoutFor } from './layout.js';
import { Hints, NavDock, AboutButton, SoundButton } from './components/Hud.jsx';
import ArrivalCard from './components/ArrivalCard.jsx';
import FullscreenNudge from './components/FullscreenNudge.jsx';
import Overlay from './components/Overlay.jsx';

const smooth01 = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const easeWarp = t => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

/**
 * The whole experience: a WebGL scene plus the HUD that floats over it.
 *
 * A class component on purpose. Almost all of the state here is imperative —
 * the renderer, the camera, the in-flight warp, the pointer — and it is read
 * and written sixty times a second by the frame loop, never by React. Only the
 * handful of fields the HUD actually renders live in `state`.
 */
export default class GalaxyPortfolio extends React.Component {
  // idx = destination we are at / flying to
  // cardIdx = destination shown on the arrival card (updates on landing)
  state = {
    idx: 0,
    cardIdx: 0,
    pageOpen: false,
    aboutOpen: false,
    soundOn: !(matchMedia('(pointer:coarse)').matches || innerWidth < 720),
    ready: false,
    mobile: matchMedia('(max-width: 720px)').matches,
  };

  canvasRef = React.createRef();
  labelRef = React.createRef();
  pageRef = React.createRef();

  nodes = [];
  about = {};
  warp = null;
  driftK = 0;
  mouse = { x: 0, y: 0, inside: false };
  wheelLock = 0;
  // landing grace: no travel by any means until this timestamp
  landLock = 0;
  nudgeUp = false;
  setNudgeUp = up => { this.nudgeUp = up; };
  speedNorm = 0;
  arrived = 1;
  burst = 0;
  // drag-to-orbit offset around the current galaxy
  orbit = { yaw: 0, pitch: 0, tYaw: 0, tPitch: 0 };

  // ---- navigation
  get busy() { return !!this.warp || this.state.pageOpen || this.state.aboutOpen; }

  openOverlay(key) {
    if (this.warp || this.state[key]) return;
    this.setState({ [key]: true });
    if (this.pageRef.current) this.pageRef.current.scrollTop = 0;
  }

  closeOverlay = () => this.setState({ pageOpen: false, aboutOpen: false });

  jumpTo = i => {
    if (!this.camera || this.warp) return;
    // Same lock as scrolling: no travel while the fullscreen nudge is up, or in
    // the first moment after landing — from the nav dots, the arrival card,
    // the hash, or "Continue to".
    if (this.nudgeUp || performance.now() < this.landLock) return;
    if (i === this.state.idx) return this.closeOverlay();
    const to = (this.landing = this.arrival(i, this.camera.position));
    const dist = this.camera.position.distanceTo(to.pos);
    // Cubic path: swing sideways on departure so we never fly through the
    // object we are leaving, then approach the target straight.
    const fromP = this.camera.position.clone();
    const dir = to.pos.clone().sub(fromP).normalize();
    const up = new this.T.Vector3(0, 1, 0);
    const side = new this.T.Vector3().crossVectors(dir, up);
    if (side.lengthSq() < 1e-4) side.set(1, 0, 0);
    side.normalize();
    const clear = Math.min(170, dist * 0.3), pull = dist * 0.28;
    const c1 = fromP.clone().addScaledVector(dir, pull).addScaledVector(side, clear);
    const c2 = to.pos.clone().addScaledVector(dir, -pull);
    this.warp = {
      i, t: 0, dur: Math.min(4.2, 2.6 + dist / 3500),
      fromP, c1, c2, fromQ: this.baseQ.clone(), toP: to.pos, toQ: to.quat,
    };
    this.arrived = 0;
    this.orbit = { yaw: 0, pitch: 0, tYaw: 0, tPitch: 0 };
    this.setState({ pageOpen: false, aboutOpen: false, idx: i });
  };

  step(dir) {
    const N = this.nodes.length;
    this.jumpTo((this.state.idx + dir + N) % N);
  }

  // ---- sound (starts on first interaction; browsers block autoplay)
  async audio() {
    if (!this._audio) {
      const A = new (window.AudioContext || window.webkitAudioContext)();
      const m = await import('./audio/ambience.js');
      this._audio = { A, m, amb: null };
    }
    await this._audio.A.resume();
    return this._audio;
  }

  async setAmbience(on) {
    const au = await this.audio();
    if (au.amb) {
      const old = au.amb;
      old.out.gain.setTargetAtTime(0, au.A.currentTime, 0.6);
      setTimeout(() => old.stop(), 2500);
      au.amb = null;
    }
    if (on) {
      au.amb = au.m.createAmbience(au.A, AMBIENCE);
      au.amb.out.gain.setTargetAtTime(0.16, au.A.currentTime, 1.8);
    }
  }

  toggleSound = () => {
    const on = !this.state.soundOn;
    this.setState({ soundOn: on });
    this.setAmbience(on);
  };

  // ---- pointer
  onPointerMove = e => {
    const r = this.rect;
    if (!r) return;
    this.mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.mouse.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    this.mouse.inside = true;
    const s = this.touch;
    if (s && !this.busy) {
      const o = this.orbit;
      o.tYaw -= (e.clientX - s.lx) * 0.006;
      o.tPitch = Math.max(-1.2, Math.min(1.2, o.tPitch - (e.clientY - s.ly) * 0.006));
      s.lx = e.clientX;
      s.ly = e.clientY;
      if (Math.hypot(e.clientX - s.x, e.clientY - s.y) > 12) e.currentTarget.style.cursor = 'grabbing';
    }
  };

  onPointerLeave = () => { this.mouse.inside = false; };

  onPointerDown = e => {
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) { /* not captureable */ }
    this.touch = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, t: performance.now() };
  };

  onPointerUp = e => {
    const s = this.touch;
    this.touch = null;
    e.currentTarget.style.cursor = 'pointer';
    if (!s) return;
    const dist = Math.hypot(e.clientX - s.x, e.clientY - s.y);
    if (dist < 12 && performance.now() - s.t < 500) this.openOverlay('pageOpen');
  };

  async componentDidMount() {
    // The mount is async; a mount/unmount/mount cycle must not leave the first
    // loop alive.
    const gen = (this.gen = (this.gen || 0) + 1);
    const [T, { createSpace, routePosition, arrival }, { createPost }] = await Promise.all([
      import('three'),
      import('./space/scene.js'),
      import('./space/post.js'),
    ]);
    if (gen !== this.gen) return;
    this.T = T;

    // A node may declare an offset from the route so it does not sit behind the
    // previous destination.
    this.nodes = PROJECTS.map((p, i) => ({
      ...p,
      pos: routePosition(i).map((v, k) => v + (p.offset ? p.offset[k] : 0)),
    }));
    this.about = { ...ABOUT, mailto: `mailto:${ABOUT.email}` };
    this.arrival = (i, from) => arrival(this.nodes, i, from);

    const canvas = this.canvasRef.current;
    const hq = QUALITY === 'high';
    const coarse = matchMedia('(pointer: coarse)').matches;
    const PR = Math.min(devicePixelRatio, hq ? 2 : coarse ? 1 : 1.25);
    const renderer = (this.renderer = new T.WebGLRenderer({
      canvas, antialias: false, powerPreference: 'high-performance',
    }));
    renderer.setPixelRatio(PR);
    renderer.toneMapping = T.NoToneMapping;
    renderer.outputColorSpace = T.LinearSRGBColorSpace;

    const camera = (this.camera = new T.PerspectiveCamera(56, 1, 0.1, 6000));
    const startIdx = Math.max(0, this.nodes.findIndex(n => n.id === location.hash.slice(1)));
    if (startIdx) this.setState({ idx: startIdx, cardIdx: startIdx });
    const start = (this.landing = this.arrival(startIdx));
    camera.position.copy(start.pos);
    this.baseQ = start.quat.clone();
    camera.quaternion.copy(this.baseQ);

    const space = (this.space = createSpace(renderer, { hq, PR, nodes: this.nodes }));
    const post = (this.post = createPost(renderer));
    this.setState({ ready: true });

    // input
    this.onHash = () => {
      const i = this.nodes.findIndex(n => n.id === location.hash.slice(1));
      if (i >= 0 && i !== this.state.idx) this.jumpTo(i);
    };
    window.addEventListener('hashchange', this.onHash);

    this.onKey = e => {
      const k = e.key;
      if (k === 'Escape') return this.closeOverlay();
      if (this.state.aboutOpen) return;
      if (k === 'Enter' || k === ' ') { e.preventDefault(); this.openOverlay('pageOpen'); }
    };
    // No travel while the fullscreen nudge is up, and none in the first moment
    // after landing (the nudge appears shortly after), so a stray scroll on
    // arrival can't warp away before the visitor has seen where they are.
    this.landLock = performance.now() + 1500;
    this.onWheel = e => {
      const now = performance.now();
      if (this.busy || this.nudgeUp || now < this.landLock || now < this.wheelLock || Math.abs(e.deltaY) < 8) return;
      this.wheelLock = now + 900;
      this.step(e.deltaY > 0 ? 1 : -1);
    };
    this.onFirst = () => {
      if (this.state.soundOn) this.setAmbience(true);
      this.firstEvents.forEach(t => window.removeEventListener(t, this.onFirst));
    };
    this.firstEvents = ['pointerdown', 'keydown', 'wheel'];
    window.addEventListener('keydown', this.onKey);
    canvas.addEventListener('wheel', this.onWheel, { passive: true });
    this.firstEvents.forEach(t => window.addEventListener(t, this.onFirst));

    // resize (cache the canvas rect; never read layout inside the frame loop)
    const fit = (pr = PR, settling = false) => {
      this.rect = canvas.getBoundingClientRect();
      const w = this.rect.width || innerWidth, h = this.rect.height || innerHeight;
      const mob = w < 720;
      if (mob !== this.state.mobile) this.setState({ mobile: mob });
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const W = Math.floor(w * pr), H = Math.floor(h * pr);
      space.setResolution(W, H);
      space.setPixelRatio(pr);
      // The five post buffers (half-float, full resolution) are rebuilt on every
      // size change, and a window drag reports a new size every frame. Rebuild
      // them once the size has settled: the composite samples them by UV, so
      // frames in between still draw correctly at the previous buffer size.
      clearTimeout(this.rtTimer);
      if (settling) this.rtTimer = setTimeout(() => post.resize(W, H), 150);
      else post.resize(W, H);
    };
    fit();

    // frame loop
    const clock = new T.Clock();
    const prevPos = camera.position.clone();
    const vel = new T.Vector3(), drift = new T.Vector3();
    const offQ = new T.Quaternion(), eul = new T.Euler(), tmp = new T.Vector3();
    const look = { x: 0, y: 0 };
    const UP = new T.Vector3(0, 1, 0), center = new T.Vector3(), off = new T.Vector3();
    const right = new T.Vector3(), target = new T.Vector3(), lookM = new T.Matrix4();
    const ndc = new T.Vector2();
    let labelShown = null;

    const frame = () => {
      const cap = this.cap;
      const raw = Math.min(clock.getDelta(), 0.05);
      const dt = cap ? cap.dt : (this.dtS = this.dtS == null ? raw : this.dtS + (raw - this.dtS) * 0.12);
      const time = (this.simTime = (this.simTime || 0) + dt);
      const w = this.warp, S = this.state;
      const overlay = S.pageOpen || S.aboutOpen, sh = space.shared;

      if (w) {
        w.t = Math.min(1, w.t + dt / w.dur);
        const s = easeWarp(w.t), u = 1 - s;
        camera.position.set(0, 0, 0)
          .addScaledVector(w.fromP, u * u * u)
          .addScaledVector(w.c1, 3 * u * u * s)
          .addScaledVector(w.c2, 3 * u * s * s)
          .addScaledVector(w.toP, s * s * s);
        this.baseQ.slerpQuaternions(w.fromQ, w.toQ, s);
        if (w.t >= 1) {
          this.warp = null;
          this.setState({ cardIdx: w.i });
          history.replaceState(null, '', `#${this.nodes[w.i].id}`);
        }
      } else {
        this.arrived = Math.min(1, this.arrived + dt * 0.8);
        const o = this.orbit, k = Math.min(1, dt * 8);
        o.yaw += (o.tYaw - o.yaw) * k;
        o.pitch += (o.tPitch - o.pitch) * k;
        if (Math.abs(o.yaw) + Math.abs(o.pitch) > 1e-4) {
          const n = this.nodes[S.idx], a = this.landing;
          center.set(...n.pos);
          target.set(n.pos[0], n.pos[1] - 17, n.pos[2]);
          off.copy(a.pos).sub(center);
          right.crossVectors(UP, off).normalize();
          off.applyAxisAngle(right, o.pitch).applyAxisAngle(UP, o.yaw);
          camera.position.copy(center).add(off);
          this.baseQ.setFromRotationMatrix(lookM.lookAt(camera.position, target, UP));
        }
      }

      vel.copy(camera.position).sub(prevPos).divideScalar(Math.max(dt, 1e-3));
      prevPos.copy(camera.position);
      if (!w) vel.set(0, 0, 0);
      this.speedNorm += (Math.min(1, vel.length() / 1400) - this.speedNorm) * Math.min(1, dt * 6);
      const sn = this.speedNorm;

      // camera: base orientation + mouse look + idle drift
      look.x += (this.mouse.x - look.x) * dt * 2.5;
      look.y += (this.mouse.y - look.y) * dt * 2.5;
      const amt = cap ? 0 : overlay ? 0.012 : 0.045, sway = cap ? 0 : 0.004;
      offQ.setFromEuler(eul.set(
        -look.y * amt + Math.sin(time * 0.23) * sway,
        -look.x * amt + Math.cos(time * 0.17) * sway,
        Math.sin(time * 0.11) * sway * 0.75,
        'YXZ',
      ));
      camera.quaternion.copy(this.baseQ).multiply(offQ);
      camera.fov = 56 + sn * 9;
      camera.updateProjectionMatrix();

      // Idle drift eases out and in; cutting it dead at warp start moved the
      // camera by a unit and read as a shake.
      this.driftK += (((w || cap) ? 0 : smooth01(this.arrived)) - this.driftK) * Math.min(1, dt * 2.5);
      drift.set(
        Math.sin(time * 0.31) * 0.9,
        Math.sin(time * 0.21) * 0.6,
        Math.cos(time * 0.17) * 0.5,
      ).multiplyScalar(this.driftK);

      // shader inputs
      const bT = S.aboutOpen ? 1 : 0;
      this.burst += (bT - this.burst) * Math.min(1, dt * (bT ? 2.2 : 1.6));
      sh.uMouse.value.x += (this.mouse.x - sh.uMouse.value.x) * Math.min(1, dt * 7);
      sh.uMouse.value.y += (-this.mouse.y - sh.uMouse.value.y) * Math.min(1, dt * 7);
      sh.uPush.value += ((w || cap || overlay || this.touch || !this.mouse.inside ? 0 : 1) - sh.uPush.value) * Math.min(1, dt * 3);
      sh.uCam.value.copy(camera.position);
      sh.uVel.value.copy(vel);
      sh.uFocus.value = 84 + sn * 300;
      sh.uSpeed.value = sn;
      space.update(time, camera, smooth01(this.burst));
      space.setOrbit(this.orbit.yaw, this.orbit.pitch);
      space.hover(camera, ndc.set(this.mouse.x, -this.mouse.y), this.mouse.inside && !w && !overlay, dt);

      // Arrival card: anchored below the galaxy. DOM writes only when values change.
      const lb = this.labelRef.current, n = this.nodes[S.cardIdx];
      if (lb && n && this.rect) {
        const show = !w && !overlay && this.arrived > 0.4;
        // Anchor a fixed share of the viewport below the object's centre — the
        // same for a galaxy, the black hole and the sun, so the card sits at one
        // height across destinations. (Hanging it under the galaxy's world
        // radius put it far lower for the edge-on galaxies than for the others.)
        tmp.set(n.pos[0], n.pos[1], n.pos[2]).project(camera);
        if (show && tmp.z < 1) {
          lb.style.left = `${((tmp.x * 0.5 + 0.5) * this.rect.width).toFixed(1)}px`;
          lb.style.top = `${Math.min(
            this.rect.height - 300,
            Math.max(this.rect.height * 0.4, (-tmp.y * 0.5 + 0.5) * this.rect.height + this.rect.height * 0.19),
          ).toFixed(1)}px`;
        }
        if (show !== labelShown) {
          labelShown = show;
          lb.style.transition = show
            ? 'opacity .7s ease, transform .7s ease'
            : 'opacity .12s ease, transform .12s ease';
          lb.style.opacity = show ? '1' : '0';
          lb.style.transform = `translateX(-50%) translateY(${show ? 0 : 18}px)`;
        }
      }

      // render
      camera.position.add(drift);
      post.render(space.scene, camera, {
        time,
        bloom: BLOOM * (1 + sn * 0.6 + Math.sin(Math.PI * this.burst) * 0.9),
        warp: sn * 0.45,
        dim: overlay ? 0.25 : 0,
        grain: cap ? 0 : 0.03,
        hole: space.holeScreen(camera),
      });
      camera.position.sub(drift);
    };

    const loop = () => {
      if (gen !== this.gen) return;
      this.raf = requestAnimationFrame(loop);
      frame();
    };
    loop();

    // Resize observers run after this frame's rAF callback and before paint.
    // Resizing the drawing buffer clears it, so without an immediate redraw the
    // browser paints a black frame on every resize event — a flicker while the
    // window edge is dragged. Fit, then draw again before the paint.
    this.ro = new ResizeObserver(() => { fit(PR, true); frame(); });
    this.ro.observe(canvas);

    if (import.meta.env.DEV) {
      // Still/sequence capture used to produce the PDF teaser and the GIF:
      // pauses the live loop and advances the scene by a fixed dt per call.
      window.galaxy = {
        capture: (dt = 0, scale = 1) => {
          if (!this.cap) cancelAnimationFrame(this.raf);
          this.cap = { dt };
          if (scale !== 1) fit(PR * scale);
          frame();
          return canvas.toDataURL('image/png');
        },
        resume: () => { if (this.cap) { this.cap = null; fit(); clock.getDelta(); loop(); } },
        jumpTo: i => this.jumpTo(i),
      };
    }
  }

  componentWillUnmount() {
    this.gen = (this.gen || 0) + 1;
    cancelAnimationFrame(this.raf);
    clearTimeout(this.rtTimer);
    this.ro && this.ro.disconnect();
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('hashchange', this.onHash);
    this.canvasRef.current && this.canvasRef.current.removeEventListener('wheel', this.onWheel);
    (this.firstEvents || []).forEach(t => window.removeEventListener(t, this.onFirst));
    this.space && this.space.dispose();
    this.post && this.post.dispose();
    this.renderer && this.renderer.dispose();
    if (this._audio) {
      this._audio.amb && this._audio.amb.stop();
      this._audio.A.close();
    }
  }

  render() {
    const { idx, cardIdx, pageOpen, aboutOpen, soundOn, ready, mobile } = this.state;
    const N = this.nodes.length;
    const overlayOpen = pageOpen || aboutOpen;
    const ui = layoutFor(mobile);
    const t = UI_STRINGS;
    const card = this.nodes[cardIdx] || {};
    const active = this.nodes[idx] || {};
    // The HUD fades out as one while a page is open, and stops taking clicks.
    const hud = { opacity: overlayOpen ? 0 : 1, pointerEvents: overlayOpen ? 'none' : 'auto' };

    return (
      <div style={{
        position: 'fixed', inset: 0, background: '#02040a', overflow: 'hidden',
        fontFamily: "'Familjen Grotesk',Helvetica,sans-serif", color: '#eef2f8',
        userSelect: 'none', WebkitFontSmoothing: 'antialiased',
      }}>
        <canvas
          ref={this.canvasRef}
          onPointerMove={this.onPointerMove}
          onPointerLeave={this.onPointerLeave}
          onPointerDown={this.onPointerDown}
          onPointerUp={this.onPointerUp}
          onPointerCancel={this.onPointerUp}
          style={{
            position: 'absolute', touchAction: 'none', inset: 0,
            width: '100%', height: '100%', display: 'block', cursor: 'pointer',
          }}
        />
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: 120,
          background: 'linear-gradient(rgba(2,4,10,.55),rgba(2,4,10,0))', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 300,
          background: 'linear-gradient(rgba(2,4,10,0),rgba(2,4,10,.75))', pointerEvents: 'none',
        }} />

        {ready && (
          <>
            <Hints ui={ui} t={t} opacity={hud.opacity} />

            <ArrivalCard
              ref={this.labelRef}
              ui={ui}
              t={t}
              node={card}
              onOpen={() => this.openOverlay('pageOpen')}
            />

            <NavDock
              ui={ui}
              nodes={this.nodes}
              idx={idx}
              onGo={this.jumpTo}
              {...hud}
            />

            <AboutButton
              ui={ui}
              label={mobile ? t.aboutShort : t.about}
              onClick={() => this.openOverlay('aboutOpen')}
              {...hud}
            />

            {ui.desktop && (
              <SoundButton
                ui={ui}
                on={soundOn}
                label={soundOn ? t.soundOn : t.soundOff}
                onClick={this.toggleSound}
                {...hud}
              />
            )}

            {ui.desktop && <FullscreenNudge t={t} hidden={overlayOpen} onOpenChange={this.setNudgeUp} />}
          </>
        )}

        <Overlay
          ref={this.pageRef}
          ui={ui}
          t={t}
          aboutOpen={aboutOpen}
          pageOpen={pageOpen}
          about={this.about}
          project={active}
          nextTitle={N ? this.nodes[(idx + 1) % N].title : ''}
          onClose={this.closeOverlay}
          onNext={() => this.jumpTo((idx + 1) % N)}
        />
      </div>
    );
  }
}
