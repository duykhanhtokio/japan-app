import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(root, 'src/data/jlpt-official/n1-2012-07-exam-01.verified.json');
const generatorPath = path.join(root, 'scripts/realign-n1-2012-07-listening.mjs');
const ids = ['n1-2012-07-l-p1-q06', 'n1-2012-07-l-p2-q01', 'n1-2012-07-l-p2-q02'];
const labels = ['Câu 6', '問題2 · Câu 1', '問題2 · Câu 2'];
const indexes = [5, 6, 7];
const port = Number(process.env.N1_TIMING_PORT || 8765);

function readState() {
  const exam = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  return ids.map((id, i) => {
    const question = exam.questions.find(q => q.audio?.segmentId === id);
    if (!question) throw new Error(`Không tìm thấy ${id}`);
    return { id, label: labels[i], startMs: question.audio.startMs, endMs: question.audio.endMs };
  });
}

function save(values) {
  if (!Array.isArray(values) || values.length !== 3 || !values.every(Number.isInteger)) {
    throw new Error('Cần đủ ba mốc thời gian tính bằng mili giây.');
  }
  const oldData = fs.readFileSync(dataPath, 'utf8');
  const oldScript = fs.readFileSync(generatorPath, 'utf8');
  const exam = JSON.parse(oldData);
  const items = readState();
  const rangeStart = oldScript.indexOf('const ranges = [');
  const rangeEnd = oldScript.indexOf('];', rangeStart);
  if (rangeStart < 0 || rangeEnd < 0) throw new Error('Không tìm thấy danh sách mốc trong script.');
  const before = oldScript.slice(0, rangeStart);
  const section = oldScript.slice(rangeStart, rangeEnd);
  const after = oldScript.slice(rangeEnd);
  let index = 0;
  const pairs = /\[(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\]/g;
  const current = [...section.matchAll(pairs)];
  if (current.length < 8) throw new Error('Danh sách mốc đã đổi cấu trúc.');
  for (let i = 0; i < 3; i++) {
    if (Math.round(Number(current[indexes[i]][1]) * 1000) !== items[i].startMs ||
        Math.round(Number(current[indexes[i]][2]) * 1000) !== items[i].endMs) {
      throw new Error('Mốc trong dữ liệu và script không khớp. Hãy đồng bộ trước khi lưu.');
    }
    const previousEnd = Math.round(Number(current[indexes[i] - 1][2]) * 1000);
    if (values[i] < previousEnd - 15000 || values[i] >= items[i].endMs) {
      throw new Error(`${labels[i]}: mốc bắt đầu không hợp lệ hoặc lùi quá 15 giây vào câu trước.`);
    }
  }
  const changed = section.replace(pairs, (match, start, end) => {
    const at = index++;
    const target = indexes.indexOf(at);
    return target < 0 ? match : `[${(values[target] / 1000).toFixed(2)}, ${end}]`;
  });
  if (index !== current.length) throw new Error('Không thể cập nhật đủ mốc.');
  for (let i = 0; i < 3; i++) {
    const question = exam.questions.find(q => q.audio?.segmentId === ids[i]);
    question.audio.startMs = values[i];
  }
  const nextData = JSON.stringify(exam, null, 2) + '\n';
  const nextScript = before + changed + after;
  const temporaryData = `${dataPath}.timing-tmp`;
  const temporaryScript = `${generatorPath}.timing-tmp`;
  try {
    fs.writeFileSync(temporaryData, nextData);
    fs.writeFileSync(temporaryScript, nextScript);
    fs.renameSync(temporaryData, dataPath);
    try { fs.renameSync(temporaryScript, generatorPath); }
    catch (error) { fs.writeFileSync(dataPath, oldData); throw error; }
  } finally {
    for (const file of [temporaryData, temporaryScript]) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
  }
  return readState();
}

const html = `<!doctype html><html lang="vi"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chỉnh âm thanh N1 tháng 7/2012</title>
<style>
body{font:17px system-ui,sans-serif;background:#f4f6fb;color:#172033;margin:0;padding:28px}
main{max-width:780px;margin:auto}h1{font-size:27px}p{line-height:1.5}
.card{background:white;border:1px solid #dfe4ee;border-radius:16px;padding:18px;margin:15px 0}
.controls{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:12px}
button{font:inherit;border:1px solid #aab5c9;background:#fff;border-radius:9px;padding:9px 13px;cursor:pointer}
button.primary{background:#1649ba;color:white;border-color:#1649ba}
button:disabled{opacity:.5;cursor:not-allowed}strong.time{font-variant-numeric:tabular-nums;font-size:21px}
#message{font-weight:600;min-height:1.5em}input[type=file]{max-width:100%}
</style><main><h1>Chỉnh phần nghe N1 · 7/2012</h1>
<p>1. Chọn file MP3 của đề trên máy. 2. Nghe thử và chỉnh mốc. 3. Bấm Lưu. Câu 4 và 5 luôn được giữ nguyên.</p>
<div class="card"><label>File âm thanh MP3: <input id="file" type="file" accept="audio/*,.mp3"></label>
<p id="audioState">Chọn file để nghe thử.</p><audio id="player" controls style="width:100%"></audio></div>
<div id="rows"></div><button id="save" class="primary">Lưu cả ba câu vào mã nguồn</button>
<p id="message" role="status"></p>
<p><small>Chỉ mốc bắt đầu thay đổi. Sau khi lưu, mở lại app để nghe kiểm tra.</small></p></main>
<script>
const player=document.getElementById('player'), rows=document.getElementById('rows');
const msg=document.getElementById('message'); let items=[], clipEnd=null;
const display=ms=>(ms/1000).toFixed(2)+' giây';
document.getElementById('file').onchange=e=>{
  if(player.src) URL.revokeObjectURL(player.src);
  const f=e.target.files[0]; if(!f)return;
  player.src=URL.createObjectURL(f); document.getElementById('audioState').textContent='Đã chọn: '+f.name;
};
player.ontimeupdate=()=>{if(clipEnd!==null && player.currentTime>=clipEnd){player.pause();clipEnd=null}};
function play(i,earlier=false){
  if(!player.src){msg.textContent='Hãy chọn file MP3 trước.';return}
  const start=items[i].startMs/1000;
  player.currentTime=Math.max(0,start-(earlier?8:0));
  clipEnd=start+(i===1?30:18);player.play().catch(()=>msg.textContent='Không phát được file đã chọn.');
}
function render(){rows.replaceChildren();items.forEach((item,i)=>{
  const card=document.createElement('section');card.className='card';
  const title=document.createElement('h2');title.textContent=item.label;
  const value=document.createElement('strong');value.className='time';value.textContent=display(item.startMs);
  const controls=document.createElement('div');controls.className='controls';
  const add=(label,fn,primary=false)=>{const b=document.createElement('button');b.textContent=label;b.className=primary?'primary':'';b.onclick=fn;controls.append(b)};
  add('▶ Nghe từ đầu',()=>play(i),true);
  add('Nghe trước mốc 8 giây',()=>play(i,true));
  add('− 0,5 giây',()=>shift(i,-500));add('+ 0,5 giây',()=>shift(i,500));
  add('Đặt mốc tại vị trí đang nghe',()=>{
    if(!player.src)return msg.textContent='Hãy chọn file MP3 trước.';
    update(i,Math.round(player.currentTime*1000/10)*10);
  });
  card.append(title,value,controls);rows.append(card);
})}
function update(i,v){if(v<0||v>=items[i].endMs){msg.textContent='Mốc vượt ngoài câu này.';return}
items[i].startMs=v;msg.textContent='Chưa lưu thay đổi.';render()}
function shift(i,delta){update(i,items[i].startMs+delta)}
async function request(url,options){const r=await fetch(url,options), data=await r.json();
  if(!r.ok)throw Error(data.error||'Có lỗi xảy ra');return data}
request('/api').then(data=>{items=data;render()}).catch(e=>msg.textContent=e.message);
document.getElementById('save').onclick=async()=>{
  try{items=await request('/api',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify(items.map(x=>x.startMs))});render();msg.textContent='Đã lưu vào hai file. Hãy mở lại app để kiểm tra.'}
  catch(e){msg.textContent='Chưa lưu: '+e.message}
};
</script></html>`;

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin && origin !== `http://127.0.0.1:${port}` && origin !== `http://localhost:${port}`) {
    res.writeHead(403).end('Forbidden'); return;
  }
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }).end(html); return;
  }
  if (req.url === '/api' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(readState())); return;
  }
  if (req.url === '/api' && req.method === 'POST') {
    try {
      let body = '';
      for await (const chunk of req) { body += chunk; if (body.length > 1000) throw Error('Dữ liệu quá lớn'); }
      const result = save(JSON.parse(body));
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: error.message }));
    }
    return;
  }
  res.writeHead(404).end('Not found');
});
server.listen(port, '127.0.0.1', () => console.log(`Mở http://127.0.0.1:${port} để chỉnh âm thanh N1 7/2012`));
