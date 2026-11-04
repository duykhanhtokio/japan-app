/** Server-clock session verifier. This is a bounded telemetry gate, NOT proof of human study. */
export const MIN_HEARTBEAT_MS = 15000;
export const MAX_HEARTBEAT_MS = 90000;
export const MAX_SESSION_MS = 4 * 60 * 60 * 1000;
export function verifiedHeartbeatSeconds(previousServerMs, nowServerMs, hasInteraction) {
  if (!Number.isSafeInteger(previousServerMs) || !Number.isSafeInteger(nowServerMs)) return 0;
  const elapsed = nowServerMs - previousServerMs;
  if (!hasInteraction || elapsed < MIN_HEARTBEAT_MS || elapsed > MAX_HEARTBEAT_MS) return 0;
  return Math.floor(elapsed / 1000);
}
export function pointsFromVerifiedSeconds(seconds, premiumVerified) {
  if (!premiumVerified || !Number.isSafeInteger(seconds) || seconds < 0) return 0;
  return Math.floor(seconds / 60);
}
