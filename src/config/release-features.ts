/** Publisher release scope, 2026-11-07. Preserve farm data for a later update. */
export const RELEASE_FEATURES = { farmEnabled: false } as const;
export function isLockedGameRoute(path: string) {
    return !RELEASE_FEATURES.farmEnabled && /^\/game(?:\/|$)/.test(path.split(/[?#]/)[0]);
}
