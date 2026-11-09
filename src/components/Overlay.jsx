import React, { forwardRef } from 'react';
import { MONO, LangSwitch } from './Hud.jsx';
import portraitSrc from '../assets/portrait.jpg';

const RISE = 'gpRise .9s cubic-bezier(.2,.8,.2,1) both';
const riseAfter = delay => `gpRise .9s ${delay} cubic-bezier(.2,.8,.2,1) both`;

const PAGE = { width: '100%', maxWidth: 840, display: 'flex', flexDirection: 'column' };
const PANEL = {
  borderRadius: 20, border: '1px solid rgba(255,255,255,.12)',
  background: 'linear-gradient(160deg,rgba(255,255,255,.05),rgba(255,255,255,.015))',
};
const CHIP = {
  fontSize: 14, padding: '10px 18px', borderRadius: 999,
  border: '1px solid rgba(255,255,255,.14)', color: '#eef2f8', background: 'rgba(255,255,255,.03)',
};
const CHIP_SMALL = { ...CHIP, fontSize: 13, padding: '8px 14px' };
const HEADING = { fontSize: 22, fontWeight: 500, letterSpacing: '-.01em' };

/** Pill chips — the toolkit on the About page, or (`small`) a project's stack. */
function Chips({ items, small = false }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: small ? 8 : 10 }}>
      {items.map((it, i) => <span key={i} style={small ? CHIP_SMALL : CHIP}>{it.title}</span>)}
    </div>
  );
}

/** The header facts as labelled rows instead of a dot-separated line — the
    first row says whether this was client work or an independent project,
    which is the one thing a dot-separated line lets people skim past. */
function Facts({ meta, tint, t }) {
  const [type, when, role, team, duration] = meta;
  // English writes the team in lower case after the role ("Founder, just me"); German nouns keep theirs
  const teamText = team && (/^team of 1$/i.test(team) ? t.justMe : t.lowerTeam ? team.toLowerCase() : team);
  const rows = [
    [t.factType, type, true],
    [t.factWhen, [when, duration].filter(Boolean).join(' · ')],
    [t.factRole, [role, teamText].filter(Boolean).join(', ')],
  ].filter(r => r[1]);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '9px 24px', fontSize: 15, maxWidth: 520 }}>
      {rows.map(([k, v, hi]) => (
        <React.Fragment key={k}>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(238,242,248,.45)', paddingTop: 3 }}>{k}</span>
          <span style={{ color: hi ? tint : 'rgba(238,242,248,.86)', fontWeight: hi ? 500 : 400 }}>{v}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

const isImagePath = src => typeof src === 'string' && /\.(png|jpe?g|gif|webp|svg)$/i.test(src);

const LINK_ICONS = {
  github: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.13v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  ),
  external: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eef2f8" style={{ opacity: .7 }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  ),
  // stroked in the solid ink and dimmed as a whole, so the crossings of the
  // meridian and the circle can't paint twice and turn brighter
  globe: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#eef2f8" style={{ opacity: .7 }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

/** External links (GitHub, App Store, a live site — anything worth pointing
    at), as plain dashed text links with an icon — the same treatment as the
    LinkedIn link on the About page, and deliberately not a pill, so they
    can't be mistaken for the stack chips above. A GitHub link shows its
    repo path ("timohuennebeck/running-app") rather than a generic label.
    `project.github` still works on its own; `project.links` can hold more
    (icon 'github', 'globe' for a live site, or 'external'). */
function LinkRow({ project, t }) {
  const all = project.links || (project.github ? [{ url: project.github, icon: 'github' }] : []);
  const stores = all.filter(l => l.store), links = all.filter(l => !l.store);
  if (!all.length) return null;
  const text = l => l.label || (l.icon === 'github' ? l.url.replace(/^https?:\/\/(www\.)?github\.com\//, '') : l.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''));
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 26px', paddingTop: 2 }}>
      {stores.map((l, i) => <StoreBadge key={`s${i}`} link={l} t={t} />)}
      {links.map((l, i) => (
        <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="gp-dashed" style={{
          display: 'inline-flex', gap: 10, alignItems: 'center', fontSize: 15,
          color: 'rgba(238,242,248,.7)', textDecoration: 'none', transition: 'color .3s',
        }}>
          {LINK_ICONS[l.icon] || LINK_ICONS.external}
          <span style={{ borderBottom: '1px dashed rgba(238,242,248,.35)', paddingBottom: 2 }}>{text(l)}</span>
        </a>
      ))}
    </div>
  );
}

/** A store badge in the stores' own format (black, grey hairline, the logo,
    a small line over the store's name), worded in the page's language. A link
    with `soon` isn't live yet: the badge is dimmed, not a link, and carries a
    "coming soon" tag. */
const APPLE_LOGO = 'M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z';
const STORE_LOGOS = {
  apple: <svg width="22" height="26" viewBox="0 0 384 512" fill="#fff" aria-hidden="true"><path d={APPLE_LOGO} /></svg>,
  google: (
    <svg width="22" height="24" viewBox="0 0 22 24" aria-hidden="true">
      <path d="M1 .8 12 12 1 23.2c-.4-.2-.6-.7-.6-1.2V2c0-.5.2-1 .6-1.2z" fill="#4285f4" />
      <path d="M1 .8c.4-.2.9-.2 1.4.1l13.2 7.5L12 12z" fill="#34a853" />
      <path d="M1 23.2 12 12l3.6 3.6-13.2 7.5c-.5.3-1 .3-1.4.1z" fill="#ea4335" />
      <path d="m15.6 8.4 4.4 2.5c.9.5.9 1.7 0 2.2l-4.4 2.5L12 12z" fill="#fbbc04" />
    </svg>
  ),
};
function StoreBadge({ link, t }) {
  const [top, name] = link.store === 'apple' ? [t.appStoreTop, 'App Store'] : [t.playTop, 'Google Play'];
  const badge = {
    display: 'inline-flex', alignItems: 'center', gap: 10, height: 48, padding: '0 18px 0 13px',
    background: '#000', color: '#fff', border: '1px solid #a6a6a6', borderRadius: 10, textDecoration: 'none',
  };
  const inner = (
    <>
      {STORE_LOGOS[link.store]}
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1 }}>
        <span style={{ fontSize: link.store === 'google' ? 9.5 : 10.5, letterSpacing: link.store === 'google' ? '.06em' : '.01em', textTransform: link.store === 'google' ? 'uppercase' : 'none' }}>{top}</span>
        <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-.02em' }}>{name}</span>
      </span>
    </>
  );
  if (link.soon) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }} aria-label={`${name} · ${t.soon}`}>
        <span style={{ ...badge, opacity: .4, filter: 'grayscale(.6)' }} aria-hidden="true">{inner}</span>
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(238,242,248,.55)' }}>{t.soon}</span>
      </span>
    );
  }
  return <a href={link.url} target="_blank" rel="noopener noreferrer" className="gp-badge" aria-label={`${top} ${name}`} style={badge}>{inner}</a>;
}

