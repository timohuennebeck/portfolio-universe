// Portfolio content. Edit copy here; the UI reads it.
//
// Per destination:
//   id        · URL hash fragment, also the deep link
//   kind      · the small tag on the arrival card — client work (at Horizon Alpha)
//               or an independent project, and its number in that set
//   tint      · accent colour for the nav dot, the galaxy's core glow, every chart,
//               every list number and every [[highlight]] on the page
//   meta      · [type, when, role, team, duration] — rendered as labelled rows
//               under the title (Type / When / Role). Keep the order.
//   media     · optional hero image path (e.g. '/projects/phase6/hero.png');
//               omitted, the page opens straight into the copy
//   stack     · chips under the tagline
//   github    · optional; shortcut for a single GitHub link
//   links     · optional; [{url, label?, icon?}] — one dashed text link each, for
//               anything that isn't a personal repo (App Store, a live site).
//               icon is 'github' or 'external' (default). Overrides `github`.
//   star      · render this destination as a sun instead of a particle galaxy
//   blackhole · render this destination as a black hole instead of a particle galaxy
//   offset    · nudge from the computed route position, so a destination does not
//               sit directly behind the previous one
//
// sections[] entries — each declares exactly one type with `type: true`. In any
// copy, [[double brackets]] highlight a phrase in the project's tint. Keep text
// between two charts; never put one chart directly after another (a list
// counts as text — it opens and closes with a sentence).
//   { text: true, body }                        · a paragraph
//   { list: true, lead?, items: [..], after? }  · numbered points between two sentences
//   { numbers: true, body }                     · one big sentence; each [[figure]] takes the
//                                                 next colour, a ★ inside a figure becomes
//                                                 the rounded star
//   { funnel: true, title, note?, tabs: [{label, steps: [{label, pct, count?}]}] }
//       · columns with the hatched drop-off; `steps` instead of `tabs` for a single funnel,
//         `independent: true` makes each column its own share of 100 (a rate before/after),
//         `reachedLabel` / `droppedLabel` rename the legend
//   { rating: true, title, note?, value, outOf?, caption?, label?,
//     distribution?: [pct5,pct4,pct3,pct2,pct1] }
//       · the App Store rating and its breakdown; place it after the outcome,
//         not before the story
//   { quote: true, stars, line, source? }
//       · one review, centred, as the page's last word — after the closing
//         paragraph, never directly under the rating
//   { waffle: true, title, note?, items: [{label, value, pct, color?}] }
//       · 100 squares coloured by share (fixed colours per item, not the tint)
export const PROJECTS = [
  { id: 'phase6', meta: ['Client work · Horizon Alpha', '2025', 'Frontend Developer', 'Team of 3', '5 weeks'], kind: 'Client work · 01', title: 'Phase6', tint: '#ffb066', tagline: 'Building the analytics Phase6 didn\'t have, finding the one screen where teachers gave up, and shipping the fix that took registrations from 10% to 18%.',
    sections: [
      { text: true, body: 'Phase6 is a vocabulary-learning platform used by over a million students in Germany. Teachers can build a test through an anonymous flow that needs no account — but [[nobody could say how many people who started ever finished]]. There was no analytics on the flow at all.' },
      { text: true, body: 'Nobody asked me to fix this — I proposed introducing Amplitude after noticing we kept changing the anonymous flow on assumptions, not evidence. Over about two weeks I mapped every step from starting a test to saving it into a [[proper event taxonomy]], instrumented it, and built the funnels to see where the flow actually broke down.' },
      // Percentages only, on purpose: the absolute counts behind them are Phase6's traffic figures.
      { funnel: true, title: 'Test creation: before and after', note: 'The share of anonymous users still in the flow at each step. The step that mattered — registering to keep the test you just built — went from one in ten to close to one in five.', tabs: [
        { label: 'Before the redesign', steps: [
          { label: 'Test creation started', pct: 100 },
          { label: 'Save prompt shown', pct: 47.66 },
          { label: 'Registered to save', pct: 10.29 },
        ] },
        { label: 'After the redesign', steps: [
          { label: 'Test creation started', pct: 100 },
          { label: 'Save prompt shown', pct: 47.66 },
          { label: 'Registered to save', pct: 18 },
        ] },
      ] },
      { text: true, body: 'The data pointed at one screen — the point where an anonymous user is asked to [[create an account just to keep the test they had already built]]. Before, that prompt sent people away to a separate page to log in or register, and a new account then had to get through a multi-question onboarding before it ever saw the app again. Two weeks of back and forth with our UI/UX designer, every round checked against the funnel rather than opinion, ended in something much smaller: [[a popup asking for an email, one click on sign up, and you are in the app with your test saved]] — no detour, no onboarding. The redesign itself took a single afternoon to implement, and the share of people who registered to keep their test went from [[10% to 18%]].' },
      { rating: true, title: 'Testimonials', note: 'The product this flow belongs to, as the German App Store rates it.', value: 4.5, caption: 'Over 82,000 ratings on the German App Store.', distribution: [72, 16, 6, 2, 5] },
      { text: true, body: 'That ratio — weeks of instrumenting and arguing, an afternoon of building — is the part of this project I\'d point to. The fix was small. [[Knowing which small fix to make was the actual work.]]' },
      { quote: true, stars: 5, line: 'You just pick your school book and it builds your exercises — that\'s simply so much better than all the other apps.', source: 'App Store review, April 2026. Translated from German.' },
    ],
    stack: [{ title: 'React' }, { title: 'TypeScript' }, { title: 'Astro' }, { title: 'Amplitude' }, { title: 'GitLab CI' }] },
  { id: 'unload', meta: ['Independent project', '2023 — 2024', 'Founder', 'Team of 1', '20 months'], github: 'https://github.com/timohuennebeck/unload-mobile-app', kind: 'Independent · 01', title: 'Unload', tint: '#ff5f6d', blackhole: true, tagline: 'An accountability app for teenagers, built on groups instead of streaks — 12,000 sign-ups, a viral launch, and a clear-eyed decision to shut it down.',
    sections: [
      { text: true, body: 'Unload was an iOS app for 14-to-20-year-olds trying to break a compulsive habit. The insight behind it: the moment someone is about to relapse is not a moment for a lecture or a chart — [[it\'s a moment they need another person]]. So instead of a solo streak counter, Unload put people into small accountability groups. With nobody else on it, that meant the marketing and the support as much as the code.' },
      { numbers: true, body: 'Over twenty months, [[12,000+]] people signed up, [[about 800]] opened the app every month, and they rated it [[4.6★]] across more than 50 ratings. Subscriptions brought in up to [[€280]] a month at their peak.' },
      { text: true, body: 'A queue matched each new user into a fixed group of two to four with real-time chat, and the group shared one streak: [[if anyone relapsed, everyone\'s counter reset]]. That sounds harsh, and it was the point — it turned a private failure into something you owed the group, which is exactly the pressure that helps at 2 a.m. Alongside the groups sat a 365-day audio course in five languages (German, English, Spanish, French, Portuguese), built on CBT principles, walking people from day zero through understanding what actually triggers their urges.' },
      // TODO: distribution is a placeholder — the real split is in App Store Connect › Ratings
      { rating: true, title: 'Testimonials', note: 'The App Store rating over the app\'s twenty months — it\'s no longer listed, so this is where it ended.', value: 4.6, caption: 'Over 50 ratings on the App Store.', distribution: [71, 18, 6, 2, 3] },
      { text: true, body: 'The launch was an accident of timing. A few TikToks about the idea went viral — 50,000 to 200,000 views each — and one of them took off before the app existed. I had a waitlist and a window, so I finished the build in a few days to catch the momentum: [[almost 500 sign-ups on launch day]], then a steady 40–50 a day after that. It was the clearest lesson I\'ve had that [[distribution, not code, is the hard part of a product]].' },
      { text: true, body: 'I sunset it deliberately. Without ongoing marketing, growth tapered; revenue slid from a peak of about €280 a month to around €120 against roughly €50 in fixed costs for hosting and the App Store, plus the customer support a live product needs. An Android version was the most requested thing — a few hundred people on a waitlist for it — and would probably have moved the numbers meaningfully, but building and running it alone on top of a full-time job wasn\'t realistic. [[Shutting a working product down on the numbers was the right call]], and a harder one than launching.' },
      { waffle: true, title: 'Where €280 comes from', note: 'A waffle of 100 squares, each 1% of monthly revenue at the peak, coloured by plan. Composition without a pie.', items: [
        { label: 'Annual plan', value: '€174', pct: 62 },
        { label: 'Monthly plan', value: '€78', pct: 28 },
        { label: 'One-time purchases', value: '€28', pct: 10 },
      ] },
      { list: true, lead: 'What I\'d do differently is mostly about [[what I couldn\'t see]].', items: [
        'I had PostHog wired in from early on, but [[I never mapped the actual flows]] — so for all that data I couldn\'t say where people dropped off, who was actually using the app, or which features earned their place.',
        'With no crash reporting, [[the only bugs I fixed were the ones someone bothered to tell me about]].',
      ], after: 'Both gaps are the reason the first thing I pushed for later, on a product with a million users, was [[proper funnels and error tracking before anything else]].' },
    ],
    stack: [{ title: 'React Native' }, { title: 'Expo' }, { title: 'TypeScript' }, { title: 'Supabase' }, { title: 'Supabase Realtime' }, { title: 'PostgreSQL' }, { title: 'PostHog' }, { title: 'RevenueCat' }] },
  { id: 'blaulichtschule', meta: ['Client work · Horizon Alpha', '2023', 'React Native Developer', 'Team of 4', '6 months'], kind: 'Client work · 02', title: 'Blaulichtschule', tint: '#5b8cff', tagline: 'Inheriting a codebase nobody could safely touch, and rewriting it from the ground up — no AI, just four people and React Native.',
    sections: [
      { text: true, body: 'Blaulichtschule is a criminal-law exam-prep app for German police trainees — real case studies, head-to-head quizzes, and content built with practicing lawyers. We took it over from the previous development team, and the codebase we inherited was close to unworkable: [[no reusable components, layout done with absolute positioning throughout]], no one able to say with confidence what a given screen actually depended on.' },
      { text: true, body: 'Adding anything new meant fighting the existing code more than writing new code, so as a team of four we [[rewrote the whole app in React Native with TypeScript from scratch]] — this was early 2023, before AI assistants were part of anyone\'s workflow, so it was four people and a lot of hours. We went [[screen by screen]]: rebuild one screen completely, get it to parity with the old one, and only then open its bug list — no half-migrated screens, and no time spent fixing code that was about to be deleted. The rewrite itself took about two to three months, inside six months on the project, and we worked directly with the client throughout in a genuinely agile setup: it was normal to ship a hotfix late on a Friday because that\'s when the client found the bug.' },
      { text: true, body: 'The rewrite showed up in Bugsnag too: [[stability went from 82% to 91%]] — the share of sessions that ended without a crash.' },
      { funnel: true, independent: true, title: 'Fewer crashes', note: 'Bugsnag\'s stability score: the solid part is sessions that ended without a crash, the hatched part is the ones that didn\'t. Nine points sounds small — it\'s the difference between a crash in roughly one session in six and one in eleven.', reachedLabel: 'Sessions without a crash', droppedLabel: 'Crashed', steps: [
        { label: 'Before the rewrite', pct: 82 },
        { label: 'After the rewrite', pct: 91 },
      ] },
      { list: true, lead: 'Once the rewrite had shipped, the work split up by area, and [[three of them became my responsibility]] for the rest of my time on the project:', items: [
        'The [[paywall]] — the Premium subscription flow the whole business runs on: the plans, the purchase and restore paths through Apple, and the gate between the free content and everything else. The one screen where a bug costs money directly.',
        'The [[flashcard system]] — the core of how people actually study. Question, answer, reveal, and the part users mention most in their reviews: [[wrong answers are saved automatically]], so you can drill exactly what you got wrong.',
        'The [[live matches]] — Juramatch, where two users go head-to-head on the same law questions in real time, with a nationwide ranking behind it. Real-time state on a mobile app, with the network dropping in and out.',
      ], after: 'None of these were greenfield: each had to keep working for the people already using it while we replaced the code underneath.' },
      { rating: true, title: 'Testimonials', note: 'Three years on, the app we rewrote is the one on the App Store — and the one people are rating.', value: 4.7, caption: '116 ratings on the German App Store.', distribution: [87, 4, 3, 0, 5] },
      { text: true, body: 'What I remember more clearly than the numbers is the discipline it took: with a client this hands-on and a codebase this fragile, "rewrite it properly" and "keep shipping Friday fixes" [[had to happen at the same time]], not one after the other.' },
      { quote: true, stars: 5, line: 'Navigation, load times and the learning areas are especially well thought out — they make the app a real experience.', source: 'App Store review, August 2023 — the month the rewrite was live. Translated from German.' },
    ],
    stack: [{ title: 'React Native' }, { title: 'TypeScript' }, { title: 'Bugsnag' }, { title: 'GitLab CI' }] },
  { id: 'planetpop', meta: ['Client work · Horizon Alpha', '2023 — 2025', 'Frontend Developer', 'Team of 3', 'On and off over 2 years'], kind: 'Client work · 03', title: 'PlanetPop', tint: '#c8a4ff', tagline: 'A learn-English-through-songs web app, built from an empty repo to paid subscriptions — infrastructure included.',
    sections: [
      { text: true, body: 'PlanetPop teaches children English through original songs and videos, and had already built an audience of over 100,000 subscribers on YouTube. The web app didn\'t exist yet: [[we built it from scratch in React Native Web]], and stood up everything behind it too — the Scaleway hosting and the MongoDB database it ran on.' },
      { list: true, lead: 'There was no fixed role on this one; the work was whatever needed shipping next, on and off over two years. What we delivered [[from a blank repository]]:', items: [
        'The [[web app itself]], built from scratch in React Native Web.',
        '[[Subscriptions on Stripe]] — plans, checkout, and the account side of paying.',
        'A series of [[landing pages]] as the marketing changed.',
        'The [[infrastructure]] underneath: Scaleway hosting and the MongoDB database.',
        'A [[mobile app]] from the same codebase — more on that below.',
      ], after: 'Requirements arrived the way they often do with a small, busy client: piecemeal, sometimes as a new ask in reply to a question, which put a premium on [[writing things down and confirming before building]].' },
      { text: true, body: 'The stack was a decision, not a default. We chose React Native Web because a mobile app was part of the plan from the start, and [[one codebase for web and native]] looked like the cheaper way to get both. It was — at first. The mobile app shipped, and was later shut down: the client didn\'t see the return they had expected from it, and keeping it in step with the web build had become a real cost. In hindsight the shared codebase bought us the second platform quickly and then charged for it every month afterwards. If I were choosing again, I\'d ask harder whether the second platform was actually wanted before designing the first one around it.' },
      { text: true, body: 'The honest ending: the product was later wound down. A six-figure YouTube following didn\'t translate into enough paying subscribers, and the company pivoted. That isn\'t a failure of the build — it shipped, it worked, people paid for it — but it\'s a useful reminder that [[a working product and a working business are two different problems]], and engineering only solves the first one.' },
    ],
    stack: [{ title: 'React Native Web' }, { title: 'Stripe' }, { title: 'MongoDB' }, { title: 'Scaleway' }] },
  { id: 'traqa', meta: ['Independent project', '2025', 'Founder', 'Team of 1', '9 months'], github: 'https://github.com/timohuennebeck/running-app', kind: 'Independent · 02', title: 'Traqa', tint: '#8ee6b0', star: true, tagline: 'A running app that adjusts your training plan every week so it doesn\'t injure you — built after a plan that did.',
    sections: [
      { text: true, body: 'Traqa started with a knee. I got into running in 2024 — a first 5K at Munich\'s B2Run, then 10Ks with colleagues, then the decision to skip the half and go straight for a marathon. A popular training app generated a 20-week plan for me, and it was too much for where I was: about six weeks in I had knee pain, and six weeks before race day I had a full runner\'s knee. The plan had adjusted to keep me on schedule for the marathon; [[it never adjusted to keep me healthy]].' },
      { text: true, body: 'So Traqa generates the plan from who you actually are — experience, weekly mileage, days you can run, terrain, injury history, goal — and then asks for a short check-in every week. The plan changes based on that check-in, with [[staying injury-free as the priority rather than the race date]]. Under the hood: an Expo app with an LLM producing multi-week plans, offline-first run tracking with background GPS, retroactive import, and maps.' },
      { list: true, lead: 'Two problems took most of the time.', items: [
        'The model. Running has so many interacting variables that handing the LLM a profile and asking for a plan produced [[confident nonsense]] — a 4 km long run next to an 18 km interval session, plans no human could complete. Getting usable output meant treating the model as an unreliable component to be constrained and checked, not an oracle, and even at launch it wasn\'t fully solved.',
        'Offline-first tracking on iOS. The app has to [[keep recording a run while the OS is actively trying to kill it]] to save battery, keep going with no connectivity at all, and then hold the finished run safely on the device until it has verifiably synced.',
      ] },
      { text: true, body: 'I shut it down in October. Fitness is one of the most crowded app categories there is, and without funding — or the time to market it properly — a solo product in it doesn\'t go anywhere: [[fewer than a hundred people ever used it]], and the TikToks and Instagram posts around it never found traction.' },
      { text: true, body: 'I never ran that marathon. I did run a half — [[1:58]] — on a plan that did exactly what Traqa was built to do: start from where the knee actually was, about five kilometres a week, and build week by week to around thirty-five, adjusting to how it felt. The honest part is where that plan came from. I used Traqa for the first weeks of recovery, and a Claude conversation for the rest. [[The idea was right; the app around it never earned its place]] over a model in a chat window — and that, together with a hard-won respect for offline-first mobile work, is what I keep from it.' },
    ],
    stack: [{ title: 'React Native' }, { title: 'Expo' }, { title: 'TypeScript' }, { title: 'Supabase' }, { title: 'PostgreSQL' }, { title: 'Mapbox' }, { title: 'PostHog' }, { title: 'RevenueCat' }, { title: 'LLM plan generation' }, { title: 'Background GPS' }, { title: 'Offline-first' }] },
];

