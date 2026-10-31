const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'docs/ssw-workspace/hospitality');
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const catalog=[],ledger=[],days=[];
for(const group of ['front','planning','service','restaurant','safety']){
 const file=path.join(root,`src/data/hospitality/${group}.json`),data=JSON.parse(fs.readFileSync(file));
 // Preserve source provenance in authoring documents, never expose it in the learner bundle.
 const author=path.join(out,`${group}-authoring.json`);
 const previous=fs.existsSync(author)?JSON.parse(fs.readFileSync(author)):{lessons:[]};
 const authoring=JSON.parse(JSON.stringify(data));for(const l of authoring.lessons){const old=previous.lessons.find(o=>o.id===l.id);for(const section of l.sections)if(!section.sourceRefs){const refs=old?.sections.find(s=>s.id===section.id)?.sourceRefs;if(refs)section.sourceRefs=refs;}}
 // Write authoring metadata after revisions are computed, so it cannot lag the runtime.

 for(const lesson of data.lessons){
  for(const section of lesson.sections)delete section.sourceRefs;
  delete lesson.revision;lesson.revision=hash(lesson);
  authoring.lessons.find(l=>l.id===lesson.id).revision=lesson.revision;
  catalog.push({id:lesson.id,level:lesson.level,title:lesson.title,reading:lesson.reading,group,revision:lesson.revision,estimatedMinutes:lesson.estimatedMinutes});
  const statuses=Object.fromEntries(locales.map(locale=>{
   const p=path.join(root,`src/data/hospitality/translations/${locale}/${group}.json`);
   if(!fs.existsSync(p))return [locale,'missing'];const t=JSON.parse(fs.readFileSync(p)).lessons.find(l=>l.id===lesson.id);
   return [locale,t?.sourceRevision===lesson.revision?'translated_ai_unreviewed':'missing_or_stale'];
  }));
  days.push({lessonId:lesson.id,level:lesson.level,sectionIds:lesson.sections.map(s=>s.id),objectiveIds:lesson.objectives.map(o=>o.id),bodyCharacters:lesson.sections.reduce((n,s)=>n+s.body.length,0),termCount:lesson.terms.length,questionCount:lesson.questions.length,estimatedMinutes:lesson.estimatedMinutes,durationMeasured:false,translationStatus:statuses,illustrationId:lesson.illustration.id,illustrationRelevantReviewed:false,renderVerified:false,physicalDeviceTested:false});
 }
 fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
 fs.writeFileSync(author,JSON.stringify(authoring,null,2)+'\n');
 const rows=JSON.parse(fs.readFileSync(path.join(out,`${group}-ledger.json`)));
 for(const row of Array.isArray(rows)?rows:rows.units||rows.knowledgeUnits||rows.ledger){const d=days.find(d=>d.lessonId===row.lesson_id);row.translation_status=d?.translationStatus||Object.fromEntries(locales.map(l=>[l,'missing']));ledger.push(row);}
}
fs.writeFileSync(path.join(root,'src/data/hospitality/catalog.json'),JSON.stringify(catalog,null,2)+'\n');
const atomFile=path.join(out,'source-atoms-authoring.json');
const atomInput=fs.existsSync(atomFile)?JSON.parse(fs.readFileSync(atomFile)):null;
const canonicalLedger={schemaVersion:atomInput?2:1,units:ledger,legacyCoverageIsNotAcceptance:true,coverageAuthority:'sourceAtoms contain the current source-first evidence; units retain historical authoring links only.'};
if(atomInput){canonicalLedger.sourceAtoms=atomInput.atoms;canonicalLedger.sourceAudit={baselineCommit:atomInput.baselineCommit,scope:atomInput.scope,pages:atomInput.pages,allSourceKnowledgeCovered:false,translationAction:atomInput.translationAction,supplementalOfficialSources:atomInput.supplementalOfficialSources,sourceFigureDetailRechecks:atomInput.sourceFigureDetailRechecks||[],remainingAcceptanceRequirements:atomInput.remainingAcceptanceRequirements||[]};}
fs.writeFileSync(path.join(out,'knowledge-ledger.json'),JSON.stringify(canonicalLedger,null,2)+'\n');
fs.writeFileSync(path.join(out,'daily-workload.json'),JSON.stringify({schemaVersion:1,days},null,2)+'\n');
let loaders="import type {HotelTranslation} from './types';\nconst loaders:Record<string,()=>{lessons:HotelTranslation[]}>= {\n";
for(const locale of locales)for(const group of ['front','planning','service','restaurant','safety'])if(fs.existsSync(path.join(root,`src/data/hospitality/translations/${locale}/${group}.json`)))loaders+=` '${locale}/${group}':()=>require('./translations/${locale}/${group}.json'),\n`;
loaders+="};\nexport function loadHotelTranslation(id:string,language:string,revision:string):HotelTranslation|null {\n const group=id.split('-')[1],load=loaders[`${language}/${group}`];if(!load)return null;const t=load().lessons.find(t=>t.id===id);return t?.sourceRevision===revision?t:null;\n}\n";
fs.writeFileSync(path.join(root,'src/data/hospitality/translation-loaders.ts'),loaders);
console.log(JSON.stringify({lessons:catalog.length,units:ledger.length,questions:days.reduce((n,d)=>n+d.questionCount,0),bodyCharacters:days.reduce((n,d)=>n+d.bodyCharacters,0)}));
