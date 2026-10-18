// Source files stay outside the repository. This checks authored-data integrity,
// preservation and honest approval state, not exhaustive source knowledge coverage.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'docs/ssw-workspace/kensetsu/foreman');
const read=n=>JSON.parse(fs.readFileSync(path.join(dir,n),'utf8'));
const baseline=read('preservation-baseline.json'),ledger=read('coverage-ledger.json'),screen=read('expression-screen.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
for(const [file,sha]of Object.entries(baseline.sha256))assert.equal(hash(fs.readFileSync(path.join(dir,file))),sha,'Original lesson modified: '+file);
const ids=new Set(),paragraphIds=new Set(),prose=new Set(),all=[];let paragraphs=0,prompts=0,images=0;
const useful=s=>assert(typeof s==='string'&&s.trim().length>0,'Missing learner-facing text');
for(let n=1;n<=28;n++){
 const s=read('session-'+String(n).padStart(3,'0')+'.json');all.push(s.id);assert.equal(s.id,'kensetsu-foreman-session-'+String(n).padStart(3,'0'));assert(!ids.has(s.id));ids.add(s.id);
 assert.equal(s.revision,1);assert.deepEqual(s.applicableLevels,['2']);assert.deepEqual(s.applicableFields,['utilities','building','civil']);
 assert.equal(s.status,'editorial_draft');assert.equal(s.durationMeasured,false);assert.equal(s.estimatedMinutes,null);assert.equal(s.appIntegrationReady,false);
 for(const k of ['domain','nativeJapanese','nativeVietnamese','rights'])assert.equal(s.review[k],false);
 useful(s.titleJa);useful(s.titleTranslations.vi);assert.equal(s.clusters.length,2);
 for(const ref of s.sourceReferences){assert.equal(ref.sourceId,ledger.sourceId);assert(ref.pdfPages.length);assert(ref.pdfPages.every(p=>Number.isInteger(p)&&p>=7&&p<=131));assert.deepEqual(ref.printedPages,ref.pdfPages.map(p=>p-6));}
 for(const c of s.clusters){
  assert(!ids.has(c.id));ids.add(c.id);useful(c.titleJa);useful(c.titleTranslations.vi);assert.equal(c.paragraphs.length,2);
  for(const p of c.paragraphs){assert(!paragraphIds.has(p.id));paragraphIds.add(p.id);useful(p.ja);useful(p.translations.vi);assert(!prose.has(p.ja),'Repeated Japanese paragraph');prose.add(p.ja);paragraphs++;}
  if(n>3){useful(c.applicationPromptJa);useful(c.applicationPromptTranslations.vi);prompts++;}
  if(c.illustration){const i=c.illustration;useful(i.captionJa);useful(i.captionTranslations.vi);assert(i.assetPath.startsWith('assets/kensetsu/foreman/'));const b=fs.readFileSync(path.join(root,i.assetPath));assert(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));assert.equal(b.readUInt32BE(16),1200);assert.equal(b.readUInt32BE(20),720);assert.equal(b.toString('ascii',b.length-8,b.length-4),'IEND');images++;}
 }
}
const weekly=[];for(let n=1;n<=4;n++){const w=read('week-'+String(n).padStart(3,'0')+'.json');assert.equal(w.sessionIds.length,7);weekly.push(...w.sessionIds);}assert.deepEqual(weekly,all);
assert.equal(paragraphs,112);assert.equal(prompts,50);assert.equal(images,4);assert.equal(screen.paragraphs,paragraphs);assert.equal(screen.candidates.length,0);assert.equal(screen.rightsCertification,false);
assert.equal(ledger.coverageDenominator,null);assert.equal(ledger.wholeSourceComplete,false);assert.equal(ledger.releaseReady,false);assert.equal(ledger.remainingTargetLocales.length,0);assert.equal(ledger.objectives.length,56);
const report={date:'2026-10-18',status:'PASS_AUTHORED_DATA_AND_PRESERVATION',lessons:all.length,weeks:4,clusters:56,japaneseParagraphs:paragraphs,vietnameseParagraphs:paragraphs,newTranslatedApplicationPrompts:prompts,originalDiagrams:images,originalThreeFilesBytePreserved:true,sourcePdfInRepository:false,wholeSourceCoverageConfirmed:false,domainReviewed:false,nativeReviewed:false,releaseReady:false};
fs.writeFileSync(path.join(dir,'content-qa-2026-10-18.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
