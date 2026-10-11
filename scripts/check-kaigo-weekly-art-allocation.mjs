import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import esbuild from 'esbuild';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const allocation=JSON.parse(fs.readFileSync('src/data/kaigo/weekly-art-allocation.json'));
const built=await esbuild.build({stdin:{contents:"export * from './src/data/kaigo/weekly-learning';export * from './src/data/kaigo/catalog';export * from './src/data/kaigo/weekly-art-allocation';export * from './src/data/kaigo/paragraph-illustrations';",resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,platform:'node',format:'cjs',external:['*.webp','*.png'],logLevel:'silent'});
const model={exports:{}};new Function('module','exports','require',built.outputFiles[0].text)(model,model.exports,p=>p);
const {kaigoCatalog,sectionsFor,paragraphIllustrations,illustrationForStudyDay,learningWeeks}=model.exports;
assert.equal(allocation.newImageGenerationAllowed,false);assert.equal(allocation.assignments.length,176);
assert.deepEqual(allocation.assignments.map(a=>a.day),kaigoCatalog.map(e=>e.day));
const weeks=learningWeeks.map(w=>{
 const rows=allocation.assignments.filter(a=>a.week===w.week);assert.equal(rows.length,w.slots.filter(s=>s.entry).length);
 assert.equal(new Set(rows.map(a=>a.artId)).size,rows.length);
 const sources=new Set();for(const a of rows){const art=paragraphIllustrations[a.artId];assert(art);assert.equal(illustrationForStudyDay(a.day),art);assert.equal(a.captionVi,art.captionVi);assert(!sources.has(art.source));sources.add(art.source);assert(art.aspectRatio>1);assert(fs.existsSync(art.source.replace('../../../','')));}
 return {week:w.week,studyDays:rows.length,imagePlacements:rows.length,distinctImages:rows.length};
});
assert.equal(kaigoCatalog.flatMap(sectionsFor).length,866);
const reader=fs.readFileSync('src/components/kaigo/WeeklyKaigo.tsx','utf8');assert(reader.includes('illustrationForStudyDay(entry.day)'));assert(!reader.includes('kaigo-section-art-'));assert(reader.includes('kaigoDepthFigures[f.key]'));
const preserved={};for(const path of ['content.json','atomic-supplements.json','gap-supplements.json','depth-supplements.json','language-supplements.json','completeness-supplements.json','daily-plan.json']){const p='src/data/kaigo/'+path,b=fs.readFileSync(p);assert.equal(hash(b),hash(execFileSync('git',['show','HEAD:'+p],{maxBuffer:32*1024*1024})));preserved[p]=hash(b);}
const assets=Object.entries(paragraphIllustrations).map(([id,a])=>{const p=a.source.replace('../../../','');const b=fs.readFileSync(p);assert.equal(hash(b),hash(execFileSync('git',['show','HEAD:'+p],{maxBuffer:32*1024*1024})));return {id,path:p,sha256:hash(b)};});
assert.equal(assets.length,396);assert.equal(new Set(assets.map(a=>a.sha256)).size,396);
const result={status:'PASS_WEEKLY_ART_ALLOCATION',generationStopped:true,calendarWeeks:26,studyDays:176,imagePlacements:176,selectedUniqueAssets:new Set(allocation.assignments.map(a=>a.artId)).size,existingAssetsPreserved:396,exactDuplicateFiles:0,unselectedAssetsRetained:267,weeks,preservedRuntimeSha256:preserved,assets,humanReviewed:false,nativeDeviceTested:false,releaseReady:false};
fs.writeFileSync('docs/ssw-workspace/kaigo/reviews/WEEKLY_ART_REDISTRIBUTION_2026-10-11.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,weeks:26,days:176,placements:176,selectedUniqueAssets:result.selectedUniqueAssets,assetsPreserved:396}));
