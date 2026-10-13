import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {applyLessonTranslations,collectTranslatableUnits} from '../src/data/kensetsu/localization.ts';
const week=Number(process.argv[2]??1);assert(Number.isInteger(week)&&week>=1&&week<=55);
const weekCode=String(week).padStart(3,'0');
const expected=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const catalog=fs.readFileSync('src/i18n/languages.ts','utf8');
const actual=[...catalog.matchAll(/code:\s*'([^']+)'/g)].map(m=>m[1]).filter(x=>x!=='ja');
assert.deepEqual(actual.slice().sort(),expected.slice().sort());
const files=Array.from({length:7},(_,i)=>`session-${String((week-1)*7+i+1).padStart(3,'0')}.json`);
const records=[];let units=0,paragraphs=0,prompts=0,terms=0;
for(const file of files){
 const number=file.match(/\d{3}/)[0];
 const bytes=fs.readFileSync(`docs/ssw-workspace/kensetsu/shared-session-${number}.json`);
 const source=JSON.parse(bytes),bundle=JSON.parse(fs.readFileSync('src/data/kensetsu/translations/'+file,'utf8'));
 const sourceUnits=collectTranslatableUnits(source);
 assert.equal(bundle.sessionId,source.id);assert.deepEqual(Object.keys(bundle.entries).sort(),Object.keys(sourceUnits).sort());
 for(const [id,entry] of Object.entries(bundle.entries)){
  assert.equal(entry.sourceJa,sourceUnits[id],`${source.id}:${id}`);
  assert.deepEqual(Object.keys(entry.translations).sort(),expected.slice().sort(),id);
  for(const [locale,text] of Object.entries(entry.translations)){
   assert(typeof text==='string'&&text.trim().length>0,`${id}:${locale}`);assert(!/TODO|TBD|準備中|placeholder/iu.test(text));
   if(['hi','ne'].includes(locale))assert(/[\u0900-\u097f]/u.test(text),`${id}:${locale}`);
   if(locale==='bn')assert(/[\u0980-\u09ff]/u.test(text));
   if(locale==='my')assert(/[\u1000-\u109f]/u.test(text));
   if(locale==='th')assert(/[\u0e00-\u0e7f]/u.test(text));
   if(locale==='km')assert(/[\u1780-\u17ff]/u.test(text));
   if(locale.startsWith('zh-'))assert(/[\u3400-\u9fff]/u.test(text));
  }
 }
 const original=JSON.stringify(source),localized=applyLessonTranslations(source,bundle);
 assert.equal(JSON.stringify(source),original,'No source mutation');assert.equal(localized.revision,source.revision);assert.equal(localized.id,source.id);
 let count=0;
 for(const locale of expected){
  assert(localized.titleTranslations[locale]);
  for(const [i,c] of localized.clusters.entries()){
   assert.equal(c.titleJa,source.clusters[i].titleJa);assert(c.titleTranslations[locale]);
   if(c.applicationPromptJa){assert(c.applicationPromptTranslations[locale]);prompts++;}
   if(c.learningActivity)assert(c.learningActivity.translations[locale]);
   for(const [j,p] of c.paragraphs.entries()){
    assert.equal(p.ja,source.clusters[i].paragraphs[j].ja);assert(p.translations[locale]);paragraphs++;
    if(locale==='en')count++;
   }
   if(c.reflectionJa)assert(c.reflectionTranslations[locale]);
   if(c.illustration)assert(c.illustration.captionTranslations[locale]);
   for(const t of c.terms??[]){assert(t.translations[locale]);terms++;}
  }
  for(const t of localized.keyTerms??[]){assert(t.translations[locale]);terms++;}
  for(const a of localized.illustrations??[])assert(a.altTranslations[locale]);
 }
 const changed=structuredClone(source);changed.clusters[0].paragraphs[0].ja+='変更';
 assert.equal(applyLessonTranslations(changed,bundle).clusters[0].paragraphs[0].translations,undefined,'Suppress stale overlay and inline fallback');
 const unrelated={...source,id:'unrelated'};assert.equal(applyLessonTranslations(unrelated,bundle),unrelated);
 if(number==='001')assert(localized.clusters[1].paragraphs[1].translations.vi.includes('Tổ trưởng trao đổi'));
 const unitCount=Object.keys(sourceUnits).length;units+=unitCount;
 records.push({sessionId:source.id,sourceRevision:source.revision,sourceContentRevision:source.contentRevision??source.revision,
 sourceSha256:crypto.createHash('sha256').update(bytes).digest('hex'),unitCount,paragraphCount:count,translatedStrings:unitCount*12});
}
const expectedCounts={1:{units:167,paragraphs:64},2:{units:219,paragraphs:84},3:{units:217,paragraphs:101}};
if(expectedCounts[week]){assert.equal(units,expectedCounts[week].units);assert.equal(paragraphs,expectedCounts[week].paragraphs*12);}
const report={status:'PASS_MACHINE_WEEKLY_ALIGNMENT_AND_ADAPTER',weekId:`kensetsu-common-week-${weekCode}`,completeLessonIds:records.map(r=>r.sessionId),locales:expected,
 translatedUnits:units,translatedStrings:units*12,paragraphTranslationStrings:paragraphs,promptTranslationStrings:prompts,glossaryTranslationStrings:terms,
 sourceRecords:records,canonicalJapaneseUnchanged:true,sourceObjectsNotMutated:true,progressIdsUnchanged:true,
 staleSourceSuppressesTranslations:true,unrelatedSessionsUnchanged:true,weekOneVietnameseRegressionChecked:week===1,
 humanLanguageReviewed:false,domainReviewed:false,releaseReady:false,
 limits:['Coverage, script and source-matching checks do not certify semantic accuracy, native-language review or rights.']};
fs.writeFileSync(`docs/ssw-workspace/kensetsu/translations/week-${weekCode}-structural-qa.json`,JSON.stringify(report,null,2)+'\n');
console.log(`KENSETSU WEEKLY TRANSLATIONS PASS: week ${week} / 7 lessons / ${units} units / 12 locales / ${units*12} strings / ${paragraphs} paragraph translations; Japanese and progress IDs unchanged.`);
