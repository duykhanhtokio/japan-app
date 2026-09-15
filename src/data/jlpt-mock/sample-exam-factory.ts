import grammarBank from '@/data/generated/grammar.json';
import vocabularyBank from '@/data/generated/vocabulary.json';
import { jlptGrammarSupplements, replacedGrammarIds } from '@/data/jlpt-grammar-supplements';
import { JLPT_OFFICIAL_STRUCTURE } from '@/data/jlpt-mock/official-structure';
import type { JlptLevel } from '@/data/jlpt-learning';
import type { JlptMockExam, JlptMockPart, JlptMockQuestion, JlptQuestionFamily } from '@/data/jlpt-mock/types';

type VocabularyRow={id:string;word:string;reading:string;meaningVi:string;meaningTranslations?:Record<string,string>;jlpt:string;exampleJa:string;exampleVi:string;status?:string};
type GrammarRow={id:string;name:string;jlpt:string;meaningVi:string;meaningJa?:string;pattern:string;exampleJa:string;exampleVi:string;status?:string};
const vocabulary=vocabularyBank as VocabularyRow[], grammar=[...(grammarBank as GrammarRow[]).filter(item=>!replacedGrammarIds.has(item.id)),...(jlptGrammarSupplements as unknown as GrammarRow[])];
const optionIds=['A','B','C','D'] as const;
const familyTitle:Record<JlptQuestionFamily,string>={kanjiReading:'漢字読み',orthography:'表記',wordFormation:'語形成',contextualVocabulary:'文脈規定',paraphrase:'言い換え類義',usage:'用法',grammarForm:'文の文法1',sentenceComposition:'文の組み立て',textGrammar:'文章の文法',shortReading:'短文',noticeReading:'掲示',informationRetrieval:'情報検索',mediumReading:'中文',longReading:'長文',integratedReading:'統合理解',assertionReading:'主張理解',listeningTask:'課題理解',listeningKeyPoint:'ポイント理解',listeningOutline:'概要理解',listeningExpression:'発話表現',listeningQuickResponse:'即時応答',listeningIntegrated:'統合理解'};
const instruction:Partial<Record<JlptQuestionFamily,string>>={kanjiReading:'＿＿＿の言葉の読み方として最もよいものを一つ選びなさい。',orthography:'ひらがなで書かれた言葉を漢字で書くとき、最もよいものを一つ選びなさい。',wordFormation:'文の意味に合う言葉を一つ選びなさい。',contextualVocabulary:'（　）に入れるのに最もよいものを一つ選びなさい。',paraphrase:'下線の言葉と意味が最も近いものを一つ選びなさい。',usage:'言葉の使い方として最もよいものを一つ選びなさい。',grammarForm:'（　）に入れるのに最もよいものを一つ選びなさい。',sentenceComposition:'★に入るものを一つ選びなさい。',textGrammar:'文章の流れに合うものを一つ選びなさい。',shortReading:'文章を読んで、質問に答えなさい。',mediumReading:'文章を読んで、質問に答えなさい。',longReading:'文章を読んで、質問に答えなさい。',integratedReading:'複数の文章を比べて、質問に答えなさい。',assertionReading:'筆者の主張として最もよいものを選びなさい。',informationRetrieval:'案内から必要な情報を探しなさい。',listeningTask:'話を聞いて、何をするか選びなさい。',listeningKeyPoint:'質問を聞いて、ポイントに合う答えを選びなさい。',listeningOutline:'話の概要として最もよいものを選びなさい。',listeningExpression:'場面に合う発話を選びなさい。',listeningQuickResponse:'発話に対する返事として最もよいものを選びなさい。',listeningIntegrated:'長めの話を聞き、内容に合う答えを選びなさい。'};
const rotate=<T,>(items:T[],start:number,count=4)=>Array.from({length:count},(_,i)=>items[(start+i)%items.length]);
const opts=(values:string[],correctIndex=0)=>values.map((text,i)=>({id:optionIds[i],text}));
const grammarSurface=(row:GrammarRow)=>{const example=row.exampleJa||'';const candidates=row.name.replace(/[（(][^）)]*[）)]/g,'').split(/[／/・]/).flatMap(value=>value.split(/[〜～]/)).map(value=>value.trim()).filter(value=>value.length>=2&&example.includes(value)).sort((a,b)=>b.length-a.length);return candidates[0]??'';};
const grammarMaskable=(row:GrammarRow)=>{const surface=grammarSurface(row),example=row.exampleJa||'';return!!surface&&example.split(surface).length===2;};
const vocabularyMeaningJa=(row:VocabularyRow)=>row.meaningTranslations?.ja??row.word;
const grammarMeaningJa=(row:GrammarRow)=>row.meaningJa??row.pattern??row.name;

