import type {ManufacturingLesson} from './index';
import type {Source49Segment} from './source49-readings';
type Wording={before:string;after:string;ruby?:Source49Segment[];effectiveJapaneseSha256?:string};
type Payload={lessonId:string;paragraphId:string;sourceHash:string;effectiveJapaneseSha256:string;canonicalTaughtAfter:string;wording:Record<string,Wording>};
let data:Payload|undefined;
function binding(lesson:ManufacturingLesson,id:string):Payload|undefined {
 if(lesson.id!=='mfg1-surface-lesson-027'||id!=='section-2')return;
 // eslint-disable-next-line @typescript-eslint/no-require-imports -- Only the matching existing study paragraph loads this addition.
 const p=data??(data=require('./source57-acid-hydrogen.json') as Payload);
 return p.lessonId===lesson.id&&p.paragraphId===id&&p.sourceHash===lesson.sourceHash&&p.wording.ja.after===p.canonicalTaughtAfter&&lesson.paragraphs.find(r=>r.id===id)?.textJa===p.wording.ja.before?p:undefined;
}
export function manufacturingSource57Paragraph(lesson:ManufacturingLesson,id:string,locale:string,text:string|undefined):string|undefined {
 const p=binding(lesson,id);if(!p||!Object.prototype.hasOwnProperty.call(p.wording,locale))return text;
 const w=p.wording[locale];return text===w.before&&w.after.startsWith(w.before+'\n')&&(locale==='ja'||w.effectiveJapaneseSha256===p.effectiveJapaneseSha256)?w.after:text;
}
export function manufacturingSource57Reading(lesson:ManufacturingLesson,id:string,text:string|undefined):Source49Segment[]|undefined {
 const p=binding(lesson,id),w=p?.wording.ja;if(!w||text!==w.after||!w.ruby?.length||w.ruby.map(s=>s.text).join('')!==text)return;
 if(w.ruby.slice(1).some(s=>/[一-龯々]/.test(s.text)&&(!s.reading||!/^[ぁ-ゖー]+$/.test(s.reading))))return;
 return w.ruby;
}
