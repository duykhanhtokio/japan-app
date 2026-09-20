import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = process.cwd();
const base = 'docs/jlpt-workspace/conversion/n1-2014-12';
const alignment = JSON.parse(fs.readFileSync(`${base}/audio-alignment-candidates.json`, 'utf8'));
const reviewPath = `${base}/runtime-review/audio-timing-review.json`;
const audioPath = path.join(root, alignment.audioPath);
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
if (alignment.segments.length !== 36) throw Error('Expected 36 segments');
let previousEnd = 0;
for (const segment of alignment.segments) {
  if (!Number.isInteger(segment.startMs) || !Number.isInteger(segment.endMs) || segment.startMs < previousEnd || segment.endMs <= segment.startMs || segment.endMs > alignment.audioDurationMs) throw Error(`Invalid candidate range: ${segment.segmentId}`);
  previousEnd = segment.endMs;
}
const load = () => fs.existsSync(reviewPath) ? JSON.parse(fs.readFileSync(reviewPath, 'utf8')) : {
  schemaVersion: 1, examId: alignment.examId, audioSha256: alignment.audioSha256,
  alignmentSha256: sha(fs.readFileSync(`${base}/audio-alignment-candidates.json`)),
  status: 'in_progress', segments: Object.fromEntries(alignment.segments.map((s) => [s.segmentId, { status: 'PENDING' }])),
};
const save = (review) => { fs.mkdirSync(path.dirname(reviewPath), { recursive: true }); fs.writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`); };
const html = `<!doctype html><meta charset="utf-8"><title>N1 2014-12 audio review</title><style>body{font:16px system-ui;max-width:850px;margin:30px auto}button{margin:5px;padding:9px}pre{white-space:pre-wrap;background:#f5f5f5;padding:12px}audio{width:100%}</style><h1>N1 2014-12 audio timing review</h1><p id="meta"></p><audio id="audio" controls></audio><p><button onclick="audio.currentTime=start/1000;audio.play()">Play segment</button><button onclick="audio.currentTime=start/1000;audio.play()">Replay</button><button onclick="save('PASS')">PASS</button><button onclick="save('NEEDS_ADJUSTMENT')">NEEDS_ADJUSTMENT</button></p><pre id="script"></pre><script>let data,index,start;const audio=document.querySelector('#audio');fetch('/data').then(r=>r.json()).then(x=>{data=x;index=x.next;show()});function show(){let s=data.segments[index];start=s.startMs;audio.src='/audio#t='+start/1000+','+s.endMs/1000;document.querySelector('#meta').textContent=(index+1)+' / '+data.segments.length+' — '+s.segmentId+' — '+s.startMs+'ms–'+s.endMs+'ms';document.querySelector('#script').textContent=s.transcriptJa}function save(status){fetch('/review',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id:data.segments[index].segmentId,status})}).then(r=>r.json()).then(x=>{data=x;index=x.next;show()})}</script>`;
const server = http.createServer((req, res) => {
  if (req.url === '/data') { const review = load(); const segments = alignment.segments.map((s) => ({ ...s, transcriptJa: JSON.parse(fs.readFileSync(`${base}/${s.sourceReview}`, 'utf8')).transcriptJa, review: review.segments[s.segmentId] })); res.end(JSON.stringify({ segments, next: Math.max(0, segments.findIndex((s) => s.review.status === 'PENDING')) })); return; }
  if (req.url === '/review' && req.method === 'POST') { let body=''; req.on('data',(x)=>body+=x); req.on('end',()=>{ const {id,status}=JSON.parse(body); if (!['PASS','NEEDS_ADJUSTMENT'].includes(status) || !alignment.segments.some((s)=>s.segmentId===id)) {res.statusCode=400;return res.end();} const review=load(); review.segments[id]={status,reviewedAt:new Date().toISOString()}; review.status=Object.values(review.segments).every((s)=>s.status!=='PENDING')?'complete':'in_progress'; save(review); res.end(JSON.stringify({segments:alignment.segments.map((s)=>({...s,review:review.segments[s.segmentId]})),next:Math.max(0,alignment.segments.findIndex((s)=>review.segments[s.segmentId].status==='PENDING'))})); }); return; }
  if (req.url?.startsWith('/audio')) { const stat=fs.statSync(audioPath); const range=req.headers.range; if (!range) {res.writeHead(200,{'content-type':'audio/mpeg','content-length':stat.size});return fs.createReadStream(audioPath).pipe(res)} const [a,b]=range.replace(/bytes=/,'').split('-'); const start=Number(a),end=b?Number(b):stat.size-1; res.writeHead(206,{'content-type':'audio/mpeg','content-range':`bytes ${start}-${end}/${stat.size}`,'accept-ranges':'bytes','content-length':end-start+1}); return fs.createReadStream(audioPath,{start,end}).pipe(res); }
  res.end(html);
});
server.listen(41714,'127.0.0.1',()=>console.log('Open http://127.0.0.1:41714 — Ctrl+C stops the local review server.'));
