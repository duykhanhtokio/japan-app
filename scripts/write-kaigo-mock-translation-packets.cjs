// Japanese-only effective corrected full-mock input; never export legacy locale text.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),modules=process.env.TOKUTEI_QA_MODULES||root,output=process.env.KAIGO_TRANSLATION_PACKET_DIR;
if(!output)throw Error('Set KAIGO_TRANSLATION_PACKET_DIR to a scratch directory');
(async()=>{const m=await require('./tokutei-ui-qa/compile.cjs')(root,modules),forms={};let questions=0;
for(const raw of m.kaigoCourse.mocks){const f=m.withJapaneseMockReview(raw);if(!f.japaneseReviewApplied)throw Error('Japanese mock review unavailable '+f.id);forms[f.id]={titleJa:f.titleJa,sourceRevision:m.japaneseMockTitleRevision(f),questions:Object.fromEntries(f.questions.map(q=>{questions++;const s=m.japaneseMockQuestionSource(q);return[q.id,{...s,sourceRevision:m.japaneseMockQuestionRevision(s),furigana:q.furigana}];}))};}
fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'full-mocks.ja.json'),JSON.stringify({sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),sourceLanguage:'ja',forms},null,2)+'\n');console.log(JSON.stringify({forms:Object.keys(forms).length,questions,otherLocaleContentIncluded:false}));})().catch(e=>{console.error(e);process.exit(1)});