/** The optional hero image, in the same inset frame as the portrait: a
    bordered card with the photo sitting inside it. Only rendered when a
    project's `media` points at an image file. */
function HeroImage({ src, alt, height, style }) {
  return (
    <div style={{ ...PANEL, padding: 18, overflow: 'hidden', display: 'flex', height, ...style }}>
      <img src={src} alt={alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, display: 'block' }} />
    </div>
  );
}

/** App Store screens (headline over a phone, transparent around it) as a row
    straight on the page, no frame. The row scrolls sideways and snaps to each
    screen; the next one peeks in at the edge so it reads as scrollable. Each
    side fades out while there is more to scroll that way, and on desktop a
    chevron on that side steps one screen along. */
const FADE = 72;
function ScreenStrip({ screens, ui, t, style }) {
  const row = React.useRef(null);
  const [more, setMore] = React.useState({ left: false, right: false });
  const measure = React.useCallback(() => {
    const el = row.current;
    if (!el) return;
    const left = el.scrollLeft > 2, right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
    setMore(m => (m.left === left && m.right === right ? m : { left, right }));
  }, []);
  React.useEffect(() => {
    measure();
    const el = row.current, ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);
  const step = dir => {
    const el = row.current, first = el?.firstElementChild;
    if (!first) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (first.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };
  // the mask fades only the sides that have more to show, so the first and last screens sit flush
  const mask = `linear-gradient(to right, ${more.left ? 'transparent' : '#000'} 0, #000 ${FADE}px, #000 calc(100% - ${FADE}px), ${more.right ? 'transparent' : '#000'} 100%)`;
  const chevron = dir => (
    <button type="button" aria-label={dir < 0 ? t.prevScreen : t.nextScreen} onClick={() => step(dir)} className="gp-quiet" style={{
      position: 'absolute', top: '50%', [dir < 0 ? 'left' : 'right']: 6, transform: 'translateY(-50%)',
      width: 44, height: 44, borderRadius: 999, display: 'grid', placeItems: 'center', cursor: 'pointer',
      border: '1px solid rgba(255,255,255,.16)', background: 'rgba(2,4,10,.6)', color: '#eef2f8',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      opacity: (dir < 0 ? more.left : more.right) ? 1 : 0,
      pointerEvents: (dir < 0 ? more.left : more.right) ? 'auto' : 'none', transition: 'opacity .3s',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={dir < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  );
  return (
    <div style={{ position: 'relative', ...style }}>
      <div ref={row} onScroll={measure} style={{
        display: 'flex', gap: ui.desktop ? 8 : 6, overflowX: 'auto', scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', maskImage: mask, WebkitMaskImage: mask,
      }}>
        {screens.map((s, i) => (
          <img key={i} src={s.src} alt={s.alt || ''} loading={i < 4 ? 'eager' : 'lazy'} draggable={false} onLoad={i === 0 ? measure : undefined} style={{
            flex: ui.desktop ? '0 0 30%' : '0 0 46%', minWidth: 0,
            aspectRatio: '430 / 932', display: 'block', scrollSnapAlign: 'start',
          }} />
        ))}
      </div>
      {ui.desktop && chevron(-1)}
      {ui.desktop && chevron(1)}
    </div>
  );
}

/** The pill tab row over a funnel with several datasets (before / after). */
function TabRow({ tabs, active, onChange }) {
  if (tabs.length < 2) return null;
  return (
    <div style={{
      display: 'inline-flex', gap: 4, padding: 5, alignSelf: 'flex-start',
      borderRadius: 999, border: '1px solid rgba(255,255,255,.12)',
      background: 'rgba(255,255,255,.03)', flexWrap: 'wrap',
    }}>
      {tabs.map((tb, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="gp-quiet"
          style={{
            border: 0, cursor: 'pointer', fontSize: 13, padding: '9px 16px',
            borderRadius: 999, fontFamily: 'inherit', transition: 'background .25s, color .25s',
            background: i === active ? 'rgba(255,255,255,.12)' : 'transparent',
            color: i === active ? '#eef2f8' : 'rgba(238,242,248,.55)',
          }}
        >{tb.label}</button>
      ))}
    </div>
  );
}

// ---- rich text -------------------------------------------------------------
// Copy in content.js can wrap a phrase in [[double brackets]] to highlight it
// in the project's tint — the same colour as its nav dot and its charts.
const MARK = /(\[\[.+?\]\])/g;
const rich = (body, tint) => String(body).split(MARK).map((part, i) =>
  part.startsWith('[[') ? <span key={i} style={{ color: tint }}>{part.slice(2, -2)}</span> : part);

/** Body copy — paragraphs, and the sentences around a numbered list. */
const para = ui => ({ fontSize: ui.body, lineHeight: 1.55, color: 'rgba(238,242,248,.88)', textWrap: 'pretty', maxWidth: 760 });

/** One big sentence, the whole project's scoreboard read rather than decoded.
    The one place that deliberately uses more than the project's tint: each
    [[figure]] takes the next colour, so four numbers read as four things. A
    ★ inside a figure becomes the rounded star used everywhere else. */
const NUMBER_INKS = ['#aebcff', '#9fe8c4', '#ffb066', '#7fd8ff'];
function NumbersCard({ s, ui }) {
  let k = 0;
  const parts = String(s.body).split(MARK).map((part, i) => {
    if (!part.startsWith('[[')) return part;
    const color = NUMBER_INKS[k++ % NUMBER_INKS.length], inner = part.slice(2, -2);
    const [before, after] = inner.split('★');
    return (
      <span key={i} style={{ color, whiteSpace: 'nowrap' }}>
        {before}
        {after !== undefined && (
          <svg width=".85em" height=".85em" viewBox="0 0 24 24" aria-label="stars" style={{ verticalAlign: '-.06em', marginLeft: '.06em' }}>
            <path d={STAR} fill={color} stroke={color} strokeWidth="2.4" strokeLinejoin="round" paintOrder="stroke" />
          </svg>
        )}
        {after}
      </span>
    );
  });
  return (
    <div style={{ fontSize: ui.desktop ? 32 : 23, fontWeight: 500, letterSpacing: '-.015em', lineHeight: 1.4, textWrap: 'pretty', maxWidth: 800, padding: '6px 0' }}>
      {parts}
    </div>
  );
}

/** A numbered list with an optional lead sentence and a closing one — for the
    two or three points a paragraph would otherwise bury. */
function NumberedList({ s, tint, ui }) {
  const p = para(ui);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {s.lead && <div style={p}>{rich(s.lead, tint)}</div>}
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 760 }}>
        {(s.items || []).map((it, i) => (
          <li key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 12, alignItems: 'baseline' }}>
            <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '.08em', color: tint }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: `calc(${ui.body} - 2px)`, lineHeight: 1.55, color: 'rgba(238,242,248,.8)', textWrap: 'pretty' }}>{rich(it, tint)}</span>
          </li>
        ))}
      </ol>
      {s.after && <div style={p}>{rich(s.after, tint)}</div>}
    </div>
  );
}

