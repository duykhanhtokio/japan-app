import type {ManufacturingLesson} from './index';
import type {SupplementalDiagram} from './supplemental-diagrams';
import type {Source49Segment} from './source49-readings';
import data from './illustration-caption-readings.json';
type Binding={sourceHash:string;titleJa:string;summaryJa:string;paragraphs:unknown};
type Entry={lessonId:string;assetFile:string;width:number;height:number;sourceJapanese:string;parts:Source49Segment[]};
const registry=data as {schemaVersion:number;revision:string;studyOnly:boolean;lessonBindings:Record<string,Binding>;entries:Record<string,Entry>};
export function manufacturingIllustrationCaptionReading(lesson:ManufacturingLesson,item:SupplementalDiagram):Source49Segment[]|undefined{
 const binding=registry.lessonBindings[lesson.id],entry=registry.entries[item.id];
 if(registry.schemaVersion!==1||registry.revision!=='completion-captions-20261107-v1'||!registry.studyOnly||!binding||!entry||entry.lessonId!==lesson.id||item.lessonId!==lesson.id||binding.sourceHash!==lesson.sourceHash||item.lessonSourceHash!==lesson.sourceHash||binding.titleJa!==lesson.titleJa||binding.summaryJa!==lesson.summaryJa||JSON.stringify(binding.paragraphs)!==JSON.stringify(lesson.paragraphs)||entry.assetFile!==item.assetFile||entry.width!==item.width||entry.height!==item.height||entry.sourceJapanese!==item.captionJa||!Array.isArray(entry.parts)||!entry.parts.length||entry.parts.map(p=>p?.text).join('')!==item.captionJa||entry.parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return entry.parts;
}
