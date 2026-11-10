import AsyncStorage from '@react-native-async-storage/async-storage';
export type LearningIdentity = {userId:string;token:string};
const listeners=new Set<()=>void>();
export function subscribeLearningIdentity(listener:()=>void){listeners.add(listener);return()=>{listeners.delete(listener);};}
let provider:(()=>Promise<LearningIdentity|null>)|undefined;
export function setLearningIdentityProvider(value:()=>Promise<LearningIdentity|null>){provider=value;for(const listener of listeners)listener();}
export const resolveLearningIdentity=()=>provider?.()??Promise.resolve(null);
export async function learningStoragePrefix(){
    if(!provider)return ''; // Preserve pre-login device history separately; never assign it to another person.
    const identity=await provider();return identity?'@learning-user:'+encodeURIComponent(identity.userId)+':':'@learning-signed-out:';
}
export async function learningStorageKey(key:string){return await learningStoragePrefix()+key;}
export async function learningStorageKeys(){
    const prefix=await learningStoragePrefix(),keys=await AsyncStorage.getAllKeys();
    return keys.filter(key=>prefix?key.startsWith(prefix):!key.startsWith('@learning-user:')&&!key.startsWith('@learning-signed-out:')).map(key=>prefix?key.slice(prefix.length):key);
}
