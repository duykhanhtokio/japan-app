/** Publisher release scope, 2026-11-07. Preserve farm data for a later update. */
export const RELEASE_FEATURES = { farmEnabled: false, organizationPortalsEnabled: false, freeLearning: true } as const;
export function isLockedGameRoute(path: string) {
    return !RELEASE_FEATURES.farmEnabled && /^\/game(?:\/|$)/.test(path.split(/[?#]/)[0]);
}

/** The first learner beta excludes all institution routes, including deep links. */
export function isLockedOrganizationRoute(path:string){
 return !RELEASE_FEATURES.organizationPortalsEnabled && /^\/portal(?:\/|$)/.test(path.split(/[?#]/)[0]);
}
