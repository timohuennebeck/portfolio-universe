// Fullscreen API with the WebKit-prefixed fallbacks Safari needed until 16.4.
// iPhone Safari exposes neither flavour for page content, so `supported()` is
// false there and callers can simply not offer fullscreen.

const doc = typeof document === 'undefined' ? {} : document;

export const fullscreenSupported = () =>
  !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);

// The API flag is lost on reload even though the window is still fullscreen
// (and it never knows about the macOS green button or F11), so also treat a
// viewport that fills the screen as fullscreen — a browser with any chrome
// showing is always shorter than the screen.
const fillsScreen = () =>
  typeof window !== 'undefined' && !!window.screen &&
  window.innerWidth >= window.screen.width && window.innerHeight >= window.screen.height;

export const isFullscreen = () =>
  !!(doc.fullscreenElement || doc.webkitFullscreenElement) || fillsScreen();

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
