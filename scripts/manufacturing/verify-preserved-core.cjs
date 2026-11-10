const fs=require('node:fs');
const crypto=require('node:crypto');
const path=require('node:path');
const assert=require('node:assert/strict');

const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

const approved={
 'questions.en.json':{
  hash:'07876f25f954f3d3e3c500a217f00b09aa569adc4f69c158efc3f8d3f9572085',
  ids:['mfg1-surface-weekly-02-q06']
 },
 'questions.id.json':{
  hash:'9eff04f86a8bf8459048f5e31deb7712151b63f499d4b4268adb32d2e15c370b',
  ids:['mfg1-electrical-weekly-14-q03']
 },
 'questions.th.json':{
  hash:'544d6681ca8004a3d3dbfcf301a5af0f6ab5f706d74269387265dbdfd972e6f7',
  ids:['mfg1-electrical-weekly-14-q03']
 },
 'questions.tl.json':{
  hash:'1f5b13dbe3534294bfad5324af318c1111ec7789928909b17de604238d902b32',
  ids:['mfg1-surface-weekly-02-q06','mfg1-electrical-weekly-14-q03']
 },
 'questions.vi.json':{
  hash:'c6cb3d6ba81597169985e9c290acb8e1070fa255a26f61157cb242949550c5e1',
  ids:['mfg1-surface-weekly-02-q06','mfg1-electrical-weekly-14-q03']
 },
 'questions.zh-CN.json':{
  hash:'3d610e127caf4c1e6d3179a2b3565e54e4e784394f713742b724f337538cb135',
  ids:['mfg1-electrical-weekly-14-q03']
 },
 'questions.zh-TW.json':{
  hash:'ea4e5cccc36ceb85e5fad5f17b68d66b53a0eb0fc82ba5a77febfdb1ae908309',
  ids:['mfg1-electrical-weekly-14-q03']
 }
};

function verifyPreservedCore(root,file,expected){
 const bytes=fs.readFileSync(path.join(root,file));
 const actual=sha(bytes);

 if(actual===expected)return;

 const entry=approved[path.basename(file)];
 if(!entry||file!=='src/data/manufacturing/translations/'+path.basename(file))
  throw Error('Protected file changed: '+file);

 assert.equal(actual,entry.hash,'Unapproved current file hash: '+file);

 const snapshot=path.join(
  root,
  'docs/ssw-workspace/manufacturing/batch22/historical-question-translations',
  path.basename(file)
 );
 const oldBytes=fs.readFileSync(snapshot);

 assert.equal(sha(oldBytes),expected,'Historical baseline mismatch: '+file);

 const oldData=JSON.parse(oldBytes);
 const newData=JSON.parse(bytes);

 assert.deepEqual(Object.keys(newData.questions).sort(),Object.keys(oldData.questions).sort());

 const changed=Object.keys(newData.questions).filter(
  id=>JSON.stringify(newData.questions[id])!==JSON.stringify(oldData.questions[id])
 );

 assert.deepEqual(changed.sort(),[...entry.ids].sort(),'Unexpected changed question IDs');

 for(const id of entry.ids){
  const before=oldData.questions[id],after=newData.questions[id];
  assert(before&&after,'Missing question '+id);

  for(const field of Object.keys(before)){
   if(['stem','options','reasons'].includes(field))continue;
   assert.deepEqual(after[field],before[field],'Unexpected field change '+id+' '+field);
  }
 }

 const restored=JSON.parse(JSON.stringify(newData));
 for(const id of entry.ids)restored.questions[id]=oldData.questions[id];

 assert.deepEqual(restored,oldData,'Other protected data changed: '+file);
}

module.exports={verifyPreservedCore};
