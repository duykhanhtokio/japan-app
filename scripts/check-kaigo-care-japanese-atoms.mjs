import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const path='src/data/kaigo/atomic-supplements.json',r=read(path),d=read('docs/ssw-workspace/kaigo/drafts/atomic-supplements-2026-10-09.json'),c=read('src/data/kaigo/content.json');
const a=read('docs/ssw-workspace/kaigo/reviews/care-japanese-source-atoms-2026-10-10.json');
const sorted=x=>Array.isArray(x)?x.map(sorted):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sorted(x[k])])):x;
function check(a){
 assert.equal(a.sourceSha256,'997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54');
 assert.equal(a.runtimeSha256,hash(path));assert.equal(a.termsRuntimeSha256,hash('src/data/kaigo/content.json'));
 assert.deepEqual(a.scopePrintedPages,[203,204,205,206,207,208]);assert.equal(a.atoms.length,216);
 assert.equal(a.existingSourceLexicalRecords,110);assert.equal(a.newVocabularyEntries,0);
 assert.equal(a.wholeDocumentCoveragePercent,null);assert.equal(a.fullScopeAtomInventoryCertified,false);assert.equal(a.humanReviewed,false);assert.equal(a.releaseReady,false);
 assert.equal(new Set(a.atoms.map(x=>x.id)).size,a.atoms.length);
 assert.equal(new Set(a.atoms.filter(x=>x.sourceLexicalId).map(x=>x.sourceLexicalId)).size,110);
 for(const page of a.scopePrintedPages){assert(a.visualPagesChecked.includes(page));assert(a.atoms.some(x=>x.printedPage===page));}
 for(const x of a.atoms){
  assert.equal(x.pdfPage,x.printedPage+2);assert.equal(x.visualPageChecked,true);assert.equal(x.humanReviewed,false);
  if(x.runtimeTermId){const t=c.terms.find(t=>t.id===x.runtimeTermId);assert(t);for(const k of ['termJa','readingJa','meaningVi'])assert.equal(x[k],t[k]);assert.equal(x.appEquivalentVi,t.meaningVi);for(const day of x.runtimeDays)assert(c.lessons.some(l=>l.day===day&&l.termIds.includes(t.id)));}
  else{const u=r.units.find(u=>u.points.some(p=>p.id===x.runtimePointId));assert(u);assert.equal(u.points.find(p=>p.id===x.runtimePointId).explanationVi,x.appEquivalentVi);assert(r.days.some(day=>day.day===x.runtimeDay&&day.unitIds.includes(u.id)));}
 }
 for(const u of r.units){assert.deepEqual(u.points,d.units.find(v=>v.id===u.id).points);const {contentRevision,...content}=u;assert.equal(contentRevision,createHash('sha256').update(JSON.stringify(sorted(content))).digest('hex'));}
 assert.equal(r.units.length,87);assert(r.units.reduce((n,u)=>n+u.points.length,0)>=536);assert.equal(c.terms.length,369);assert.equal(c.mocks.length,12);assert(read('src/data/kaigo/daily-plan.json').totalDays>=144);
 assert(!/sourceSha256|sourcePrintedPages|https?:|\.pdf/.test(JSON.stringify(r)));
}
check(a);let negativeControlsRejected=0;
for(const mutate of [x=>x.atoms[0].runtimeTermId='missing',x=>x.atoms[0].readingJa='wrong',x=>x.atoms[0].appEquivalentVi='wrong',x=>x.atoms[0].pdfPage=1,x=>x.visualPagesChecked.pop()]){const x=structuredClone(a);mutate(x);assert.throws(()=>check(x));negativeControlsRejected++;}
console.log(JSON.stringify({status:'PASS_LINKS_NOT_FULL_SOURCE_CERTIFICATION',atoms:216,existingLexicalRecords:110,newVocabularyEntries:0,pages:6,points:r.units.reduce((n,u)=>n+u.points.length,0),negativeControlsRejected,nativeDeviceTested:false}));
