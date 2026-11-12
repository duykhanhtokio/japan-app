import {prefetch} from './dialogue-npc-audio';
/** Start warming while the scenario card is visible, then await the same work before entering. */
const preparations=new Map<string,Promise<void>>();
export function prepareDialogueEntry(scenarioId:string,category?:string|null){
 const key=scenarioId+':'+(category??'');const existing=preparations.get(key);if(existing)return existing;
 const pending=(async()=>{const {loadGeoDialogueTurns}=await import('./geo-dialogue-loader');const first=(await loadGeoDialogueTurns(scenarioId)).find(turn=>turn.speaker==='NPC'&&turn.npc?.textJa);if(first?.npc?.textJa)await prefetch(first.npc.textJa,{scenarioId:first.scenarioId,turnId:first.id,category});})();
 preparations.set(key,pending);void pending.catch(()=>{if(preparations.get(key)===pending)preparations.delete(key);});
 if(preparations.size>12)preparations.delete(preparations.keys().next().value!);return pending;
}
