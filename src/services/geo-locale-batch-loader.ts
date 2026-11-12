import { localeModules } from '@/data/generated/geo-locales';
import type { DialogueLocaleBatch } from './dialogue-locale-batches';
type LocaleModule = {loadBatch:(id:string)=>unknown|undefined};
const cached=new Map<string,Promise<LocaleModule>>();
export async function loadGeoLocaleBatch(locale:string,batchId:string):Promise<DialogueLocaleBatch|undefined>{
 const loader=localeModules[locale];
 if(!loader)return undefined;
 let promise=cached.get(locale);
 if(!promise){
  promise=loader().catch(error=>{cached.delete(locale);throw error;});
  cached.set(locale,promise);
 }
 const module=await promise;
 const raw=module.loadBatch(batchId);
 if(raw===undefined)return undefined;
 return (raw && typeof raw==='object' && 'default' in raw ? raw.default : raw) as DialogueLocaleBatch;
}
