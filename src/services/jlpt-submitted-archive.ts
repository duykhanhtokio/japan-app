import { learningStorageKey } from './learning-storage-scope';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { N1TrialSession } from './jlpt-trial-session-storage';
const key=(storageKey:string)=>learningStorageKey(`${storageKey}:submitted-archive:v1`);
let queue:Promise<unknown>=Promise.resolve();
async function readArchive(physicalKey:string):Promise<N1TrialSession[]> {
    try{const raw=await AsyncStorage.getItem(physicalKey);const value=raw?JSON.parse(raw):[];return Array.isArray(value)?value.filter(s=>s.submitted&&s.result&&s.submittedAt):[];}catch{return [];}
}
export const loadSubmittedArchive = async (storageKey:string) => readArchive(await key(storageKey));
export async function archiveSubmittedSession(storageKey:string,session:N1TrialSession,physicalSessionKey?:string) {
    const physicalKey=physicalSessionKey?`${physicalSessionKey}:submitted-archive:v1`:await key(storageKey);
    const job=queue.then(async()=>{if(!session.submitted||!session.submittedAt||!session.result)return;const entries=await readArchive(physicalKey);const index=entries.findIndex(s=>s.submittedAt===session.submittedAt);if(index<0)entries.push(session);else entries[index]=session;await AsyncStorage.setItem(physicalKey,JSON.stringify(entries));});queue=job.catch(()=>undefined);return job;
}
