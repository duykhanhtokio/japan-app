import type {ManufacturingLesson} from './index';
import type {SupplementalDiagram} from './supplemental-diagrams';
import data from './companion-field-readings.json';
export type CompanionReadingPart={text:string;reading?:string};
type Reading={sourceJapanese:string;parts:CompanionReadingPart[]};
type Image={assetFile:string;width:number;height:number;readings:string[]};
type Binding={sourceHash:string;fields:Record<string,string>;images:Record<string,Image[]>};
const registry=data as {schemaVersion:number;revision:string;studyOnly:boolean;readings:Record<string,Reading>;lessons:Record<string,Binding>};
function canonicalLesson(lesson:ManufacturingLesson):ManufacturingLesson|undefined{
 if(lesson.id.includes('-source-guide-'))return require('./source-guides.json').guides.find((l:ManufacturingLesson)=>l.id===lesson.id);
 const pool=lesson.id.includes('-completion37-')?(lesson.specialty==='mechanical'?require('./completion37/mechanical.json'):lesson.specialty==='electrical'?require('./completion37/electrical.json'):lesson.specialty==='surface'?require('./completion37/surface.json'):null):(lesson.specialty==='mechanical'?require('./mechanical.json'):lesson.specialty==='electrical'?require('./electrical.json'):lesson.specialty==='surface'?require('./surface.json'):null);
 return pool?.lessons.find((l:ManufacturingLesson)=>l.id===lesson.id);
}
function current(lesson:ManufacturingLesson):Binding|undefined{
 const binding=registry.lessons[lesson.id];
 if(registry.schemaVersion!==1||registry.revision!=='companion-fields-20261107-v1'||!registry.studyOnly||!binding||binding.sourceHash!==lesson.sourceHash)return;
 const canonical=canonicalLesson(lesson);
 return canonical&&canonical.sourceHash===lesson.sourceHash&&canonical.specialty===lesson.specialty&&canonical.titleJa===lesson.titleJa&&canonical.objectiveJa===lesson.objectiveJa&&canonical.summaryJa===lesson.summaryJa&&JSON.stringify(canonical.paragraphs)===JSON.stringify(lesson.paragraphs)?binding:undefined;
}
function checked(id:string|undefined):Reading|undefined{
 const row=id?registry.readings[id]:undefined;
 if(!row||typeof row.sourceJapanese!=='string'||!Array.isArray(row.parts)||!row.parts.length||row.parts.map(p=>p?.text).join('')!==row.sourceJapanese||row.parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return row;
}
export function manufacturingCompanionFieldReading(lesson:ManufacturingLesson,paragraphId:string,field:'title'|'text',text:string):CompanionReadingPart[]|undefined{
 const row=checked(current(lesson)?.fields[paragraphId+'.'+field]);return row?.sourceJapanese===text?row.parts:undefined;
}
/** Compose only whole current paragraph readings; image captions never infer substrings or neighbours. */
export function manufacturingCompanionCaptionReading(lesson:ManufacturingLesson,item:SupplementalDiagram):CompanionReadingPart[]|undefined{
 const binding=current(lesson);
 if(!binding||item.lessonId!==lesson.id||item.lessonSourceHash!==lesson.sourceHash)return;
 for(const entry of binding.images[item.id]??[]){
  if(entry.assetFile!==item.assetFile||entry.width!==item.width||entry.height!==item.height)continue;
  const rows=entry.readings.map(checked);if(!rows.length||rows.some(row=>!row)||rows.map(row=>row!.sourceJapanese).join('\n\n')!==item.captionJa)continue;
  return rows.flatMap((row,i)=>i?[{text:'\n'},{text:'\n'},...row!.parts]:row!.parts);
 }
}
