// The two layout tables the whole HUD reads from. `mobile` is driven by the
// canvas width (< 720px), not a media query, so the app stays correct when the
// viewport is resized rather than only on load.
const MOBILE = {
  mobile: true, desktop: false,
  edge: '20px', pillBottom: '20px', navBottom: '24px', cardTitle: '34px',
  hudLeft: '120px', hudTop: '30px', hudSize: '11px', hudJustify: 'flex-end',
  aboutTop: '20px', aboutBottom: 'auto', aboutH: '40px',
  tagMax: '100%', cardWidth: 'calc(100% - 40px)',
  overlayPad: '0 20px 120px', stickyPad: '18px 4px 0', pageTop: '9vh',
  aboutCols: '1fr', aboutGap: '28px', portraitW: '150px', portraitH: '190px',
  h1: '40px', lead: '19px', body: '17px', mediaH: '220px',
  sectionGap: '40px',
};

const DESKTOP = {
  mobile: false, desktop: true,
  edge: '40px', pillBottom: '40px', navBottom: '40px', cardTitle: '44px',
  hudLeft: 'auto', hudTop: '40px', hudSize: '12px', hudJustify: 'flex-end',
  aboutTop: 'auto', aboutBottom: '40px', aboutH: '44px',
  tagMax: '480px', cardWidth: 'min(560px, calc(100% - 80px))',
  overlayPad: '0 24px 160px', stickyPad: '30px 16px 0', pageTop: '13vh',
  aboutCols: '220px 1fr', aboutGap: '48px', portraitW: '220px', portraitH: '280px',
  h1: '68px', lead: '24px', body: '22px', mediaH: '460px',
  sectionGap: '64px',
};

export const layoutFor = mobile => (mobile ? MOBILE : DESKTOP);
