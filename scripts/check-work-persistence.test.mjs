import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,readFileSync,rmSync,mkdirSync,chmodSync,accessSync,constants} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const script=fileURLToPath(new URL('./check-work-persistence.mjs',import.meta.url));
function git(cwd,...args){return execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();}
function fixture(t){
 const root=mkdtempSync(path.join(tmpdir(),'tokutei-persistence-'));
 t.after(()=>rmSync(root,{recursive:true,force:true}));
 const remote=path.join(root,'origin.git'),local=path.join(root,'local'),other=path.join(root,'other');
 git(root,'init','--bare','--initial-branch=main',remote);
 git(root,'clone',remote,local);
 for(const [key,value] of [['user.name','Persistence Fixture'],['user.email','fixture@example.invalid']])git(local,'config',key,value);
 writeFileSync(path.join(local,'unit.txt'),'verified unit\n');
 git(local,'add','unit.txt');git(local,'commit','-m','save completed unit');git(local,'push','-u','origin','main');
 const saved=git(local,'rev-parse','HEAD');
 git(root,'clone',remote,other);
 for(const [key,value] of [['user.name','Persistence Fixture'],['user.email','fixture@example.invalid']])git(other,'config',key,value);
 return {root,local,other,saved};
}
function advance(f,file='other.txt',content='parallel work\n'){
 writeFileSync(path.join(f.other,file),content);git(f.other,'add',file);git(f.other,'commit','-m','parallel update');git(f.other,'push','origin','main');
 return git(f.other,'rev-parse','HEAD');
}
function gate(f,args,env=process.env){
 try{return {status:0,output:execFileSync(process.execPath,[script,...args],{cwd:f.local,encoding:'utf8',env,stdio:['ignore','pipe','pipe']})};}
 catch(error){return {status:error.status,output:String(error.stdout??'')+String(error.stderr??'')};}
}
const scoped=['--allow-unrelated-advance','--paths','unit.txt'];

test('default strict mode still rejects unrelated remote advancement',t=>{
 const f=fixture(t);advance(f);const r=gate(f,['--paths','unit.txt']);
 assert.equal(r.status,1);assert.match(r.output,/does not equal/);
});
test('opt-in preserves completed bytes and unrelated unfinished local work',t=>{
 const f=fixture(t),head=advance(f);writeFileSync(path.join(f.local,'pending.txt'),'keep this draft\n');
 const r=gate(f,scoped);assert.equal(r.status,0,r.output);assert.match(r.output,/WORK PERSISTENCE PASS/);assert.ok(r.output.includes(head));
 assert.equal(git(f.local,'rev-parse','HEAD'),f.saved);assert.equal(readFileSync(path.join(f.local,'pending.txt'),'utf8'),'keep this draft\n');
});
test('opt-in rejects any remote edit of a completed path',t=>{
 const f=fixture(t);advance(f,'unit.txt','different remote content\n');const r=gate(f,scoped);
 assert.equal(r.status,1);assert.match(r.output,/remote changed completed-unit paths/);
});
test('opt-in still rejects dirty completed local files',t=>{
 const f=fixture(t);advance(f);writeFileSync(path.join(f.local,'unit.txt'),'unfinished edit\n');const r=gate(f,scoped);
 assert.equal(r.status,1);assert.match(r.output,/uncommitted changes/);
});
test('opt-in rejects unrelated rewritten remote history even with identical unit bytes',t=>{
 const f=fixture(t);git(f.other,'checkout','--orphan','replacement');git(f.other,'rm','-rf','.');
 writeFileSync(path.join(f.other,'unit.txt'),'verified unit\n');git(f.other,'add','unit.txt');git(f.other,'commit','-m','unrelated history');
 git(f.other,'push','--force','origin','HEAD:main');const r=gate(f,scoped);
 assert.equal(r.status,1);assert.match(r.output,/not an ancestor/);
});
test('opt-in requires explicit safe tracked completed paths',t=>{
 const f=fixture(t);for(const args of [['--allow-unrelated-advance'],['--allow-unrelated-advance','--paths','../unit.txt'],['--allow-unrelated-advance','--paths','missing.txt']]){
  const r=gate(f,args);assert.equal(r.status,1);assert.match(r.output,/requires explicit|unsafe|absent from HEAD/);
 }
});
test('unrelated advance between fetch and advertisement is verified by exact commit',t=>{
 const f=fixture(t),bin=path.join(f.root,'bin');mkdirSync(bin);
 const realGit=process.env.PATH.split(path.delimiter).map(p=>path.join(p,'git')).find(p=>{try{accessSync(p,constants.X_OK);return true;}catch{return false;}});
 assert.ok(realGit);const marker=path.join(f.root,'advanced');
 const wrapper=`#!${process.execPath}\nconst{execFileSync}=require('node:child_process');const fs=require('node:fs');const p=require('node:path');const args=process.argv.slice(2);const git=(...a)=>execFileSync(process.env.TASK_REAL_GIT,a,{stdio:['ignore','pipe','pipe']});if(args[0]==='ls-remote'&&!fs.existsSync(process.env.TASK_MARKER)){fs.writeFileSync(p.join(process.env.TASK_OTHER,'other.txt'),'race update\\n');git('-C',process.env.TASK_OTHER,'add','other.txt');git('-C',process.env.TASK_OTHER,'commit','-m','racing writer');git('-C',process.env.TASK_OTHER,'push','origin','main');fs.writeFileSync(process.env.TASK_MARKER,'done');}try{process.stdout.write(execFileSync(process.env.TASK_REAL_GIT,args,{stdio:['ignore','pipe','pipe']}));}catch(e){process.stdout.write(e.stdout??'');process.stderr.write(e.stderr??'');process.exit(e.status??1);}\n`;
 const executable=path.join(bin,'git');writeFileSync(executable,wrapper);chmodSync(executable,0o755);
 const r=gate(f,scoped,{...process.env,PATH:bin+path.delimiter+process.env.PATH,TASK_REAL_GIT:realGit,TASK_OTHER:f.other,TASK_MARKER:marker});
 assert.equal(r.status,0,r.output);assert.ok(r.output.includes(git(f.other,'rev-parse','HEAD')));assert.equal(git(f.local,'rev-parse','HEAD'),f.saved);
});
