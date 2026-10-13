import fs from 'node:fs';
import assert from 'node:assert/strict';
import {applyLessonTranslations} from '../src/data/kensetsu/localization.ts';
const source=JSON.parse(fs.readFileSync('docs/ssw-workspace/kensetsu/shared-session-001.json','utf8'));
const bundle=JSON.parse(fs.readFileSync('src/data/kensetsu/translations/session-001.json','utf8'));
const expected=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const catalog=fs.readFileSync('src/i18n/languages.ts','utf8');
for(const locale of expected)assert(catalog.includes(`code: '${locale}'`));
assert.equal(Object.keys(bundle.entries).length,30);
for(const [id,entry] of Object.entries(bundle.entries)){
 assert.deepEqual(Object.keys(entry.translations).sort(),expected.slice().sort(),id);
 assert.equal(new Set(Object.values(entry.translations)).size,12,id);
 for(const [locale,text] of Object.entries(entry.translations)){
  assert(text.trim().length>0,`${id}:${locale}`);assert(!/TODO|TBD|準備中|placeholder/iu.test(text));
  if(['hi','ne'].includes(locale))assert(/[\u0900-\u097f]/u.test(text),`${id}:${locale}`);
  if(locale==='bn')assert(/[\u0980-\u09ff]/u.test(text));
  if(locale==='my')assert(/[\u1000-\u109f]/u.test(text));
  if(locale==='th')assert(/[\u0e00-\u0e7f]/u.test(text));
  if(locale==='km')assert(/[\u1780-\u17ff]/u.test(text));
  if(locale.startsWith('zh-'))assert(/[\u3400-\u9fff]/u.test(text));
 }
}
const original=JSON.stringify(source),localized=applyLessonTranslations(source,bundle);
assert.equal(JSON.stringify(source),original,'Adapter must not mutate source');
assert.equal(localized.revision,source.revision);assert.equal(localized.id,source.id);
let paragraphs=0,prompts=0,terms=0;
for(const locale of expected){
 assert(localized.titleTranslations[locale]);
 for(const [i,c] of localized.clusters.entries()){
  assert.equal(c.titleJa,source.clusters[i].titleJa);assert(c.titleTranslations[locale]);
  assert(c.applicationPromptTranslations[locale]);prompts++;
  assert(c.learningActivity.translations[locale]);
  for(const [j,p] of c.paragraphs.entries()){
   assert.equal(p.ja,source.clusters[i].paragraphs[j].ja);assert(p.translations[locale]);paragraphs++;
   assert.equal(bundle.entries[p.id].sourceJa,p.ja);
  }
  if(c.reflectionJa)assert(c.reflectionTranslations[locale]);
  if(c.illustration)assert(c.illustration.captionTranslations[locale]);
  for(const t of c.terms??[]){assert(t.translations[locale]);terms++;}
 }
}
const changed=structuredClone(source);changed.clusters[0].paragraphs[0].ja+='変更';
assert.equal(applyLessonTranslations(changed,bundle).clusters[0].paragraphs[0].translations,undefined,'Stale overlay and inline fallback must be suppressed');
const unrelated={...source,id:'unrelated'};assert.equal(applyLessonTranslations(unrelated,bundle),unrelated);
assert.equal(localized.clusters[1].paragraphs[1].translations.vi,bundle.entries[source.clusters[1].paragraphs[1].id].translations.vi);
assert(localized.clusters[1].paragraphs[1].translations.vi.includes('Tổ trưởng trao đổi'));
const report={status:'PASS_MACHINE_ALIGNMENT_AND_ADAPTER',completeLessonIds:[source.id],locales:expected,
 translatedUnits:30,translatedStrings:360,paragraphTranslationStrings:paragraphs,promptTranslationStrings:prompts,
 glossaryTranslationStrings:terms,canonicalJapaneseUnchanged:true,sourceObjectsNotMutated:true,progressIdsUnchanged:true,
 staleSourceSuppressesTranslations:true,unrelatedSessionsUnchanged:true,staleVietnameseCorrected:true,
 humanLanguageReviewed:false,domainReviewed:false,releaseReady:false,
 limits:['Script checks field/locale coverage, scripts and source matching; it does not certify translation quality or native-language review.']};
fs.writeFileSync('docs/ssw-workspace/kensetsu/translations/session-001-structural-qa.json',JSON.stringify(report,null,2)+'\n');
console.log('KENSETSU TRANSLATIONS PASS: one complete lesson / 30 units / 12 locales / 360 strings; immutable Japanese and progress IDs; stale-source suppression verified.');
