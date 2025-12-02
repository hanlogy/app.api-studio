export function resolveForwardUrl({
  template,
  query,
  pathParams = {},
}: {
  readonly template: string;
  readonly query?: Record<string, string>;
  readonly pathParams?: Record<string, string>;
}): string {
  const expanded = template.replace(
    /\{\{\s*([^}]+)\s*\}\}/g,
    (match, exprRaw) => {
      const expr = String(exprRaw).trim();

      if (expr === 'params.*') {
        return pathParams['*'] ?? '';
      }

      const [, key] = /^params\.(.+)$/.exec(expr) ?? [];
      return key ? pathParams[key] ?? '' : match;
    },
  );

  const search = query && new URLSearchParams(query).toString();
  if (!search) {
    return expanded;
  }

  return expanded + (expanded.includes('?') ? '&' : '?') + search;
}
