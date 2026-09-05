// Scene knobs. These were the design tool's live-tweakable props; they are
// build-time constants here.

// Ambience voice: 'drone' | 'wind' | 'pulsar' | 'choir'
export const AMBIENCE = 'drone';

// 'balanced' halves the particle counts and caps the pixel ratio at 1.25;
// 'high' doubles the star field and allows a pixel ratio of 2.
export const QUALITY = 'balanced';

// Bloom multiplier applied on top of the speed- and burst-driven boost. 0–2.5.
export const BLOOM = 1;
