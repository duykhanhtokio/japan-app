import type { PrefectureDialogueModule } from '@/data/generated/geo-prefectures';
import { prefectureModules } from '@/data/generated/geo-prefectures';
import scenarioLocations from '@/data/generated/life-on-demand/scenario-locations.json';
import locationCities from '@/data/generated/life-on-demand/location-cities.json';
import cities from '@/data/generated/cities.json';

// All content stays offline. No access control is applied here.
const cityPrefecture = new Map<string,string>(
  (cities as {id:string;prefectureId:string}[]).map(city=>[city.id,city.prefectureId])
);
const scenarioToLocation = scenarioLocations as Record<string,string>;
const locationToCity = locationCities as Record<string,string>;
const cached = new Map<string,Promise<PrefectureDialogueModule>>();
export function getScenarioPrefectureId(scenarioId:string):string|undefined {
 const locationId=scenarioToLocation[scenarioId];
 return locationId ? cityPrefecture.get(locationToCity[locationId]) : undefined;
}
export async function loadPrefectureRawDialogue(scenarioId:string):Promise<unknown|undefined>{
 const prefectureId=getScenarioPrefectureId(scenarioId);
 if(!prefectureId)return undefined;
 const load=prefectureModules[prefectureId];
 if(!load)return undefined;
 let promise=cached.get(prefectureId);
 if(!promise){
  promise=load().catch(error=>{cached.delete(prefectureId);throw error;});
  cached.set(prefectureId,promise);
 }
 const module=await promise;
 return module.loadRawDialogue(scenarioId);
}
export function clearPrefectureLoaderCache():void{cached.clear();}
