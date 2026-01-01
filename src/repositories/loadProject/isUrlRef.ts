const URL_REF_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//;

export function isUrlRef(s: string): boolean {
  return URL_REF_RE.test(s);
}