// ---- data cards ------------------------------------------------------------
// Small, data-driven visuals for a case study. Each takes its numbers from
// content.js and the project's tint; none of them need an image.

const MUTED = 'rgba(238,242,248,.5)';
const TRACK = 'rgba(255,255,255,.08)';

function ChartCard({ title, note, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26, padding: '6px 0' }}>
      {title && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.01em' }}>{title}</div>
          {note && <div style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(238,242,248,.62)', textWrap: 'pretty', maxWidth: 560 }}>{note}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

const STAR = 'M12 2.5l2.9 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17.3l-6 3.3 1.3-6.6L2.4 9.4l6.7-.8z';

/** A star row filled to `value` out of 5. Each star is one SVG holding a muted
    star and a tint star clipped to that star's own fraction, so the two
    shapes coincide exactly and 4.5 ends in a clean half. */
function Stars({ value, tint, size = 22 }) {
  const uid = React.useId();
  return (
    <div style={{ display: 'flex', gap: 4, width: 'fit-content' }} aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map(i => {
        const frac = Math.max(0, Math.min(1, value - i)), id = `${uid}-${i}`;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <defs><clipPath id={id}><rect x="0" y="0" width={24 * frac} height="24" /></clipPath></defs>
            <path d={STAR} fill="#2b2f3a" stroke="#2b2f3a" strokeWidth="2.4" strokeLinejoin="round" paintOrder="stroke" />
            {frac > 0 && <path d={STAR} fill={tint} stroke={tint} strokeWidth="2.4" strokeLinejoin="round" paintOrder="stroke" clipPath={`url(#${id})`} />}
          </svg>
        );
      })}
    </div>
  );
}

