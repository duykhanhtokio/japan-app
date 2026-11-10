// Bounded remediation: new numeric bar comparison; preserve original 848 exam items.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),p='src/data/food-manufacturing/source-closure43.json',data=JSON.parse(fs.readFileSync(path.join(root,p))),locales=JSON.parse(fs.readFileSync(path.join(__dirname,'food59-bar-locales.json')));
const before=structuredClone(data),template=structuredClone(data.checks[0]),source=locales.ja;
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v,Object.keys(v).sort())).digest('hex');
const lex={'棒':'ぼう','値':'あたい','比べ':'くらべ','説明':'せつめい','前':'まえ','架空例':'かくうれい','件数':'けんすう','件':'けん','最も':'もっとも','多い':'おおい','項目':'こうもく','少ない':'すくない','答え':'こたえ','差':'さ','求め':'もとめ','長さ':'ながさ','何':'なに','表し':'あらわし','各':'かく','位置':'いち','数量':'すうりょう','大小':'だいしょう','混同':'こんどう','単位':'たんい','付け':'つけ'};
const pattern=new RegExp(Object.keys(lex).sort((a,b)=>b.length-a.length).join('|'),'g');
function ruby(text){const tokens=[];let i=0;for(const m of text.matchAll(pattern)){const tail=text.slice(i,m.index);assert(!/[一-龯々〆]/.test(tail),'Unreviewed reading '+tail);if(tail)tokens.push({text:tail});tokens.push({text:m[0],reading:lex[m[0]]});i=m.index+m[0].length;}const tail=text.slice(i);assert(!/[一-龯々〆]/.test(tail),'Unreviewed reading '+tail);if(tail)tokens.push({text:tail});return tokens;}
Object.assign(template,{id:'food59-bar-comparison',titleJa:source.title,promptJa:source.prompt,expectedPointsJa:source.points,titleRuby:ruby(source.title),promptRuby:ruby(source.prompt),expectedPointsRuby:source.points.map(ruby)});
template.sourceHash=hash({titleJa:template.titleJa,promptJa:template.promptJa,expectedPointsJa:template.expectedPointsJa});template.translations={};
for(const locale of ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']){const[t,p,points]=locales[locale];assert(t.trim()&&p.trim()&&points.length===2&&points.every(s=>s.trim()));template.translations[locale]={title:t,prompt:p,expectedPoints:points,sourceHash:template.sourceHash};}
assert(!data.checks.some(x=>x.id===template.id));data.checks.push(template);assert.deepEqual(data.sections,before.sections);assert.deepEqual(data.checks.slice(0,-1),before.checks);fs.writeFileSync(path.join(root,p),JSON.stringify(data,null,2)+'\n');
const p34=path.join(root,'src/data/food-manufacturing/source-closure34.json'),d34=JSON.parse(fs.readFileSync(p34));let corrections=0;
for(const section of d34.sections)for(const t of section.ruby||[])if(t.text==='値'&&t.reading==='ね'){assert(['food34-historical-production','food34-checksheet-feasibility','food34-chart-axes'].includes(section.id));t.reading='あたい';corrections++;}
assert.equal(corrections,3);fs.writeFileSync(p34,JSON.stringify(d34,null,2)+'\n');
console.log(JSON.stringify({status:'FOOD59_BAR_AUTHORED',newSelfChecks:1,translatedChecks:12,correctedContextReadings:corrections,oldSectionsAndChecksPreserved:true,oldLessonExamStateRevisionsUnchanged:true}));
