import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const dir='docs/ssw-workspace/kensetsu/exams/ten-by-forty/';
const blueprint=JSON.parse(fs.readFileSync(dir+'blueprint.json','utf8'));
const preserved=JSON.parse(fs.readFileSync(dir+'preserved-file-hashes.json','utf8'));
for(const plan of blueprint.exams){
 const packet=[];
 for(let n=plan.sessionRange[0];n<=plan.sessionRange[1];n++){
  const lessonFile='docs/ssw-workspace/kensetsu/shared-session-'+String(n).padStart(3,'0')+'.json';
  const bytes=fs.readFileSync(lessonFile),lessonSha256=crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(lessonSha256,preserved[lessonFile]);
  packet.push({number:n,lessonFile,lessonSha256,session:JSON.parse(bytes)});
 }
 fs.writeFileSync(dir+'source-exam-'+String(plan.examNumber).padStart(2,'0')+'.json',JSON.stringify(packet,null,2)+'\n');
}
console.log('Prepared10 temporary source packets from hash-verified canonical385lessons');
