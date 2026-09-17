import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const base = 'docs/jlpt-workspace/conversion/n1-2014-07';
const manifest = JSON.parse(fs.readFileSync(`${base}/source-manifest.json`, 'utf8'));
assert.equal(manifest.examId, 'n1-2014-07-exam-05');
assert.equal(manifest.assets.length, 29);
for (const a of manifest.assets) {
  const bytes = fs.readFileSync(a.path);
  assert.equal(bytes.length, a.bytes, a.path);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), a.sha256, a.path);
}
const source = fs.readFileSync('src/data/jlpt-mock/n1-2014-07-official.ts', 'utf8');
const key = JSON.parse(`[${source.match(/WRITTEN_KEY = \[([\s\S]*?)\] as const/)[1].replace(/,\s*$/, '')}]`);
assert.equal(key.length, 70);
const files = fs.readdirSync(base).filter(n => /^written-.*\.review\.json$/.test(n)).sort();
const rows = files.flatMap(n => JSON.parse(fs.readFileSync(`${base}/${n}`, 'utf8')));
const seen = new Set();
for (const q of rows) {
  assert(!seen.has(q.questionNumber), `Duplicate ${q.questionNumber}`); seen.add(q.questionNumber);
  assert.equal(q.correctOptionId, String(key[q.questionNumber - 1]), `Key ${q.questionNumber}`);
  assert.equal(q.options.length, 4); assert(q.options.every(x => typeof x === 'string' && x.trim()));
  assert(q.promptJa.trim()); assert(q.instructionJa.trim());
  assert(manifest.assets.some(x => x.path.endsWith(`/question/page-${String(q.sourcePage).padStart(2, '0')}.jpg`)));
  if (q.underlinedText) assert(q.promptJa.includes(q.underlinedText));
}
assert.deepEqual([...seen].sort((a,b) => a-b), Array.from({length:rows.length}, (_,i)=>i+1));
if (process.argv.includes('--complete-written')) assert.equal(rows.length, 70);
console.log(`N1 2014-07 PROGRESS PASS: ${rows.length}/70 written, exact answer keys, options, contiguous sequence and 29 source hashes; listening/translation remain pending.`);
const listeningKey = JSON.parse(`[${source.match(/LISTENING_KEY = \[([\s\S]*?)\] as const/)[1].replace(/,\s*$/, '')}]`);
assert.equal(listeningKey.length, 37);
const counts = [6,7,6,14,4];
const listening = fs.readdirSync(base).filter(n=>/^listening-problem-\d+\.review\.json$/.test(n)).sort().flatMap(n=>JSON.parse(fs.readFileSync(`${base}/${n}`, 'utf8')));
const listeningSeen = new Set();
for (const q of listening) {
  const index = counts.slice(0,q.problemNumber-1).reduce((a,b)=>a+b,0)+q.questionNumber-1;
  assert(q.problemNumber>=1 && q.problemNumber<=5);
  assert(q.questionNumber>=1 && q.questionNumber<=counts[q.problemNumber-1]);
  assert(!listeningSeen.has(index)); listeningSeen.add(index);
  assert.equal(q.correctOptionId,String(listeningKey[index]));
  assert.equal(q.options.length,q.problemNumber===4?3:4);
  assert(q.options.every(x=>typeof x==='string' && x.trim()));
  assert(q.transcriptJa.trim()); assert(q.promptJa.trim());
  assert.equal(q.transcriptVerificationStatus,'verified_against_source_image');
  for(const page of q.source.answerScriptPages) assert(manifest.assets.some(x=>x.path.endsWith(`/answer-script/page-${String(page).padStart(2,'0')}.jpg`)));
  if(q.audio) {assert(q.audio.startMs>=0);assert(q.audio.endMs>q.audio.startMs);assert(q.audio.endMs<=2979900);}
  else assert.equal(q.audioTimingStatus,'pending_alignment');
}
if(process.argv.includes('--complete-listening')) assert.equal(listening.length,37);
console.log(`N1 2014-07 LISTENING PROGRESS PASS: ${listening.length}/37 source transcripts, ${listening.filter(q=>q.audio).length}/37 audio mappings; missing mappings remain pending.`);
if (process.argv.includes('--complete-audio')) {
  assert.equal(listening.length,37);
  assert(listening.every(q=>q.audio));
  const segments = [...new Map(listening.map(q=>[q.audio.segmentId,q.audio])).values()];
  assert.equal(segments.length,36);
  const {spawnSync} = await import('node:child_process');
  for(const [i,a] of segments.entries()) {
    if(i) assert(segments[i-1].endMs<=a.startMs,a.segmentId);
    const decoded=spawnSync('ffmpeg',['-v','error','-ss',String(a.startMs/1000),'-t',String((a.endMs-a.startMs)/1000),'-i','assets/jlpt/n1/2014-07/audio/n1-2014-07.mp3','-f','null','-'],{encoding:'utf8'});
    assert.equal(decoded.status,0,`${a.segmentId}: ${decoded.stderr}`);
  }
  const shared=listening.filter(q=>q.problemNumber===5 && q.responseSuffix);
  assert.equal(shared.length,2);assert.deepEqual(shared.map(q=>q.correctOptionId),['4','1']);assert.deepEqual(shared[0].audio,shared[1].audio);
  console.log('N1 2014-07 AUDIO PASS: 36 unique segments decode; two independent final responses share one range. Perceptual runtime review remains pending.');
}
