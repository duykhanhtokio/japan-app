// Source-scoped text integrity beyond mutually matching but corrupted ruby text.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..');
function validate(data){
 for(const row of data.checks)for(const [tokens,key] of [['promptRuby','promptJa'],['modelAnswerRuby','modelAnswerJa'],...(row.teachingJa?[['teachingRuby','teachingJa']]:[])]){
  assert.equal(row[tokens].map(t=>t.text).join(''),row[key],`${row.id}: complete ruby text`);
  for(const token of row[tokens])if(token.readingKana!==undefined)assert(/^[\p{Script=Hiragana}ー]+$/u.test(token.readingKana),`${row.id}: invalid readingKana`);
 }
 const get=id=>{const rows=data.checks.filter(c=>c.id===id);assert.equal(rows.length,1);return rows[0];};
 const mobility=get('kaigo-reader-movement-mobility-meaning'),examples=get('kaigo-reader-movement-adl-iadl-examples'),meaning=get('kaigo-reader-movement-adl-iadl-meaning');
 for(const row of [mobility,examples,meaning])for(const key of ['promptJa','modelAnswerJa'])assert(/[。？]$/.test(row[key]),`${row.id}: truncated Japanese sentence`);
 assert(mobility.promptJa.includes('移動'));for(const term of ['生活行為','活動','範囲','心身','機能'])assert(mobility.modelAnswerJa.includes(term),`Missing source mobility concept: ${term}`);
 for(const row of [examples,meaning])for(const key of ['promptJa','modelAnswerJa'])for(const term of ['ADL','IADL'])assert(row[key].includes(term),`${row.id}: lost concept label ${term}`);
 for(const term of ['移動','食事','着替え','排泄','入浴','金銭管理','買い物','洗濯','交通機関','通信機器'])assert(examples.modelAnswerJa.includes(term),`Lost source example ${term}`);
 for(const term of ['自立','日常生活動作','家庭','地域','維持'])assert(meaning.modelAnswerJa.includes(term),`Lost definition component ${term}`);
 const consent=data.checks.find(c=>c.id==='kaigo-reader-consent-decision-support');
 if(consent){
  assert.equal(consent.promptJa,'本人が選ぶために、どのような情報を伝え、決定後はどう支えますか。','Consent prompt must retain complete Japanese wording');
  assert.equal(consent.modelAnswerJa,'選択肢とそれぞれの利点・不利益を分かりやすく伝えます。本人が自分の意思で選べるよう支え、その決定を尊重して実現を支援します。','Consent answer must retain all decision-support steps');
  for(const tokens of [consent.promptRuby,consent.modelAnswerRuby])for(const token of tokens)if(token.readingKana!==undefined)assert(/[\p{Script=Han}々]/u.test(token.text),'Kana-only text must not acquire invented ruby');
 }
 return true;
}
module.exports={validate};
if(require.main===module){
 const file='src/data/kaigo/reader-communication-checks.json',data=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));validate(data);
 const old=JSON.parse(cp.execFileSync('git',['show',`c25e4e260df736515921193e6b59d723f397f1f5:${file}`],{cwd:root,encoding:'utf8'}));
 assert.throws(()=>validate(old),'Previously shipped truncated Japanese/ruby must fail');
 const bad=structuredClone(data),row=bad.checks.find(c=>c.id==='kaigo-reader-movement-adl-iadl-meaning');row.promptRuby=[{text:row.promptJa,readingKana:'ADL'}];assert.throws(()=>validate(bad),'Latin ruby must fail even when token text reconstruction matches');
 console.log(JSON.stringify({status:'PASS_KAIGO_READER_TEXT_INTEGRITY',checks:data.checks.length,sourceScopedMovementChecks:3,rejectedPriorCorruptPayload:true,rejectedLatinRuby:true,sourceCoverageCertification:false}));
}
