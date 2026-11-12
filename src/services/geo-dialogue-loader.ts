import type { AppLanguageCode } from '@/i18n/languages';
import type { LifeDialogueTurn } from '@/types/life-conversation';
import { loadPrefectureRawDialogue } from './geo-prefecture-raw-loader';
import { decorateGeoDialogueTurnsAsync } from './geo-dialogue-decoration-async';

// Normal prefecture navigation does not import the 7561-file legacy raw
// require.context. Generic fallback stays available as an async import.
export async function loadGeoDialogueTurns(scenarioId:string, language:AppLanguageCode='ja'):Promise<LifeDialogueTurn[]>{
 const raw=await loadPrefectureRawDialogue(scenarioId);
 if(raw!==undefined)return decorateGeoDialogueTurnsAsync(raw,scenarioId,language);
 const legacy=await import('./dialogue-content-loader');
 return legacy.loadDialogueTurns(scenarioId);
}
