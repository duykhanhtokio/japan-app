/* Current-snapshot audit; counts do not certify source semantics or study time. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const locales = ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const inputs = {};
function read(file) {
  const bytes = fs.readFileSync(path.join(root,file));
  inputs[file] = hash(bytes);
  return JSON.parse(bytes);
}
const data = name => read(`src/data/agriculture/${name}.json`);
const lessons = data('lessons.ja').lessons;
const byId = new Map(lessons.map(l => [l.id,l]));
const manifest = data('course-manifest');
const support = data('daily-learning-support');
const images = data('recognition-images').images;
const checks = data('reader-moisture-checks').checks;
const ledger = read('docs/ssw-workspace/source-coverage-v2/agriculture.json');
const translations = Object.fromEntries(locales.map(lc => [lc,data(`translations/${lc}`)]));
const errors = [];
const requireValue = (ok,code,at) => { if(!ok) errors.push({code,at}); };
let localePairs = 0;
for (const lesson of lessons) for (const lc of locales) {
  const t = translations[lc][lesson.id];
  const at = `${lesson.id}/${lc}`;
  requireValue(t && t.sourceHash === lesson.sourceHash,'STALE_OR_MISSING_LESSON_TRANSLATION',at);
  if (!t) continue;
  for (const field of ['title','objective','activity']) requireValue(typeof t[field] === 'string' && t[field].trim(),'EMPTY_TRANSLATION',`${at}/${field}`);
  for (const p of lesson.paragraphs) requireValue(typeof t.paragraphs?.[p.id] === 'string' && t.paragraphs[p.id].trim(),'MISSING_PARAGRAPH_TRANSLATION',`${at}/${p.id}`);
  localePairs++;
}
let checkLocalePairs = 0;
for (const check of checks) {
  for(const field of ['prompt','modelAnswer','teaching']) {
    if(!check[`${field}Ja`]) continue;
    const ruby = check[`${field}Ruby`];
    requireValue(Array.isArray(ruby) && ruby.map(t=>t.text).join('')===check[`${field}Ja`],'RUBY_TEXT_MISMATCH',`${check.id}/${field}`);
    for(const t of ruby || []) if(/[\p{Script=Han}々]/u.test(t.text)) requireValue(typeof t.readingKana==='string' && t.readingKana.trim(),'RUBY_READING_MISSING',`${check.id}/${field}/${t.text}`);
  }
  for (const lc of locales) {
    const t = check.translations[lc];
    requireValue(t && t.translatedFrom==='ja' && t.prompt?.trim() && t.modelAnswer?.trim(),'MISSING_RETRIEVAL_TRANSLATION',`${check.id}/${lc}`);
    if(check.teachingJa) requireValue(t?.teaching?.trim(),'MISSING_RETRIEVAL_TEACHING_TRANSLATION',`${check.id}/${lc}`);
    checkLocalePairs++;
  }
  for (const origin of [check.answerOrigin,check.teachingOrigin].filter(Boolean)) for(const part of origin.parts || []) {
    const l=byId.get(part.lessonId);
    requireValue(l && l.sourceHash===part.sourceHash,'STALE_RETRIEVAL_ORIGIN',`${check.id}/${part.lessonId}`);
    for(const id of part.paragraphIds || []) requireValue(l?.paragraphs.some(p=>p.id===id),'MISSING_RETRIEVAL_ORIGIN_PARAGRAPH',`${check.id}/${id}`);
  }
  for(const level of check.levels) requireValue(manifest.levels[level]?.weeks.some(w=>w.lessonIds.includes(check.lessonId)),'UNSCHEDULED_RETRIEVAL',`${check.id}/${level}`);
}
const textLength = (l,pids) => l.paragraphs.filter(p=>!pids || pids.includes(p.id)).reduce((n,p)=>n+p.textJa.replace(/\s/g,'').length,0);
function figureLinks(lid,level) {
  const l=byId.get(lid), result=[];
  const diagram=support.controlledDiagrams[lid];
  if(diagram) {
    requireValue(diagram.lessonSourceHash===l.sourceHash,'STALE_CONTROLLED_DIAGRAM',lid);
    result.push({kind:'controlled',assetPath:diagram.assetPath,assetSha256:diagram.assetSha256});
  }
  for(const im of images) if(im.lessonIds.includes(lid) && im.scopeLevels.includes(level)) {
    requireValue(im.lessonSourceHashes?.[lid]===l.sourceHash,'STALE_RECOGNITION_LINK',`${lid}/${im.id}`);
    result.push({kind:'recognition',id:im.id,assetPath:im.assetPath,assetSha256:im.assetSha256});
  }
  const binding=support.figureBindings[lid];
  if(binding?.scopeLevels.includes(level)) {
    const im=images.find(im=>im.id===binding.figureId);
    requireValue(binding.lessonSourceHash===l.sourceHash && im?.assetSha256===binding.assetSha256,'STALE_REUSED_FIGURE',lid);
    if(im) result.push({kind:'reuse',id:im.id,assetPath:im.assetPath,assetSha256:im.assetSha256});
  }
  return result;
}
const days=[];
for(const [level,course] of Object.entries(manifest.levels)) for(const week of course.weeks) for(const [index,lid] of week.lessonIds.entries()) {
  const l=byId.get(lid);
  requireValue(l && l.levels.includes(level),'INVALID_SCHEDULE_LESSON',`${level}/${week.id}/${lid}`);
  if(!l) continue;
  const companions=(support.companionReadings[lid] || []).filter(e=>byId.get(e.lessonId)?.levels.includes(level));
  const figures=figureLinks(lid,level);
  let chars=textLength(l);
  for(const entry of companions) {
    const companion=byId.get(entry.lessonId);
    requireValue(support.sourceVersions[lid]===l.sourceHash && entry.sourceHash===companion.sourceHash,'STALE_COMPANION',`${lid}/${entry.lessonId}`);
    for(const pid of entry.paragraphIds) requireValue(companion.paragraphs.some(p=>p.id===pid),'MISSING_COMPANION_PARAGRAPH',`${lid}/${pid}`);
    chars+=textLength(companion,entry.paragraphIds);
    figures.push(...figureLinks(entry.lessonId,level));
  }
  days.push({level,week:week.number,day:index+1,lessonId:lid,japaneseParagraphCharacters:chars,companionLessonIds:companions.map(e=>e.lessonId),figureLinks:figures,measuredMinutes:l.measuredMinutes??null,timingStatus:l.timingStatus});
}
// Accepted direct links only. A paragraph may contain several claims: this is
// an exact evidence index, never automatic claim-level semantic acceptance.
const reverse=[];
for(const [index,l] of lessons.entries()) for(const [pi,p] of l.paragraphs.entries()) {
  const pointer=`/lessons/${index}/paragraphs/${pi}/textJa`;
  const ids=ledger.knowledgeUnits.filter(u=>u.status==='covered_ai' && u.teachingEvidence.some(e=>e.path==='src/data/agriculture/lessons.ja.json' && e.jsonPointer===pointer && e.sha256Mode==='json-value' && e.relation==='direct' && e.semanticReviewed && e.sha256===hash(JSON.stringify(p.textJa)))).map(u=>u.knowledgeId);
  reverse.push({lessonId:l.id,paragraphId:p.id,declaredLegacyKnowledgeIds:p.knowledgeIds,acceptedExactTextEvidenceKnowledgeIds:ids,claimLevelSemanticReview:'not_established_by_this_audit'});
}
const assets=[...new Map(days.flatMap(d=>d.figureLinks).map(f=>[f.assetPath,f])).values()].map(f=>{
  const file=path.join(root,f.assetPath);
  const available=fs.existsSync(file);
  return {...f,available,hashMatches:available?hash(fs.readFileSync(file))===f.assetSha256:null};
});
const report={schemaVersion:1,status:errors.length?'FAIL_CURRENT_DEPENDENCIES':'PASS_CURRENT_DEPENDENCIES',commit:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),inputSha256:inputs,groups:{lessonRevisions:{lessons:lessons.length,locales:locales.length,checkedPairs:localePairs},retrievalRevisions:{checks:checks.length,checkedLocalePairs:checkLocalePairs,rubyMeaningReviewed:false},scheduledDays:{count:days.length,withoutLinkedFigure:days.filter(d=>!d.figureLinks.length).map(d=>d.lessonId),durationMeasuredDays:days.filter(d=>d.measuredMinutes!==null).length,figureAssets:assets.length,availableFigureAssets:assets.filter(a=>a.available).length},reverseIndex:{paragraphs:reverse.length,withAcceptedExactTextEvidence:reverse.filter(r=>r.acceptedExactTextEvidenceKnowledgeIds.length).length,withoutAcceptedExactTextEvidence:reverse.filter(r=>!r.acceptedExactTextEvidenceKnowledgeIds.length).length}},errors,days,figureAssets:assets,reverseParagraphIndex:reverse,limits:{sourceSemanticsReviewed:false,allClaimsSourceBacked:false,allLocaleSemanticsReviewed:false,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,figuresVisuallyReviewed:false,audioAudited:false,sourceDenominator:ledger.denominator.status,wholeSourceKnowledgeCovered:false}};
const out=process.argv.indexOf('--out');
if(out>=0) fs.writeFileSync(path.resolve(root,process.argv[out+1]),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,groups:report.groups,errors,limits:report.limits}));
if(errors.length) process.exitCode=1;
