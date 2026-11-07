import type {ManufacturingLesson} from './index';
import {manufacturingRecognitionPackForLesson,manufacturingRecognitionLessons,type RecognitionPack} from './recognition38';
import registry from './recognition-caption-readings.json';
type Part={text:string;reading?:string};
type Entry={expectedPack:Record<string,unknown>;bindingRevision:string;afterJapanese:string;parts:Part[]};
/** Study-only full canonical source/pack/asset/before-caption bindings. Never used by quiz figures. */
export function recognitionCaptionDisplay(lesson:ManufacturingLesson,pack:RecognitionPack,enabled=true):{text:string;parts:Part[]}|undefined{
 const data=(registry.packs as Record<string,Entry>)[pack.id];
 if(!enabled||registry.schemaVersion!==1||registry.revision!=='recognition-caption-source-readings-20261107-v1'||!registry.studyOnly||!data||lesson.sourceHash!==data.bindingRevision)return;
 const selected=manufacturingRecognitionPackForLesson(lesson),canonical=manufacturingRecognitionLessons(lesson.specialty).find(l=>l.id===lesson.id);
 if(!selected||!canonical||selected.id!==pack.id||canonical.sourceHash!==lesson.sourceHash||canonical.titleJa!==lesson.titleJa||canonical.objectiveJa!==lesson.objectiveJa||canonical.summaryJa!==lesson.summaryJa||JSON.stringify(canonical.paragraphs)!==JSON.stringify(lesson.paragraphs))return;
 const fingerprint=(p:RecognitionPack)=>({id:p.id,titleJa:p.titleJa,captionJa:p.captionJa,captionSourceHash:p.captionSourceHash,lessonIds:p.lessonIds,lessonSourceHashes:p.lessonSourceHashes,assets:p.assets,questionBindings:p.questions.map(q=>({id:q.id,sourceHash:q.sourceHash,imageAssetIds:q.imageAssetIds,imageAssetHashes:q.imageAssetHashes}))});
 if(JSON.stringify(fingerprint(pack))!==JSON.stringify(data.expectedPack)||JSON.stringify(fingerprint(selected))!==JSON.stringify(data.expectedPack))return;
 const pool=[...require('./mechanical.json').lessons,...require('./electrical.json').lessons,...require('./surface.json').lessons,...require('./completion37/mechanical.json').lessons,...require('./completion37/electrical.json').lessons,...require('./completion37/surface.json').lessons,...require('./source-guides.json').guides] as ManufacturingLesson[];
 for(const id of pack.lessonIds){const expected=(registry.sourceLessons as Record<string,Record<string,unknown>>)[id],current=pool.find(l=>l.id===id);if(!expected||!current||Object.entries(expected).some(([k,v])=>JSON.stringify(current[k as keyof ManufacturingLesson])!==JSON.stringify(v)))return;}
 const after=pack.id==='mfg37-required-hole-weld-annotations'?pack.captionJa.replace('実施工','実際の施工'):pack.captionJa,parts=data.parts;
 if(data.afterJapanese!==after||!Array.isArray(parts)||!parts.length||parts.map(p=>p?.text).join('')!==after||parts.some(p=>!p||typeof p.text!=='string'||!p.text||(/[一-龯々]/.test(p.text)&&(!p.reading||!/^[ぁ-ゖー]+$/.test(p.reading)))||(p.reading!==undefined&&!/^[ぁ-ゖー]+$/.test(p.reading))))return;
 return {text:after,parts};
}
