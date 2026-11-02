const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {withCommittedSnapshot}=require('./report.cjs');
const repo=fs.mkdtempSync(path.join(os.tmpdir(),'ssw-report-test-'));
const git=(...args)=>execFileSync('git',args,{cwd:repo,stdio:['ignore','pipe','pipe']}).toString().trim();
function put(p,value){const f=path.join(repo,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,value);}
const registry='docs/ssw-workspace/source-coverage-v2/registry.json',ledger='docs/ssw-workspace/source-coverage-v2/food.json';
try{
 git('init','--quiet');git('config','user.name','Snapshot test');git('config','user.email','test@example.invalid');
 put(registry,JSON.stringify({sectors:[{sector:'food',ledger}]}));
 put(ledger,JSON.stringify({pages:[{regionCensus:{artifactPath:'regions.json'}}],knowledgeUnits:[{teachingEvidence:[{path:'teaching.json'}],assessmentEvidence:[{path:'absent.json'}]}]}));
 put('regions.json','{"version":"committed-regions"}');put('teaching.json','{"version":"committed-teaching"}');
 git('add','.');git('commit','--quiet','-m','snapshot fixture');const first=git('rev-parse','HEAD');
 put('teaching.json','{"version":"unfinished-teaching"}');put('regions.json','{"version":"unfinished-regions"}');put('absent.json','{"untracked":true}');put('unrelated-private.txt','must never enter snapshot');
 let snapshot;
 withCommittedSnapshot(repo,'HEAD',(folder,commit)=>{snapshot=folder;assert.equal(commit,first);assert.equal(JSON.parse(fs.readFileSync(path.join(folder,'teaching.json'))).version,'committed-teaching');assert.equal(JSON.parse(fs.readFileSync(path.join(folder,'regions.json'))).version,'committed-regions');assert.equal(fs.existsSync(path.join(folder,'absent.json')),false);assert.equal(fs.existsSync(path.join(folder,'unrelated-private.txt')),false);});
 assert.equal(fs.existsSync(snapshot),false);
 git('add','teaching.json');git('commit','--quiet','-m','second snapshot');
 withCommittedSnapshot(repo,first,(folder,commit)=>{assert.equal(commit,first);assert.equal(JSON.parse(fs.readFileSync(path.join(folder,'teaching.json'))).version,'committed-teaching');});
 assert.throws(()=>withCommittedSnapshot(repo,'HEAD',folder=>{snapshot=folder;throw Error('callback probe');}),/callback probe/);assert.equal(fs.existsSync(snapshot),false);
 put(ledger,JSON.stringify({knowledgeUnits:[{teachingEvidence:[{path:'../outside'}]}]}));git('add',ledger);git('commit','--quiet','-m','unsafe dependency fixture');assert.throws(()=>withCommittedSnapshot(repo,'HEAD',()=>{}),/Unsafe snapshot path/);
 console.log('PASS_COMMITTED_REPORT_ISOLATION: committed bytes, exact ref, no working/untracked/private fallback, cleanup, unsafe path rejection');
}finally{fs.rmSync(repo,{recursive:true,force:true});}
