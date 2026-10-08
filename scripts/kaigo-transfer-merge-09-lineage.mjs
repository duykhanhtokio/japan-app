import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {restoreFollowup10Bundle} from './kaigo-followup-10-lineage.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const evidencePath='docs/ssw-workspace/kaigo/reviews/priority-gap-transfer-merge-09.json';
const serial=x=>JSON.stringify(x,null,2)+'\n';
const blob=s=>{const b=Buffer.from(s);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');};
export function restoreMerge09Bundle(bundle,filePath){
 bundle=restoreFollowup10Bundle(bundle,filePath);
 if(!bundle.editorialTransferMerge)return structuredClone(bundle);
 const e=JSON.parse(fs.readFileSync(resolve(root,evidencePath),'utf8'));
 const c=e.changes.find(c=>filePath.replaceAll('\\','/').endsWith(c.path));
 assert(c,'merge09 supported path');
 assert.equal(blob(serial(bundle)),c.afterGitBlobSha,'merge09 current bundle identity');
 const r=structuredClone(bundle),m=r.modules.find(m=>m.id===c.targetModuleId);
 assert(m?.transferPractice.rehearsalPlan09,'merge09 rehearsal plan present');
 assert.equal(m.replacementPlan.transferMergeRef,'reviews/priority-gap-transfer-merge-09.json');
 delete m.transferPractice.rehearsalPlan09;
 delete m.replacementPlan.transferMergeRef;
 delete r.editorialTransferMerge;
 assert.equal(blob(serial(r)),c.beforeGitBlobSha,'merge09 exact predecessor');
 return r;
}
export function restoreMerge09Bundles(bundles){
 return bundles.map(b=>{
  if(!b.editorialTransferMerge)return structuredClone(b);
  const e=JSON.parse(fs.readFileSync(resolve(root,evidencePath),'utf8'));
  const c=e.changes.find(c=>b.modules.some(m=>m.id===c.targetModuleId));
  assert(c,'merge09 supported bundle');
  return restoreMerge09Bundle(b,c.path);
 });
}
export function historicalBytes09(filePath,bytes){
 if(!filePath.endsWith('.json'))return bytes;
 let d;try{d=JSON.parse(bytes);}catch{return bytes;}
 if(!d.editorialTransferMerge)return bytes;
 return Buffer.from(serial(restoreMerge09Bundle(d,filePath)));
}
