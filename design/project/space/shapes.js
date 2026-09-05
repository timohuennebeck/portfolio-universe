// Galaxy shape generators. Each returns [localPosition, relativeRadius 0..1] for one particle.
import * as T from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const gauss = () => (Math.random() + Math.random() + Math.random() + Math.random() - 2) * 0.7;
const TAU = Math.PI * 2;

export const SHAPES = {
  spiral() { const r = Math.pow(Math.random(), 0.55) * 26, arm = Math.random() < .5 ? 0 : Math.PI, a = r * 0.22 + arm + gauss() * 0.4 * (1 + r / 22); return [new T.Vector3(Math.cos(a) * r, gauss() * (1.2 + r * 0.04), Math.sin(a) * r), r / 26]; },
  elliptical() { const v = new T.Vector3(gauss() * 15, gauss() * 8, gauss() * 9); return [v, v.length() / 16]; },
  filament() { const t = Math.random(), a = -1.3 + t * 2.6, w = 1 + Math.pow(Math.random(), 3) * 3.4; const p = new T.Vector3(Math.cos(a) * 15 - 11.5, Math.sin(a) * 15 + 5, 0); return [p.add(new T.Vector3(gauss() * w, gauss() * w, gauss() * w * 1.5)), Math.abs(t - 0.5) * 2]; },
  edgeOn() { const x = gauss() * 26; return [new T.Vector3(x, gauss() * (1 + Math.max(0, 6 - Math.abs(x)) * 0.35), gauss() * 4), Math.abs(x) / 26]; },
  irregular() { const k = Math.floor(Math.random() * 3), cx = [-12, 6, 10][k], cz = [4, -9, 8][k], cy = [2, -3, 4][k], sc = [7, 5, 6][k]; return [new T.Vector3(cx + gauss() * sc, cy + gauss() * sc * 0.6, cz + gauss() * sc), 0.5 + Math.random() * 0.5]; },
  globular() { const r = Math.pow(Math.random(), 1.6) * 11, th = Math.random() * TAU, u = Math.random() * 2 - 1, q = Math.sqrt(1 - u * u); return [new T.Vector3(r * q * Math.cos(th), r * u, r * q * Math.sin(th)), r / 11]; },
  barred() { if (Math.random() < 0.28) { const x = gauss() * 9; return [new T.Vector3(x, gauss() * 1.4, gauss() * 2.2), Math.abs(x) / 12]; } const r = 6 + Math.pow(Math.random(), 0.7) * 20, arm = Math.random() < .5 ? 0 : Math.PI, a = r * 0.3 + arm + gauss() * 0.3; return [new T.Vector3(Math.cos(a) * r, gauss() * 1.5, Math.sin(a) * r), r / 26]; },
  ring() { const a = Math.random() * TAU, r = 18 + gauss() * 2.4; return [new T.Vector3(Math.cos(a) * r, gauss() * 1.4, Math.sin(a) * r), 0.85]; },
};

// Order in which destinations receive shapes
export const SHAPE_ORDER = ['spiral', 'elliptical', 'filament', 'edgeOn', 'irregular', 'globular', 'barred', 'ring'];
export const shapeFor = i => SHAPES[SHAPE_ORDER[i % SHAPE_ORDER.length]];
