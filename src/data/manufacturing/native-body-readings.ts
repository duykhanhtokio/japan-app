import type {ManufacturingLesson} from './index';
import data from './native-body-readings.json';
import native from './royal-week01-technical-locales.json';
type Part={text:string;reading?:string};
const registry=data as {schemaVersion:number;revision:string;studyOnly:boolean;readings:Record<string,{sourceJapanese:string;parts:Part[]}>;lessons:Record<string,{sourceHash:string;fields:Record<string,string>}>};
/** Reuse canonical payloads rather than copying the full lesson into every reading field. */
export function manufacturingNativeFieldCurrent(lesson:ManufacturingLesson,field:string,text:string|undefined):boolean{
 const row=(native.locales.ja.lessons as Record<string,{sourceHash:string;[key:string]:unknown}>)[lesson.id];
 if(typeof text!=='string'||!row||row.sourceHash!==lesson.sourceHash||row[field]!==text)return false;
 const pool=lesson.specialty==='mechanical'?require('./mechanical.json'):lesson.specialty==='electrical'?require('./electrical.json'):lesson.specialty==='surface'?require('./surface.json'):null;
 const canonical=pool?.lessons.find((l:ManufacturingLesson)=>l.id===lesson.id) as ManufacturingLesson|undefined;
 return !!canonical&&canonical.sourceHash===lesson.sourceHash&&canonical.specialty===lesson.specialty&&canonical.titleJa===lesson.titleJa&&canonical.summaryJa===lesson.summaryJa&&canonical.objectiveJa===lesson.objectiveJa&&JSON.stringify(canonical.paragraphs)===JSON.stringify(lesson.paragraphs);
}
export function hasManufacturingNativeBodyReading(lessonId:string,field:string):boolean{return !!registry.lessons[lessonId]?.fields[field];}
export function manufacturingNativeBodyReading(lesson:ManufacturingLesson,field:string,text:string|undefined):Part[]|undefined{
 const binding=registry.lessons[lesson.id],key=binding?.fields[field],row=key?registry.readings[key]:undefined;
 if(registry.schemaVersion!==1||registry.revision!=='native-body-whole-paragraph-reuse-20261107-v1'||!registry.studyOnly||binding?.sourceHash!==lesson.sourceHash||!manufacturingNativeFieldCurrent(lesson,field,text)||!row||row.sourceJapanese!==text||!Array.isArray(row.parts)||!row.parts.length||row.parts.map(p=>p?.text).join('')!==text||row.parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return row.parts;
}
