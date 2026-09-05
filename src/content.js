// Portfolio content. Edit copy here; the UI reads it.
//
// Per destination:
//   id        · URL hash fragment, also the deep link
//   tint      · accent colour for the nav dot and the galaxy's core glow
//   meta      · scannable header line, joined with "·" (year · role · team · duration)
//   stack     · chips under the tagline
//   github    · optional; hides the "View on GitHub" pill when absent
//   star      · render this destination as a sun instead of a particle galaxy
//   blackhole · render this destination as a black hole instead of a particle galaxy
//   offset    · nudge from the computed route position, so a destination does not
//               sit directly behind the previous one
export const PROJECTS = [
  { id: 'google', meta: ['2025', 'Lead product designer', 'Team of 14', '8 months'], github: 'https://github.com/timohuennebeck/google', kind: 'Project 01', title: 'Google', tint: '#ffb066', tagline: 'Redesigning how a billion people find a place to eat, sleep and go next.', media: 'DROP HERO IMAGE · GOOGLE',
    sections: [
      { text: true, body: 'Local search results looked the same whether you were hunting for a late-night pharmacy or planning a week in Lisbon. I led the design of a result format that adapts to intent: dense and fast when you know what you want, visual and exploratory when you do not.' },
      { stats: true, items: [{ meta: 'Role', title: 'Lead product designer', text: 'Research, interaction design and hand-off with a team of 14 engineers.' }, { meta: 'Outcome', title: '+12% task completion', text: 'Measured across 40 markets in the first quarter after launch.' }, { meta: 'Year', title: '2025', text: 'Eight months from first sketch to global rollout.' }] },
      { text: true, body: 'The hardest part was restraint. Every team wanted a module on the result; the format only worked because it showed three things well instead of ten things badly. We wrote the rules down, and the rules shipped with the pixels.' }],
    stack: [{ title: 'Figma' }, { title: 'User research' }, { title: 'Prototyping' }, { title: 'Design tokens' }, { title: 'A/B testing' }] },
  { id: 'traqa', meta: ['2023 — 2024', 'Founding designer', 'Team of 5', '14 months'], github: 'https://github.com/timohuennebeck/traqa', kind: 'Project 02', title: 'Traqa', tint: '#7fd8ff', tagline: 'A fleet-tracking product for small logistics companies, rebuilt from the dispatcher outward.', media: 'DROP HERO IMAGE · TRAQA',
    sections: [
      { text: true, body: 'Traqa sold GPS hardware and threw in the software for free. Dispatchers hated it. We spent two weeks in dispatch rooms in Hamburg and Rotterdam, then rebuilt the product around the one screen they stare at for nine hours a day.' },
      { stats: true, items: [{ meta: 'Role', title: 'Founding designer', text: 'First design hire. Owned product, brand and the website.' }, { meta: 'Outcome', title: 'Churn −31%', text: 'Twelve months after the new dispatch view shipped.' }, { meta: 'Year', title: '2023 — 2024', text: 'From seed to Series A.' }] },
      { text: true, body: 'Small teams cannot afford design that only lives in mockups. Every component shipped with its own documentation and a working React implementation, so a team of five engineers could move without waiting on me.' }],
    stack: [{ title: 'Figma' }, { title: 'React' }, { title: 'Mapbox' }, { title: 'Storybook' }, { title: 'Field research' }] },
  { id: 'yc', meta: ['2024', 'Design lead', 'W24 batch', '3 months'], github: 'https://github.com/timohuennebeck/yc', kind: 'Project 03', title: 'Y Combinator', tint: '#c8a4ff', tagline: 'Product and brand for a YC-backed team in the W24 batch, from application to demo day.', media: 'DROP HERO IMAGE · Y COMBINATOR',
    sections: [
      { text: true, body: 'Three months, one product, one shot at demo day. I joined the founders for the batch to turn a working prototype into something investors could understand in ninety seconds and customers could use in five minutes.' },
      { stats: true, items: [{ meta: 'Role', title: 'Design lead', text: 'Product, onboarding, pitch materials and the launch site.' }, { meta: 'Outcome', title: '$4.2M seed', text: 'Closed six weeks after demo day.' }, { meta: 'Year', title: '2024', text: 'Winter batch.' }] },
      { text: true, body: 'The deck and the product told the same story with the same words. That consistency is most of what a brand is at this stage, and it is cheaper than a logo.' }],
    stack: [{ title: 'Figma' }, { title: 'Framer' }, { title: 'Next.js' }, { title: 'Pitch design' }] },
  { id: 'project4', meta: ['2026', 'Your role', 'Team size', 'Duration'], github: 'https://github.com/timohuennebeck/project4', kind: 'Project 04', title: 'Project 04', tint: '#9fb8ff', tagline: 'Name the fourth project and I will put it here.', media: 'DROP HERO IMAGE · PROJECT 04',
    sections: [
      { text: true, body: 'A short paragraph introducing the project: what it was, who it was for, and what you were responsible for. Two or three sentences is enough.' },
      { stats: true, items: [{ meta: 'Role', title: 'Your role', text: 'One line on scope.' }, { meta: 'Outcome', title: 'The result', text: 'One measurable outcome.' }, { meta: 'Year', title: '2026', text: 'Timeframe.' }] }],
    stack: [{ title: 'Tool one' }, { title: 'Tool two' }, { title: 'Tool three' }] },
  { id: 'project5', meta: ['2026', 'Your role', 'Team size', 'Duration'], github: 'https://github.com/timohuennebeck/project5', kind: 'Project 05', title: 'Project 05', tint: '#bfe0ff', blackhole: true, tagline: 'Name the fifth project and I will put it here.', media: 'DROP HERO IMAGE · PROJECT 05',
    sections: [
      { text: true, body: 'A short paragraph introducing the project: what it was, who it was for, and what you were responsible for. Two or three sentences is enough.' },
      { stats: true, items: [{ meta: 'Role', title: 'Your role', text: 'One line on scope.' }, { meta: 'Outcome', title: 'The result', text: 'One measurable outcome.' }, { meta: 'Year', title: '2026', text: 'Timeframe.' }] }],
    stack: [{ title: 'Tool one' }, { title: 'Tool two' }, { title: 'Tool three' }] },
  { id: 'project6', meta: ['2026', 'Your role', 'Team size', 'Duration'], github: 'https://github.com/timohuennebeck/project6', kind: 'Project 06', title: 'Project 06', tint: '#ffc46b', star: true, offset: [1500, 620, 500], tagline: 'Name the sixth project and I will put it here.', media: 'DROP HERO IMAGE · PROJECT 06',
    sections: [
      { text: true, body: 'A short paragraph introducing the project: what it was, who it was for, and what you were responsible for. Two or three sentences is enough.' },
      { stats: true, items: [{ meta: 'Role', title: 'Your role', text: 'One line on scope.' }, { meta: 'Outcome', title: 'The result', text: 'One measurable outcome.' }, { meta: 'Year', title: '2026', text: 'Timeframe.' }] }],
    stack: [{ title: 'Tool one' }, { title: 'Tool two' }, { title: 'Tool three' }] },
];

export const ABOUT = {
  name: 'Timo Hünnebeck',
  intro: 'Product designer and creative technologist. I design products people use for hours a day, and I build the prototypes that prove they work before anyone writes production code.',
  detail: 'Nine years across Google, a YC startup and my own studio. Based in Berlin, open to lead and staff roles from 2027, remote or on site.',
  email: 'jantimohuennebeck@gmail.com',
  linkedin: 'https://www.linkedin.com/in/timo-huennebeck',
  twitter: 'https://twitter.com/timohuennebeck',
  toolkit: ['Research', 'Interaction design', 'Design systems', 'Prototyping', 'Motion', 'Figma', 'React', 'Three.js', 'GLSL', 'Swift'].map(title => ({ title })),
};

// UI strings. The app is English only.
export const UI_STRINGS = {
  touchHint: 'Drag to orbit · Tap to open',
  scroll: 'to travel',
  drag: 'to orbit',
  enter: 'to open',
  open: 'Open',
  about: 'About Timo',
  aboutShort: 'About',
  soundOn: 'Sound on',
  soundOff: 'Sound off',
  back: 'Back to space',
  email: 'Email Timo',
  toolkit: 'Toolkit',
  warp: 'Warp to',
};
