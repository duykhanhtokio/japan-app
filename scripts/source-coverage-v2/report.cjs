// Derived view only. Sector ledgers remain the sole acceptance source of truth.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process');
const {validateFile,readJSON,hash}=require('./check.cjs');
const root=path.resolve(__dirname,'../..');
function buildReportAt(reportRoot,committedSnapshot){const registryPath='docs/ssw-workspace/source-coverage-v2/registry.json',registry=readJSON(path.join(reportRoot,registryPath));const sectors=registry.sectors.map(row=>{const file=path.join(reportRoot,row.ledger);if(!fs.existsSync(file))return {sector:row.sector,status:'MISSING_LEDGER',sourceCoveragePercent:null,fullyCovered:false};try{const s=validateFile(reportRoot,row.ledger),d=readJSON(file);return {...s,ledger:row.ledger,ledgerSha256:hash(fs.readFileSync(file)),denominatorStatus:d.denominator.status,unresolved:d.unresolved,openKnowledgeIds:d.knowledgeUnits.filter(k=>!['covered_ai','excluded','duplicate'].includes(k.status)).map(k=>k.knowledgeId)};}catch(e){return {sector:row.sector,status:'INVALID_LEDGER',code:e.code||'READ_ERROR',message:e.message,sourceCoveragePercent:null,fullyCovered:false};}});return {schemaVersion:2,registry:registryPath,registrySha256:hash(fs.readFileSync(path.join(reportRoot,registryPath))),...(committedSnapshot?{committedSnapshot}:{}),meaning:'Derived mechanical evidence status; no semantic, native, expert, device, rights or learner-time acceptance inferred.',allLedgersValid:sectors.every(s=>s.status==='PASS_REGISTRY_CONTRACT'),allSourceKnowledgeCovered:sectors.every(s=>s.fullyCovered),sectors};}
// Read only ledger dependencies from one immutable Git commit. Never read another
// worker's in-progress bytes or export the whole app/source corpus for a report.
function withCommittedSnapshot(repo,ref,callback){
 const git=args=>execFileSync('git',args,{cwd:repo,maxBuffer:64*1024*1024});
 const commit=git(['rev-parse','--verify','--end-of-options',`${ref}^{commit}`]).toString().trim();
 if(!/^[a-f0-9]{40}$/.test(commit))throw Error('Expected an exact commit SHA');
 const tracked=new Set(git(['ls-tree','-r','--name-only',commit]).toString().trim().split('\n'));
 const folder=fs.mkdtempSync(path.join(os.tmpdir(),'ssw-committed-report-'));
 const written=new Set();
 function copy(file){
  if(typeof file!=='string'||path.isAbsolute(file)||file.includes('\\')||file.split('/').includes('..'))throw Error('Unsafe snapshot path');
  if(!tracked.has(file)||written.has(file))return;
  const target=path.join(folder,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,git(['show',`${commit}:${file}`]));written.add(file);
 }
 function dependencies(value){if(!value||typeof value!=='object')return;for(const [key,v] of Object.entries(value)){if((key==='path'||key==='artifactPath')&&typeof v==='string')copy(v);else dependencies(v);}}
 try{
  const registryPath='docs/ssw-workspace/source-coverage-v2/registry.json';copy(registryPath);
  const registry=readJSON(path.join(folder,registryPath));
  for(const row of registry.sectors){copy(row.ledger);const f=path.join(folder,row.ledger);if(fs.existsSync(f))dependencies(readJSON(f));}
  return callback(folder,commit);
 }finally{fs.rmSync(folder,{recursive:true,force:true});}
}
function buildReport(options={}){return options.ref?withCommittedSnapshot(options.repo||root,options.ref,(folder,commit)=>buildReportAt(folder,commit)):buildReportAt(root);}
module.exports={buildReport,withCommittedSnapshot};
if(require.main===module){const refIndex=process.argv.indexOf('--ref');if(refIndex>=0&&!process.argv[refIndex+1])throw Error('--ref requires a Git ref');const r=buildReport({ref:refIndex>=0?process.argv[refIndex+1]:undefined});const i=process.argv.indexOf('--out');if(i>=0){const out=process.argv[i+1];if(!out)throw Error('--out requires a path');fs.writeFileSync(out,JSON.stringify(r,null,2)+'\n');}console.log(JSON.stringify({...r,sectors:r.sectors.map(({openKnowledgeIds,unresolved,...s})=>({...s,openKnowledgeUnits:openKnowledgeIds?.length,unresolvedItems:unresolved?.length}))}));if(!r.allLedgersValid)process.exitCode=1;}
