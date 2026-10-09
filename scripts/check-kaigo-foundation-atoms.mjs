import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const runtimePath='src/data/kaigo/atomic-supplements.json';
const rt=read(runtimePath),audit=read('docs/ssw-workspace/kaigo/reviews/foundation-source-atoms-2026-10-09.json');
const points=new Map(rt.units.flatMap(u=>u.points.map(p=>[p.id,{...p,unitId:u.id}])));
assert.equal(audit.runtimeSha256,createHash('sha256').update(fs.readFileSync(runtimePath)).digest('hex'));
assert.equal(new Set(audit.atoms.map(x=>x.id)).size,audit.atoms.length);
for(const a of audit.atoms){
 assert.equal(a.pdfPage,a.printedPage+2);assert(audit.scopePrintedPages.includes(a.printedPage));assert(audit.visualPagesChecked.includes(a.printedPage));
 const p=points.get(a.runtimePointId);assert(p,'Missing exact point '+a.id);assert.equal(p.explanationVi,a.appEquivalentVi);
 assert(rt.days.some(d=>d.day===a.runtimeDay&&d.unitIds.includes(p.unitId)));assert.equal(a.humanReviewed,false);
 if(a.status==='meaning-linked-qualified')assert(a.qualificationVi);
}
assert.equal(audit.counts.identifiedAtoms,audit.atoms.length);assert.equal(audit.counts.openVisualItems,audit.openItems.length);
assert.equal(audit.fullScopeAtomInventoryCertified,false);assert.equal(audit.wholeDocumentCoveragePercent,null);assert.equal(audit.allSourceKnowledgeFullyCovered,false);
const evidencePath='docs/ssw-workspace/kaigo/runtime-tests/2026-10-09-atomic/browser-evidence.json';
let renderedAtoms=null;
if(process.argv.includes('--require-browser')){
 const e=read(evidencePath);assert.equal(e.status,'PASS');assert.equal(e.points,rt.units.reduce((n,u)=>n+u.points.length,0));
 const rendered=new Set(e.units.flatMap(u=>rt.units.find(v=>v.id===u.id).points.map(p=>p.id)));
 for(const a of audit.atoms)assert(rendered.has(a.runtimePointId));renderedAtoms=audit.atoms.length;
}
console.log(JSON.stringify({status:'PASS_LINKS_NOT_SEMANTIC_OR_RIGHTS_CERTIFICATION',identifiedAtoms:audit.atoms.length,renderedAtoms,openVisualItems:audit.openItems.length,wholeDocumentCoveragePercent:null,humanReviewed:false,releaseReady:false}));
