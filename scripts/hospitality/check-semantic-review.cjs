// Evidence/revision checks only; semantic judgments are explicitly AI-authored.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),dir=path.join(root,'docs/ssw-workspace/hospitality');
const read=p=>JSON.parse(fs.readFileSync(p));
const ledger=read(path.join(dir,'knowledge-ledger.json')),input=read(path.join(dir,'semantic-review-authoring-20261101.json'));
assert.deepEqual(ledger.semanticReview,input,'canonical semantic review is stale');
const lessons=new Map(['front','planning','service','restaurant','safety'].flatMap(g=>read(path.join(root,'src/data/hospitality',g+'.json')).lessons.map(l=>[l.id,l])));
assert.equal(input.sourceClaims.length,ledger.sourceAtoms.length);
const ids=new Set();
for(const r of input.sourceClaims){assert(!ids.has(r.atomId));ids.add(r.atomId);const a=ledger.sourceAtoms.find(a=>a.atomId===r.atomId);assert(a);const l=lessons.get(r.lessonId);assert.equal(l.revision,r.sourceRevision);assert.deepEqual(r.questionIds,a.after.questionIds);assert.equal(r.assessmentScope,a.after.assessmentStatus);}
for(const v of input.visualMeaningReviews){assert(v.features.length);for(const id of v.atoms)assert(ids.has(id));for(const f of v.learningFigures){const file=path.join(root,'assets/app/hospitality',f.lessonId+'.png');assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),f.sha256);}}
assert.equal(input.sourcePages.length,117);assert(input.sourcePages.every(p=>p.allPageIdeasAccepted===false));
assert.equal(input.summary.allSourceKnowledgeCovered,false);assert(input.remaining.length>0);
console.log(JSON.stringify({status:'PASS',claimRecords:ids.size,visualMeaningGroups:input.visualMeaningReviews.length,freshSourceVisualPages:input.summary.freshSourceVisualPages,semanticCertification:false}));
