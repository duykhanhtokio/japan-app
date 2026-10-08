import AsyncStorage from '@react-native-async-storage/async-storage';
const queues=new Map<string,Promise<void>>();
export async function loadKaigoState(key:string){await queues.get(key)?.catch(()=>{});return AsyncStorage.getItem(key);}
export function saveKaigoState(key:string,value:unknown){const previous=queues.get(key)??Promise.resolve();const next=previous.catch(()=>{}).then(()=>AsyncStorage.setItem(key,JSON.stringify(value)));queues.set(key,next);void next.finally(()=>{if(queues.get(key)===next)queues.delete(key);}).catch(()=>{});return next;}