export const ABOUT = {
  name: 'Timo Hünnebeck',
  role: 'Senior Frontend Developer',
  location: 'Munich',
  github: 'https://github.com/timohuennebeck',
  cv: 'Timo-Huennebeck-CV.pdf', // served from public/, resolved against the site's base path
  intro: 'Frontend developer in Munich — three years of React, Next.js and Expo at Horizon Alpha, trainee to senior, lately on Phase6 and its million users. I came from marketing, so I would rather read a funnel than argue about a screen.',
  detail: 'Two iOS apps of my own, one of them to 12,000 sign-ups. In the space view, the galaxies are client work; the black hole and the sun are mine.',
  email: 'jantimohuennebeck@gmail.com',
  linkedin: 'https://www.linkedin.com/in/timo-huennebeck',
  twitter: 'https://x.com/TimoHuennebeck',
  toolkit: ['TypeScript', 'React', 'React Native', 'Expo', 'Next.js', 'Astro', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Supabase', 'AWS', 'Docker', 'GitLab CI', 'Cypress', 'Sentry', 'Amplitude', 'Claude Code'].map(title => ({ title })),
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
  downloadCv: 'Download CV',
  toolkit: 'Toolkit',
  warp: 'Continue to',
  fullscreenNudge: 'This experience is best in fullscreen.',
  enterFullscreen: 'Enter fullscreen',
  dismiss: 'Dismiss',
};
