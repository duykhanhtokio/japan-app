import { decorateGeoDialogueTurns } from './dialogue-decoration';
import type { LifeDialogueTurn } from '@/types/life-conversation';
export { decorateGeoDialogueTurns } from './dialogue-decoration';
type MetroRequireContext = { (key: string): unknown; keys(): string[] };
type RequireWithContext = NodeRequire & {
 context(directory:string,useSubdirectories:boolean,pattern:RegExp):MetroRequireContext;
};
// Legacy synchronous API retained for history and callers not yet migrated.
// It is NOT imported by the normal geographic dialogue route.
const dialogueContext=(require as RequireWithContext).context('../data/generated/dialogues',false,/\.json$/);
const availableFiles=new Set(dialogueContext.keys());
export function loadDialogueTurns(scenarioId:string):LifeDialogueTurn[]{
 const directKey='./'+scenarioId+'.json';
 const genericMatch=/^SC-LOC-JP-\d{5}-(\d{2})-001$/.exec(scenarioId);
 const key=availableFiles.has(directKey)?directKey:genericMatch?'./GENERIC-CITY-'+genericMatch[1]+'.json':directKey;
 if(!availableFiles.has(key))return [];
 const moduleValue=dialogueContext(key);
 const value=moduleValue && typeof moduleValue==='object' && 'default' in moduleValue
  ? (moduleValue as {default:unknown}).default : moduleValue;
 if(key===directKey)return decorateGeoDialogueTurns(value,scenarioId);
 const selected=Array.isArray(value)?value:value && typeof value==='object'
  ? (value as {shared?:LifeDialogueTurn[];N5?:LifeDialogueTurn[]}).shared ??
    (value as {N5?:LifeDialogueTurn[]}).N5 : null;
 if(!Array.isArray(selected))return [];
 const genericId='GENERIC-CITY-'+genericMatch![1];
 const replaced=selected.map(turn=>{
  const replace=(v:string|null)=>v?.split(genericId).join(scenarioId)??null;
  return {...turn,id:replace(turn.id)!,scenarioId,nextDialogueId:replace(turn.nextDialogueId)};
 });
 return decorateGeoDialogueTurns(replaced,scenarioId);
}
