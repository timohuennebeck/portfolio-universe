import React, { forwardRef } from 'react';
import { MONO } from './Hud.jsx';
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
const HEADING = { fontSize: 22, fontWeight: 500, letterSpacing: '-.01em' };

function Chips({ items, style = CHIP }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: style === CHIP ? 10 : 8 }}>
      {items.map((it, i) => <span key={i} style={style}>{it.title}</span>)}
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
        <img
          src={portraitSrc}
          alt={about.name}
          style={{
            ...PANEL, width: ui.portraitW, height: ui.portraitH,
            objectFit: 'cover', display: 'block',
          }}
        />
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
              display: 'inline-flex', alignItems: 'center', padding: '14px 24px',
              borderRadius: 999, background: '#eef2f8', color: '#02040a', fontSize: 14,
              fontWeight: 500, transition: 'background .3s',
            }}>{t.email}</a>
            <a href={about.linkedin} target="_blank" rel="noopener noreferrer" className="gp-dashed" style={{
              fontSize: 15, color: 'rgba(238,242,248,.7)',
              borderBottom: '1px dashed rgba(238,242,248,.35)', paddingBottom: 2,
              transition: 'color .3s',
            }}>LinkedIn</a>
            <a href={about.twitter} target="_blank" rel="noopener noreferrer" className="gp-dashed" style={{
              fontSize: 15, color: 'rgba(238,242,248,.7)',
              borderBottom: '1px dashed rgba(238,242,248,.35)', paddingBottom: 2,
              transition: 'color .3s',
            }}>Twitter</a>
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
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px 0', fontFamily: MONO, fontSize: 12,
          letterSpacing: '.08em', color: 'rgba(238,242,248,.62)',
        }}>
          {meta.map((text, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <span style={{ padding: '0 12px', opacity: .4 }}>·</span>}
              <span>{text}</span>
            </span>
          ))}
        </div>
        <div style={{
          fontSize: ui.lead, lineHeight: 1.45, color: 'rgba(238,242,248,.86)',
          textWrap: 'pretty', maxWidth: 760,
        }}>{project.tagline}</div>
        {project.stack && (
          <Chips items={project.stack} style={{
            fontSize: 13, padding: '8px 14px', borderRadius: 999,
            border: '1px solid rgba(255,255,255,.14)', color: '#eef2f8',
            background: 'rgba(255,255,255,.03)',
          }} />
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="gp-glass" style={{
            alignSelf: 'flex-start', display: 'flex', gap: 10, alignItems: 'center', height: 40,
            padding: '0 16px 0 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,.14)',
            background: 'rgba(255,255,255,.04)', color: '#eef2f8', fontSize: 13,
            textDecoration: 'none', transition: 'background .3s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.13v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
            </svg>
            <span>View on GitHub</span>
          </a>
        )}
      </div>

      <div style={{
        ...PANEL, height: ui.mediaH, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: MONO, fontSize: 11, letterSpacing: '.18em',
        color: 'rgba(238,242,248,.4)', animation: riseAfter('.15s'),
      }}>{project.media}</div>

      {(project.sections || []).map((s, i) => (
        <div key={i} style={{
          display: 'flex', flexDirection: 'column', gap: 22, animation: riseAfter('.3s'),
        }}>
          {s.text && (
            <div style={{
              fontSize: ui.body, lineHeight: 1.55, color: 'rgba(238,242,248,.88)',
              textWrap: 'pretty', maxWidth: 760,
            }}>{s.body}</div>
          )}
          {s.label && <div style={HEADING}>{s.label}</div>}
          {s.stats && (
            <div style={{ display: 'grid', gridTemplateColumns: ui.statCols, gap: 14 }}>
              {s.items.map((it, k) => (
                <div key={k} style={{
                  ...PANEL, borderRadius: 18, padding: '26px 26px 24px', display: 'flex',
                  flexDirection: 'column', gap: 14, minHeight: 170,
                }}>
                  <div style={{
                    fontFamily: MONO, fontSize: 11, letterSpacing: '.2em',
                    textTransform: 'uppercase', color: 'rgba(238,242,248,.5)',
                  }}>{it.meta}</div>
                  <div style={{
                    fontSize: 30, fontWeight: 500, letterSpacing: '-.02em',
                    lineHeight: 1.1, textWrap: 'balance',
                  }}>{it.title}</div>
                  <div style={{
                    fontSize: 14, lineHeight: 1.5, color: 'rgba(238,242,248,.62)',
                    textWrap: 'pretty', marginTop: 'auto',
                  }}>{it.text}</div>
                </div>
              ))}
            </div>
          )}
          {s.chips && <Chips items={s.items} />}
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
          background: '#eef2f8', color: '#02040a', border: 0, padding: '15px 26px',
          borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer',
        }}>{t.warp} {nextTitle}</button>
      </div>
    </div>
  );
}

/** The full-screen reading surface. It stays mounted so it can cross-fade, but
    its contents unmount when closed so the entry animations replay each time. */
const Overlay = forwardRef(function Overlay(props, ref) {
  const { ui, t, aboutOpen, pageOpen, about, project, nextTitle, onClose, onNext } = props;
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
            <button type="button" onClick={onClose} className="gp-glass" style={{
              background: 'rgba(6,10,20,.85)', border: '1px solid rgba(255,255,255,.14)',
              color: '#eef2f8', padding: '10px 18px', borderRadius: 999, cursor: 'pointer',
              fontSize: 13, display: 'flex', gap: 10, alignItems: 'center',
            }}>
              <span>{t.back}</span>
              {ui.desktop && (
                <span style={{ fontFamily: MONO, fontSize: 10, opacity: .55 }}>ESC</span>
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
