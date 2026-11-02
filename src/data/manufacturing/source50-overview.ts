import type {ManufacturingLesson} from './index';
import type {Source49Segment} from './source49-readings';
type Wording={before:string;after:string;ruby?:Source49Segment[];effectiveJapaneseSha256?:string};
type Paragraph={paragraphId:string;canonicalTaughtAfter:string;effectiveJapaneseSha256:string;wording:Record<string,Wording>};
type Payload={lessonId:string;sourceHash:string;paragraphs:Paragraph[]};
let data:Payload|undefined;
function binding(lesson:ManufacturingLesson,id:string):Paragraph|undefined {
 if(lesson.id!=='mfg1-electrical-l043'||!['section-1','section-2','section-3'].includes(id))return;
 // eslint-disable-next-line @typescript-eslint/no-require-imports -- Load only for the existing overview study day.
 const p=data??(data=require('./source50-overview.json') as Payload);
 if(p.lessonId!==lesson.id||p.sourceHash!==lesson.sourceHash)return;
 const row=p.paragraphs.find(r=>r.paragraphId===id);
 return row&&row.wording.ja.after===row.canonicalTaughtAfter&&lesson.paragraphs.find(r=>r.id===id)?.textJa===row.wording.ja.before?row:undefined;
}
export function manufacturingSource50Paragraph(lesson:ManufacturingLesson,id:string,locale:string,text:string|undefined):string|undefined {
 const row=binding(lesson,id);if(!row||!Object.prototype.hasOwnProperty.call(row.wording,locale))return text;
 const w=row.wording[locale];
 return text===w.before&&typeof w.after==='string'&&w.after.startsWith(w.before+'\n')&&(locale==='ja'||w.effectiveJapaneseSha256===row.effectiveJapaneseSha256)?w.after:text;
}
export function manufacturingSource50Reading(lesson:ManufacturingLesson,id:string,text:string|undefined):Source49Segment[]|undefined {
 const row=binding(lesson,id),w=row?.wording.ja;if(!w||text!==w.after||!w.ruby?.length||w.ruby.map(s=>s.text).join('')!==text)return;
 // Segment0 preserves the existing body; every NEW kanji-bearing segment needs an authored reading.
 if(w.ruby.slice(1).some(s=>/[一-龯々]/.test(s.text)&&(!s.reading||!/^[ぁ-ゖー]+$/.test(s.reading))))return;
 return w.ruby;
}
