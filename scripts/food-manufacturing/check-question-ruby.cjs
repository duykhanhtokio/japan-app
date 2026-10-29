const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {stripTypeScriptTypes}=require('node:module');
const root=path.resolve(__dirname,'../..'),data=path.join(root,'src/data/food-manufacturing');
const pack=JSON.parse(fs.readFileSync(path.join(data,'ruby/weekly-first.json')));
const rest=JSON.parse(fs.readFileSync(path.join(data,'ruby/weekly-rest.json')));
assert.equal(rest.status,'authored_ai_unreviewed');
assert.equal(Object.keys(rest.questions).length,33);
assert(!Object.keys(rest.questions).some(id=>id in pack.questions));
const readings=Object.assign({},pack.questions,rest.questions);
const raw=JSON.parse(fs.readFileSync(path.join(data,'exams.ja.json'))).exams;
const gate=stripTypeScriptTypes(fs.readFileSync(path.join(root,'src/components/world/japanese-ruby-data.ts'),'utf8').replace(/^import type .*$/gm,'')).replace(/^export /gm,'');
const {hasAlignedRuby}=vm.runInNewContext(gate+';({hasAlignedRuby})');
const source=stripTypeScriptTypes(fs.readFileSync(path.join(data,'question-ruby.ts'),'utf8').replace(/^import .*$/gm,'')).replace(/^export /gm,'');
const {foodManufacturingQuestionRuby:getRuby}=vm.runInNewContext(source+';({foodManufacturingQuestionRuby})',{pack,rest,hasAlignedRuby});
function revision(value){const text=JSON.stringify(value);let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);return `fnv1a-${(h>>>0).toString(16)}`;}
assert.equal(pack.status,'authored_ai_unreviewed');
let fields=0,covered=0,uncovered=0;
for(const e of raw)for(const q of e.questions){
 const question={id:q.id,sourceHash:revision({promptJa:q.promptJa,optionsJa:q.optionsJa,explanationJa:q.explanationJa,optionExplanationsJa:q.optionExplanationsJa})};
 const expected={stemJa:q.promptJa,...Object.fromEntries(q.optionsJa.map((s,i)=>[`optionsJa.${i}`,s])),explanationJa:q.explanationJa,...Object.fromEntries(q.optionExplanationsJa.map((s,i)=>[`optionReasonsJa.${i}`,s]))};
 if(!readings[q.id]){assert.equal(getRuby(question,'stemJa',q.promptJa),undefined);uncovered++;continue;}
 assert.equal(e.kind,'weekly');covered++;
 assert.deepEqual(Object.keys(readings[q.id].fields).sort(),Object.keys(expected).sort());
 for(const [key,text] of Object.entries(expected)){
  const result=getRuby(question,key,text);assert(result,`${q.id}/${key}`);fields++;
  assert.equal(result.map(p=>p.text).join(''),text);
  assert.equal(getRuby({...question,sourceHash:'stale'},key,text),undefined);
  assert.equal(getRuby(question,key,text+'変更'),undefined);
  const saved=readings[q.id].fields[key];
  for(const broken of [null,[],[{text,reading:'INVALID'}],[{text}]]){readings[q.id].fields[key]=broken;assert.equal(getRuby(question,key,text),undefined);}
  readings[q.id].fields[key]=saved;
 }
}
assert.equal(covered,39);assert.equal(fields,390);assert.equal(uncovered,800);
for(const [id,key,expected] of [
 ['food-1-week-02-q01','optionsJa.0','しつおんのほうがかならずさっきんされるとせつめいする。'],
 ['food-1-week-06-q03','optionsJa.0','ひとりにしてしょうじょうがきえるまでほうちする。'],
 ['food-2-week-05-q01','stemJa','やさいのいたんだぶぶんをのこせばぶどまりがあがるとていあんされました。しょくちょうのはんだんはどれですか。'],
 ['food-2-week-06-q01','optionsJa.3','ちゅういりょくだけのもんだいとしておなじちゅういをくりかえす。'],
 ['food-2-week-06-q03','optionsJa.0','じしゃのしきちがいなのでかならずたいしょうがいとする。']
])assert.equal(readings[id].fields[key].map(p=>p.reading??p.text).join(''),expected);
// Compile the actual UI and bundle the actual loader to catch TSX/import errors.
const esbuild=require('esbuild');
for(const file of ['FoodQuestionRuby.tsx','FoodManufacturingCourse.tsx'])esbuild.transformSync(fs.readFileSync(path.join(root,'src/components/food-manufacturing',file),'utf8'),{loader:'tsx',jsx:'automatic'});
esbuild.buildSync({entryPoints:[path.join(data,'question-ruby.ts')],bundle:true,write:false,platform:'node',alias:{'@':path.join(root,'src')}});
console.log(JSON.stringify({status:'PASS',questions:covered,fields,staleAndMisalignedRejected:fields*2,malformedCasesRejected:fields*4,uncoveredFallbacks:uncovered,tsxCompile:true,nativeReviewed:false,browserTested:false}));
