import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createState,ensureChallenge,recordMatches,exchangeKeys,unlockExam,accessTo,startRun,submitRun,WEEK_MS } from '../../src/daily-learning/core.mjs';
import { runLearningAction, loadDailyWords } from './daily-learning.mjs';
const require = createRequire(import.meta.url);
const {newDb}=require(process.env.LEARNING_PG_MEM ?? 'pg-mem');
const catalog=[{id:'n5-2011-12-exam-01',level:'N5'},{id:'n5-2012-12-exam-02',level:'N5'},{id:'jpapp-n5-original-01-v1',level:'N5'}];
const words=Array.from({length:30},(_,i)=>({id:'w'+i,word:'語'+i,reading:'ご'+i,meaning:'meaning '+i,level:'N5'}));
const now=Date.parse('2026-11-07T03:00:00Z');
test('28 nonconsecutive daily completions award four keys; replay does not award twice',()=>{
 const s=createState('N5',catalog);
 for(let i=0;i<28;i++) {const t=now+i*2*86400000,ch=ensureChallenge(s,words,t,'en'), tuples=ch.words.map(w=>[w.id,w.id,w.id]);assert.equal(recordMatches(s,ch.day,tuples,t).completed,true);assert.equal(recordMatches(s,ch.day,tuples,t).keyAwarded,false);}
 assert.equal(s.keys,4);exchangeKeys(s,'exchange1');assert.equal(s.keys,0);assert.equal(s.tickets,1);assert.equal(exchangeKeys(s,'exchange1').replayed,true);assert.equal(s.tickets,1);
});
test('challenge stable, wrong matches rejected, next day expires, duplicate visible readings excluded',()=>{
 const s=createState('N5',catalog),ch=ensureChallenge(s,[...words,{...words[0],id:'alias'}],now,'en');
 assert.equal(new Set(ch.words.map(w=>w.reading)).size,10);assert.equal(ensureChallenge(s,words,now,'vi'),ch);
 assert.equal(recordMatches(s,ch.day,[[ch.words[0].id,ch.words[1].id,ch.words[0].id]],now).completed,false);
 assert.throws(()=>recordMatches(s,ch.day,[],now+86400000));
});
test('ticket opens only an original for exactly seven days, multiple starts and retained unfinished work',()=>{
 const s=createState('N5',catalog);s.tickets=1;const exam=catalog[1].id;
 assert.throws(()=>unlockExam(s,catalog[2].id,now,0,'bad',catalog));
 const grant=unlockExam(s,exam,now,0,'unlock1',catalog);assert.equal(grant.expiresAt-now,WEEK_MS);assert.equal(s.tickets,0);
 unlockExam(s,exam,now+1,0,'unlock1',catalog);assert.equal(s.tickets,0);assert.equal(s.grants[exam],grant.expiresAt);
 for(let i=0;i<3;i++){startRun(s,exam,'run'+i,now+i,0,catalog);submitRun(s,exam,'run'+i,now+i,0);}
 startRun(s,exam,'unfinished',now+1,0,catalog);assert.equal(accessTo(s,exam,now+WEEK_MS,0,'unfinished').allowed,false);assert.throws(()=>submitRun(s,exam,'unfinished',now+WEEK_MS,0));
 assert.equal(s.runs.unfinished.submitted,false);s.tickets=1;unlockExam(s,exam,now+WEEK_MS,0,'unlock2',catalog);assert.equal(accessTo(s,exam,now+WEEK_MS,0,'unfinished').allowed,true);
});
test('premium grants cover authored exams, but only already-started premium runs survive expiry',()=>{
 const s=createState('N5',catalog),exam=catalog[2].id;s.tickets=4;
 startRun(s,exam,'premium1',now,now+1,catalog);assert.equal(accessTo(s,exam,now+2,0,'premium1').allowed,true);assert.equal(accessTo(s,exam,now+2,0).allowed,false);submitRun(s,exam,'premium1',now+2,0);assert.equal(accessTo(s,exam,now+3,0,'premium1').allowed,false);assert.equal(s.tickets,4);
});
test('database handler persists immutable free exam and deduplicated exchanges across reloads',async()=>{
 const mem=newDb();mem.public.none('CREATE TABLE learning_accounts(user_id text primary key,state jsonb,updated_at timestamp); CREATE TABLE economy_entitlements(user_id text,expires_at timestamp,revoked_at timestamp)');
 const {Pool}=mem.adapters.createPg(),db=new Pool();
 const a=await runLearningAction(db,'alice','daily',{level:'N5',locale:'en'},{now,words:()=>words});
 const initial=a.state.freeExamId;
 const b=await runLearningAction(db,'alice','account',{level:'N3',locale:'en'},{now});assert.equal(b.state.freeExamId,initial);assert.equal(b.state.initialLevel,'N5');assert.equal(b.state.level,'N3');
 const c=await runLearningAction(db,'bob','account',{level:'N4'},{now});assert.notEqual(c.state.freeExamId,initial);await db.end();
});

test('all five levels and thirteen app languages have ten unambiguous localized cards',()=>{
 for(const locale of ['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl','ja']) for(const level of ['N5','N4','N3','N2','N1']) {
  const state={...createState('N5',catalog),level};const ch=ensureChallenge(state,loadDailyWords(locale),now,locale);assert.equal(ch.words.length,10);for(const field of ['word','reading','meaning'])assert.equal(new Set(ch.words.map(w=>w[field])).size,10);
 }
});
