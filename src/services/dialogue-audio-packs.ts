import releaseJson from '../data/dialogue-content/npc-audio-release.json';
export type PackedNpcRecording = {sourceJa:string;role:string;speakerId:number;clip:string;pack:string;startMs:number;durationMs:number;sha256:string;nativeReviewed:false};
type Pack = {bytes:number;sha256:string;durationMs:number};
type Release = {complete:boolean;baseUrl:string;turnCount:number;scenarioCount:number;packs:Record<string,Pack>};
type Shard = Record<string,Record<string,PackedNpcRecording>>;
type Context = { (name:string):unknown; keys():string[] };
const context=(require as NodeRequire & {context(path:string,recursive:boolean,pattern:RegExp):Context}).context('../data/dialogue-content/audio-packs',false,/\.json$/);
const available=new Set(context.keys()),cache=new Map<string,Shard>();
export const npcAudioRelease=releaseJson as Release;
function shardKey(scenarioId:string) {
 // IDs are ASCII; this is the same byte-wise FNV-1a as the publishing validator.
 let value=2166136261;
 for(let i=0;i<scenarioId.length;i++)value=Math.imul(value^scenarioId.charCodeAt(i),16777619)>>>0;
 return `./${String(value%32).padStart(2,'0')}.json`;
}
export function packedRecordingFor(text:string,scenarioId:string,turnId:string,role:string,speakerId:number) {
 if(!npcAudioRelease.complete||npcAudioRelease.turnCount!==42768||npcAudioRelease.scenarioCount!==7128)return null;
 const key=shardKey(scenarioId);if(!available.has(key))return null;
 let data=cache.get(key);
 if(!data){const loaded=context(key) as Shard|{default:Shard};data=('default'in loaded?loaded.default:loaded) as Shard;cache.set(key,data);if(cache.size>4)cache.delete(cache.keys().next().value!);}
 const row=data[scenarioId]?.[turnId],pack=row?npcAudioRelease.packs[row.pack]:null;
 if(!row||!pack||row.sourceJa!==text||row.role!==role||row.speakerId!==speakerId||row.startMs<0||row.durationMs<=0||row.startMs+row.durationMs>pack.durationMs+.1)return null;
 if(!/^https:\/\/github\.com\/duykhanhtokio\/japan-app\/releases\/download\/npc-audio-[a-zA-Z0-9-]+$/.test(npcAudioRelease.baseUrl)||!/^voice-\d{2}-\d{2}\.mp3$/.test(row.pack))return null;
 return {...row,source:{uri:`${npcAudioRelease.baseUrl}/${row.pack}`}};
}
