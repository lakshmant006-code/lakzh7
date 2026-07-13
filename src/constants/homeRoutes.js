/** URL paths that render the same landing experience as `/`. */
export const HOME_PATHS = ["/", "/google-creative"];

function normalizePathname(pathname) {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function isGoogleCreativePath(pathname) {
  return normalizePathname(pathname) === "/google-creative";
}

/** Main homepage only — not `/google-creative` (nav section highlights & landing timing). */
export function isDefaultHomePath(pathname) {
  return normalizePathname(pathname) === "/";
}

export function isHomePath(pathname) {
  const p = normalizePathname(pathname);
  return p === "/" || p === "/google-creative";
}
