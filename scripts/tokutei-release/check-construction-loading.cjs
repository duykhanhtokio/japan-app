'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {loader}=require('./profile-data-loading.cjs'),root=path.resolve(__dirname,'../..');
const host=loader(),api=host.load(path.join(root,'src/data/kensetsu/index.ts'));
const overlays=()=>host.reads.filter(r=>/src\/data\/kensetsu\/translations\/session-\d+\.json$/.test(r.path));
assert.equal(overlays().length,0,'catalog import eagerly evaluated overlays');
const first=api.sessionById.get('kensetsu-common-session-001');assert(first);assert(first.titleJa);assert.equal(overlays().length,0,'metadata lookup loaded translations');
assert(first.clusters.length);assert.equal(overlays().length,1,'one reader must load exactly one overlay');
assert.equal(api.sessionById.get(first.id),first);assert.equal(first.clusters,first.clusters,'resolved overlay must be cached');
const {applyLessonTranslations,deferLessonTranslations}=host.load(path.join(root,'src/data/kensetsu/localization.ts'));
let compared=0;
for(let n=1;n<=385;n++){
 const id=String(n).padStart(3,'0'),session=JSON.parse(fs.readFileSync(path.join(root,`docs/ssw-workspace/kensetsu/shared-session-${id}.json`))),bundle=JSON.parse(fs.readFileSync(path.join(root,`src/data/kensetsu/translations/session-${id}.json`)));
 const actual=api.sessionById.get(session.id),expected=applyLessonTranslations(session,bundle);
 assert.equal(JSON.stringify(actual),JSON.stringify(expected),'changed session '+session.id);compared++;
}
const specimen={id:'test',titleJa:'new',titleTranslations:{vi:'old'},clusters:[{id:'c',titleJa:'body',paragraphs:[{id:'p',ja:'new paragraph',translations:{vi:'old paragraph'}}]}]};
let calls=0;const stale={sessionId:'test',entries:{title:{sourceJa:'old',translations:{vi:'stale title'}},p:{sourceJa:'old paragraph',translations:{vi:'stale paragraph'}}}};
const deferred=deferLessonTranslations(specimen,()=>{calls++;return stale;});assert.equal(calls,0);assert.equal(deferred.id,'test');assert.equal(calls,0);assert.equal(deferred.titleTranslations,undefined);assert.equal(deferred.clusters[0].paragraphs[0].translations,undefined);assert.equal(calls,1);
assert.equal(JSON.stringify(specimen.titleTranslations),JSON.stringify({vi:'old'}),'source session mutated');
const report={status:'PASS',all385SessionOutputsEqualEagerBehavior:true,catalogOverlayEvaluations:0,selectedSessionOverlayEvaluations:1,stableIdsAndObjectIdentity:true,overlayMemoized:true,staleSourceSuppressesOldInlineTranslation:true,sourceObjectsUnchanged:true,physicalDeviceTested:false};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
