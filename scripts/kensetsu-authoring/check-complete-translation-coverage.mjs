import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {collectTranslatableUnits} from '../../src/data/kensetsu/localization.ts';

const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const sorted=values=>[...values].sort();
const index=fs.readFileSync('src/data/kensetsu/index.ts','utf8');
const registry=index.match(/const translationBundles:TranslationBundle\[\]=\[([^\]]+)\]/)?.[1].split(',');
assert(registry,'Translation registry missing');
assert.deepEqual(registry,Array.from({length:385},(_,i)=>'translations'+String(i+1).padStart(3,'0')));
const rows=[];let units=0,paragraphs=0;
for(let i=1;i<=385;i++){
 const n=String(i).padStart(3,'0');
 assert.equal((index.match(new RegExp("import translations"+n+" from './translations/session-"+n+"\\.json';",'g'))??[]).length,1);
 const sourceBytes=fs.readFileSync('docs/ssw-workspace/kensetsu/shared-session-'+n+'.json');
 const source=JSON.parse(sourceBytes),canonical=collectTranslatableUnits(source);
 const bundleBytes=fs.readFileSync('src/data/kensetsu/translations/session-'+n+'.json');
 const bundle=JSON.parse(bundleBytes);
 assert.equal(bundle.sessionId,source.id);
 assert.deepEqual(sorted(Object.keys(bundle.entries)),sorted(Object.keys(canonical)));
 for(const [key,ja] of Object.entries(canonical)){
  const e=bundle.entries[key];assert.equal(e.sourceJa,ja);
  assert.deepEqual(sorted(Object.keys(e.translations)),sorted(locales));
  for(const locale of locales){assert.equal(typeof e.translations[locale],'string');assert(e.translations[locale].trim());}
 }
 const count=Object.keys(canonical).length,pc=source.clusters.reduce((sum,c)=>sum+c.paragraphs.length,0);
 units+=count;paragraphs+=pc;
 rows.push({sessionId:source.id,units:count,paragraphs:pc,sourceSha256:crypto.createHash('sha256').update(sourceBytes).digest('hex'),bundleSha256:crypto.createHash('sha256').update(bundleBytes).digest('hex')});
}
const report={status:'PASS_COMPLETE_AI_TRANSLATION_DATA_COVERAGE',weeks:55,lessons:385,remainingLessons:0,locales,sourceUnits:units,translationStrings:units*12,paragraphs,paragraphTranslationStrings:paragraphs*12,registryComplete:true,exactCanonicalSourceAndLocaleKeys:true,nonemptyStrings:true,humanLanguageReviewed:false,domainReviewed:false,rightsApproved:false,releaseReady:false,limits:['Mechanical coverage only; no new semantic or peer review.','Does not certify complete knowledge coverage against external reference documents.','Does not certify native devices or all-script glyph coverage.'],records:rows};
fs.writeFileSync('docs/ssw-workspace/kensetsu/translations/COMPLETE_AI_TRANSLATION_COVERAGE_QA.json',JSON.stringify(report,null,2)+'\n');
console.log('COMPLETE COVERAGE PASS:',units,'source units,',units*12,'strings,',paragraphs,'paragraphs; 385/385 lessons and registry entries; 12 locales.');
