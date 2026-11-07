import AsyncStorage from '@react-native-async-storage/async-storage';
import type { N1TrialSession } from './jlpt-trial-session-storage';
const key=(storageKey:string)=>`${storageKey}:submitted-archive:v1`;
let queue:Promise<unknown>=Promise.resolve();
export async function loadSubmittedArchive(storageKey:string):Promise<N1TrialSession[]> {
    try{const raw=await AsyncStorage.getItem(key(storageKey));const value=raw?JSON.parse(raw):[];return Array.isArray(value)?value.filter(s=>s.submitted&&s.result&&s.submittedAt):[];}catch{return [];}
}
export function archiveSubmittedSession(storageKey:string,session:N1TrialSession) {
    const job=queue.then(async()=>{if(!session.submitted||!session.submittedAt||!session.result)return;const entries=await loadSubmittedArchive(storageKey);const index=entries.findIndex(s=>s.submittedAt===session.submittedAt);if(index<0)entries.push(session);else entries[index]=session;await AsyncStorage.setItem(key(storageKey),JSON.stringify(entries));});queue=job.catch(()=>undefined);return job;
}
