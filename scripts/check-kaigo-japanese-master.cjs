const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root;
const esbuild=require(require.resolve('esbuild',{paths:[modules]}));
const code=esbuild.buildSync({stdin:{contents:`export * from './src/data/kaigo/japanese-master';export * from './src/data/kaigo/japanese-reading';export * from './src/data/kaigo/catalog';`,resolveDir:root},bundle:true,write:false,platform:'node',format:'cjs',logLevel:'error'}).outputFiles[0].text;
const box={exports:{}};new Function('module','exports',code)(box,box.exports);const m=box.exports;
const baseline=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/kaigo/japanese-master/preservation-baseline.json')));
const crypto=require('crypto');for(const [p,h] of Object.entries(baseline))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'),h,p);
const ids=new Set();let paragraphs=0;
for(const e of m.kaigoCatalog.filter(e=>e.day<=7)){
 const sections=m.japaneseSectionsFor(e);assert(m.japaneseLessonMetadata[e.id]);
 for(const s of sections){assert(!ids.has(s.id));ids.add(s.id);assert(s.japaneseComplete);assert(s.masterStatus);assert(s.headingJa&&!/[À-ỹ]/u.test(s.headingJa));assert(s.paragraphsJa.length>0);for(const p of s.paragraphsJa){assert(p.trim());assert(!/[À-ỹ]/u.test(p));assert(!/^知識を確かめて、理由を説明しましょう。$/.test(p));paragraphs++;}}
}
assert.equal(ids.size,73);assert.equal(paragraphs,246);
const id=Object.keys(m.japaneseMasterSections)[0],master=m.japaneseMasterSections[id];
const translation={sourceRevision:m.japaneseMasterRevision(master),heading:'Reference',paragraphs:master.paragraphsJa.map(()=> 'Direct draft translation'),status:'translated_ai_unreviewed'};
assert.equal(m.translationForMaster(id,'en',{[id]:{en:translation}}),translation);
assert.equal(m.translationForMaster(id,'th',{[id]:{vi:translation}}),undefined,'No Vietnamese fallback');
assert.equal(m.translationForMaster(id,'en',{[id]:{en:translation}},{...m.japaneseMasterSections,[id]:{...master,paragraphsJa:[...master.paragraphsJa,'変更']}}),undefined,'Japanese paragraph edit invalidates translation');
assert.equal(m.translationForMaster(id,'en',{[id]:{en:translation}},{...m.japaneseMasterSections,[id]:{...master,headingJa:'変更'}}),undefined,'Heading edit invalidates translation');
assert.equal(m.translationForMaster('unknown','en',{[id]:{en:translation}}),undefined);
for(const s of Object.values(m.japaneseMasterSections)){assert.equal(s.humanReviewed,false);assert.equal(s.domainReviewed,false);assert.equal(s.nativeReviewed,false);}
const questionDraft=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/kaigo/japanese-master/week-01-questions.draft.json'))),qs=questionDraft.questions;
assert.equal(Object.keys(qs).length,59);for(const q of Object.values(qs)){assert(q.promptJa);assert.equal(q.optionsJa.length,4);assert.equal(new Set(q.optionsJa).size,4);assert.equal(q.rationalesJa.length,4);assert(q.correctIndex>=0&&q.correctIndex<4);assert(!/[À-ỹ]/u.test(JSON.stringify(q)));}
const review=questionDraft.optionRationaleReview;
assert.equal(review.reviewedQuestionCount,59);assert.equal(review.reviewedOptionCount,236);
assert.equal(review.runtimeIntegrated,false);assert.equal(review.humanReviewed,false);assert.equal(review.domainReviewed,false);assert.equal(review.nativeReviewed,false);
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,review.sourceMasterPath))).digest('hex'),review.sourceJapaneseSha256,'Japanese changes require renewed question editorial review');
const core=Object.fromEntries(Object.entries(qs).map(([id,q])=>[id,{promptJa:q.promptJa,optionsJa:q.optionsJa,correctIndex:q.correctIndex}]));
assert.equal(crypto.createHash('sha256').update(JSON.stringify(core)).digest('hex'),review.questionCoreSha256,'Question changes require renewed option-rationale review');
for(const [id,q] of Object.entries(qs)){
 assert.equal(new Set(q.rationalesJa).size,4,`${id}: repeated rationale`);
 for(const explanation of q.rationalesJa){assert(explanation.trim());assert(!explanation.startsWith('この選択肢は場面の条件と一致しません。'),`${id}: generic explanation`);}
}
console.log('KAIGO JAPANESE MASTER PASS: 7 days / 73 sections / 246 paragraphs; legacy source bytes preserved; stale and unsupported translations rejected; 59 question drafts structurally valid (not runtime-integrated).');
