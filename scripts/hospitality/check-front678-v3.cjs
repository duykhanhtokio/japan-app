const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),cp=require('child_process'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..'),baseline='d38397e7569b136777ba2c219ab0df56d9c4eee1',ids=['hotel-front-06','hotel-front-07','hotel-front-08'],locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),old=p=>JSON.parse(cp.execFileSync('git',['show',`${baseline}:${p}`],{cwd:root,encoding:'utf8'}));
for(const g of ['front']){const p=`src/data/hospitality/${g}.json`;assert.deepEqual(read(p),old(p),'Japanese front canonical must remain stable');}
let pairs=0,preservedOutside=0,preservedOldQuestions=0;
const source=read('docs/ssw-workspace/hospitality/source-v2-front678-translation-source.json');
for(const locale of locales){const p=`src/data/hospitality/translations/${locale}/front.json`,data=read(p),before=old(p);
for(const l of before.lessons){const now=data.lessons.find(x=>x.id===l.id);assert(now);if(!ids.includes(l.id)){assert.deepEqual(now,l);preservedOutside++;continue;}
const expected=structuredClone(now);for(const q of l.questions){const n=now.questions.find(x=>x.id===q.id);assert.deepEqual(n,q,`${locale}/${q.id} original translation immutable`);preservedOldQuestions++;}
for(const f of ['title','reading','objectives','terms','example','practice','illustration'])assert.deepEqual(now[f],l[f],`${locale}/${l.id}/${f}`);
for(let i=0;i<l.sections.length;i++){if(l.id==='hotel-front-06'&&i===3){assert(now.sections[i].body.startsWith(l.sections[i].body+'\n\n'));assert.equal(now.sections[i].title,l.sections[i].title);}else assert.deepEqual(now.sections[i],l.sections[i]);}}
for(const s of source.lessons){const t=data.lessons.find(x=>x.id===s.id);if(!t)continue;assert.equal(t.sourceRevision,s.revision);assert.equal(t.status,'translated_ai_unreviewed');assert.equal(t.questions.length,s.questions.length);for(let i=0;i<s.questions.length;i++){assert.equal(t.questions[i].id,s.questions[i].id);assert.equal(t.questions[i].answerIndex,s.questions[i].answerIndex);}pairs++;}}
if(process.argv.includes('--require-36'))assert.equal(pairs,36);
console.log(JSON.stringify({status:'PASS_FRONT678_V3',currentPairs:pairs,requiredBatchPairs:36,preservedOutsideFrontLessons:preservedOutside,preservedExistingQuestionTranslations:preservedOldQuestions,japaneseFrontCanonicalUnchanged:true,nativeReviewed:false}));
