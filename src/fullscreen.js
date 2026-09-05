// Fullscreen API with the WebKit-prefixed fallbacks Safari needed until 16.4.
// iPhone Safari exposes neither flavour for page content, so `supported()` is
// false there and callers can simply not offer fullscreen.

const doc = typeof document === 'undefined' ? {} : document;

export const fullscreenSupported = () =>
  !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);

// The API flag is lost on reload even though the window is still fullscreen,
// and it never knows about the macOS green button or F11. So also treat the
// window itself filling the screen as fullscreen: outerWidth/outerHeight is the
// browser window including its toolbar, and only a fullscreen window reaches
// the screen's full size (a normal one is shorter by the menu bar or taskbar).
const windowFillsScreen = () => {
  if (typeof window === 'undefined' || !window.screen) return false;
  const { width, height } = window.screen;
  const fits = (a, b) => a >= b - 2;
  return (fits(window.outerWidth, width) && fits(window.outerHeight, height))
    || (fits(window.innerWidth, width) && fits(window.innerHeight, height));
};

export const isFullscreen = () =>
  !!(doc.fullscreenElement || doc.webkitFullscreenElement) || windowFillsScreen();

/** Resolves once the request has been issued; rejects if the browser refuses. */
export function requestFullscreen(el = document.documentElement) {
  const fn = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!fn) return Promise.reject(new Error('Fullscreen API unavailable'));
  try {
    // Prefixed WebKit returns undefined rather than a promise.
    return Promise.resolve(fn.call(el));
  } catch (err) {
    return Promise.reject(err);
  }
}

/** Subscribes to enter/exit; returns the unsubscribe. */
export function onFullscreenChange(fn) {
  const events = ['fullscreenchange', 'webkitfullscreenchange'];
  events.forEach(e => document.addEventListener(e, fn));
  return () => events.forEach(e => document.removeEventListener(e, fn));
}
