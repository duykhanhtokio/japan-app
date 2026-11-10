// Check alignment and reachability, not native-speaker acceptance.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),data=path.join(root,'src/data/hospitality');
const han=/[一-龯々〆]/;let texts=0,segments=0;
function values(l){return [l.title,...l.objectives.map(o=>o.text),...l.sections.flatMap(s=>[s.title,s.body]),...l.terms.map(t=>t.meaning),l.example.situation,...l.example.steps,l.practice.prompt,...l.practice.expectedPoints,l.illustration.caption,l.illustration.alt,...l.questions.flatMap(q=>[q.prompt,...q.choices,q.explanation])].filter(s=>han.test(s));}
const readingSource=fs.readFileSync(path.join(root,'src/components/hospitality/HotelJapaneseText.tsx'),'utf8');
for(const g of ['front','planning','service','restaurant','safety','mock']){
 const source=JSON.parse(fs.readFileSync(path.join(data,(g==='mock'?'mocks':g)+'.json'))),r=JSON.parse(fs.readFileSync(path.join(data,'readings',g+'.json')));
 assert(readingSource.includes(`readings/${g}.json`),'readings not registered');
 for(const l of source.lessons||source.mocks){
  assert.equal(r.lessons[l.id].sourceRevision,l.revision,`stale readings: ${l.id}`);
  for(const s of values(l)){
   const spans=r.entries[s];assert(spans,`missing text ${l.id}`);let cursor=0;const parts=[];texts++;
   for(const [start,length,kana] of spans){assert(start>=cursor&&length>0&&start+length<=s.length,'invalid span');parts.push({text:s.slice(cursor,start)});parts.push({text:s.slice(start,start+length),reading:kana});cursor=start+length;}
   parts.push({text:s.slice(cursor)});assert.equal(parts.map(p=>p.text).join(''),s,'text alignment');
   for(const p of parts)if(han.test(p.text)){assert(p.reading&&/^[ぁ-ゖー]+$/.test(p.reading),'missing kana');segments++;}
  }
 }
}
const rules=fs.readFileSync(path.join(root,'scripts/hospitality/build-readings.py'),'utf8');
for(const [word,kana] of [['一日','いちにち'],['四本','よんほん'],['二本','にほん'],['乳','にゅう'],['室','しつ'],['鏡','かがみ'],['何','なに']])assert(rules.includes(`'${word}':'${kana}'`));
console.log(JSON.stringify({status:'PASS',lessons:38,sourceTextOccurrences:texts,kanjiSegmentOccurrences:segments,alignment:true,revisionIsolation:true,nativeReviewed:false}));
