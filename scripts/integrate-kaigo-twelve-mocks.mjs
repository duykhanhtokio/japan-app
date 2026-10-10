import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
const dir='docs/ssw-workspace/kaigo/drafts/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),serial=x=>JSON.stringify(x,null,2)+'\n',hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const objectHash=x=>hash(JSON.stringify(canonical(x)));
const baseline=read('docs/ssw-workspace/kaigo/reviews/twelve-mocks-baseline.json'),course=read('src/data/kaigo/content.json'),collection=read(dir+'mock-collection.json');
for(const [k,h] of Object.entries(baseline.unchangedFields))assert.equal(objectHash(course[k]),h,k);
for(const m of baseline.originalMocks)assert.equal(objectHash(course.mocks.find(x=>x.id===m.id)),m.objectSha256,m.id);
const support=read(dir+'kaigo-mock-review-support-twelve-vi.json').entries;
const added=collection.forms.filter(f=>Number(f.id.slice(-2))>=4).map(f=>{
 const m=read(dir+f.path),kind=m.id.includes('skills')?'skills':'japanese';
 const x={id:m.id,version:m.version,titleVi:(kind==='skills'?'Thi thử kỹ năng':'Thi thử tiếng Nhật')+' · Đề '+Number(m.id.slice(-2)),durationMs:m.durationMs,questions:m.questions.map(q=>{
 const vi=support.find(e=>e.questionId===q.id);assert(vi);return{id:q.id,promptJa:q.promptJa,promptVi:vi.promptVi,optionsJa:q.optionsJa,optionsVi:vi.optionsVi,correctIndex:q.correctIndex,rationalesVi:q.rationalesVi,rationalesJa:q.rationalesJa??[],passageJa:q.passageJa??'',passageVi:vi.passageVi??'',figureDescriptionJa:q.figureDescriptionJa??'',figureDescriptionVi:vi.figureDescriptionVi??'',figureKey:q.figurePath?q.figurePath.split('/').at(-1).replace('.svg',''):null,furigana:q.furigana};})};x.contentRevision=hash(serial(x));return x;
});assert.equal(added.length,6);
course.mocks=course.mocks.filter(m=>Number(m.id.slice(-2))<=3).concat(added);assert.equal(course.mocks.length,12);
fs.writeFileSync('src/data/kaigo/content.json',serial(course));
let figures=fs.readFileSync('src/data/kaigo/figures.ts','utf8');
for(const m of added)for(const q of m.questions)if(q.figureKey&&!figures.includes("'"+q.figureKey+"'"))figures=figures.replace('};',` '${q.figureKey}':require('../../../assets/kaigo/practical/${q.figureKey}.png'),\n};`);
fs.writeFileSync('src/data/kaigo/figures.ts',figures);
console.log(JSON.stringify({status:'INTERNAL_TEST_INTEGRATED',forms:12,questions:360,oldFormsUnchanged:6,oldCourseFieldsUnchanged:true,releaseReady:false}));
