import type {LifeCity,LifeLocation,LifeScenario,LifeScenarioIndexItem} from '@/types/life-conversation';
import {contentBucket,loadLocationBucket,loadScenarioBucket} from '@/data/generated/life-on-demand/loaders';

// Importing this API allocates no curriculum JSON, maps or scenario inventories.
// Metro keeps these installed assets available offline; require caches each
// selected bucket after the user first opens its city/location/dialogue.
let cities:LifeCity[]|undefined;
const cityRows=()=>cities??(cities=require('@/data/generated/cities.json') as LifeCity[]);
const locationCities=()=>require('@/data/generated/life-on-demand/location-cities.json') as Record<string,string>;
const scenarioLocations=()=>require('@/data/generated/life-on-demand/scenario-locations.json') as Record<string,string>;
const cityCounts=()=>require('@/data/generated/life-on-demand/city-counts.json') as Record<string,{scenarioCount:number;dialogueCount:number;locationCount:number}>;
const own=(rows:Record<string,unknown>,id:string)=>Object.prototype.hasOwnProperty.call(rows,id);

export function getAllLifeCities():LifeCity[]{return cityRows();}
export function getLifeCitiesByPrefecture(prefectureId:string):LifeCity[]{return cityRows().filter(c=>c.prefectureId===prefectureId).sort((a,b)=>a.order-b.order);}
export function getLifeCityById(cityId:string):LifeCity|null{return cityRows().find(c=>c.id===cityId)??null;}
export function getLifeLocationsByCity(cityId:string):LifeLocation[]{const rows=loadLocationBucket(contentBucket(cityId)).byCity;return own(rows,cityId)?rows[cityId]:[];}
export function getLifeLocationById(locationId:string):LifeLocation|null{
 const ids=locationCities();return own(ids,locationId)?loadLocationBucket(contentBucket(ids[locationId])).byId[locationId]??null:null;
}
export function getLifeScenariosByLocation(locationId:string):LifeScenario[]{const rows=loadScenarioBucket(contentBucket(locationId)).byLocation;return own(rows,locationId)?rows[locationId]:[];}
export function getLifeScenarioById(scenarioId:string):LifeScenario|null{
 const ids=scenarioLocations();return own(ids,scenarioId)?loadScenarioBucket(contentBucket(ids[scenarioId])).byId[scenarioId]??null:null;
}
export function getLifeScenarioIndex(scenarioId:string):LifeScenarioIndexItem|null{
 const ids=scenarioLocations();return own(ids,scenarioId)?loadScenarioBucket(contentBucket(ids[scenarioId])).index[scenarioId]??null:null;
}
export function hasLifeDialogue(scenarioId:string):boolean{return (getLifeScenarioIndex(scenarioId)?.dialogueCount??0)>0;}
// City cards only need small precomputed totals, never all scenario bodies.
export function getLifeDialogueCountByCity(cityId:string):number{return cityCounts()[cityId]?.dialogueCount??0;}
export function getLifeScenarioCountByCity(cityId:string):number{return cityCounts()[cityId]?.scenarioCount??0;}

export function getLifeLocationCountByCity(cityId:string):number{return cityCounts()[cityId]?.locationCount??0;}
export function getLifeAvailableScenarioCountByLocation(locationId:string):number{const counts=require('@/data/generated/life-on-demand/location-counts.json') as Record<string,number>;return own(counts,locationId)?counts[locationId]:0;}
