import type {ManufacturingLesson} from './index';
import {manufacturingNativeFieldCurrent} from './native-body-readings';
type Part={text:string;reading?:string};
type Registry={schemaVersion:number;revision:string;sourceWeek:number;studyOnly:boolean;readings:Record<string,{sourceJapanese:string;parts:Part[]}>;lessons:Record<string,{sourceHash:string;fields:Record<string,string>}>};
function registryForLesson(id:string):Registry|null{
 const match=/^mfg1-(?:mechanical-lesson-|electrical-l|surface-lesson-)(\d{3})$/.exec(id);if(!match)return null;
 switch(Math.ceil(Number(match[1])/7)){case 3:return require('./native-reviewed-week03-fields.json') as Registry;case 4:return require('./native-reviewed-week04-fields.json') as Registry;case 5:return require('./native-reviewed-week05-fields.json') as Registry;case 6:return require('./native-reviewed-week06-fields.json') as Registry;case 7:return require('./native-reviewed-week07-fields.json') as Registry;case 8:return require('./native-reviewed-week08-fields.json') as Registry;case 9:return require('./native-reviewed-week09-fields.json') as Registry;case 10:return require('./native-reviewed-week10-fields.json') as Registry;case 11:return require('./native-reviewed-week11-fields.json') as Registry;case 12:return require('./native-reviewed-week12-fields.json') as Registry;default:return null;}
}
export function hasManufacturingReviewedNativeField(id:string,field:string):boolean{return !!registryForLesson(id)?.lessons?.[id]?.fields?.[field];}
export function manufacturingReviewedNativeFieldReading(lesson:ManufacturingLesson,field:string,text:string|undefined):Part[]|undefined{
 const registry=registryForLesson(lesson.id),binding=registry?.lessons?.[lesson.id],key=binding?.fields?.[field],row=key?registry?.readings?.[key]:undefined;
 if(!registry||registry.schemaVersion!==1||registry.revision!=='native-reviewed-fields-20261107-v1'||!registry.studyOnly||registry.sourceWeek!==Math.ceil(Number(lesson.id.match(/(\d+)$/)?.[1])/7)||!row||binding?.sourceHash!==lesson.sourceHash||!manufacturingNativeFieldCurrent(lesson,field,text)||row.sourceJapanese!==text||!Array.isArray(row.parts)||!row.parts.length||row.parts.map(p=>p?.text).join('')!==text||row.parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return row.parts;
}
