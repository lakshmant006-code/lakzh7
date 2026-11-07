/* The hand turns into a stipple print the moment something is drawn on it, so the drawing is what holds the colour.
   Each drawing gets one of a few looks, decided by its id, so the one you see while drawing is the one that is saved. */
export const LOOKS = 4;
export const newId = () => (crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx".replace(/x/g, () => ((Math.random() * 16) | 0).toString(16)));
export const lookOf = (id) => (parseInt(String(id).slice(0, 2), 16) || 0) % LOOKS;
export const lookSrc = (id) => `/hand/look-${lookOf(id)}.webp`;
