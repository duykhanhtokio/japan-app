import type {HotelCatalogEntry,HotelLesson,HotelTranslation} from './types';
export const hospitalityCatalog:HotelCatalogEntry[]=require('./catalog.json');
const loaders:Record<string,()=>{lessons:HotelLesson[]}>= {
 front:()=>require('./front.json'),planning:()=>require('./planning.json'),
 service:()=>require('./service.json'),restaurant:()=>require('./restaurant.json'),safety:()=>require('./safety.json'),
};
export function loadHotelLesson(id:string):HotelLesson {
 const entry=hospitalityCatalog.find(item=>item.id===id);
 if(!entry)throw new Error('Unknown hotel lesson');
 const lesson=loaders[entry.group]().lessons.find(item=>item.id===id);
 if(!lesson)throw new Error('Missing hotel lesson');return lesson;
}
// Translation loaders are generated only for actual files. Missing content is explicit.
export {loadHotelTranslation} from './translation-loaders';
export type {HotelCatalogEntry,HotelLesson,HotelTranslation};
export function loadHotelMock(level:1|2):HotelLesson{return require('./mocks.json').mocks.find((m:HotelLesson)=>m.level===level);}
