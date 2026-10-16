// Checks exact authorized scope changes, not clinical or native-language approval.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');const resolution=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/kaigo/reviews/JAPANESE_FINAL_SCOPE_RESOLUTION.json')));
const baseline=resolution.baselineCommit;const old=p=>JSON.parse(execFileSync('git',['show',`${baseline}:${p}`],{cwd:root,maxBuffer:16e6}));const read=p=>JSON.parse(fs.readFileSync(path.join(root,p)));let changed=0,paragraphs=0,sections=0;
for(const key of ['humanReviewed','domainReviewed','nativeReviewed','nativeDeviceTested','rightsApproved','releaseReady'])assert.equal(resolution[key],false);
assert.equal(resolution.sourceKnowledgeCoveragePercent,null);assert.equal(resolution.dispositions.length,4);assert.equal(new Set(resolution.dispositions.map(x=>x.id)).size,4);assert.equal(resolution.dispositions.filter(x=>x.status==='excluded_unlabelled_visual_detail').length,2);assert.equal(resolution.dispositions.filter(x=>x.status==='replaced_with_supported_learning').length,2);
for(let week=1;week<=26;week++){
 const n=String(week).padStart(2,'0'),p=`src/data/kaigo/japanese-master/week-${n}.json`,a=read(p),b=old(p);const expected=structuredClone(b);
 for(const patch of resolution.masterPatches.filter(x=>x.week===week)){assert.equal(expected.sections[patch.sectionId].paragraphsJa[patch.paragraphIndex],patch.beforeJa);assert.notEqual(patch.beforeJa,patch.afterJa);expected.sections[patch.sectionId].paragraphsJa[patch.paragraphIndex]=patch.afterJa;changed++;}
 assert.deepEqual(a,expected,`Unrecorded Japanese change week${week}`);sections+=Object.keys(a.sections).length;paragraphs+=Object.values(a.sections).reduce((s,x)=>s+x.paragraphsJa.length,0);
 const qp=`docs/ssw-workspace/kaigo/japanese-master/week-${n}-questions.draft.json`,q=read(qp),before=old(qp);assert.deepEqual(q.questions,before.questions,'Question content changed');assert.equal(q.sourceJapaneseSha256,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'));
}
assert.equal(changed,5);assert.equal(sections,866);assert.equal(paragraphs,5372);console.log(JSON.stringify({status:'PASS_JAPANESE_FINAL_AGREED_SCOPE',baselineCommit:baseline,paragraphsRevised:changed,sections,paragraphs,excluded:2,replaced:2,blockingSourceDetails:0,sourceKnowledgeCoveragePercent:null,humanReviewed:false,domainReviewed:false,nativeReviewed:false}));