function vocabularyQuestion(level:JlptLevel,family:JlptQuestionFamily,index:number,rows:VocabularyRow[]):JlptMockQuestion{
 const row=rows[index%rows.length], pool=rotate(rows,index,4), answerAt=index%4;
 const ordered=[...pool]; ordered.splice(answerAt,0,ordered.splice(0,1)[0]);
 let prompt=row.exampleJa||`${row.word}を使います。`, values=ordered.map(x=>x.word), explanation=`「${row.word}（${row.reading}）」は「${vocabularyMeaningJa(row)}」という意味です。例：${row.exampleJa}`;
 if(family==='kanjiReading'){prompt=`「${row.word}」の読み方はどれですか。`;values=ordered.map(x=>x.reading);}
 if(family==='orthography'){prompt=`「${row.reading}」の正しい表記はどれですか。`;values=ordered.map(x=>x.word);}
 if(family==='paraphrase'){prompt=`「${row.word}」の意味に最も近いものはどれですか。`;values=ordered.map(vocabularyMeaningJa);}
 if(family==='usage'){prompt=`「${row.word}」の使い方として最もよいものはどれですか。`;values=ordered.map(x=>x.exampleJa||`${x.word}を使います。`);}
 if(family==='contextualVocabulary'||family==='wordFormation'){prompt=(row.exampleJa||`${row.word}を使います。`).replace(row.word,'（　）');values=ordered.map(x=>x.word);}
 return{id:`${level}-01-${family}-${index+1}`,level,section:'vocabulary',family,prompt,options:opts(values,answerAt),correctOptionId:optionIds[answerAt],sourceVocabularyIds:[row.id],sourceGrammarIds:[],explanation};
}
function grammarQuestion(level:JlptLevel,family:JlptQuestionFamily,index:number,rows:GrammarRow[]):JlptMockQuestion{
 const row=rows[index%rows.length],pool=rotate(rows,index,4),answerAt=index%4,ordered=[...pool];ordered.splice(answerAt,0,ordered.splice(0,1)[0]);
 const surface=grammarSurface(row),masked=(row.exampleJa||'').replace(surface,'（　）'),prompt=family==='sentenceComposition'?`次の文を正しく組み立てるとき、★に入るものはどれですか。\n（　）　★　（　）　（　）`:family==='textGrammar'?`次の文章の（　）に入るものとして最もよいものを一つ選びなさい。\n${masked}`:masked;
 return{id:`${level}-01-${family}-${index+1}`,level,section:'grammar',family,prompt,options:opts(ordered.map(grammarSurface),answerAt),correctOptionId:optionIds[answerAt],sourceVocabularyIds:[],sourceGrammarIds:[row.id],explanation:`正解は「${surface}」。文を完成すると「${row.exampleJa}」になります。意味：${grammarMeaningJa(row)}。接続：${row.pattern}`};
}
function readingQuestion(level:JlptLevel,family:JlptQuestionFamily,index:number,rows:VocabularyRow[]):JlptMockQuestion{
 const a=rows[(index*3)%rows.length],b=rows[(index*3+1)%rows.length],c=rows[(index*3+2)%rows.length];
 const passage=family==='informationRetrieval'?`「${a.word}」資料室のお知らせ（案内番号${index+1}）\n平日 9:00～19:00／土曜日 10:00～17:00／日曜日 休館\n本を借りる人はカードを受付に出してください。返却は入口の箱でもできます。`:family==='integratedReading'?`テーマ：${a.word}\nAさん：便利なので、私は毎日オンラインで買い物をします。\nBさん：品物を直接確かめたいので、店で買うことが多いです。`:`${a.exampleJa} ${b.exampleJa} ${c.exampleJa} この経験（${index+1}）から、目的を確認してから行動することが大切だと分かりました。`;
 const answer=index%4, choices=family==='informationRetrieval'?['土曜日の16時に本を借りる','日曜日に本を借りる','土曜日の18時に本を借りる','カードなしで本を借りる']:family==='integratedReading'?['Aさんは便利さを重視する','二人ともオンラインだけで買う','Bさんは品物を見たくない','二人の意見は全く同じ']:['目的を確認してから行動する','何も準備しない','いつも同じ方法を選ぶ','経験を振り返らない'];
 const values=choices.map((_,i)=>choices[(i-answer+4)%4]);
 return{id:`${level}-01-${family}-${index+1}`,level,section:'reading',family,prompt:'本文の内容に合うものはどれですか。',passage,options:opts(values,answer),correctOptionId:optionIds[answer],sourceVocabularyIds:[a.id,b.id,c.id],sourceGrammarIds:[],explanation:`本文の根拠は「${choices[0]}」に当たる箇所です。他の選択肢は、時間・条件・筆者の結論のいずれかが本文と一致しません。`};
}
function listeningQuestion(level:JlptLevel,family:JlptQuestionFamily,index:number,rows:VocabularyRow[]):JlptMockQuestion{
 const row=rows[index%rows.length],answer=index%4;
 const variant=index%4;
 const scenarios:Record<string,{prompt:string;scripts:string[];answers:string[]}>= {
  listeningTask:{prompt:variant%2===0?'男の人と女の人が話しています。男の人はこのあと、まず何をしなければなりませんか。':'女の人はこのあと、まず何をしますか。',scripts:[`女：${row.word}の手続きは、まず受付で名前を書いて、それから二階へ行ってください。男：分かりました。先に受付ですね。`,`男：会議で${row.word}の資料を使います。女：では九時半までに印刷して、そのあと部長に渡してください。男：はい、まず印刷します。`,`女：${row.word}と書かれた荷物を入口まで運んでください。そのあと車を持ってきてください。男：分かりました。`,`男：${row.word}の行事は体育館で行います。女：では、先に参加者へ場所の変更を連絡します。`],answers:['受付で名前を書く','資料を印刷する','荷物を入口まで運ぶ','場所の変更を連絡する']},
  listeningKeyPoint:{prompt:variant%2===0?'男の人は、なぜ予定を変えましたか。':'女の人が一番大切だと言っていることは何ですか。',scripts:[`男：${row.word}を買う予定でしたが、店が休みだったので明日にします。`,`女：${row.word}の作業では、速さより安全確認が一番大切です。`,`男：雨で電車が止まったので、${row.word}の会議にはオンラインで参加します。`,`女：予算が足りないので、${row.word}は来月に延期しましょう。`],answers:['店が休みだったから','安全を確認すること','電車が止まったから','予算が足りないから']},
  listeningOutline:{prompt:'この話の主な内容は何ですか。',scripts:[`今日は${row.word}の利用方法について説明します。最初に受付でカードを受け取り、終わったら返してください。`,`会議では${row.word}に関する新しい計画と、来月の予定について話し合いました。`,`この放送は${row.word}の行事の場所が公園から体育館へ変わったことを知らせています。`,`先生は${row.word}を勉強するとき、毎日短い時間でも続けることが大切だと話しています。`],answers:['利用方法の説明','新しい計画と予定','行事の場所変更','勉強を続ける大切さ']},
  listeningExpression:{prompt:'この場面で何と言うのが最もよいですか。',scripts:[`${row.word}について受付の人に聞きたいです。何と言いますか。`,`重い${row.word}を友達に運んでもらいました。何と言いますか。`,`先生の${row.word}を借りたいです。何と言いますか。`,`約束の時間に遅れました。${row.word}を待っていた人に何と言いますか。`],answers:['すみません、教えていただけますか','手伝ってくれてありがとう','お借りしてもいいですか','遅れて申し訳ありません']},
  listeningQuickResponse:{prompt:'発話に対する返事として最もよいものを選んでください。',scripts:[`${row.word}はもう準備できましたか。`,`明日、${row.word}を一緒に見に行きませんか。`,`この${row.word}、ここに置いてもいいですか。`,`${row.word}の使い方が分からないんですが。`],answers:['はい、先ほど終わりました','いいですね、行きましょう','はい、そこにお願いします','では、私が説明します']},
  listeningIntegrated:{prompt:'二人の話を聞いて、最後に決まったことを選んでください。',scripts:[`男：${row.word}の会議は三時からでどうですか。女：三時は別の予定があります。四時なら大丈夫です。男：では四時にしましょう。`,`女：${row.word}は電車で運びますか。男：大きすぎるので車を使いましょう。女：分かりました。`,`男：${row.word}の行事は公園の予定です。女：雨の予報ですから体育館に変えませんか。男：そうしましょう。`,`女：${row.word}の資料は今日送りますか。男：まだ確認が必要なので、明日の朝送りましょう。`],answers:['四時に会議をする','車で運ぶ','体育館で行う','明日の朝送る']},
 };
 const scenario=scenarios[family]??scenarios.listeningTask,script=scenario.scripts[variant],target=scenario.answers[variant],distractorPool=scenario.answers.filter(value=>value!==target),ordered=[target,...distractorPool],values=ordered.map((_,i)=>ordered[(i-answer+4)%4]);
 return{id:`${level}-01-${family}-${index+1}`,level,section:'listening',family,prompt:scenario.prompt,options:opts(values,answer),correctOptionId:optionIds[answer],audioScript:script,audioTranscript:script,sourceVocabularyIds:[row.id],sourceGrammarIds:[],explanation:`会話の条件と最後の決定を確認します。正解は「${target}」です。`};
}
export function buildSampleExam(level:JlptLevel):JlptMockExam{
 const vocab=vocabulary.filter(x=>x.jlpt===level&&x.status!=='Draft'),gram=grammar.filter(x=>x.jlpt===level&&x.status!=='Draft'&&grammarMaskable(x));
 const parts:JlptMockPart[]=[],questions:JlptMockQuestion[]=[];let vi=0,gi=0,ri=0,li=0;
 for(const item of JLPT_OFFICIAL_STRUCTURE[level]){parts.push({id:`${level}-01-${item.family}`,title:`問題 ${parts.length+1}　${familyTitle[item.family]}`,instructions:instruction[item.family]||item.objective,section:item.section,family:item.family,questionCount:item.count});for(let i=0;i<item.count;i++){if(item.section==='vocabulary')questions.push(vocabularyQuestion(level,item.family,vi++,vocab));else if(item.section==='grammar')questions.push(grammarQuestion(level,item.family,gi++,gram));else if(item.section==='reading')questions.push(readingQuestion(level,item.family,ri++,vocab));else questions.push(listeningQuestion(level,item.family,li++,vocab));}}
 return{id:`${level.toLowerCase()}-test-01`,level,number:1,title:`JLPT ${level} 模擬試験 第1回`,parts,questions};
}
