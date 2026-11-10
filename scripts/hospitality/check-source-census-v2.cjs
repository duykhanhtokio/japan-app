const fs=require('fs'),assert=require('node:assert/strict'),cp=require('child_process'),path=require('path');
const root=path.resolve(__dirname,'../..'),baseline='5ff65af0fe2ec63eb0b47c250212fd5dcc7c3c6a';
const load=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=p=>JSON.parse(cp.execFileSync('git',['show',`${baseline}:${p}`],{cwd:root,encoding:'utf8'}));
let preservedLessons=0,preservedQuestions=0;
for(const group of ['front','planning','service','restaurant','safety']){
 const p=`src/data/hospitality/${group}.json`,before=old(p),after=load(p);
 assert.deepEqual(before.lessons.map(l=>l.id),after.lessons.map(l=>l.id));
 for(const a of before.lessons){const b=after.lessons.find(x=>x.id===a.id);for(const s of a.sections){const t=b.sections.find(x=>x.id===s.id);if(a.id==='hotel-planning-01'&&s.id==='hotel-planning-01-needs')continue;if(a.id==='hotel-planning-04'&&s.id==='hotel-planning-04-content'){assert(t.body.startsWith(s.body+'\n\n'));assert.equal(t.title,s.title);}else assert.deepEqual(t,s,`${a.id}/${s.id} unchanged section`);}
 for(const q of a.questions){const n=b.questions.find(x=>x.id===q.id);assert(n);assert.equal(n.answerIndex,q.answerIndex);if(q.id==='hotel-planning-01-q09')continue;for(const k of ['prompt','choices','explanation'])assert.deepEqual(n[k],q[k],`${q.id}/${k}`);preservedQuestions++;}preservedLessons++;}
}
const jp=load('src/data/hospitality/planning.json');const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
for(const locale of locales){const data=load(`src/data/hospitality/translations/${locale}/planning.json`);for(const id of ['hotel-planning-01','hotel-planning-04']){const s=jp.lessons.find(x=>x.id===id),t=data.lessons.find(x=>x.id===id);assert.equal(t.sourceRevision,s.revision);assert.equal(t.status,'translated_ai_unreviewed');assert.equal(t.questions.length,s.questions.length);for(let i=0;i<s.questions.length;i++){assert.equal(t.questions[i].id,s.questions[i].id);assert.equal(t.questions[i].answerIndex,s.questions[i].answerIndex);} }}
const registry=load('docs/ssw-workspace/source-coverage-v2/hospitality.json');const prior=JSON.parse(cp.execFileSync('git',['show',`d38397e7569b136777ba2c219ab0df56d9c4eee1:docs/ssw-workspace/source-coverage-v2/hospitality.json`],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}));for(const u of prior.knowledgeUnits)assert(registry.knowledgeUnits.some(v=>v.knowledgeId===u.knowledgeId),'Existing source unit must be preserved');assert.equal(registry.wholeSourceKnowledgeCovered,false);
cp.execFileSync(process.execPath,['scripts/source-coverage-v2/check.cjs','docs/ssw-workspace/source-coverage-v2/hospitality.json'],{cwd:root,stdio:'inherit'});
console.log(JSON.stringify({status:'PASS_HOSPITALITY_V2_PRESERVATION',baseline,preservedLessonIds:preservedLessons,preservedExistingQuestionWording:preservedQuestions,allExistingAnswerIndexesPreserved:true,currentPlanningLocalePairs:24,wholeSourceKnowledgeCovered:false}));
