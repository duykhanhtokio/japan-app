/* Offline exact-context reuse only. This does not generate or certify readings. */
const data=require('./reader-moisture-checks.json');
const hasHan=text=>/[\p{Script=Han}々]/u.test(text);
function alignedTokens(text,tokens){
 if(!Array.isArray(tokens)||!tokens.length)return false;
 return tokens.every(t=>t&&typeof t.text==='string'&&t.text.length>0&&(!hasHan(t.text)||typeof t.readingKana==='string'&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana)))&&tokens.map(t=>t.text).join('')===text;
}
function createParagraphRubyLookup(checks){
 return function paragraphRuby(lesson,paragraphId,text,level){
  if(!lesson||!lesson.levels?.includes(level)||!lesson.paragraphs?.some(p=>p.id===paragraphId&&p.textJa===text))return null;
  const candidates=[];
  for(const c of checks){
   const parts=c.answerOrigin?.parts;
   if(!c.levels?.includes(level)||c.modelAnswerJa!==text||!Array.isArray(parts)||parts.length!==1)continue;
   const p=parts[0];
   if(p.lessonId!==lesson.id||p.sourceHash!==lesson.sourceHash||p.paragraphIds?.length!==1||p.paragraphIds[0]!==paragraphId||!alignedTokens(text,c.modelAnswerRuby))continue;
   candidates.push(c.modelAnswerRuby);
  }
  if(!candidates.length)return null;
  // Conflicting explicit readings are left unresolved rather than selected by order.
  const signature=JSON.stringify(candidates[0]);
  if(candidates.some(tokens=>JSON.stringify(tokens)!==signature))return null;
  return candidates[0].map(t=>({...t}));
 };
}
const agricultureParagraphRuby=createParagraphRubyLookup(data.checks);
module.exports={agricultureParagraphRuby,createParagraphRubyLookup};
