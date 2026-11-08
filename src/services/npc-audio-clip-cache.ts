import * as FileSystem from 'expo-file-system/legacy';
import {Platform} from 'react-native';
import {validateNpcRangeResponse,type NpcAudioRange} from './npc-audio-range';
const pending=new Map<string,Promise<{uri:string}>>();
const root=FileSystem.cacheDirectory?FileSystem.cacheDirectory+'npc-clips-v1/':null;
let directory:Promise<void>|null=null,downloads=0,pruning=false;
const protectedFiles=new Set<string>(),recentlyUsed=new Map<string,number>();
async function prune(){
 if(!root||pruning)return;pruning=true;
 try{const names=await FileSystem.readDirectoryAsync(root);const files=await Promise.all(names.filter(n=>n.endsWith('.mp3')).map(async name=>{const uri=root+name,info=await FileSystem.getInfoAsync(uri);return {uri,bytes:info.exists?info.size:0,time:info.exists?info.modificationTime:0};}));
 let bytes=files.reduce((sum,f)=>sum+f.bytes,0),count=files.length;
 for(const f of files.sort((a,b)=>a.time-b.time)){if(bytes<=64*1024*1024&&count<=512)break;if(protectedFiles.has(f.uri)||Date.now()-(recentlyUsed.get(f.uri)??0)<120000)continue;await FileSystem.deleteAsync(f.uri,{idempotent:true});bytes-=f.bytes;count--;}
 }catch{}finally{pruning=false;}
}
/** Save only the requested original MP3 frames. Never fall back to a full pack download. */
export function loadNpcAudioClip(uri:string,range:NpcAudioRange):Promise<{uri:string}>{
 const key=`${range.packSha256}-${range.start}-${range.end}`;
 const existing=pending.get(key);if(existing)return existing;
 const request=(async()=>{
  const headers={Range:`bytes=${range.start}-${range.end}`};
  if(Platform.OS==='web'){
   const response=await fetch(uri,{headers});const blob=await response.blob();validateNpcRangeResponse(range,response.status,Object.fromEntries(response.headers.entries()),blob.size);
   return {uri:URL.createObjectURL(blob)};
  }
  if(!root)throw new Error('Native NPC clip cache is unavailable');
  directory??=FileSystem.makeDirectoryAsync(root,{intermediates:true}).catch(error=>{directory=null;throw error;});await directory;
  const target=root+key+'.mp3';recentlyUsed.set(target,Date.now());if(recentlyUsed.size>1024)recentlyUsed.delete(recentlyUsed.keys().next().value!);const info=await FileSystem.getInfoAsync(target),expected=range.end-range.start+1;
  if(info.exists&&info.size===expected)return {uri:target};
  protectedFiles.add(target);const temporary=target+'.part';
  const task=FileSystem.createDownloadResumable(uri,temporary,{headers},progress=>{if(progress.totalBytesWritten>expected||progress.totalBytesExpectedToWrite>expected)void task.cancelAsync().catch(()=>{});});
  const timeout=setTimeout(()=>{void task.cancelAsync().catch(()=>{});},20000);
  try{const result=await task.downloadAsync();if(!result)throw new Error('NPC clip download cancelled');const downloaded=await FileSystem.getInfoAsync(temporary);validateNpcRangeResponse(range,result.status,result.headers,downloaded.exists?downloaded.size:0);await FileSystem.moveAsync({from:temporary,to:target});
   if(++downloads%16===0)void prune();return {uri:target};
  }catch(error){await FileSystem.deleteAsync(temporary,{idempotent:true}).catch(()=>{});throw error;}finally{clearTimeout(timeout);protectedFiles.delete(target);}
 })();
 pending.set(key,request);
 void request.catch(()=>{}).finally(()=>{if(Platform.OS!=='web'){if(pending.get(key)===request)pending.delete(key);}else if(pending.size>24){const oldest=pending.keys().next().value;if(oldest){const stale=pending.get(oldest);pending.delete(oldest);void stale?.then(value=>URL.revokeObjectURL(value.uri)).catch(()=>{});}}});
 return request;
}
