import React, { useEffect, useState } from 'react';
import { fullscreenSupported, isFullscreen, requestFullscreen, onFullscreenChange } from '../fullscreen.js';

/** Let the stage land unobscured for a beat before the nudge slides in. */
const APPEAR_AFTER_MS = 800;
/** How long the nudge stays up, once visible, before it quietly leaves. */
const AUTO_DISMISS_MS = 12000;

/**
 * A one-time invitation to go fullscreen, shown as the page lands.
 *
 * The stage shows clean for a beat, then the pill slides up into the top
 * center over a lightly blurred stage so it reads as a moment, not a banner.
 * While it is up the stage underneath takes no clicks. It leaves after
 * twelve seconds, on the close button, on the fullscreen button, on a click
 * anywhere else, or as soon as the document goes fullscreen by any route. Desktop
 * only: the parent does not mount it on the mobile layout, and browsers that
 * cannot go fullscreen at all (iPhone Safari) never see it either.
 */
export default function FullscreenNudge({ t, hidden, onOpenChange }) {
  // 'pending' -> 'open' -> 'closed'
  const [phase, setPhase] = useState(() =>
    fullscreenSupported() && !isFullscreen() ? 'pending' : 'closed'
  );
  const open = phase === 'open';
  const close = () => setPhase('closed');

  // Tell the stage when the nudge is up, so scrolling can't warp to the next
  // destination underneath it — arriving, warping, and then being asked to go
  // fullscreen reads as three unrelated things happening at once.
  useEffect(() => { if (onOpenChange) onOpenChange(open); }, [open, onOpenChange]);

  useEffect(() => {
    if (phase === 'closed') return;
    const timer = setTimeout(
      () => setPhase(phase === 'pending' ? 'open' : 'closed'),
      phase === 'pending' ? APPEAR_AFTER_MS : AUTO_DISMISS_MS
    );
    const offChange = onFullscreenChange(() => { if (isFullscreen()) close(); });
    return () => {
      clearTimeout(timer);
      offChange();
    };
  }, [phase]);

  const enter = () => {
    close();
    requestFullscreen().catch(err => console.warn('Fullscreen refused', err));
  };

  const shown = open && !hidden;
  const fade = { opacity: shown ? 1 : 0, transition: 'opacity .6s ease' };

  return (
    <>
      {/* Catches every click while the nudge is up so nothing behind it can be
          hit by accident; a click on it simply lets the visitor move on. */}
      <div
        aria-hidden="true"
        onClick={close}
        style={{
          ...fade, position: 'absolute', inset: 0, zIndex: 3,
          pointerEvents: shown ? 'auto' : 'none',
          background: 'rgba(2,4,10,.28)',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        }}
      />
      <div
        role="status"
        // The app's window-level key handler turns Enter into "open project"
        // and cancels the button's own activation; keys pressed here are ours.
        onKeyDown={e => e.stopPropagation()}
        style={{
          ...fade, position: 'absolute', left: '50%', top: 48, zIndex: 4,
          // Rises in from below its resting place; sinks back down on the way out.
          transform: shown ? 'translate(-50%, 0)' : 'translate(-50%, 56px)',
          transition: shown
            ? 'opacity .55s ease, transform .7s cubic-bezier(.2,.8,.2,1)'
            : 'opacity .5s ease, transform .5s ease-in',
          pointerEvents: shown ? 'auto' : 'none',
          display: 'flex', alignItems: 'center', gap: 6,
          maxWidth: 'calc(100% - 32px)',
          height: 54, padding: '0 10px 0 22px', borderRadius: 999,
          background: 'rgba(6,10,20,.85)', border: '1px solid rgba(255,255,255,.1)',
          color: '#eef2f8', fontSize: 15, whiteSpace: 'nowrap',
          boxShadow: '0 20px 60px rgba(0,0,0,.45)',
        }}
      >
        <span style={{ marginRight: 14 }}>{t.fullscreenNudge}</span>
        <button
          type="button"
          onClick={enter}
          className="gp-light"
          style={{
            background: '#eef2f8', color: '#02040a', border: 0, cursor: 'pointer',
            padding: '0 18px', height: 38, borderRadius: 999, fontSize: 14, fontWeight: 500,
            transition: 'background .3s',
          }}
        >
          {t.enterFullscreen}
        </button>
        <button
          type="button"
          onClick={close}
          aria-label={t.dismiss}
          className="gp-quiet"
          style={{
            background: 'transparent', border: 0, cursor: 'pointer', width: 38, height: 38,
            borderRadius: '50%', color: 'rgba(238,242,248,.55)', fontSize: 18, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color .3s',
          }}
        >
          ×
        </button>
      </div>
    </>
  );
}
