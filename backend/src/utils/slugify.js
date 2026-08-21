export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateOrderNumber() {
  const segment = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `JLF-${Date.now().toString(36).toUpperCase()}-${segment()}${segment()}`;
}
