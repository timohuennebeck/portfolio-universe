import React from 'react';
import portraitSrc from '../assets/portrait.jpg';

export const MONO = "'IBM Plex Mono',monospace";

const kbd = {
  fontFamily: MONO, fontSize: 10, padding: '3px 7px',
  border: '1px solid rgba(255,255,255,.18)', borderRadius: 4, color: '#eef2f8',
};
const hint = { display: 'flex', gap: 8, alignItems: 'center' };
const glass = {
  border: '1px solid rgba(255,255,255,.1)', cursor: 'pointer', borderRadius: 999,
  background: 'rgba(6,10,20,.85)', color: 'rgba(238,242,248,.7)', fontSize: 13,
  display: 'flex', gap: 10, alignItems: 'center',
  transition: 'opacity .5s, background .3s',
};

/** Interaction hints. Top-right on both layouts; keyboard keys are desktop only. */
export function Hints({ ui, t, opacity }) {
  return (
    <div style={{
      position: 'absolute', left: ui.hudLeft, right: ui.edge, top: ui.hudTop, zIndex: 2,
      display: 'flex', justifyContent: ui.hudJustify, textAlign: 'right', gap: 22,
      fontSize: ui.hudSize, lineHeight: 1.4, color: 'rgba(238,242,248,.45)',
      pointerEvents: 'none', opacity, transition: 'opacity .5s',
    }}>
      {ui.mobile ? <span>{t.touchHint}</span> : (
        <>
          <span style={hint}><kbd style={kbd}>Scroll</kbd> {t.scroll}</span>
          <span style={hint}><kbd style={kbd}>Drag</kbd> {t.drag}</span>
          <span style={hint}><kbd style={kbd}>Enter</kbd> {t.enter}</span>
        </>
      )}
    </div>
  );
}

/** Bottom dock: one pill per destination. On mobile only the active pill shows
    its title, in a fixed-width slot, so the dock never changes width. */
export function NavDock({ ui, nodes, idx, onGo, opacity, pointerEvents }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: ui.navBottom, zIndex: 2,
      display: 'flex', justifyContent: 'center', opacity, pointerEvents,
      transition: 'opacity .5s',
    }}>
      <nav aria-label="Destinations" style={{
        display: 'flex', alignItems: 'center', gap: 2, padding: 4, borderRadius: 999,
        background: 'rgba(6,10,20,.85)', border: '1px solid rgba(255,255,255,.1)', height: 44,
      }}>
        {nodes.map((n, i) => {
          const active = i === idx, showTitle = !ui.mobile || active;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => onGo(i)}
              aria-current={active ? 'true' : undefined}
              aria-label={n.title}
              className={'gp-nav-pill' + (active ? ' is-active' : '')}
              style={{
                border: 0, cursor: 'pointer',
                padding: ui.mobile && !active ? '0 12px' : '0 14px',
                borderRadius: 999,
                background: active ? 'rgba(255,255,255,.12)' : 'transparent',
                color: active ? '#fff' : 'rgba(238,242,248,.55)',
                width: ui.mobile && active ? 150 : 'auto',
                fontSize: 13, display: 'flex', gap: 9, alignItems: 'center',
                justifyContent: 'center', transition: 'background .35s, color .35s', height: 34,
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%', background: n.tint,
                boxShadow: `0 0 8px ${n.tint}`, opacity: active ? 1 : 0.35,
              }} />
              {showTitle && (
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
                  {n.title}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/** Top-left on mobile, bottom-left on desktop. */
export function AboutButton({ ui, label, onClick, opacity, pointerEvents }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="gp-glass"
      style={{
        ...glass, position: 'absolute', left: ui.edge, top: ui.aboutTop,
        bottom: ui.aboutBottom, zIndex: 2, padding: '0 16px 0 12px', height: ui.aboutH,
        opacity, pointerEvents,
      }}
    >
      <img src={portraitSrc} alt="" aria-hidden="true" style={{
        width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', display: 'block',
        border: '1px solid rgba(255,255,255,.18)',
      }} />
      <span>{label}</span>
    </button>
  );
}

/** Desktop only — touch devices start silent and get no toggle. */
export function SoundButton({ ui, on, label, onClick, opacity, pointerEvents }) {
  const dot = on ? '#9fe8c4' : 'rgba(255,255,255,.25)';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="gp-glass"
      style={{
        ...glass, position: 'absolute', right: ui.edge, bottom: ui.pillBottom,
        zIndex: 2, padding: '0 16px', height: 44, opacity, pointerEvents,
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: dot,
        boxShadow: `0 0 8px ${dot}`, transition: 'background .3s',
      }} />
      <span>{label}</span>
    </button>
  );
}
