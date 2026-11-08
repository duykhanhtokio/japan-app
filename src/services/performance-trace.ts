// Opt-in diagnostics only: no learner content, storage, network or retained log.
export const PERFORMANCE_TRACE_ENABLED = typeof process !== 'undefined' && process.env.EXPO_PUBLIC_PERF_TRACE === '1';
const now = () => typeof performance !== 'undefined' ? performance.now() : Date.now();
const origin = now();
let navigation: { path: string; start: number } | undefined;
export function tracePerformance(stage: string, detail: Record<string, string | number> = {}) {
    if (PERFORMANCE_TRACE_ENABLED) console.info('YOKOSO_PERF ' + JSON.stringify({ stage, elapsedMs: Math.round(now() - origin), ...detail }));
}
export function beginNavigationTrace(path: string) {
    if (!PERFORMANCE_TRACE_ENABLED) return;
    navigation = {path, start: now()};
    tracePerformance('navigation_requested', {path});
}
export function commitNavigationTrace(path: string) {
    if (!PERFORMANCE_TRACE_ENABLED) return;
    const durationMs = navigation?.path === path ? now() - navigation.start : undefined;
    tracePerformance('route_committed', {path, ...(durationMs === undefined ? {} : {durationMs})});
    navigation = undefined;
}
export function traceAsync<T>(stage: string, work: () => Promise<T>): Promise<T> {
    if (!PERFORMANCE_TRACE_ENABLED) return work();
    const start = now();
    return Promise.resolve().then(work).then(value => {
        tracePerformance(stage, {durationMs: now() - start, outcome:'resolved'});
        return value;
    }, error => {
        tracePerformance(stage, {durationMs: now() - start, outcome:'rejected'});
        throw error;
    });
}
tracePerformance('trace_module_evaluated');
