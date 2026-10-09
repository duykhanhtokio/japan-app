import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const path='src/data/kaigo/atomic-supplements.json',data=read(path),draft=read('docs/ssw-workspace/kaigo/drafts/atomic-supplements-2026-10-09.json'),base=read('src/data/kaigo/content.json');
function check(d){
 assert.equal(d.humanReviewed,false);assert.equal(d.releaseReady,false);
 assert.equal(d.units.length,draft.units.length);assert.equal(new Set(d.units.map(u=>u.id)).size,d.units.length);
 const assigned=d.days.flatMap(x=>x.unitIds);assert.equal(assigned.length,d.units.length);assert.equal(new Set(assigned).size,d.units.length);
 for(const [i,day] of d.days.entries()){assert.equal(day.day,58+i);assert.equal(day.plannedMinutes,30);assert(day.unitIds.length===1);}
 for(const u of d.units){assert(base.lessons.some(l=>l.day===u.parentDay));assert(assigned.includes(u.id));const original=draft.units.find(x=>x.id===u.id);assert(original);assert.deepEqual(u.points,original.points);assert.deepEqual(u.probe,original.probe);assert(u.points.length>=3);assert(u.probe.promptVi&&u.probe.expectedVi&&u.limitsVi);const {contentRevision,...content}=u;assert.equal(contentRevision,createHash('sha256').update(JSON.stringify(sort(content))).digest('hex'));}
 const raw=JSON.stringify(d);assert(!/sourcePrintedPages|sourceSha256|https?:|\.pdf|=== PDF/.test(raw));
}
function sort(x){return Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;}
check(data);
let rejected=0;for(const mutate of [d=>d.units[0].points.pop(),d=>d.days[0].unitIds.pop(),d=>d.units[0].parentDay=999,d=>d.units[0].contentRevision='bad']){const copy=structuredClone(data);mutate(copy);assert.throws(()=>check(copy));rejected++;}
const original=execFileSync('git',['show','49e6f67a07ed37ffd08f22f2a8442e2edcebdc50:src/data/kaigo/content.json'],{maxBuffer:20*1024*1024});assert.equal(fs.readFileSync('src/data/kaigo/content.json').compare(original),0);
console.log(JSON.stringify({status:'PASS_DATA_NOT_COMPLETE_SOURCE_OR_RIGHTS_CERTIFICATION',units:data.units.length,points:data.units.reduce((n,u)=>n+u.points.length,0),days:data.days.length,plannedExtraMinutes:data.days.length*30,negativeControlsRejected:rejected,baseCourseUnchanged:true,allSourceKnowledgeFullyCovered:false,humanReviewed:false,nativeDeviceTested:false,releaseReady:false}));
