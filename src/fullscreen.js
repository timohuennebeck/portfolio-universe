// Fullscreen API with the WebKit-prefixed fallbacks Safari needed until 16.4.
// iPhone Safari exposes neither flavour for page content, so `supported()` is
// false there and callers can simply not offer fullscreen.

const doc = typeof document === 'undefined' ? {} : document;

export const fullscreenSupported = () =>
  !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled);

export const isFullscreen = () =>
  !!(doc.fullscreenElement || doc.webkitFullscreenElement);

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