/** Rating as a big number + stars, with the 5→1 distribution beside it —
    the App Store's own framing, so readers decode it instantly. */
function RatingCard({ s, tint, ui, t }) {
  const dist = s.distribution || [];
  return (
    <ChartCard title={s.title} note={s.note}>
      <div style={{ display: 'grid', gridTemplateColumns: ui.desktop ? '1fr 1.4fr' : '1fr', gap: ui.desktop ? 48 : 28, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: MUTED }}>{s.label || t.ratingLabel}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{ fontSize: 64, fontWeight: 500, letterSpacing: '-.04em', lineHeight: 1 }}>{s.value.toLocaleString(t.locale)}</div>
            <div style={{ fontSize: 17, color: 'rgba(238,242,248,.62)' }}>{t.outOf} {s.outOf || 5}</div>
          </div>
          <Stars value={s.value} tint={tint} />
          {s.caption && <div style={{ fontSize: 14, color: 'rgba(238,242,248,.62)' }}>{s.caption}</div>}
        </div>
        {dist.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dist.map((pct, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '14px 1fr 44px', gap: 14, alignItems: 'center' }}>
                <div style={{ fontFamily: MONO, fontSize: 12, color: MUTED, textAlign: 'right' }}>{5 - i}</div>
                <div style={{ height: 8, borderRadius: 999, background: TRACK, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: tint }} />
                </div>
                <div style={{ fontFamily: MONO, fontSize: 12, color: MUTED, textAlign: 'right' }}>{pct}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ChartCard>
  );
}

/** One App Store review, pulled out and centred — the one block on the page
    that isn't left-aligned, so it breaks the rhythm on purpose: the tint
    quotation mark, the line, the stars, and where it's from. Lives at the
    end of the story, well away from the rating block. */
