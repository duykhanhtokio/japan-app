type Route = { name: string; params?: object; state?: NavigationState };
export type NavigationState = { index?: number; routes: readonly Route[] };

export function matchRoutePattern(pathname: string, patterns: string[]): string | undefined {
  const path = pathname.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  return [...patterns].sort((a, b) =>
    b.split('/').filter(part => part && !part.startsWith('[')).length
    - a.split('/').filter(part => part && !part.startsWith('[')).length)
    .find(key => new RegExp('^' + key.replace(/\[[^\]]+\]/g, '[^/]+') + '$').test(path));
}

export function routePath(route: Route): string {
  if (route.state?.routes.length) {
    return routePath(route.state.routes[route.state.index ?? route.state.routes.length - 1]);
  }
  const pathname = route.name.replace(/\[([^\]]+)\]/g, (_, key: string) => {
    const value = (route.params as Record<string, unknown> | undefined)?.[key];
    return Array.isArray(value) ? value.map(encodeURIComponent).join('/') : encodeURIComponent(String(value ?? key));
  }).replace(/\([^/]+\)\/?/g, '').replace(/(?:^|\/)index$/, '');
  return '/' + pathname.replace(/^\/+|\/+$/g, '');
}

// Find the previous entry in the deepest active navigator. Preserve actual
// stack history rather than guessing a parent from the current URL.
export function previousRoutePath(state: NavigationState): string | null {
  const index = state.index ?? state.routes.length - 1;
  const current = state.routes[index];
  if (current?.state) {
    const nested = previousRoutePath(current.state);
    if (nested) return nested;
  }
  return index > 0 ? routePath(state.routes[index - 1]) : null;
}
