/** Current factory MP3: MPEG-2 Layer III, 24 kHz mono, 48 kbps, no ID3/Xing.
 * Each 576-sample / 24ms frame occupies 144 bytes. Do not infer this for new encodings. */
export type NpcAudioRange={start:number;end:number;total:number;packSha256:string};
export function npcAudioRange(startMs:number,durationMs:number,pack:{bytes:number;durationMs:number;sha256:string}):NpcAudioRange|null{
 if(!Number.isSafeInteger(startMs)||startMs<0||!Number.isSafeInteger(durationMs)||durationMs<=0||startMs%24!==0||durationMs%24!==0)return null;
 if(!/^[a-f0-9]{64}$/.test(pack.sha256)||pack.bytes!==pack.durationMs*6)return null;
 const start=startMs*6,end=start+durationMs*6-1;
 if(!Number.isSafeInteger(end)||end>=pack.bytes||end-start+1>2*1024*1024)return null;
 return {start,end,total:pack.bytes,packSha256:pack.sha256};
}
export function validateNpcRangeResponse(range:NpcAudioRange,status:number,headers:Record<string,string>,bytes:number){
 const h=Object.fromEntries(Object.entries(headers).map(([k,v])=>[k.toLowerCase(),v]));
 if(status!==206||h['content-range']!==`bytes ${range.start}-${range.end}/${range.total}`||bytes!==range.end-range.start+1)throw new Error('NPC server did not return the exact bounded MP3 clip');
}
