import {useEffect,useRef,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
/** Serial writes preserve the latest answer under rapid taps. Invalid records are never overwritten implicitly. */
export function useRestaurantRecord<T>(key:string,restore:(raw:string|null)=>T|null){
 const restoreRef=useRef(restore);restoreRef.current=restore;
 const [value,setValue]=useState<T|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState<'read'|'invalid'|'write'|null>(null),[saving,setSaving]=useState(false),[generation,setGeneration]=useState(0);
 const live=useRef(false),latest=useRef<T|null>(null),queue=useRef(Promise.resolve(true)),sequence=useRef(0),raw=useRef<string|null>(null),lastOptimistic=useRef(true),epoch=useRef(0);
 useEffect(()=>{const scope=++epoch.current;live.current=true;latest.current=null;setValue(null);setLoading(true);setError(null);setSaving(false);sequence.current=0;
  AsyncStorage.getItem(key).then(stored=>{if(!live.current||epoch.current!==scope)return;raw.current=stored;const restored=restoreRef.current(stored);latest.current=restored;setValue(restored);setError(restored===null?'invalid':null);setLoading(false);}).catch(()=>{if(live.current&&epoch.current===scope){setLoading(false);setError('read');}});
  return()=>{live.current=false;};
 },[key,generation]);
 const update=(next:T|((current:T)=>T),options:{optimistic?:boolean}={}):Promise<boolean>=>{
  const current=latest.current;if(current===null)return Promise.resolve(false);
  const changed=typeof next==='function'?(next as (current:T)=>T)(current):next;
  const optimistic=options.optimistic!==false;lastOptimistic.current=optimistic;latest.current=changed;if(optimistic)setValue(changed);setSaving(true);const n=++sequence.current,scope=epoch.current;
  const task=queue.current.catch(()=>false).then(async()=>{try{const json=JSON.stringify(changed);await AsyncStorage.setItem(key,json);if(epoch.current===scope)raw.current=json;if(live.current&&epoch.current===scope&&n===sequence.current){if(!optimistic)setValue(changed);setError(null);setSaving(false);}return true;}catch{if(live.current&&epoch.current===scope&&n===sequence.current){setError('write');setSaving(false);}return false;}});
  queue.current=task;return task;
 };
 const retry=()=>{if(error==='write'&&latest.current!==null)return update(latest.current,{optimistic:lastOptimistic.current});setGeneration(g=>g+1);return Promise.resolve(false);};
 const reset=async(fresh:T)=>{
  if(error!=='invalid')return false;
  try{if(raw.current!==null)await AsyncStorage.setItem(`${key}:invalid-record:${Date.now()}`,raw.current);latest.current=fresh;return await update(fresh);}catch{if(live.current)setError('write');return false;}
 };
 return {value,loading,error,saving,update,retry,reset};
}
