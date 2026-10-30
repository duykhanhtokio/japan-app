import type {ManufacturingLesson} from './index';

export type SupplementalDiagram={id:string;lessonId:string;lessonSourceHash:string;assetFile:string;width:number;height:number;captionJa:string;scopeLimits:string[]};
type Registry={items:SupplementalDiagram[]};
type Captions={locales:Record<string,Record<string,{sourceJa:string;text:string}>>};
let registry:Registry|null=null;
let captions:Captions|null=null;

/** Additional original conceptual figures, bound to the exact taught lesson revision. */
export function manufacturingSupplementalDiagrams(lesson:ManufacturingLesson):SupplementalDiagram[]{
 const data=registry??(registry=require('./supplemental-diagrams.json') as Registry);
 return data.items.filter(item=>item.lessonId===lesson.id&&item.lessonSourceHash===lesson.sourceHash
  &&typeof item.captionJa==='string'&&!!item.captionJa.trim()
  &&Number.isFinite(item.width)&&item.width>0&&Number.isFinite(item.height)&&item.height>0);
}

export function manufacturingSupplementalCaption(item:SupplementalDiagram,locale:string):string|null{
 if(locale==='ja')return null;
 const data=captions??(captions=require('./supplemental-diagram-translations.json') as Captions);
 const entries=Object.prototype.hasOwnProperty.call(data.locales,locale)?data.locales[locale]:undefined;
 const target=entries&&Object.prototype.hasOwnProperty.call(entries,item.id)?entries[item.id]:undefined;
 return target?.sourceJa===item.captionJa&&typeof target.text==='string'&&target.text.trim()?target.text:null;
}
