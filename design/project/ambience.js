// Generative space audio. createAmbience(ctx, kind) -> { out: GainNode (already connected), stop() }
export function createAmbience(A, kind = 'drone') {
  const out = A.createGain(); out.gain.value = 0; out.connect(A.destination);
  const timers = [], nodes = [];
  const osc = (f, type, g, dest) => { const o = A.createOscillator(); o.type = type; o.frequency.value = f; const og = A.createGain(); og.gain.value = g; o.connect(og); og.connect(dest); o.start(); nodes.push(o); return { o, og }; };
  const lfo = (f, amt, param) => { const l = A.createOscillator(); l.frequency.value = f; const lg = A.createGain(); lg.gain.value = amt; l.connect(lg); lg.connect(param); l.start(); nodes.push(l); return l; };
  const noise = (dest) => { const b = A.createBuffer(1, A.sampleRate * 4, A.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = A.createBufferSource(); s.buffer = b; s.loop = true; s.connect(dest); s.start(); nodes.push(s); return s; };
  const filt = (type, f, q, dest) => { const x = A.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q; x.connect(dest); return x; };
  if (kind === 'wind') {
    for (let i = 0; i < 3; i++) { const g = A.createGain(); g.gain.value = 0.09; g.connect(out); const bp = filt('bandpass', 300 + i * 260, 1.6, g); noise(bp); lfo(0.05 + i * 0.023, 220 + i * 120, bp.frequency); lfo(0.031 + i * 0.017, 0.05, g.gain); }
    osc(41, 'sine', 0.35, out); const sub = osc(61.7, 'sine', 0.12, out); lfo(0.09, 2, sub.o.frequency);
  } else if (kind === 'pulsar') {
    const lp = filt('lowpass', 500, 0.7, out); [[65.4, .45], [98, .25], [130.8, .12]].forEach(([f, g]) => { const v = osc(f, 'sine', g, lp); lfo(0.06 + Math.random() * 0.05, f * 0.003, v.o.frequency); });
    const ng = A.createGain(); ng.gain.value = 0.02; ng.connect(out); noise(filt('bandpass', 900, 0.8, ng));
    const ping = () => { const t = A.currentTime; const o = A.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(880, t); o.frequency.exponentialRampToValueAtTime(660, t + 1.2); const g = A.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0005, t + 1.6); o.connect(g); g.connect(out); o.start(t); o.stop(t + 1.7); };
    ping(); timers.push(setInterval(ping, 2600));
  } else if (kind === 'choir') {
    const lp = filt('lowpass', 1400, 0.5, out); lfo(0.04, 500, lp.frequency);
    [220, 261.6, 329.6, 440, 493.9, 110].forEach((f, i) => { const v = osc(f * (1 + (Math.random() - .5) * 0.004), 'sine', i === 5 ? 0.3 : 0.11, lp); lfo(0.11 + i * 0.03, f * 0.0035, v.o.frequency); lfo(0.05 + i * 0.013, 0.04, v.og.gain); });
    const ng = A.createGain(); ng.gain.value = 0.012; ng.connect(out); noise(filt('highpass', 2500, 0.5, ng));
  } else {
    const lp = filt('lowpass', 420, 0.6, out); lfo(0.045, 180, lp.frequency);
    [[55, 'sine', .5], [82.41, 'sine', .32], [110, 'triangle', .14], [164.81, 'sine', .1], [55.3, 'sine', .3]].forEach(([f, type, g]) => { const v = osc(f, type, g, lp); lfo(0.07 + Math.random() * 0.08, f * 0.004, v.o.frequency); });
    const ng = A.createGain(); ng.gain.value = 0.035; ng.connect(out); noise(filt('bandpass', 600, 0.5, ng));
  }
  return { out, stop() { timers.forEach(clearInterval); nodes.forEach(n => { try { n.stop(); } catch (e) {} }); out.disconnect(); } };
}

// Warp whoosh: filtered noise sweep + rising tone, lasting `dur` seconds
export function playWarp(A, dur = 3) {
  const t = A.currentTime, peak = t + dur * 0.45, end = t + dur;
  const b = A.createBuffer(1, A.sampleRate * (dur + 0.5), A.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = A.createBufferSource(); s.buffer = b; const bp = A.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.1;
  bp.frequency.setValueAtTime(140, t); bp.frequency.exponentialRampToValueAtTime(2600, peak); bp.frequency.exponentialRampToValueAtTime(180, end);
  const g = A.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, peak); g.gain.exponentialRampToValueAtTime(0.0001, end);
  s.connect(bp); bp.connect(g); g.connect(A.destination); s.start(t); s.stop(end + 0.1);
  const o = A.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(420, peak); o.frequency.exponentialRampToValueAtTime(60, end);
  const og = A.createGain(); og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(0.08, peak); og.gain.exponentialRampToValueAtTime(0.0001, end);
  o.connect(og); og.connect(A.destination); o.start(t); o.stop(end + 0.1);
}
