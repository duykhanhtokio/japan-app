// Validate review evidence, not linguistic quality or native approval.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {root} = require('./lib/dialogue-translation-validation.cjs');
const {ownerFor} = require('./dialogue-translation-worker.cjs');
process.chdir(root);
const base = 'docs/localization-workspace/quality-workspace';
const cache = new Map();
const read = p => { if (!cache.has(p)) cache.set(p, JSON.parse(fs.readFileSync(p))); return cache.get(p); };
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const policy = read('docs/localization-workspace/DIALOGUE_TRANSLATION_OWNERSHIP.json');
const queueByOwner = new Map();
const candidateFile = fs.existsSync(base+'/review-candidates.jsonl') ? base+'/review-candidates.jsonl' : base+'/baseline-screening-findings.jsonl';
for (const line of fs.readFileSync(candidateFile,'utf8').trim().split('\n')) { const row=JSON.parse(line); row.id ??= row.path+'|'+row.turnId+'|'+row.kind; if(!queueByOwner.has(row.owner)) queueByOwner.set(row.owner,[]); queueByOwner.get(row.owner).push(row); }
const owners = [];
for (const [owner,queue] of [...queueByOwner].sort(([a],[b])=>a.localeCompare(b))) {
  const file=owner+'.json';
  const logPath = base+'/adjudications/'+file;
  const log = fs.existsSync(logPath) ? read(logPath) : {owner, decisions:{}};
  assert.equal(log.owner, owner);
  const ids = new Set(queue.map(r => r.id));
  assert.equal(ids.size,queue.length,'Duplicate candidate IDs');
  for (const id of Object.keys(log.decisions)) assert(ids.has(id), 'Decision absent from queue: '+id);
  const result = {owner,total:queue.length,recorded:0,fixed:0,acceptable:0,pending:0,stale:0};
  for (const row of queue) {
    assert.equal(ownerFor(row.batch,row.locale,policy),owner);
    const d = log.decisions[row.id];
    if (!d) { result.pending++; continue; }
    result.recorded++;
    assert(d.reason.trim().length >= 20);
    assert.equal(d.nativeReviewed,false);
    const field = row.kind === 'hint' ? 'hintTranslation' : 'translation';
    const target = read(row.path).scenarios[row.scenarioId].turns[row.turnId][field];
    const source = read('docs/localization-workspace/sources/dialogue-batch-'+row.batch+'.ja.json').scenarios[row.scenarioId].turns[row.turnId][row.kind === 'hint' ? 'hintJa' : 'sourceJa'];
    const stale = hash(target)!==d.translationSha256 || hash(source)!==d.sourceSha256;
    if (stale) result.stale++;
    if (stale || !['fixed','acceptable'].includes(d.decision)) result.pending++;
    if (d.decision==='fixed') {
      result.fixed++;
      const revisionRoot='docs/localization-workspace/quality-revisions';
      const matches=fs.readdirSync(revisionRoot).map(date=>path.join(revisionRoot,date,owner,d.repairPacketId)).filter(dir=>fs.existsSync(path.join(dir,'receipt.json')));
      assert.equal(matches.length,1,'Expected one durable receipt');
      const marker={...read(path.join(matches[0],'receipt.json')),archive:matches[0]};
      assert.equal(marker.owner,owner);
      assert(marker.files.some(f=>f.path===row.path));
      assert(marker.changedUnits.some(u=>u.scenarioId===row.scenarioId && u.turnId===row.turnId && (u.field===field || (marker.kind==='source-hints' && row.kind==='hint'))), 'Receipt lacks candidate: '+row.id);
      const archived = read(path.join(marker.archive,'after',row.path)).scenarios[row.scenarioId].turns[row.turnId][field];
      assert.equal(hash(archived),d.translationSha256,'Archive proof mismatch: '+row.id);
    } else if (d.decision==='acceptable') result.acceptable++;
  }
  owners.push(result);
}
const pending = owners.reduce((n,r)=>n+r.pending,0);
const report = {status:pending?'IN_PROGRESS':'PASS_REVIEW_EVIDENCE',candidateUnits:owners.reduce((n,r)=>n+r.total,0),pending,owners,nativeReviewed:false,semanticCertification:false};
console.log(JSON.stringify(report));
if (!process.argv.includes('--allow-pending')) assert.equal(pending,0,'Unreviewed or stale candidate decisions remain');
