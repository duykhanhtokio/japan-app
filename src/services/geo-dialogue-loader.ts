import type { LifeDialogueTurn } from '@/types/life-conversation';
import { loadPrefectureRawDialogue } from './geo-prefecture-raw-loader';

// Compatibility-first: returns exactly the legacy decorated output for all
// indexed prefecture scenarios, with legacy fallback for generic IDs.
// IMPORTANT: legacy decoration still imports require.context and thus this
// bridge alone does not improve initial Metro bundling.
export async function loadGeoDialogueTurns(scenarioId: string): Promise<LifeDialogueTurn[]> {
 const raw = await loadPrefectureRawDialogue(scenarioId);
 const legacy = await import('./dialogue-content-loader');
 if (raw === undefined) return legacy.loadDialogueTurns(scenarioId);
 return legacy.decorateGeoDialogueTurns(raw, scenarioId);
}
