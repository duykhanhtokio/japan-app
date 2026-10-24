// Mechanical punctuation repair only. Preserve translations and concurrent edits.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const cp = require('node:child_process');
const {root, locales, validateBatch} = require('./lib/dialogue-translation-validation.cjs');
const {lock} = require('./dialogue-quality-repair-worker.cjs');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const normalize = s => s.replace(/。{2,}/g, '。');
const args = process.argv.slice(2), apply = args.includes('--apply');
const at = args.indexOf('--archive'), archive = at < 0 ? null : args[at + 1];
assert(!apply || (archive && path.isAbsolute(archive)), '--apply requires --archive ABSOLUTE_PATH');
process.chdir(root);
let unlock;
try {
  if (apply) unlock = lock();
  const dirty = new Set();
  const status = cp.execFileSync('git', ['status', '--porcelain=v1', '-z'], {encoding:'utf8'}).split('\0');
  for (let i=0;i<status.length;i++) {
    const row=status[i]; if(!row) continue;
    dirty.add(row.slice(3)); if(/[RC]/.test(row.slice(0,2))) dirty.add(status[++i]);
  }
  const changes = new Map(), affected=[], skipped=[];
  let repairedHints=0, candidates=0;
  const load = file => {
    const before=fs.readFileSync(file);
    return {file,before,data:JSON.parse(before)};
  };
  for(const name of fs.readdirSync('docs/localization-workspace/sources').filter(n=>/^dialogue-batch-\d+\.ja\.json$/.test(n)).sort()) {
    const sourcePath='docs/localization-workspace/sources/'+name, source=load(sourcePath);
    const batch=source.data.batch, rows=[];
    for(const [sid,s] of Object.entries(source.data.scenarios))
      for(const [tid,t] of Object.entries(s.turns))
        if(typeof t.hintJa==='string' && normalize(t.hintJa)!==t.hintJa) rows.push({sid,tid,before:t.hintJa,after:normalize(t.hintJa)});
    if(!rows.length) continue;
    candidates+=rows.length;
    const canonicalPaths=[...new Set(rows.map(r=>'src/data/generated/dialogues/'+r.sid+'.json'))];
    const packPaths=locales.map(l=>'src/data/dialogue-content/locale-batches/'+l+'/'+batch+'.json');
    const paths=[sourcePath,...canonicalPaths,...packPaths];
    if(paths.some(p=>dirty.has(p)||!fs.existsSync(p))) {skipped.push({batch,hints:rows.length,reason:'concurrent changes or missing direct canonical file'});continue;}
    validateBatch(batch);
    const files=new Map([[sourcePath,source],...canonicalPaths.map(p=>[p,load(p)]),...packPaths.map(p=>[p,load(p)])]);
    for(const r of rows) {
      source.data.scenarios[r.sid].turns[r.tid].hintJa=r.after;
      const d=files.get('src/data/generated/dialogues/'+r.sid+'.json').data;
      const turn=(Array.isArray(d)?d:d.shared??d.N5).find(t=>t.id===r.tid);
      assert.equal(turn?.speaker,'PLAYER');assert.equal(turn.player.hint,r.before);turn.player.hint=r.after;
      for(const p of packPaths) {const entry=files.get(p).data.scenarios[r.sid].turns[r.tid];assert.equal(entry.hintJa,r.before);entry.hintJa=r.after;}
    }
    for(const [p,f] of files) {
      f.after=Buffer.from(JSON.stringify(f.data,null,2)+'\n');
      assert(!changes.has(p),'Canonical file unexpectedly shared between batches');changes.set(p,f);
    }
    affected.push({batch,hints:rows.length});repairedHints+=rows.length;
  }
  const report={status:apply?'REPAIRED_AND_VALIDATED':'DRY_RUN',candidateHints:candidates,repairedHints,localeSourceBindings:repairedHints*locales.length,affected,skipped,translationsUnchanged:true,semanticReviewComplete:false,files:[...changes].map(([p,f])=>({path:p,beforeSha256:hash(f.before),afterSha256:hash(f.after)}))};
  if(apply) {
    assert(!fs.existsSync(archive),'Use a new archive directory');
    // Compare every input before touching any file; all writers share the repair lock.
    for(const [p,f] of changes) assert.equal(hash(fs.readFileSync(p)),hash(f.before),'Concurrent revision: '+p);
    fs.mkdirSync(archive,{recursive:true});
    for(const [p,f] of changes) {
      for(const [side,bytes] of [['before',f.before],['after',f.after]]) {const dest=path.join(archive,side,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);}
    }
    fs.writeFileSync(path.join(archive,'manifest.json'),JSON.stringify(report,null,2)+'\n');
    for(const [p,f] of changes) {const tmp=p+'.punctuation-'+process.pid+'.tmp';fs.writeFileSync(tmp,f.after);fs.renameSync(tmp,p);}
    for(const {batch} of affected) validateBatch(batch);
  }
  console.log(JSON.stringify(report));
} finally {unlock?.();}
