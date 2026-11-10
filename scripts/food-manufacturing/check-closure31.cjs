const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto'),cp=require('child_process');
const root=path.resolve(__dirname,'../..'),data=path.join(root,'src/data/food-manufacturing');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const pack=read(path.join(data,'source-closure31.json'));
const locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const lessons={};for(const p of [path.join(data,'lessons.1.ja.json'),path.join(data,'lessons.2.ja.json'),...fs.readdirSync(path.join(data,'authoring-20261029')).filter(n=>/^part[1-6]\.json$/.test(n)).map(n=>path.join(data,'authoring-20261029',n))])for(const l of read(p).lessons||[])lessons[l.id]=l;
let translated=0,rubyFields=0;
for(const s of pack.sections){
 assert.equal(s.lessonSourceHash,lessons[s.lessonId].sourceHash);
 assert.deepEqual(Object.keys(s.translations).sort(),locales.slice().sort());
 for(const [text,tokens]of [[s.textJa,s.ruby],[s.titleJa,s.titleRuby]]){
  assert.equal(tokens.map(t=>t.text).join(''),text);for(const t of tokens)if(/[一-龯]/.test(t.text))assert(t.reading&&/^[ぁ-ゖー]+$/.test(t.reading),JSON.stringify(t));rubyFields++;
 }
 for(const locale of locales){const t=s.translations[locale];assert.equal(t.sourceHash,s.sourceHash);assert(t.title.trim()&&t.text.trim());translated++;}
 assert(s.sourceRefs.every(r=>r.document==='ssw2'&&r.pdfPage-r.printedPage===9));
}
// Frozen banks and saved-learner revision inputs must remain byte-identical.
let preserved=0;
for(const p of ['src/data/food-manufacturing/lessons.1.ja.json','src/data/food-manufacturing/lessons.2.ja.json','src/data/food-manufacturing/exams.ja.json','src/services/food-manufacturing-study-state.ts']){
 if(!fs.existsSync(path.join(root,p)))continue;
 const old=cp.execFileSync('git',['show','8e6ae1775:'+p],{cwd:root,maxBuffer:16*1024*1024});assert(old.equals(fs.readFileSync(path.join(root,p))),p);preserved++;
}
const report={status:'PASS',sections:pack.sections.length,translatedSectionPairs:translated,rubyFields,frozenCanonicalFilesPreserved:preserved,nativeReviewed:false,domainReviewed:false,fullSourceCoverageCertified:false};
fs.writeFileSync(path.join(root,'docs/ssw-workspace/food-manufacturing/source-closure-20261031/supplement-validation.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
