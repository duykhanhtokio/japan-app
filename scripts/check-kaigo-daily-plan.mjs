import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p));
const plan=read('src/data/kaigo/daily-plan.json'),base=read('src/data/kaigo/content.json'),rt=read('src/data/kaigo/atomic-supplements.json');
const depth=read('src/data/kaigo/depth-supplements.json');
const completeness=read('src/data/kaigo/completeness-supplements.json');
const gap=read('src/data/kaigo/gap-supplements.json');
const language=read('src/data/kaigo/language-supplements.json');
const atoms=read('docs/ssw-workspace/kaigo/reviews/body-source-atoms-2026-10-09.json');
function check(p,a){
 assert.equal(p.dailyMinutes,30);assert.equal(p.maxWeeks,null);assert.equal(p.completeSourceInventory,false);assert.equal(p.learnerTimeMeasured,false);
 assert.deepEqual(p.languageDays,language.days);
 const days=[...p.baseDays,...rt.days,...gap.days,...depth.days,...completeness.days,...p.languageDays].sort((a,b)=>a.day-b.day);assert.equal(p.totalDays,days.length);assert.equal(p.plannedMinutes,days.length*30);
 days.forEach((d,i)=>{assert.equal(d.day,i+1);assert.equal(d.plannedMinutes,30);});
 for(const d of base.days){const parts=p.baseDays.filter(x=>x.baseDay===d.day);assert.equal(parts.length,d.plannedMinutes/30);parts.forEach((x,i)=>{assert.equal(x.lessonId,d.lessonId);assert.equal(x.mockId,d.mockId);assert.equal(x.part,i+1);assert.equal(x.parts,parts.length);});}
 assert.equal(a.runtimeSha256,createHash('sha256').update(fs.readFileSync('src/data/kaigo/atomic-supplements.json')).digest('hex'));
 assert.equal(a.fullScopeAtomInventoryCertified,false);assert.equal(a.wholeDocumentCoveragePercent,null);
 assert.equal(new Set(a.atoms.map(x=>x.id)).size,a.atoms.length);
 const points=new Map(rt.units.flatMap(u=>u.points.map(x=>[x.id,{...x,unitId:u.id}])));
 for(const x of a.atoms){const point=points.get(x.runtimePointId);assert(point);assert.equal(x.appEquivalentVi,point.explanationVi);assert.equal(x.pdfPage,x.printedPage+2);assert(a.visualPagesChecked.includes(x.printedPage));assert(rt.days.some(d=>d.day===x.runtimeDay&&d.unitIds.includes(point.unitId)));assert.equal(x.humanReviewed,false);}
 for(const page of a.scopePrintedPages)assert(a.atoms.some(x=>x.printedPage===page));
}
const aging=read('docs/ssw-workspace/kaigo/reviews/aging-source-atoms-2026-10-09.json');check(plan,atoms);check(plan,aging);const communication=read('docs/ssw-workspace/kaigo/reviews/communication-source-atoms-2026-10-09.json');check(plan,communication);const movement=read('docs/ssw-workspace/kaigo/reviews/movement-source-atoms-2026-10-09.json');check(plan,movement);let rejected=0;
for(const mutate of [(p)=>p.baseDays[0].plannedMinutes=60,(p)=>p.baseDays.pop(),(p)=>p.baseDays[1].day=1,(_,a)=>a.atoms[0].runtimePointId='missing',(_,a)=>a.atoms[0].appEquivalentVi='changed']){const p=structuredClone(plan),a=structuredClone(atoms);mutate(p,a);assert.throws(()=>check(p,a));rejected++;}
console.log(JSON.stringify({status:'PASS_PLAN_AND_LINKS_NOT_FULL_SOURCE_CERTIFICATION',dailyMinutes:30,totalPlannedDays:plan.totalDays,plannedMinutes:plan.plannedMinutes,maxWeeks:null,bodyAtoms:atoms.atoms.length,bodyPages:25,agingAtoms:aging.atoms.length,agingPages:aging.scopePrintedPages.length,communicationAtoms:communication.atoms.length,communicationPages:communication.scopePrintedPages.length,movementAtoms:movement.atoms.length,movementPages:movement.scopePrintedPages.length,negativeControlsRejected:rejected,learnerTimeMeasured:false,wholeDocumentCoveragePercent:null}));
