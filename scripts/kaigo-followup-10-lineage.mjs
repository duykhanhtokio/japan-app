import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const evidencePath='docs/ssw-workspace/kaigo/reviews/priority-gap-followup-10.json';
const serial=x=>JSON.stringify(x,null,2)+'\n';
const blob=s=>{const b=Buffer.from(s);return crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');};
export function restoreFollowup10Bundle(bundle,filePath){
 if(!bundle.editorialFollowup10)return structuredClone(bundle);
 const e=JSON.parse(fs.readFileSync(resolve(root,evidencePath),'utf8'));
 const c=e.changes.find(c=>filePath.replaceAll('\\','/').endsWith(c.path));
 assert(c,'followup10 supported path');
 assert.equal(blob(serial(bundle)),c.afterGitBlobSha,'followup10 current bundle identity');
 const r=structuredClone(bundle),m=r.modules.find(m=>m.id===c.targetModuleId);
 assert(m?.transferPractice.rehearsalPlan10,'followup10 plan present');
 assert.equal(m.replacementPlan.followupRepairRef,'reviews/priority-gap-followup-10.json');
 delete m.transferPractice.rehearsalPlan10;
 delete m.replacementPlan.followupRepairRef;
 delete r.editorialFollowup10;
 assert.equal(blob(serial(r)),c.beforeGitBlobSha,'followup10 exact predecessor');
 return r;
}
export function restoreFollowup10Bundles(bundles){
 return bundles.map(b=>{
  if(!b.editorialFollowup10)return structuredClone(b);
  const e=JSON.parse(fs.readFileSync(resolve(root,evidencePath),'utf8'));
  const c=e.changes.find(c=>b.modules.some(m=>m.id===c.targetModuleId));
  assert(c,'followup10 supported bundle');
  return restoreFollowup10Bundle(b,c.path);
 });
}
