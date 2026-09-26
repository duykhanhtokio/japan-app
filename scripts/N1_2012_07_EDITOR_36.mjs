import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(root, 'src/data/jlpt-official/n1-2012-07-exam-01.verified.json');
const generatorPath = path.join(root, 'scripts/realign-n1-2012-07-listening.mjs');
let port = Number(process.env.N1_TIMING_PORT || 8765);

function listeningFrom(exam) {
  return exam.questions.filter(q => q.family === 'listening');
}
function stateFrom(exam) {
  return listeningFrom(exam).map(q => ({
    id: q.questionId,
    segmentId: q.audio.segmentId,
    problem: q.problemNumber,
    question: q.questionNumber,
    subquestion: q.subQuestionNumber ?? null,
    startMs: q.audio.startMs,
    endMs: q.audio.endMs,
  }));
}
function state() {
  return stateFrom(JSON.parse(fs.readFileSync(dataPath, 'utf8')));
}
function save(input) {
  const originalData = fs.readFileSync(dataPath, 'utf8');
  const originalScript = fs.readFileSync(generatorPath, 'utf8');
  const exam = JSON.parse(originalData);
  const existing = stateFrom(exam);
  if (!Array.isArray(input) || input.length !== existing.length) throw Error('Số câu không khớp với đề thi.');
  const edits = input.map((item, i) => {
    const old = existing[i];
    if (item?.id !== old.id || !Number.isInteger(item.startMs) || !Number.isInteger(item.endMs)) {
      throw Error(`Dữ liệu của câu ${i + 1} không hợp lệ.`);
    }
    if (item.startMs < 0 || item.startMs >= item.endMs || item.endMs > 2664098) {
      throw Error(`Mốc bắt đầu/kết thúc của 問題${old.problem} câu ${old.question} không hợp lệ.`);
    }
    return { ...old, startMs: item.startMs, endMs: item.endMs };
  });
  const shared = new Map();
  for (const item of edits) {
    const other = shared.get(item.segmentId);
    if (other && (item.startMs !== other.startMs || item.endMs !== other.endMs)) {
      throw Error('Hai ý dùng chung âm thanh phải có cùng mốc.');
    }
    shared.set(item.segmentId, item);
  }
  const start = originalScript.indexOf('const ranges = [');
  const end = originalScript.indexOf('];', start);
  if (start < 0 || end < 0) throw Error('Không tìm thấy danh sách mốc trong script tạo dữ liệu.');
  const section = originalScript.slice(start, end);
  const pattern = /\[(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\]/g;
  const matches = [...section.matchAll(pattern)];
  if (matches.length !== existing.length) throw Error('Số mốc trong script và số câu không khớp.');
  for (let i = 0; i < matches.length; i++) {
    if (Math.round(Number(matches[i][1]) * 1000) !== existing[i].startMs ||
        Math.round(Number(matches[i][2]) * 1000) !== existing[i].endMs) {
      throw Error(`Script và dữ liệu không khớp ở câu ${i + 1}; chưa lưu thay đổi nào.`);
    }
  }
  let current = 0;
  const nextSection = section.replace(pattern, () => {
    const item = edits[current++];
    return `[${(item.startMs / 1000).toFixed(2)}, ${(item.endMs / 1000).toFixed(2)}]`;
  });
  const questions = listeningFrom(exam);
  edits.forEach((item, i) => {
    questions[i].audio.startMs = item.startMs;
    questions[i].audio.endMs = item.endMs;
    if (item.startMs !== existing[i].startMs || item.endMs !== existing[i].endMs) {
      questions[i].audio.timingConfidence = 'candidate_unverified';
      questions[i].audio.verificationStatus = 'needs_runtime_review';
    }
  });
  const changes = [
    [dataPath, JSON.stringify(exam, null, 2) + '\n', originalData],
    [generatorPath, originalScript.slice(0, start) + nextSection + originalScript.slice(end), originalScript],
  ];
  const renamed = [];
  try {
    for (const [target, value] of changes) fs.writeFileSync(target + '.timing-tmp', value);
    for (const [target] of changes) { fs.renameSync(target + '.timing-tmp', target); renamed.push(target); }
  } catch (error) {
    for (const target of renamed) fs.writeFileSync(target, changes.find(c => c[0] === target)[2]);
    throw error;
  } finally {
    for (const [target] of changes) {
      if (fs.existsSync(target + '.timing-tmp')) fs.unlinkSync(target + '.timing-tmp');
    }
  }
  return stateFrom(exam);
}

const html = `<!doctype html><html lang="vi"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>36 mục nghe N1 tháng 7/2012</title>
<style>
body{margin:0;background:#f4f6fb;color:#1a273b;font:16px system-ui,sans-serif}
main{max-width:1080px;margin:auto;padding:16px 18px 48px}
h1{font-size:25px}h2{font-size:21px;margin:25px 0 10px}
.player{position:sticky;top:0;background:white;z-index:2;padding:14px;border:1px solid #dbe1ee;border-radius:12px;box-shadow:0 2px 12px #13243b18}
audio{width:100%;margin-top:10px}
.row{background:white;border:1px solid #dbe1ee;border-radius:12px;padding:12px;margin:9px 0;display:grid;grid-template-columns:115px 1fr 1fr;gap:12px;align-items:start}
.mark{border-left:1px solid #e5eaf3;padding-left:12px}.actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
button{font:inherit;padding:7px 10px;border-radius:8px;border:1px solid #afbcd3;background:#fff;cursor:pointer}
button:hover{background:#eaf1ff}.time{font-variant-numeric:tabular-nums;font-weight:700;color:#1545a8}
.save{background:#1549bf;color:white;border:0;padding:12px 24px;margin-top:20px}
#message{min-height:24px;font-weight:600}
@media(max-width:670px){.row{grid-template-columns:1fr}.mark{border-left:0;border-top:1px solid #e5eaf3;padding:8px 0 0}}
</style><main><h1>Đánh dấu toàn bộ bài nghe N1 · 7/2012</h1>
<div class="player"><label>Chọn file âm thanh của đề: <input id="file" type="file" accept="audio/*,.mp3"></label>
<audio id="audio" controls preload="metadata"></audio>
<div>Đang nghe: <span id="position">00:00.00</span> · Phát liên tục toàn bộ bài nghe. Dừng tại điểm cần đánh dấu rồi bấm nút của câu bên dưới.</div></div>
<p id="count">Đang tải danh sách câu nghe…</p><div id="list"></div><button class="save" id="save">Lưu toàn bộ vị trí câu hỏi</button><p id="message" role="status"></p>
</main><script>
const audio=document.getElementById('audio'), list=document.getElementById('list'), msg=document.getElementById('message');
let items=[], localUrl='';
function clock(ms){let n=Math.max(0,ms)/1000;return String(Math.floor(n/60)).padStart(2,'0')+':'+(n%60).toFixed(2).padStart(5,'0')}
function status(s){msg.textContent=s}
function sync(index,field,value){
  if(value<0||value>2664098){status('Mốc nằm ngoài file âm thanh.');return}
  const item=items[index];if(field==='startMs'&&value>=item.endMs||field==='endMs'&&value<=item.startMs){status('Mốc bắt đầu phải đứng trước mốc kết thúc.');return}
  for(const x of items)if(x.segmentId===item.segmentId)x[field]=value;
  status('Đã chỉnh, chưa lưu.');render();
}
function jump(ms){if(!audio.src){status('Hãy chọn file âm thanh trước.');return}audio.currentTime=ms/1000}
function mark(index,field){if(!audio.src){status('Hãy chọn file âm thanh trước.');return}sync(index,field,Math.round(audio.currentTime*1000/10)*10)}
function button(parent,label,action){const b=document.createElement('button');b.textContent=label;b.onclick=action;parent.append(b)}
function render(){list.replaceChildren();let section=null,last=null;
 document.getElementById('count').textContent='Đang hiển thị '+items.length+' mục trả lời thuộc '+new Set(items.map(x=>x.problem)).size+' 問題.';
 items.forEach((item,i)=>{
  if(item.problem!==last){last=item.problem;section=document.createElement('section');
   const heading=document.createElement('h2');heading.textContent='問題 '+last;section.append(heading);list.append(section)}
  const row=document.createElement('div');row.className='row';
  const name=document.createElement('strong');name.textContent='Câu '+item.question+(item.subquestion?' · ý '+item.subquestion:'');row.append(name);
  for(const [field,label] of [['startMs','Bắt đầu'],['endMs','Kết thúc']]){
    const block=document.createElement('div');block.className='mark';
    const title=document.createElement('div');title.textContent=label+' · ';
    const time=document.createElement('button');time.className='time';time.textContent=clock(item[field]);time.title='Chuyển thanh phát đến mốc này';time.onclick=()=>jump(item[field]);title.append(time);block.append(title);
    const controls=document.createElement('div');controls.className='actions';
    button(controls,'−0,5s',()=>sync(i,field,item[field]-500));
    button(controls,'+0,5s',()=>sync(i,field,item[field]+500));
    button(controls,'Đánh dấu '+label.toLowerCase(),()=>mark(i,field));
    block.append(controls);row.append(block);
  }section.append(row);
 })
}
document.getElementById('file').onchange=e=>{
 const file=e.target.files[0];if(!file)return;if(localUrl)URL.revokeObjectURL(localUrl);
 localUrl=URL.createObjectURL(file);audio.src=localUrl;audio.load();status('Đã chọn '+file.name+'. Bấm phát để nghe toàn bộ bài.')
};
audio.ontimeupdate=()=>document.getElementById('position').textContent=clock(audio.currentTime*1000);
async function request(url,options){const response=await fetch(url,options);const result=await response.json();if(!response.ok)throw Error(result.error||'Có lỗi');return result}
request('/api').then(result=>{items=result;render()}).catch(error=>{
 document.getElementById('count').textContent='Không tải được danh sách câu.';status(error.message)
});
document.getElementById('save').onclick=async()=>{
 try{items=await request('/api',{method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify(items.map(({id,startMs,endMs})=>({id,startMs,endMs})))});
 render();status('Đã lưu toàn bộ mốc vào mã nguồn. Hãy kiểm tra lại trong app.')}
 catch(error){status('Chưa lưu: '+error.message)}
};
</script></html>`;

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin && ![`http://127.0.0.1:${port}`, `http://localhost:${port}`].includes(origin)) {
    res.writeHead(403).end('Forbidden'); return;
  }
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }).end(html); return;
  }
  if (req.url === '/api' && req.method === 'GET') {
    try { res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(state())); }
    catch (error) { res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: error.message })); }
    return;
  }
  if (req.url === '/api' && req.method === 'POST') {
    try {
      let body = '';
      for await (const chunk of req) { body += chunk; if (body.length > 20000) throw Error('Dữ liệu quá lớn.'); }
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(save(JSON.parse(body))));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: error.message }));
    }
    return;
  }
  res.writeHead(404).end('Not found');
});
server.on('error', error => {
  if (error.code === 'EADDRINUSE' && port < 8790) {
    console.log(`Cổng ${port} đang chạy một bản cũ. Chuyển sang cổng ${port + 1}.`);
    port++;
    server.listen(port, '127.0.0.1');
  } else {
    console.error(error);
    process.exitCode = 1;
  }
});
server.on('listening', () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`Đã mở bản 36 mục: ${url}`);
  if (process.platform === 'darwin') {
    const browser = spawn('open', [url], { stdio: 'ignore' });
    browser.on('error', () => {});
    browser.unref();
  }
});
server.listen(port, '127.0.0.1');