function QuoteCard({ s, tint, ui }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20, padding: '14px 0' }}>
      <svg aria-hidden="true" width="48" height="36" viewBox="0 0 96 72" style={{ display: 'block', filter: `drop-shadow(0 0 12px ${tint}59)` }}>
        <path fill={tint} d="M22 72C9 72 0 62 0 48 0 26 14 8 38 0l6 10C30 16 22 26 20 36c1 0 3-1 5-1 12 0 20 8 20 19 0 10-9 18-23 18zm52 0c-13 0-22-10-22-24C52 26 66 8 90 0l6 10c-14 6-22 16-24 26 1 0 3-1 5-1 12 0 20 8 20 19 0 10-9 18-23 18z" />
      </svg>
      <div style={{ fontSize: ui.desktop ? 28 : 22, fontWeight: 500, letterSpacing: '-.015em', lineHeight: 1.35, maxWidth: 720, textWrap: 'balance' }}>{s.line}</div>
      <Stars value={s.stars} tint={tint} size={18} />
      {s.source && <div style={{ fontSize: 14, color: 'rgba(238,242,248,.62)', marginTop: -6 }}>{s.source}</div>}
    </div>
  );
}

const HATCH = 'repeating-linear-gradient(135deg, rgba(255,255,255,.14) 0 2px, transparent 2px 9px)';

/** One funnel: every step as a column whose height is the share still in the
    flow, the hatched block above it what the previous step lost. The last
    step is lit in the tint. */
function FunnelColumns({ steps, tint, ui, locale, independent = false }) {
  const gap = ui.desktop ? 14 : 8;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
      <div style={{ display: 'flex', gap, alignItems: 'flex-end', height: ui.desktop ? 340 : 260 }}>
        {steps.map((st, i) => {
          // in a funnel each column is measured against the previous step; with
          // `independent` every column is a share of 100 and the hatch is its own remainder
          const prev = independent || i === 0 ? 100 : steps[i - 1].pct, last = i === steps.length - 1;
          return (
            <div key={i} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6, height: `${prev}%`, justifyContent: 'flex-end' }}>
              {/* the hatch takes whatever the solid bar leaves, so the column's
                  total height is always the previous step — even when a tiny
                  share is held at the minimum height its label needs */}
              {prev > st.pct && <div style={{ flex: '1 1 0', minHeight: 0, borderRadius: 8, background: HATCH }} />}
              <div style={{
                // symmetric padding: a bar too short for its share stops at the label
                // plus equal room above and below, never at the label touching the edge
                flex: `0 0 calc(${st.pct / prev * 100}%)`, borderRadius: 8, padding: '18px 4px', textAlign: 'center',
                background: last ? tint : 'rgba(255,255,255,.07)', boxShadow: last ? `0 0 28px ${tint}66` : 'none',
                color: last ? '#02040a' : '#eef2f8', transition: 'flex-basis .4s',
              }}>
                <div style={{ fontSize: ui.desktop ? 19 : 15, fontWeight: 600, letterSpacing: '-.01em' }}>{Math.round(st.pct)}%</div>
                {st.count != null && <div style={{ fontFamily: MONO, fontSize: 12, marginTop: 4, opacity: last ? .7 : .55 }}>{st.count.toLocaleString(locale)}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap }}>
        {steps.map((st, i) => (
          <div key={i} style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: ui.desktop ? 14 : 12, lineHeight: 1.35, color: 'rgba(238,242,248,.7)', textWrap: 'balance' }}>{st.label}</div>
        ))}
      </div>
    </div>
  );
}

/** A funnel section: one funnel, with optional `tabs` to switch between
    several datasets (before / after). */
