import React, { forwardRef } from 'react';
import { MONO } from './Hud.jsx';

/** The label that hangs under the destination you have arrived at.
    Its position and opacity are written imperatively by the frame loop (it has
    to track a projected world point), so this only renders the content. */
const ArrivalCard = forwardRef(function ArrivalCard({ ui, t, node, onOpen }, ref) {
  return (
    <div ref={ref} style={{
      position: 'absolute', left: '50%', top: '60%', width: ui.cardWidth,
      transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 10, textAlign: 'center', opacity: 0, pointerEvents: 'none',
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 11, letterSpacing: '.26em',
        textTransform: 'uppercase', color: 'rgba(238,242,248,.55)',
      }}>{node.kind}</div>
      <div style={{
        fontSize: ui.cardTitle, fontWeight: 500, letterSpacing: '-.03em', lineHeight: 1,
        color: '#fff', textShadow: '0 2px 24px rgba(2,4,10,.9)',
      }}>{node.title}</div>
      <div style={{
        fontSize: 15, lineHeight: 1.45, color: 'rgba(238,242,248,.72)',
        maxWidth: ui.tagMax, textWrap: 'pretty', textShadow: '0 1px 12px rgba(2,4,10,.9)',
      }}>{node.tagline}</div>
      <button
        type="button"
        onClick={onOpen}
        className="gp-light"
        style={{
          marginTop: 8, pointerEvents: 'auto', background: '#eef2f8', color: '#02040a',
          border: 0, padding: '14px 26px', borderRadius: 999, fontSize: 14, fontWeight: 500,
          cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
          boxShadow: '0 0 40px rgba(255,255,255,.12)',
        }}
      >
        <span>{t.open} {node.title}</span>
        {ui.desktop && (
          <span style={{
            fontFamily: MONO, fontSize: 10, lineHeight: 1, opacity: .55,
            letterSpacing: '.1em', position: 'relative', top: 1,
          }}>ENTER</span>
        )}
      </button>
    </div>
  );
});

export default ArrivalCard;
