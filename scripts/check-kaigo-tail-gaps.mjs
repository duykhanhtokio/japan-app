import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=x=>createHash('sha256').update(x).digest('hex'),sort=x=>Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;
const g=read('src/data/kaigo/gap-supplements.json'),a=read('docs/ssw-workspace/kaigo/reviews/tail-gap-review-2026-10-10.json'),rt=read('src/data/kaigo/atomic-supplements.json'),plan=read('src/data/kaigo/daily-plan.json');
function check(g,a){
 assert.equal(g.units.length,4);assert.equal(g.units.flatMap(u=>u.points).length,13);assert.deepEqual(g.days.map(d=>d.day),[161,162,163,164]);
 for(const k of ['humanReviewed','domainReviewed','nativeReviewed','releaseReady'])assert.equal(g[k],false);
 const ids=new Set(rt.units.flatMap(u=>[u.id,u.probe.id,...u.points.map(p=>p.id)]));
 for(const [i,u] of g.units.entries()){
  for(const id of [u.id,u.probe.id,...u.points.map(p=>p.id)]){assert(!ids.has(id));ids.add(id);}
  const {contentRevision,...v}=u;assert.equal(contentRevision,'gap-'+sha(JSON.stringify(sort(v))).slice(0,16));assert.equal(g.days[i].plannedMinutes,30);assert.deepEqual(g.days[i].unitIds,[u.id]);assert.equal(a.units[i].runtimeDay,g.days[i].day);assert.deepEqual(a.units[i].points,u.points);assert(u.probe.promptVi.length>80);assert(u.probe.expectedVi.length>120);assert(u.limitsVi.length>70);
  for(const p of u.points)assert(p.explanationVi.length>120);
 }
 assert.deepEqual(a.tailPages.map(x=>x.printedPage),[270,271,272,273,274]);assert(a.tailPages[1].reviewScope.includes('excluded'));assert.equal(a.originalKnowledgeCoveragePercent,null);assert.equal(a.allSourceKnowledgeFullyCovered,false);assert.equal(a.existingInventoryLinkChecks.length,12);assert.equal(a.existingInventoryLinkChecks.reduce((s,x)=>s+x.recordedRows,0),2844);assert(a.existingInventoryLinkChecks.every(x=>x.errors.length===0));
 function privacy(x){if(Array.isArray(x))return x.forEach(privacy);if(x&&typeof x==='object')for(const [k,v] of Object.entries(x)){assert(!/sourcePages|sourceRefs|sourceMetadata|sourceSha|libraryFileId/.test(k));if(typeof v==='string')assert(!/https?:\/\/|libfile_|\.pdf\b/.test(v));privacy(v);}}privacy(g);
}
check(g,a);
const base=read('src/data/kaigo/content.json'),points=new Map(rt.units.flatMap(u=>u.points.map(p=>[p.id,{...p,unitId:u.id}]))),terms=new Map(base.terms.map(t=>[t.id,t]));
for(const inventory of a.existingInventoryLinkChecks){const d=read('docs/ssw-workspace/kaigo/reviews/'+inventory.file);assert.equal(d.atoms.length,inventory.recordedRows);for(const atom of d.atoms){if(atom.runtimePointId){const p=points.get(atom.runtimePointId);assert(p);assert.equal(atom.appEquivalentVi,p.explanationVi);assert(rt.days.some(day=>day.day===atom.runtimeDay&&day.unitIds.includes(p.unitId)));}else{const t=terms.get(atom.runtimeTermId);assert(t);for(const k of ['termJa','readingJa','meaningVi'])assert.equal(atom[k],t[k]);assert.deepEqual([...atom.runtimeDays].sort((a,b)=>a-b),base.lessons.filter(l=>l.termIds.includes(t.id)).map(l=>l.day).sort((a,b)=>a-b));}}}
for(const [p,h] of Object.entries(a.preservationSha256))assert.equal(sha(fs.readFileSync(p)),h);assert.equal(plan.totalDays,164);assert.equal(plan.plannedMinutes,4920);assert(fs.readFileSync('src/data/kaigo/index.ts','utf8').includes('...gapSupplements.units'));
let rejected=0;for(const mutate of [(g)=>g.days[0].plannedMinutes=60,(g)=>g.units[0].points[0].explanationVi='bad',(g)=>g.units[1].id=g.units[0].id,(_,a)=>a.tailPages[1].reviewScope='whole answer key',(_,a)=>a.existingInventoryLinkChecks[0].errors.push('broken')]){const x=structuredClone(g),y=structuredClone(a);mutate(x,y);assert.throws(()=>check(x,y));rejected++;}
const result={status:'PASS_GAP_LINKS_PRESERVATION_AND_LIMITS',newUnits:4,newPoints:13,newCases:4,newDays:4,totalDays:164,dailyMinutes:30,recordedRowsChecked:2844,negativeControlsRejected:rejected,fullSourceInventoryCertified:false,humanReviewed:false,releaseReady:false};fs.writeFileSync('docs/ssw-workspace/kaigo/reviews/tail-gap-validation-2026-10-10.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
