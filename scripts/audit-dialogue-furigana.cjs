// Inventory active Japanese lines without generating or guessing readings.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const scenarios=new Map(['src/data/generated/scenarios.json','src/data/dialogue-content/scenario-overrides.json','src/data/dialogue-content/independent-city-overrides.json'].flatMap(read).map(s=>[s.id,s]));
const hints=read('src/data/dialogue-content/player-hints.json'),sourceHash=crypto.createHash('sha256');
const stats=()=>({lines:0,linesWithKanji:0,alignedRuby:0,completeKanjiRuby:0,missingKanjiRuby:0,invalidRuby:0,legacyReadingOnly:0});
const counts={NPC:stats(),PLAYER:stats()},examples=[];
const kanji=/[\p{Script=Han}々〆ヵヶ]/u;
for(const sid of scenarios.keys()){
 let file=`src/data/generated/dialogues/${sid}.json`,generic=false;
 if(!fs.existsSync(path.join(root,file))){const m=/^SC-LOC-JP-\d{5}-(\d{2})-001$/.exec(sid);assert(m,'Missing dialogue '+sid);file=`src/data/generated/dialogues/GENERIC-CITY-${m[1]}.json`;generic=true;}
 const data=read(file),turns=Array.isArray(data)?data:data.shared??data.N5;assert.equal(turns.length,11,sid);
 const rubyPath=`src/data/dialogue-content/furigana/${sid}.json`,bundle=fs.existsSync(path.join(root,rubyPath))?read(rubyPath):null;
 for(const t of turns){
  const id=generic?t.id.replace(/GENERIC-CITY-\d{2}/g,sid):t.id,isNpc=t.speaker==='NPC',body=isNpc?t.npc:t.player;
  const text=(isNpc?body.textJa:body.recommendedAnswerJa)??'',hint=hints[id];
  let ruby=isNpc?body.textRuby:hint?.answerJa===text?(hint.recommendedAnswerRuby??body.recommendedAnswerRuby):body.recommendedAnswerRuby;
  const authored=bundle?.scenarioId===sid?bundle.turns?.[id]:null;
  if(authored?.speaker===t.speaker&&authored.sourceJa===text)ruby=authored.ruby;
  const legacy=isNpc?body.furigana:body.recommendedAnswerFurigana,c=counts[t.speaker];assert(c,t.speaker);c.lines++;
  sourceHash.update(JSON.stringify([sid,id,t.speaker,text,ruby??null,legacy??null])+'\n');
  const hasKanji=kanji.test(text),aligned=Array.isArray(ruby)&&ruby.length>0&&ruby.every(p=>typeof p.text==='string')&&ruby.map(p=>p.text).join('')===text;
  if(hasKanji)c.linesWithKanji++;
  if(aligned)c.alignedRuby++;else if(ruby?.length)c.invalidRuby++;
  const complete=aligned&&ruby.every(p=>!kanji.test(p.text)||(typeof p.reading==='string'&&/^[\p{Script=Hiragana}ー\s]+$/u.test(p.reading)));
  if(hasKanji&&complete)c.completeKanjiRuby++;
  if(hasKanji&&!complete){c.missingKanjiRuby++;if(examples.filter(e=>e.speaker===t.speaker).length<10)examples.push({scenarioId:sid,turnId:id,speaker:t.speaker,reason:aligned?'kanji segment lacks hiragana reading':'no aligned ruby'});}
  if(legacy?.trim()&&!aligned)c.legacyReadingOnly++;
 }
}
const report={status:'OPEN',backlogId:'DIALOGUE-FURIGANA-001',canonicalScenarios:scenarios.size,sourceSha256:sourceHash.digest('hex'),counts,rendererObservation:{npc:'Source-bound textRuby data is loaded; active NPC presentation still uses plain Text. A separate UI candidate awaits visual validation.',player:'JapaneseRuby consumes source-aligned recommendedAnswerRuby; missing segments render plain text.'},scope:'Structural data inventory only; no native pronunciation or device approval. Authored readings remain AI-unreviewed.',examples};
fs.writeFileSync(path.join(root,'docs/localization-workspace/dialogue-furigana-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,canonicalScenarios:scenarios.size,counts}));
