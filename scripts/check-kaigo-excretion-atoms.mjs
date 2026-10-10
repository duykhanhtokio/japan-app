import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const path='src/data/kaigo/atomic-supplements.json',r=read(path),d=read('docs/ssw-workspace/kaigo/drafts/atomic-supplements-2026-10-09.json');
const a=read('docs/ssw-workspace/kaigo/reviews/excretion-source-atoms-2026-10-10.json');
const sorted=x=>Array.isArray(x)?x.map(sorted):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sorted(x[k])])):x;
function check(a){
 assert.equal(a.sourceSha256,'997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54');
 assert.equal(a.runtimeSha256,createHash('sha256').update(fs.readFileSync(path)).digest('hex'));
 assert.equal(a.wholeDocumentCoveragePercent,null);assert.equal(a.fullScopeAtomInventoryCertified,false);assert.equal(a.humanReviewed,false);assert.equal(a.releaseReady,false);
 assert.equal(new Set(a.atoms.map(x=>x.id)).size,a.atoms.length);
 for(const page of a.scopePrintedPages){assert(a.visualPagesChecked.includes(page));assert(a.atoms.some(x=>x.printedPage===page));}
 for(const x of a.atoms){
  const unit=r.units.find(u=>u.points.some(p=>p.id===x.runtimePointId));assert(unit);
  const p=unit.points.find(p=>p.id===x.runtimePointId);assert.equal(p.explanationVi,x.appEquivalentVi);
  assert.equal(x.pdfPage,x.printedPage+2);assert.equal(x.visualPageChecked,true);assert.equal(x.humanReviewed,false);
  assert(r.days.some(day=>day.day===x.runtimeDay&&day.unitIds.includes(unit.id)));
 }
 for(const u of r.units){
  assert.deepEqual(u.points,d.units.find(v=>v.id===u.id).points);
  const {contentRevision,...content}=u;assert.equal(contentRevision,createHash('sha256').update(JSON.stringify(sorted(content))).digest('hex'));
 }
 assert.equal(r.units.length,87);assert(r.units.reduce((n,u)=>n+u.points.length,0)>=497);
 assert.equal(read('src/data/kaigo/daily-plan.json').totalDays,144);
 assert(!/sourceSha256|sourcePrintedPages|https?:|\.pdf/.test(JSON.stringify(r)));
}
check(a);let negativeControlsRejected=0;
for(const mutate of [x=>x.atoms[0].runtimePointId='missing',x=>x.atoms[0].appEquivalentVi='wrong',x=>x.atoms[0].pdfPage=1,x=>x.visualPagesChecked.pop()]){
 const x=structuredClone(a);mutate(x);assert.throws(()=>check(x));negativeControlsRejected++;
}
console.log(JSON.stringify({status:'PASS_LINKS_NOT_FULL_SOURCE_CERTIFICATION',excretionAtoms:a.atoms.length,pages:18,points:r.units.reduce((n,u)=>n+u.points.length,0),units:87,days:144,negativeControlsRejected,fullSourceCoverage:false,nativeDeviceTested:false}));
