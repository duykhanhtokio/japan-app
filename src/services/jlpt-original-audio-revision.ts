/** Preserve saved attempts when a baked original recording changes its timeline. */
export type OriginalAudioRevision = {
  examId: string;
  level: string;
  sessionKey: string;
  fromAudioSha256: string;
  toAudioSha256: string;
  /** Ordered [previous milliseconds, replacement milliseconds]. */
  anchors: readonly (readonly [number, number])[];
};

type Storage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

const RAW_REVISION = '__originalAudioSha256';
export const originalAudioRevisionKey = (key: string) => `jlpt:audio-revision:${key}`;

export function validateOriginalAudioRevision(row: OriginalAudioRevision) {
  const identity = /^jpapp-(n[1-5])-original-(0[1-6])-v1$/.exec(row.examId);
  if (!/^N[1-5]$/.test(row.level)
      || !identity || identity[1].toUpperCase() !== row.level
      || !new RegExp(`^jlpt:jpapp:${identity[1]}:original:${identity[2]}:v[1-9][0-9]*$`).test(row.sessionKey)
      || !/^[a-f0-9]{64}$/.test(row.fromAudioSha256) || !/^[a-f0-9]{64}$/.test(row.toAudioSha256)
      || row.fromAudioSha256 === row.toAudioSha256 || row.anchors.length < 2) {
    throw new Error('Invalid original audio revision');
  }
  let previous = [-1, -1];
  for (const point of row.anchors) {
    if (point.length !== 2 || !point.every(Number.isSafeInteger)
        || point[0] <= previous[0] || point[1] <= previous[1]) {
      throw new Error('Original audio timeline must be strictly ordered');
    }
    previous = [point[0], point[1]];
  }
  if (row.anchors[0][0] !== 0 || row.anchors[0][1] !== 0) {
    throw new Error('Original audio timeline must start at zero');
  }
}

export function remapOriginalListeningPosition(positionMs: number, anchors: OriginalAudioRevision['anchors']) {
  if (!Number.isFinite(positionMs)) throw new Error('Invalid listening position');
  if (positionMs <= 0) return 0;
  const last = anchors[anchors.length - 1];
  if (positionMs >= last[0]) return last[1];
  let low = 0;
  let high = anchors.length - 1;
  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2);
    if (anchors[middle][0] <= positionMs) low = middle;
    else high = middle;
  }
  const a = anchors[low];
  const b = anchors[high];
  return Math.round(a[1] + (positionMs - a[0]) * (b[1] - a[1]) / (b[0] - a[0]));
}

export function createOriginalAudioRevisionMigrator(storage: Storage, revisions: readonly OriginalAudioRevision[]) {
  const seen = new Set<string>();
  for (const row of revisions) {
    validateOriginalAudioRevision(row);
    if (seen.has(row.sessionKey)) throw new Error('Duplicate original audio session');
    seen.add(row.sessionKey);
  }
  const finished = new Set<string>();
  const inFlight = new Map<string, Promise<void>>();

  async function migrate(row: OriginalAudioRevision) {
    const markerKey = originalAudioRevisionKey(row.sessionKey);
    const marker = await storage.getItem(markerKey);
    if (marker === row.toAudioSha256) return;
    if (marker && marker !== row.fromAudioSha256) throw new Error('Unknown original audio revision');
    const raw = await storage.getItem(row.sessionKey);
    let session: Record<string, unknown> | null = null;
    try {
      const value: unknown = raw ? JSON.parse(raw) : null;
      if (value && typeof value === 'object' && !Array.isArray(value)) session = value as Record<string, unknown>;
    } catch {
      // Leave incompatible data intact; the approved session loader decides
      // whether it can be opened, just as it did before this audio revision.
    }
    if (session?.[RAW_REVISION] === row.toAudioSha256) {
      // Recovery after the session write succeeded but its separate marker
      // failed. Never map an already converted position for a second time.
      await storage.setItem(markerKey, row.toAudioSha256);
      return;
    }
    if (session && typeof session.version === 'number' && [1, 2, 3, 4].includes(session.version)
        && session.answers && typeof session.answers === 'object' && !Array.isArray(session.answers)
        && (session.mode === 'exam' || session.mode === 'practice')
        && !session.submitted && session.status !== 'submitted' && session.status !== 'reviewing'
        && typeof session.listeningPositionMs === 'number' && Number.isFinite(session.listeningPositionMs)
        && session.listeningPositionMs > 0) {
      if (session[RAW_REVISION] && session[RAW_REVISION] !== row.fromAudioSha256) {
        throw new Error('Unknown saved original audio revision');
      }
      const revised = {
        ...session,
        listeningPositionMs: remapOriginalListeningPosition(session.listeningPositionMs, row.anchors),
        [RAW_REVISION]: row.toAudioSha256,
      };
      // Keep answers, currentQuestion, played IDs, score and timestamps intact.
      // Write recovery information with the position before the separate marker.
      await storage.setItem(row.sessionKey, JSON.stringify(revised));
    }
    await storage.setItem(markerKey, row.toAudioSha256);
  }

  return async function prepareLevel(level: string) {
    await Promise.all(revisions.filter(row => row.level === level).map(row => {
      if (finished.has(row.sessionKey)) return Promise.resolve();
      const pending = inFlight.get(row.sessionKey);
      if (pending) return pending;
      const work = migrate(row).then(() => { finished.add(row.sessionKey); }).finally(() => {
        inFlight.delete(row.sessionKey);
      });
      inFlight.set(row.sessionKey, work);
      return work;
    }));
  };
}
