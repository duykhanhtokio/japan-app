import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {stripTypeScriptTypes} from 'node:module';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import vm from 'node:vm';
const out=fileURLToPath(new URL('./',import.meta.url)),root=resolve(out,'../../../../..'),data=resolve(root,'src/data/manufacturing');
const read=p=>JSON.parse(readFileSync(p,'utf8')),sha=text=>createHash('sha256').update(text).digest('hex');
const locales=['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const source=stripTypeScriptTypes(readFileSync(resolve(data,'editorial-translations.ts'),'utf8')).replaceAll('export ','');
const context={require(name){return read(resolve(data,name));},result:null};
vm.runInNewContext(source+'\nresult={revisedManufacturingLessonTranslation};',context);
const translations=Object.fromEntries(locales.map(locale=>[locale,read(resolve(data,'translations',locale+'.json')).lessons]));
const lessons={};let count=0,fields=0;
for(const specialty of ['mechanical','electrical','surface']){
 const file=`src/data/manufacturing/${specialty}.json`,canonical=read(resolve(root,file));
 const planFile=resolve(out,'..',specialty,'caption-plan.json');
 const bindingsFile=resolve(out,'..',specialty,'daily-bindings.json');
 let provided=null,providedFile=null;
 if(existsSync(bindingsFile)){provided=read(bindingsFile);providedFile=bindingsFile;}
 else if(existsSync(planFile)){provided=read(planFile);providedFile=planFile;}
 const chosen=provided ? (provided.bindings??provided.days??provided.lessons) : null;
 for(const lesson of canonical.lessons){
  const bound=chosen ? chosen.find(x=>x.lessonId===lesson.id) : null;
  if(bound){assert.equal(bound.captionJa,lesson.summaryJa);assert.equal(bound.altJa,lesson.titleJa);assert.equal(bound.lessonSourceHash??bound.sourceHash,lesson.sourceHash);}
  const captionJa=lesson.summaryJa,altJa=lesson.titleJa;
  const targets={};
  for(const locale of locales){
   const raw=translations[locale][lesson.id];assert.equal(raw.sourceHash,lesson.sourceHash);
   const effective=context.result.revisedManufacturingLessonTranslation(lesson,locale,raw);
   assert.ok(effective.summary.trim()&&effective.title.trim());
   targets[locale]={caption:effective.summary,alt:effective.title,sourceHash:lesson.sourceHash,captionSourceHash:sha(captionJa),altSourceHash:sha(altJa),translatedDirectlyFrom:'ja',origin:'exact_existing_current_lesson_translation_reuse',sourceFile:`src/data/manufacturing/translations/${locale}.json`,captionSourceField:`/lessons/${lesson.id}/summary`,altSourceField:`/lessons/${lesson.id}/title`,nativeReviewed:false,domainReviewed:false};
   fields+=2;
  }
  lessons[lesson.id]={specialty,lessonSourceHash:lesson.sourceHash,captionJa,altJa,captionSourceHash:sha(captionJa),altSourceHash:sha(altJa),captionSourceField:'summaryJa',altSourceField:'titleJa',captionPlanValidated:Boolean(bound),planFile:providedFile?.slice(root.length+1)??null,locales:targets};count++;
 }
}
const result={schemaVersion:1,status:'exact_existing_current_translation_reuse',scope:'262 actual core study-day illustration captions and alt labels; image relevance/display acceptance remains separate.',locales,lessonCount:count,translatedFieldCount:fields,newlyAuthoredTranslations:0,lessons,nativeReviewed:false,domainReviewed:false};
assert.equal(count,262);assert.equal(fields,6288);
writeFileSync(resolve(out,'daily-translations.json'),JSON.stringify(result,null,2)+'\n');
console.log(`DAILY TARGET BINDINGS PASS: ${count} canonical summary/title pairs ×12locales =${fields} source-bound existing target fields; validated plans ${Object.values(lessons).filter(x=>x.captionPlanValidated).length}.`);
