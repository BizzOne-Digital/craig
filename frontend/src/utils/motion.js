export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function watchReducedMotion(callback) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handler = (event) => callback(event.matches);

  if (media.addEventListener) {
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }

  media.addListener(handler);
  return () => media.removeListener(handler);
}
