import type {ManufacturingLesson,ManufacturingQuestion,ManufacturingExam,Specialty,SourceRef} from '../index';
import type {QuestionTranslation} from '../translations';

export type RecognitionAsset={id:string;file:string;width:number;height:number;altJa:string;sha256:string;role?:string};
export type RecognitionQuestion=ManufacturingQuestion&{imageAssetIds:string[];imageAssetHashes:Record<string,string>};
export type RecognitionPack={id:string;lessonIds:string[];lessonSourceHashes:Record<string,string>;titleJa:string;captionJa:string;captionSourceHash:string;assets:RecognitionAsset[];questions:RecognitionQuestion[]};
type Binding={revision:string;captionSourceHash:string;lessonSourceHashes:Record<string,string>;assetHashes:Record<string,string>;questionHashes:Record<string,string>};
type LocaleFile={locale:string;packs:Record<string,{caption:string;captionSourceHash:string;questions:Record<string,QuestionTranslation>}>};
let cached:RecognitionPack[]|null=null;
let sourceLessons:Map<string,ManufacturingLesson>|null=null;
const bindings=require('./bindings.json').packs as Record<string,Binding>;
const specialties:Specialty[]=['mechanical','electrical','surface'];
function packs():RecognitionPack[]{
 return cached??(cached=[...require('./core/mechanical.json').packs,...require('./core/measurement.json').packs,...require('./core/materials.json').packs,...require('./core/processes.json').packs,...require('./core/finishing.json').packs] as RecognitionPack[]);
}
function lessons():Map<string,ManufacturingLesson>{
 if(sourceLessons)return sourceLessons;
 const entries:ManufacturingLesson[]=[...require('../mechanical.json').lessons,...require('../electrical.json').lessons,...require('../surface.json').lessons,...require('../source-guides.json').guides,...require('../completion37/mechanical.json').lessons,...require('../completion37/electrical.json').lessons,...require('../completion37/surface.json').lessons];
 return sourceLessons=new Map(entries.map(lesson=>[lesson.id,lesson]));
}
function active(pack:RecognitionPack):boolean{
 const bound=bindings[pack.id];
 return !!bound&&bound.captionSourceHash===pack.captionSourceHash
  &&pack.lessonIds.every(id=>lessons().get(id)?.sourceHash===bound.lessonSourceHashes[id]&&pack.lessonSourceHashes[id]===bound.lessonSourceHashes[id])
  &&pack.assets.every(asset=>bound.assetHashes[asset.id]===asset.sha256)
  &&pack.questions.every(q=>bound.questionHashes[q.id]===q.sourceHash&&q.imageAssetIds.every(id=>q.imageAssetHashes[id]===bound.assetHashes[id]));
}
function locales(locale:string):LocaleFile|null{
 switch(locale){
  case 'en':return require('./locales/en.json') as LocaleFile;
  case 'vi':return require('./locales/vi.json') as LocaleFile;
  case 'id':return require('./locales/id.json') as LocaleFile;
  case 'zh-CN':return require('./locales/zh-CN.json') as LocaleFile;
  case 'zh-TW':return require('./locales/zh-TW.json') as LocaleFile;
  case 'hi':return require('./locales/hi.json') as LocaleFile;
  case 'bn':return require('./locales/bn.json') as LocaleFile;
  case 'ne':return require('./locales/ne.json') as LocaleFile;
  case 'my':return require('./locales/my.json') as LocaleFile;
  case 'th':return require('./locales/th.json') as LocaleFile;
  case 'km':return require('./locales/km.json') as LocaleFile;
  case 'tl':return require('./locales/tl.json') as LocaleFile;
  default:return null;
 }
}
const shortId=(pack:RecognitionPack)=>pack.id.replace(/^mfg37-required-/,'');
const lessonId=(s:Specialty,pack:RecognitionPack)=>`mfg1-${s}-recognition38-${shortId(pack)}`;
const relevant=(s:Specialty,pack:RecognitionPack)=>pack.lessonIds.some(id=>id.startsWith('mfg1-'+s+'-'));
export function manufacturingRecognitionPacks():RecognitionPack[]{return packs().filter(active);}
export function manufacturingRecognitionLessons(specialty:Specialty):ManufacturingLesson[]{
 return manufacturingRecognitionPacks().filter(pack=>relevant(specialty,pack)).map(pack=>({id:lessonId(specialty,pack),specialty,titleJa:pack.titleJa,objectiveJa:pack.captionJa,paragraphs:[],terms:[],activityJa:'図と設問で確認します。',safetyJa:[],summaryJa:pack.captionJa,sourceHash:bindings[pack.id].revision,sources:pack.questions.flatMap(q=>q.sources).filter((ref:SourceRef,index,array)=>array.findIndex(x=>x.documentId===ref.documentId&&x.pdfPage===ref.pdfPage)===index),estimatedMinutes:Math.max(10,Math.min(30,pack.questions.length*3)),reviewStatus:'ai_source_compared_recognition_not_professional_signoff'}));
}
export function manufacturingRecognitionPackForLesson(lesson:ManufacturingLesson):RecognitionPack|null{
 if(!lesson.id.includes('-recognition38-'))return null;
 return manufacturingRecognitionPacks().find(pack=>relevant(lesson.specialty,pack)&&lessonId(lesson.specialty,pack)===lesson.id&&bindings[pack.id].revision===lesson.sourceHash)??null;
}
export function manufacturingRecognitionChecks(specialty:Specialty):ManufacturingExam[]{
 return manufacturingRecognitionPacks().filter(pack=>relevant(specialty,pack)).map(pack=>({id:`mfg1-${specialty}-recognition38-check-${shortId(pack)}`,revision:bindings[pack.id].revision,titleJa:pack.titleJa+'・確認',kind:'weekly',officialSimulation:false,weekId:'recognition38',questions:pack.questions}));
}
function questionPack(question:ManufacturingQuestion):{pack:RecognitionPack;source:RecognitionQuestion}|null{
 if(!question.id.startsWith('mfg38-')&&!question.id.startsWith('mfg37-required-'))return null;
 for(const pack of manufacturingRecognitionPacks()){
  const source=pack.questions.find(q=>q.id===question.id&&q.sourceHash===question.sourceHash);
  if(source&&source.stemJa===question.stemJa&&source.correctIndex===question.correctIndex
   &&JSON.stringify(source.optionsJa)===JSON.stringify(question.optionsJa)
   &&JSON.stringify(source.optionReasonsJa)===JSON.stringify(question.optionReasonsJa)){
   const input=question as RecognitionQuestion;
   if(JSON.stringify(input.imageAssetIds)!==JSON.stringify(source.imageAssetIds)||JSON.stringify(input.imageAssetHashes)!==JSON.stringify(source.imageAssetHashes))return null;
   return {pack,source};
  }
 }
 return null;
}
export function manufacturingRecognitionCaption(pack:RecognitionPack,locale:string):string|null{
 if(!active(pack))return null;const file=locales(locale),target=file?.packs[pack.id];
 return file?.locale===locale&&target?.captionSourceHash===pack.captionSourceHash&&typeof target.caption==='string'&&target.caption.trim()?target.caption:null;
}
export function manufacturingRecognitionQuestionTranslation(question:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 const found=questionPack(question);if(!found)return null;const file=locales(locale),entry=file?.packs[found.pack.id]?.questions[question.id];
 return file?.locale===locale&&entry?.sourceHash===question.sourceHash&&typeof entry.stem==='string'&&!!entry.stem.trim()
  &&Array.isArray(entry.options)&&entry.options.length===4&&entry.options.every(x=>typeof x==='string'&&x.trim())
  &&Array.isArray(entry.reasons)&&entry.reasons.length===4&&entry.reasons.every(x=>typeof x==='string'&&x.trim())?entry:null;
}
export function manufacturingRecognitionQuestionAssets(question:ManufacturingQuestion):{pack:RecognitionPack;assets:RecognitionAsset[]}|null{
 const found=questionPack(question);if(!found)return null;
 const assets=found.source.imageAssetIds.map(id=>found.pack.assets.find(a=>a.id===id));
 if(assets.some(a=>!a||a.role==='teaching'||a.role==='post_submission_teaching'))return null;
 return {pack:found.pack,assets:assets as RecognitionAsset[]};
}
export const manufacturingRecognitionSpecialties=specialties;
