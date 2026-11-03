'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {readJSON,pointer,hash}=require('../source-coverage-v2/check.cjs');
const root=path.resolve(__dirname,'../..');
function evidence(e){
 assert(e&&typeof e.path==='string'&&!path.isAbsolute(e.path)&&!e.path.includes('\\')&&!e.path.split('/').includes('..'),'unsafe app evidence path');
 const file=path.join(root,e.path);assert(fs.existsSync(file),'missing app evidence');
 const actual=e.sha256Mode==='json-value'?hash(JSON.stringify(pointer(readJSON(file),e.jsonPointer))):e.sha256Mode==='file'?hash(fs.readFileSync(file)):null;
 assert.equal(actual,e.sha256,'stale app-claim evidence '+e.path);
}
function validate(claim,ids){
 assert(claim.claimId&&claim.statementJa&&['grounded_ai','provenance_pending'].includes(claim.status),'invalid extension');
 assert(Array.isArray(claim.sourceKnowledgeIds)&&claim.sourceKnowledgeIds.every(id=>ids.has(id)),'unknown source anchor');
 assert(Array.isArray(claim.teachingEvidence)&&claim.teachingEvidence.length,'missing teaching');claim.teachingEvidence.forEach(evidence);
 assert(Array.isArray(claim.unresolved),'missing app-claim unresolved state');
 if(claim.status==='grounded_ai'){
  assert.equal(claim.unresolved.length,0);assert.equal(claim.assessmentAcceptance,true);
  assert(claim.scopeJa&&claim.provenance?.kind&&claim.provenance?.modelDefinition,'missing bounded model provenance');
  assert(Array.isArray(claim.assessmentEvidence)&&claim.assessmentEvidence.length,'missing app assessment');claim.assessmentEvidence.forEach(evidence);
 }
 for(const [flag,value]of Object.entries(claim.review||{}))if(value===true){assert(claim.reviewEvidence?.[flag]?.length,'unsupported human/device flag');claim.reviewEvidence[flag].forEach(evidence);}
 assert(typeof claim.reviewRef==='string'&&!path.isAbsolute(claim.reviewRef)&&!claim.reviewRef.split('/').includes('..')&&fs.existsSync(path.join(root,claim.reviewRef)),'missing self-review receipt');
}
function run(){
 const registry=readJSON(path.join(root,'docs/ssw-workspace/source-coverage-v2/registry.json')),seen=new Set(),claims=[];let negativeControls=0;
 for(const row of registry.sectors){
  const ledger=readJSON(path.join(root,row.ledger)),ids=new Set(ledger.knowledgeUnits.map(u=>u.knowledgeId));
  for(const claim of ledger.appClaimExtensions||[]){
   assert(!seen.has(claim.claimId),'duplicate app claim');seen.add(claim.claimId);validate(claim,ids);
   const stale=structuredClone(claim);stale.teachingEvidence[0].sha256='0'.repeat(64);assert.throws(()=>validate(stale,ids));negativeControls++;
   if(claim.status==='grounded_ai'){
    const missing=structuredClone(claim);missing.assessmentEvidence=[];assert.throws(()=>validate(missing,ids));negativeControls++;
    const falseHuman=structuredClone(claim);falseHuman.review.nativeReviewed=true;assert.throws(()=>validate(falseHuman,ids));negativeControls++;
   }
   claims.push({sector:row.sector,claimId:claim.claimId,status:claim.status});
  }
 }
 const report={status:'PASS_REGISTERED_APP_CLAIM_BINDINGS',claims,negativeControls,wholeAppClaimInventoryComplete:false,domainOrNativeAcceptanceInferred:false,sourcePdfCoverageIncreasedByTheseExtensions:false};
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));return report;
}
if(require.main===module){try{run();}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={validate,evidence};
