import type { LifeDialogueTurn } from '@/types/life-conversation';
import { loadPrefectureRawDialogue } from './geo-prefecture-raw-loader';
import { decorateGeoDialogueTurns } from './dialogue-decoration';

// Normal prefecture navigation does not import the 7561-file legacy raw
// require.context. Generic fallback stays available as an async import.
export async function loadGeoDialogueTurns(scenarioId:string):Promise<LifeDialogueTurn[]>{
 const raw=await loadPrefectureRawDialogue(scenarioId);
 if(raw!==undefined)return decorateGeoDialogueTurns(raw,scenarioId);
 const legacy=await import('./dialogue-content-loader');
 return legacy.loadDialogueTurns(scenarioId);
}
