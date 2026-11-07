import type {ManufacturingLesson} from './index';
import registry from './week02-companion-readings.json';
import source from './royal-week02-companion-figures.json';
type Part={text:string;reading?:string};
type Entry={expectedCurrentRow:{sourceHash:string;assetFile:string;sha256:string;width:number;height:number;paragraphIds:string[];captionJa:string};expectedCurrentJapanese:{sourceHash:string;title:string;summary:string;paragraphs:{id:string;title:string;text:string}[]};fields:Record<string,{sourceJapanese:string;parts:Part[]}>};
export function week02CompanionReading(lesson:ManufacturingLesson,field:string,text:string):Part[]|undefined{
 const data=(registry.lessons as Record<string,Entry>)[lesson.id],row=(source.lessons as Record<string,Entry['expectedCurrentRow']&{locales:Record<string,Entry['expectedCurrentJapanese']>}>)[lesson.id];
 if(registry.schemaVersion!==1||registry.revision!=='week02-companion-current-source-readings-20261107-v1'||!registry.studyOnly||!data||!row)return;
 const bound=data.expectedCurrentRow,ja=row.locales.ja;
 if(!ja||Object.entries(bound).some(([k,v])=>JSON.stringify(row[k as keyof typeof row])!==JSON.stringify(v))||JSON.stringify(ja)!==JSON.stringify(data.expectedCurrentJapanese)||row.sourceHash!==lesson.sourceHash||ja.sourceHash!==lesson.sourceHash||row.captionJa!==lesson.summaryJa||ja.title!==lesson.titleJa)return;
 const pool=[...require('./mechanical.json').lessons,...require('./electrical.json').lessons,...require('./surface.json').lessons,...require('./completion37/mechanical.json').lessons,...require('./completion37/electrical.json').lessons,...require('./completion37/surface.json').lessons,...require('./source-guides.json').guides] as ManufacturingLesson[],canonical=pool.find(l=>l.id===lesson.id);
 if(!canonical||canonical.specialty!==lesson.specialty||canonical.sourceHash!==lesson.sourceHash||canonical.titleJa!==lesson.titleJa||canonical.summaryJa!==lesson.summaryJa||canonical.objectiveJa!==lesson.objectiveJa||JSON.stringify(canonical.paragraphs)!==JSON.stringify(lesson.paragraphs)||ja.paragraphs.some(p=>{const current=lesson.paragraphs.find(x=>x.id===p.id);return !current||current.titleJa!==p.title||current.textJa!==p.text;}))return;
 const entry=data.fields[field],parts=entry?.parts;
 if(!entry||entry.sourceJapanese!==text||!Array.isArray(parts)||!parts.length||parts.map(p=>p?.text).join('')!==text||parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return parts;
}
