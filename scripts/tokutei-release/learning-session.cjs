#!/usr/bin/env node
'use strict';
// Observer-operated, local-only timing receipt. Never synthesizes learner evidence.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'../..');
const SECTORS=['agriculture','manufacturing','food','restaurant','hospitality','construction','kaigo'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function contentFile(relative){
  if(typeof relative!=='string'||!relative.startsWith('src/data/')||path.isAbsolute(relative)||relative.split('/').includes('..')||relative.includes('\\'))throw Error('Content must be a repository-relative src/data file');
  const full=fs.realpathSync(path.join(ROOT,relative));
  if(!full.startsWith(fs.realpathSync(path.join(ROOT,'src/data'))+path.sep))throw Error('Content escaped src/data');
  return full;
}
function stamp(now){return {atMs:now===undefined?Date.now():now,monotonicNs:(now===undefined?process.hrtime.bigint():BigInt(now)*1000000n).toString()};}
function delta(a,b){
 if(!/^\d{1,30}$/.test(a.monotonicNs||'')||!/^\d{1,30}$/.test(b.monotonicNs||''))throw Error('Monotonic timestamps required');
 const ns=BigInt(b.monotonicNs)-BigInt(a.monotonicNs);if(ns<0n)throw Error('Clock moved backwards or device restarted');
 return Number(ns)/1000000;
}
function create({sector,dayId,observerId,participantId,buildCommit,contentPath,device,synthetic=false},now){
  if(!SECTORS.includes(sector))throw Error('Unknown sector');
  for(const [k,v]of Object.entries({dayId,observerId,participantId,device}))if(typeof v!=='string'||!v.trim())throw Error('Required: '+k);
  if(!/^[a-f0-9]{40}$/.test(buildCommit||''))throw Error('Exact tested build commit required');
  return {schemaVersion:1,kind:'observed_learning_session',sector,dayId,observerId,participantId,buildCommit,device,contentPath,contentSha256:hash(fs.readFileSync(contentFile(contentPath))),synthetic,events:[{type:'start',...stamp(now)}],observerAttestation:null,acceptance:{learnerDurationMeasured:false,physicalDeviceTested:false,domainReviewed:false,nativeReviewed:false}};
}
function event(session,type,now){
  if(!['pause','resume','finish'].includes(type))throw Error('Unknown event');
  const previous=session.events.at(-1);
  const time=stamp(now);if(!Number.isSafeInteger(time.atMs))throw Error('Invalid timestamp');delta(previous,time);
  const allowed={start:['pause','finish'],resume:['pause','finish'],pause:['resume','finish'],finish:[]};
  if(!allowed[previous.type]?.includes(type))throw Error('Invalid event order');
  session.events.push({type,...time});return session;
}
function summarize(session){
  if(session.kind!=='observed_learning_session'||session.schemaVersion!==1||!Array.isArray(session.events)||session.events[0]?.type!=='start')throw Error('Invalid session');
  let activeMs=0,previous=session.events[0];
  if(!Number.isSafeInteger(previous.atMs)||previous.atMs<0)throw Error('Invalid timestamp');
  for(const e of session.events.slice(1)){
    if(!Number.isSafeInteger(e.atMs))throw Error('Invalid timestamp');const elapsed=delta(previous,e);
    const allowed={start:['pause','finish'],resume:['pause','finish'],pause:['resume','finish'],finish:[]};
    if(!allowed[previous.type]?.includes(e.type))throw Error('Invalid event order');
    if(previous.type==='start'||previous.type==='resume')activeMs+=elapsed;
    previous=e;
  }
  const finished=previous.type==='finish',wallMs=delta(session.events[0],previous),wallClockMs=previous.atMs-session.events[0].atMs;
  const currentContent=hash(fs.readFileSync(contentFile(session.contentPath)))===session.contentSha256;
  return {status:finished?'RECORDED_REQUIRES_REVIEW':'IN_PROGRESS',sector:session.sector,dayId:session.dayId,finished,activeMs,activeSeconds:activeMs/1000,activeMinutes:activeMs/60000,wallMs,wallClockMs,clockShiftMs:wallClockMs-wallMs,monotonicClockUsed:true,pauseMs:wallMs-activeMs,currentContent,synthetic:session.synthetic===true,observerAttested:session.observerAttestation?.liveLearnerObserved===true&&!!session.observerAttestation?.notes?.trim(),eligibleForHumanReview:finished&&currentContent&&session.synthetic!==true&&session.observerAttestation?.liveLearnerObserved===true&&!!session.observerAttestation?.notes?.trim(),acceptance:{learnerDurationMeasured:false,physicalDeviceTested:false,domainReviewed:false,nativeReviewed:false},note:'Recorded monotonic intervals require observer verification and scope review. Device names, elapsed time and simulated fixtures are not acceptance.'};
}
module.exports={create,event,summarize};
if(require.main===module){
  try{
    const [command,file,input]=process.argv.slice(2);if(!file)throw Error('Usage: learning-session.cjs start FILE CONFIG.json | pause/resume/finish/summary FILE | attest FILE NOTES.txt');
    if(command==='start'){
      const session=create(JSON.parse(fs.readFileSync(input,'utf8')));fs.writeFileSync(file,JSON.stringify(session,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(summarize(session)));
    }else{
      const session=JSON.parse(fs.readFileSync(file,'utf8'));
      if(command==='summary'){console.log(JSON.stringify(summarize(session)));}
      else if(command==='attest'){
        if(session.events.at(-1)?.type!=='finish'||session.synthetic)throw Error('Attestation requires a finished, non-synthetic observed session');
        const notes=fs.readFileSync(input,'utf8').trim();if(!notes)throw Error('Observer notes required');
        session.observerAttestation={liveLearnerObserved:true,notes,atMs:Date.now()};fs.writeFileSync(file,JSON.stringify(session,null,2)+'\n');console.log(JSON.stringify(summarize(session)));
      }else{event(session,command);fs.writeFileSync(file,JSON.stringify(session,null,2)+'\n');console.log(JSON.stringify(summarize(session)));}
    }
  }catch(e){console.error(e.message);process.exitCode=1;}
}
