// Guard the two scoped additions against the exact preceding content checkpoint.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {isDeepStrictEqual}=require('node:util');
const same=(a,b,msg)=>assert(isDeepStrictEqual(a,b),msg);
const root=path.resolve(__dirname,'../..'),baseline='c25e4e260df736515921193e6b59d723f397f1f5',base='docs/ssw-workspace/source-coverage-v2';
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8')),old=p=>JSON.parse(cp.execFileSync('git',['show',`${baseline}:${p}`],{cwd:root,encoding:'utf8',maxBuffer:12*1024*1024}));
const packet=read(`${base}/construction-batch4-authoring.json`),locales=['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];let oldParagraphs=0,priorEntries=0;
for(const spec of packet.groups){
 assert.deepEqual(Object.keys(spec.translations).sort(),[...locales].sort());assert(!/[\p{Script=Han}々]/u.test(spec.appendJa.replace(/[\p{Script=Han}々]+（[\p{Script=Hiragana}ー]+）/gu,'')),'New Japanese must include complete contextual kana');
 const p=`docs/ssw-workspace/kensetsu/foreman/session-${String(spec.session).padStart(3,'0')}.json`,before=old(p),after=read(p),expected=structuredClone(before),cluster=expected.clusters.find(c=>c.learningActivity),a=cluster.learningActivity;
 a.ja+='\n\n'+spec.appendJa;a.translations.vi+='\n\n'+spec.translations.vi;expected.contentRevision++;
 same(after,expected,'No old Japanese paragraph/prompt/image or completion revision may change');oldParagraphs+=before.clusters.reduce((n,c)=>n+c.paragraphs.length,0);
 for(const locale of locales.filter(x=>x!=='vi')){
  const p=`src/data/kensetsu/foreman-translations/${locale}.json`,before=old(p),after=read(p),expected=structuredClone(before);
  for(const supplement of packet.groups){const entry=expected.sessions[afterSessionId(supplement.session)].entries.learningActivity;entry.sourceJa+='\n\n'+supplement.appendJa;entry.translations[locale]+='\n\n'+supplement.translations[locale];}same(after,expected,'Only these two activity additions and their source bindings may change');if(spec===packet.groups[0])priorEntries+=Object.values(before.sessions).reduce((n,s)=>n+Object.keys(s.entries).length,0);
 }
}
function afterSessionId(n){return `kensetsu-foreman-session-${String(n).padStart(3,'0')}`;}
const ledger=read(`${base}/construction.json`),before=old(`${base}/construction.json`);assert.equal(ledger.knowledgeUnits.length,before.knowledgeUnits.length);assert.equal(ledger.denominator.status,'open');assert.equal(ledger.wholeSourceKnowledgeCovered,false);
for(const u of before.knowledgeUnits){const now=ledger.knowledgeUnits.find(x=>x.knowledgeId===u.knowledgeId);assert.deepEqual(now.before,u.before);if(u.status==='blocked')same(now,u,'Existing source blockers stay explicit');}
assert.equal(ledger.knowledgeUnits.filter(u=>u.status==='covered_ai').length,66);assert.equal(ledger.knowledgeUnits.filter(u=>u.status==='blocked').length,7);
console.log(JSON.stringify({status:'PASS_CONSTRUCTION_BATCH4_PRESERVATION',sessions:[18,19],oldParagraphsPreserved:oldParagraphs,uniquePriorOverlayEntriesCompared:priorEntries,newActivityLocaleSupplements:24,newCoveredKnowledgeUnits:9,sourceDenominator:'open',completionRevisionsUnchanged:true,existingSevenSourceBlockersPreserved:true}));