function FunnelCard({ s, tint, ui, t }) {
  const tabs = s.tabs || [{ label: '', steps: s.steps || [] }];
  const [active, setActive] = React.useState(0);
  const legend = { display: 'flex', alignItems: 'center', gap: 8 };
  const swatch = { width: 16, height: 12, borderRadius: 3 };
  return (
    <ChartCard title={s.title} note={s.note}>
      <TabRow tabs={tabs} active={active} onChange={setActive} />
      <FunnelColumns steps={(tabs[active] || tabs[0]).steps} tint={tint} ui={ui} locale={t.locale} independent={!!s.independent} />
      <div style={{ display: 'flex', gap: 22, fontSize: 13, color: 'rgba(238,242,248,.7)', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={legend}><span style={{ ...swatch, background: tint }} />{s.reachedLabel || t.reached}</span>
        <span style={legend}><span style={{ ...swatch, background: 'repeating-linear-gradient(135deg, rgba(255,255,255,.4) 0 1.5px, transparent 1.5px 4.5px)' }} />{s.droppedLabel || t.dropped}</span>
      </div>
    </ChartCard>
  );
}

/** A count per day as thin columns — commits over a month. A day with nothing
    stays a dashed baseline, so a pause reads as a pause; days at or above `hot`
    light up in the tint; `marks` pin a short label over a day. Dates arrive as
    one ISO start day and are written in the page's language. Hover (or tap) a
    column for its day and count. */
function BarsCard({ s, tint, ui, t }) {
  const counts = s.counts || [], max = Math.max(1, ...counts);
  const [tip, setTip] = React.useState(null);
  const fmt = new Intl.DateTimeFormat(t.locale, { day: 'numeric', month: 'short' });
  const day = i => { const d = new Date(`${s.from}T12:00:00`); d.setDate(d.getDate() + i); return fmt.format(d); };
  const unit = n => (s.unit ? s.unit[n === 1 ? 0 : 1] : '');
  const at = i => `${(i + .5) / counts.length * 100}%`;
  const top = i => `${counts[i] / max * 100}%`;
  const label = { position: 'absolute', transform: 'translateX(-50%)', fontFamily: MONO, fontSize: 12, whiteSpace: 'nowrap', pointerEvents: 'none' };
  return (
    <ChartCard title={s.title} note={s.note}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div role="img" aria-label={s.title} onMouseLeave={() => setTip(null)} style={{
          position: 'relative', height: ui.desktop ? 240 : 180, marginTop: 30,
          display: 'flex', alignItems: 'flex-end', gap: ui.desktop ? 4 : 2,
        }}>
          {counts.map((n, i) => {
            const hot = s.hot != null && n >= s.hot;
            return (
              <div key={i} onMouseEnter={() => setTip(i)} onPointerDown={() => setTip(i)} style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{
                  width: '100%', height: n ? `max(2px, ${n / max * 100}%)` : 0, borderRadius: '3px 3px 1px 1px',
                  background: tip === i ? '#fff' : hot ? tint : 'rgba(255,255,255,.14)',
                  boxShadow: hot ? `0 0 18px ${tint}55` : 'none', transition: 'background .2s',
                  borderBottom: n ? 'none' : '1px dashed rgba(255,255,255,.25)',
                }} />
              </div>
            );
          })}
          {(s.marks || []).map(m => tip === null && (
            <div key={m.at} style={{ ...label, left: at(m.at), bottom: `calc(${top(m.at)} + 8px)`, color: 'rgba(238,242,248,.62)' }}>{m.label}</div>
          ))}
          {tip !== null && (
            <div style={{
              ...label, left: at(tip), bottom: `calc(${top(tip)} + 10px)`, color: '#eef2f8',
              background: 'rgba(6,10,20,.92)', border: '1px solid rgba(255,255,255,.14)', padding: '4px 9px', borderRadius: 6,
            }}>{day(tip)} · {counts[tip]} {unit(counts[tip])}</div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 12, color: MUTED }}>
          <span>{day(0)}</span><span>{day(counts.length - 1)}</span>
        </div>
      </div>
    </ChartCard>
  );
}

/** 100 squares, each 1% of a total, coloured by category — composition
    without a pie. Like the numbers sentence, this is a deliberate exception
    to "everything in the tint": three plans need three colours to be told
    apart, in a fixed order. Items carry `pct`; `value` is the label. */
const WAFFLE_INKS = ['#9fe8c4', '#9fb8ff', '#ffc46b', '#7fd8ff'];
function WaffleCard({ s, ui }) {
  const items = (s.items || []).map((it, i) => ({ ...it, color: it.color || WAFFLE_INKS[i % WAFFLE_INKS.length] }));
  const squares = [];
  items.forEach((it, i) => { for (let k = 0; k < Math.round(it.pct); k++) squares.push(i); });
  while (squares.length < 100) squares.push(null);
  return (
    <ChartCard title={s.title} note={s.note}>
      <div style={{ display: 'grid', gridTemplateColumns: ui.desktop ? 'auto 1fr' : '1fr', gap: ui.desktop ? 56 : 28, alignItems: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 30px)', gridAutoRows: 30, gap: 5 }} aria-label={items.map(it => `${it.label} ${it.pct}%`).join(', ')}>
          {squares.slice(0, 100).map((idx, i) => (
            <div key={i} style={{ borderRadius: 6, background: idx === null ? TRACK : items[idx].color }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '12px auto 1fr auto', gap: 14, alignItems: 'baseline' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: it.color, alignSelf: 'center' }} />
              <span style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-.02em' }}>{it.value}</span>
              <span style={{ fontSize: 15, color: 'rgba(238,242,248,.7)' }}>{it.label}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, color: MUTED }}>{it.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

/** The portrait as a card in the hand: it tilts a few degrees toward the
    pointer and a soft glare follows it — enough to feel held, not enough
    to perform. Pointer only; on touch it just sits still in its frame. */
const TILT_DEG = 6;
function TiltCard({ width, height, children }) {
  const [t, setT] = React.useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });
  const move = e => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - y) * TILT_DEG, ry: (x - 0.5) * TILT_DEG, gx: x * 100, gy: y * 100, on: true });
  };
  // on leave the glare fades out where it was; snapping it back to the centre
  // while it fades showed as a flash in the middle of the card
  const leave = () => setT(prev => ({ ...prev, rx: 0, ry: 0, on: false }));
  return (
    <div style={{ width, height, perspective: 900 }} onMouseMove={move} onMouseLeave={leave}>
      <div style={{
        ...PANEL, width: '100%', height: '100%', padding: 10, boxSizing: 'border-box', display: 'flex',
        position: 'relative', overflow: 'hidden',
        transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
        transition: t.on ? 'transform .08s ease-out, box-shadow .3s' : 'transform .5s cubic-bezier(.2,.8,.2,1), box-shadow .5s',
        boxShadow: t.on ? '0 18px 40px rgba(0,0,0,.45)' : '0 8px 30px rgba(0,0,0,.35)',
      }}>
        {children}
        {/* a soft glare that follows the pointer */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
          background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, rgba(255,255,255,.16), rgba(255,255,255,0) 60%)`,
          opacity: t.on ? 1 : 0, transition: 'opacity .3s', mixBlendMode: 'screen',
        }} />
      </div>
    </div>
  );
}

function AboutPage({ ui, t, about }) {
  return (
    <div style={{ ...PAGE, gap: 56, paddingTop: ui.pageTop }}>
      <div style={{
        display: 'grid', gridTemplateColumns: ui.aboutCols, gap: ui.aboutGap,
        alignItems: 'start', animation: RISE,
      }}>
        {/* the portrait in the same inset frame as every image on the site,
            with a trading-card tilt under the pointer */}
        <TiltCard width={ui.portraitW} height={ui.portraitH}>
          <img
            src={portraitSrc}
            alt={about.name}
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 12 }}
          />
        </TiltCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 6 }}>
          <h1 style={{
            margin: 0, fontSize: ui.h1, fontWeight: 500,
            letterSpacing: '-.035em', lineHeight: .98,
          }}>{about.name}</h1>
          <div style={{
            fontSize: ui.lead, lineHeight: 1.5, color: 'rgba(238,242,248,.86)', textWrap: 'pretty',
          }}>{about.intro}</div>
          <div style={{
            fontSize: 17, lineHeight: 1.6, color: 'rgba(238,242,248,.66)', textWrap: 'pretty',
          }}>{about.detail}</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 26, paddingTop: 10, flexWrap: 'wrap',
          }}>
            <a href={about.mailto} className="gp-light" style={{
              display: 'inline-flex', alignItems: 'center', padding: '13px 24px',
              borderRadius: 999, background: '#eef2f8', color: '#02040a', fontSize: 14,
              fontWeight: 500, transition: 'background .3s',
            }}>{t.email}</a>
            {[
              { label: 'LinkedIn', href: about.linkedin },
              { label: 'X', href: about.twitter },
              { label: 'GitHub', href: about.github },
              // the CV saves as a file rather than replacing the page with a PDF viewer
              { label: t.downloadCv, href: `${import.meta.env.BASE_URL}${about.cv}`, download: true },
            ].map(l => (
              <a key={l.label} href={l.href} className="gp-dashed" style={{
                fontSize: 15, color: 'rgba(238,242,248,.7)',
                borderBottom: '1px dashed rgba(238,242,248,.35)', paddingBottom: 2,
                transition: 'color .3s',
              }} {...(l.download ? { download: '' } : { target: '_blank', rel: 'noopener noreferrer' })}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, animation: riseAfter('.3s') }}>
        <div style={HEADING}>{t.toolkit}</div>
        <Chips items={about.toolkit} />
      </div>
    </div>
  );
}

function ProjectPage({ ui, t, project, nextTitle, onClose, onNext }) {
  const meta = project.meta || [];
  return (
    <div style={{ ...PAGE, gap: ui.sectionGap, paddingTop: ui.pageTop }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: RISE }}>
        <h1 style={{
          margin: 0, fontSize: ui.h1, fontWeight: 500, letterSpacing: '-.035em',
          lineHeight: .98, textWrap: 'balance',
        }}>{project.title}</h1>
        <Facts meta={meta} tint={project.tint} t={t} />
        <div style={{
          fontSize: ui.lead, lineHeight: 1.45, color: 'rgba(238,242,248,.86)',
          textWrap: 'pretty', maxWidth: 760,
        }}>{project.tagline}</div>
        {project.stack && <Chips items={project.stack} small />}
        <LinkRow project={project} t={t} />
      </div>

      {project.screens?.length > 0 && (
        <ScreenStrip screens={project.screens} ui={ui} t={t} style={{ animation: riseAfter('.15s') }} />
      )}

      {isImagePath(project.media) && (
        <HeroImage src={project.media} alt={project.title} height={ui.mediaH} style={{ animation: riseAfter('.15s') }} />
      )}

      {/* each section declares exactly one type with `type: true` — the strict
          checks mean a data field can never be mistaken for a section type */}
      {(project.sections || []).map((s, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 22, animation: riseAfter('.3s') }}>
          {s.text === true && <div style={para(ui)}>{rich(s.body, project.tint)}</div>}
          {s.list === true && <NumberedList s={s} tint={project.tint} ui={ui} />}
          {s.numbers === true && <NumbersCard s={s} ui={ui} />}
          {s.funnel === true && <FunnelCard s={s} tint={project.tint} ui={ui} t={t} />}
          {s.rating === true && <RatingCard s={s} tint={project.tint} ui={ui} t={t} />}
          {s.quote === true && <QuoteCard s={s} tint={project.tint} ui={ui} />}
          {s.waffle === true && <WaffleCard s={s} ui={ui} />}
          {s.bars === true && <BarsCard s={s} tint={project.tint} ui={ui} t={t} />}
        </div>
      ))}

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        flexWrap: 'wrap', paddingTop: 10, animation: riseAfter('.45s'),
      }}>
        <button type="button" onClick={onClose} className="gp-quiet" style={{
          background: 'none', border: 0, color: 'rgba(238,242,248,.6)',
          cursor: 'pointer', fontSize: 14,
        }}>{t.back}</button>
        <button type="button" onClick={onNext} className="gp-light" style={{
          background: '#eef2f8', color: '#02040a', border: 0, padding: '13px 26px',
          borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer',
        }}>{t.warp} {nextTitle}</button>
      </div>
    </div>
  );
}

/** The full-screen reading surface. It stays mounted so it can cross-fade, but
    its contents unmount when closed so the entry animations replay each time. */
const Overlay = forwardRef(function Overlay(props, ref) {
  const { ui, t, lang, onLang, aboutOpen, pageOpen, about, project, nextTitle, onClose, onNext } = props;
  const open = aboutOpen || pageOpen;
  return (
    <div
      ref={ref}
      aria-hidden={!open}
      style={{
        position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity .7s ease',
        background: 'linear-gradient(rgba(2,4,10,.2),rgba(2,4,10,.6) 30%,rgba(2,4,10,.75))',
        zIndex: 3,
      }}
    >
      {open && (
        <div style={{
          minHeight: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: ui.overlayPad,
        }}>
          <div style={{
            position: 'sticky', top: 0, width: '100%', display: 'flex',
            justifyContent: 'flex-end', alignItems: 'center', padding: ui.stickyPad, zIndex: 1,
          }}>
            <LangSwitch lang={lang} onChange={onLang} t={t} style={{ marginRight: 14, color: 'rgba(238,242,248,.6)' }} />
            <button type="button" onClick={onClose} className="gp-glass" style={{
              background: 'rgba(6,10,20,.85)', border: '1px solid rgba(255,255,255,.14)',
              color: '#eef2f8', padding: '10px 18px', borderRadius: 999, cursor: 'pointer',
              fontSize: 13, display: 'flex', gap: 10, alignItems: 'center',
            }}>
              <span>{t.back}</span>
              {ui.desktop && (
                <span style={{ fontFamily: MONO, fontSize: 10, lineHeight: 1, opacity: .55, position: 'relative', top: 1 }}>ESC</span>
              )}
            </button>
          </div>

          {aboutOpen && <AboutPage ui={ui} t={t} about={about} />}
          {pageOpen && (
            <ProjectPage
              ui={ui} t={t} project={project} nextTitle={nextTitle}
              onClose={onClose} onNext={onNext}
            />
          )}
        </div>
      )}
    </div>
  );
});

export default Overlay;
