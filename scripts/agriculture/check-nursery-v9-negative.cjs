// Reject plausible acceptance mistakes with the real source-ledger validator; in-memory clones only.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{validateSector}=require('../source-coverage-v2/check.cjs');const root=path.resolve(__dirname,'../..'),p='docs/ssw-workspace/source-coverage-v2/agriculture.json',base=JSON.parse(fs.readFileSync(path.join(root,p)));const cases=[];
function rejects(name,mutate){const l=structuredClone(base);mutate(l);let e;try{validateSector(root,l);}catch(error){e=error;}assert(e,'Must reject '+name);cases.push({name,code:e.code||e.name});}
const own=l=>l.knowledgeUnits.find(u=>u.knowledgeId==='agriculture-v9-thin-disease');
rejects('stale new assessment hash',l=>own(l).assessmentEvidence[0].sha256='0'.repeat(64));
rejects('covered knowledge without exact source element',l=>own(l).sourceRefs[0].elementIds=[]);
rejects('domain approval inferred from AI review',l=>own(l).review.domainReviewed=true);
rejects('duplicate historical record points to itself',l=>{const u=l.knowledgeUnits.find(u=>u.knowledgeId==='agriculture-v2-AGR-K-NURSERY-06');u.duplicateOf=u.knowledgeId;});
rejects('whole-sector coverage claimed while denominator open',l=>l.wholeSourceKnowledgeCovered=true);
const report={status:'PASS_AGRICULTURE_NURSERY_V9_NEGATIVE_GUARDS',cases,changesToRuntimeOrSourceLedger:false};fs.writeFileSync(path.join(root,'docs/ssw-workspace/source-coverage-v2/agriculture-nursery-v9-negative-validation.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
