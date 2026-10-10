import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),esbuild=require(process.env.KAIGO_ESBUILD_MODULE||'esbuild');
const compiled=esbuild.buildSync({entryPoints:['src/data/kaigo/weekly-learning.ts'],bundle:true,write:false,platform:'node',format:'cjs'}).outputFiles[0].text;
const box={exports:{}};new Function('module','exports',compiled)(box,box.exports);const m=box.exports;
const slots=m.learningWeeks.flatMap(w=>w.slots),active=slots.filter(s=>s.entry);
assert.equal(m.learningWeeks.length,26);assert.equal(slots.length,182);assert.equal(active.length,176);assert.equal(slots.filter(s=>!s.entry).length,6);
assert.deepEqual(active.map(s=>s.day),Array.from({length:176},(_,i)=>i+1));assert(slots.filter(s=>!s.entry).every(s=>s.day>=177));
assert.equal(m.weeklyQuestions.length,new Set(m.weeklyQuestions.map(q=>q.id)).size);
for(const q of m.weeklyQuestions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.rationales.length,4);assert(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4);assert(active.some(s=>s.day===q.day));}
assert.equal(m.questionsForWeek(0).length,0);assert.equal(m.questionsForWeek(27).length,0);assert(m.learningWeeks.every(w=>m.questionsForWeek(w.week).length>0));
let rejected=0;for(const raw of ['bad','null','[]','{"version":2,"days":{"1":true},"assessments":{}}','{"version":1,"days":{"183":true,"2":"yes"},"assessments":{"27":true}}']){assert.deepEqual(m.restoreCompletion(raw).days,{});rejected++;}
const p=m.restoreCompletion('{"version":1,"days":{"176":true},"assessments":{"26":true},"lastWeek":26}');assert(m.weekDone(26,p));assert(!m.weekDone(25,p));assert(!m.weekDone(26,{...p,assessments:{}}));assert(!m.weekDone(26,{...p,days:{}}));
const old=JSON.parse(fs.readFileSync(process.env.KAIGO_BASELINE_HASHES||'docs/ssw-workspace/kaigo/reviews/weekly-preservation-baseline-2026-10-10.json'));
for(const [path,expected] of Object.entries(old))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),expected,path);
const sections=active.flatMap(s=>m.sectionsFor(s.entry));assert.equal(sections.length,new Set(sections.map(s=>s.id)).size);assert(sections.every(s=>s.heading&&s.parentDay));
const result={status:'PASS_KAIGO_WEEKLY_CALENDAR_MODEL',weeks:26,slots:182,activeDays:176,disabledDays:6,questions:m.weeklyQuestions.length,sections:sections.length,preservedRuntimeJsonFiles:Object.keys(old).length,invalidCompletionFixturesRejected:rejected,fullParagraphArtComplete:false,humanReviewed:false,nativeDeviceTested:false,releaseReady:false};
fs.writeFileSync('docs/ssw-workspace/kaigo/reviews/weekly-calendar-validation-2026-10-10.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
