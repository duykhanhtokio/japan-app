import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reviewDir = path.join(root, 'docs/jlpt-workspace/conversion/n1-2013-07');
const visionDir = path.join(root, 'docs/jlpt-workspace/batch-01/ocr/n1-2013-07-exam-03/answer_script_pdf/pages');
const outDir = path.join(root, 'src/data/jlpt-official/n1-2013-07');

const read = (file) => fs.readFileSync(file, 'utf8')
  .replace(/^小程序[^\n]*\n/gm, '').replace(/^第\d+[^\n]*$/gm, '')
  .replaceAll('決まり第、', '決まり次第、').replaceAll('目記載せてる', '日記載せてる')
  .replaceAll('買っていただき安い', '買っていただきやすい').replaceAll('使え続ける', '使い続ける')
  .replaceAll('なんて人事って', 'なんて他人事って').replaceAll('お嬢めに預かり', 'お褒めに預かり')
  .replaceAll('心の髪を', '心の襞を').replaceAll('されていますたが', 'されていましたが')
  .replaceAll('活発になっこと', '活発になったこと').replaceAll('ターゲット絞った', 'ターゲットを絞った')
  .replaceAll('どのようなものをお探しですか', 'どのようなものをお探しですか')
  .replaceAll('それかれわたし', 'それからわたし').replaceAll('ベルトか\nえればと', 'ベルトを替えれば、')
  .replaceAll('にもつれていける', 'にも連れていける').replaceAll('一生を付き合える', '一生付き合える')
  .replaceAll('ベルト換\nえると', 'ベルトを換えると').replaceAll('二つの国の時間が分かるのを便利', '二つの国の時間が分かるのは便利')
  .replaceAll('一日一回ねじをまかなければ', '一日一回ねじを巻かなければ').trim();
const page = (n) => read(path.join(visionDir, `page-${String(n).padStart(2, '0')}.vision.txt`));
const writtenFiles = fs.readdirSync(reviewDir).filter((name) => /^written.*\.review\.json$/.test(name)).sort();
const writtenReview = writtenFiles.flatMap((name) => {
  const value = JSON.parse(fs.readFileSync(path.join(reviewDir, name), 'utf8'));
  return Array.isArray(value) ? value : value.questions ?? value.items;
});

const writtenKey = [4,2,4,3,3,1,3,2,2,1,3,1,3,2,4,4,2,1,4,2,1,4,1,3,3,4,2,4,1,2,3,4,1,2,3,2,4,1,3,1,3,1,2,4,3,4,3,4,3,1,2,1,4,2,3,4,1,3,2,4,2,3,2,1,1,3,4,2,1,2];
const listeningKey = [3,2,1,2,3,4,3,2,2,3,2,2,4,2,3,3,1,3,1,2,2,2,2,3,3,2,3,1,2,1,3,1,2,2,1,4];

if (writtenReview.length !== 70) throw new Error(`Expected 70 written questions, got ${writtenReview.length}`);
writtenReview.forEach((question, index) => {
  if (question.questionNumber !== index + 1) throw new Error(`Written sequence breaks at ${index + 1}`);
  if (String(question.correctOptionId) !== String(writtenKey[index])) throw new Error(`Written answer mismatch at ${index + 1}`);
  if (question.options.length !== 4) throw new Error(`Written option count mismatch at ${index + 1}`);
});

const instruction = {
  1: 'では、まず質問を聞いてください。それから話を聞いて、問題用紙の（1）から（4）の中から、もっともよいものを一つ選んでください。',
  2: 'では、まず質問を聞いてください。そのあと、問題用紙の選択肢を読んでください。読む時間があります。それから、話を聞いて、問題用紙の（1）から（4）の中から、もっともよいものを一つ選んでください。',
  3: 'では、問題用紙に何も印刷されていません。この問題は全体としてどんな内容かを聞く問題です。まず話を聞いてください。それから、質問と選択肢を聞いて、（1）から（4）の中から、もっともよいものを一つ選んでください。',
  4: 'では、問題用紙に何も印刷されていません。まず文を聞いてください。それから、それに対する返事を聞いて、（1）から（3）の中から、もっともよいものを一つ選んでください。',
  5: 'では長めの話を聞きます。この問題には練習はありません。メモをとってもかまいません。',
};

const groups = [
  {
    problem: 1, pages: [8,9], starts: [13200,86620,179380,270100,373200,483940], end: 560100,
    prompts: ['男の人はこの後まず何をしますか。','女の学生はサークルのほかのメンバーに何を伝えますか。','男の店員はこの後まず何をしますか。','男の留学生はこの後まず何をしなければなりませんか。','男の学生はこれから何をしなければなりませんか。','この後、店員は男性のスーツをどう展示しますか。'],
    options: [
      ['会長にあいさつを依頼する','会場を予約する','招待状を準備する','会長の送迎車を手配する'],
      ['イベントを予定どおり行うこと','イベントを中止すること','イベントを延期すること','イベントを前倒しで行うこと'],
      ['過去のメニューを調べる','割引券の企画を立てる','セットメニューを企画する','新しい内装の計画を立てる'],
      ['レベル分けのテストを受ける','上級の聴解の先生に相談する','上級の漢字の授業を受ける','事務に報告をする'],
      ['学内のゴミを拾う','ポスターを張る場所を増やす','ゴミを捨てないように呼びかける','サークルで新しい取り組みを提案する'],
      ['高級感を前面に押し出して展示する','女性の服と並べて展示する','家で着るものと並べて展示する','小物と組み合わせて展示する'],
    ],
  },
  {
    problem: 2, pages: [9,10], starts: [560100,678040,776140,906620,1014140,1112440], end: 1203820,
    prompts: ['女の学生はどうしてホームページに日記を書いていますか。','部長は今後、どのような机を作る必要があると言っていますか。','先生は留学の一番の利点はどんなことだと言っていますか。','女の人はこれから商品をどのように売っていきたいと言っていますか。','作家の小田さんの作品は、どんな点が評価されて受賞しましたか。','平均株価が上がったのはどうしてだと言っていますか。'],
    options: [
      ['コメントをもらうと元気になるから','大勢の人が読んでくれるから','両親に近況を伝えるため','素敵な出会いを求めるため'],
      ['兄弟で共有できる机','長期にわたって使える机','手ごろな価格の机','子供の好みに合った机'],
      ['異文化が理解できるようになること','自分自身のことがより分かるようになること','外国語が習得できること','国際的なネットワークが作れること'],
      ['国内の若者に絞って販売を強化する','国内の高齢者に絞って販売を強化する','海外の若者を販売対象に加える','海外の高齢者を販売対象に加える'],
      ['長編小説として自身の半生を書いたところ','登場人物の心理を詳細に書いたところ','社会と人々の在り方を鋭い視点で書いたところ','独特の世界観で人間関係を書いたところ'],
      ['国内の需要が伸びたから','国内の製造業での設備投資が増えたから','政府が減税策を発表したから','政府の新しい経済政策への期待が高いから'],
    ],
  },
  {
    problem: 3, pages: [10,11], starts: [1203820,1307920,1408680,1526320,1641260,1749500], end: 1867560,
    prompts: ['女のアナウンサーは何について話していますか。','男の人は、新しいパソコンは若者にとってどうだと言っていますか。','女の人は仕事について今後どうしようと思っていますか。','男の人は主に何について話していますか。','女の人が伝えたいことは何ですか。','男の人は何のために女の人を呼びましたか。'],
    options: [
      ['植物を育てることの難しさ','ペットが飼えない住宅事情','都会の人間関係','ある園芸店の新たな取り組み'],
      ['デザインもよく、値段も適当だ','デザインはよいが、値段は適当でない','デザインはあまりよくないが、値段は適当だ','デザインもあまりよくなく、値段も適当でない'],
      ['自分で新しい会社を作る','給料の高い会社で働く','今の会社でしばらく働き続ける','新しい業界で働く'],
      ['動物の生活圏','動物の脳の進化','動物の睡眠の取り方','動物と天敵の関係'],
      ['結果を出すためには地道な努力が必要','公園の美化には地域ぐるみの協力が必要','植物を育てるには日々の手入れが大切','スポーツや勉強も結果を出すことが大切'],
      ['新しい部署に移動させるため','斬新なアイディアを褒めるため','仕事の進め方について助言するため','プロジェクトについて意見を聞くため'],
    ],
  },
  {
    problem: 4, pages: [12], starts: [1867560,1902440,1936800,1969520,2002080,2034580,2069240,2105900,2140060,2175820,2211640,2247140,2282540,2317480], end: 2352660,
    prompts: ['ねえ、会計課の山田君、いつもぼそぼそ話すよね。','昨日の夜中のサッカー中継、うっかりしてて見逃しちゃったよ。','今日の面接、散々だったよ。','君の報告書、新入社員でもあるまいし、なんなんだ。','さっきからそわそわしちゃって、何かあるの。','この間、駅前の交差点で幼馴染にばったり出くわしてね。','うちの子ジョギング始めるって言ってるんだけど、せいぜい3日も続けば上々だろうな。','今日、市役所に行ったら、あちこち窓口を盥回しにされて頭に来たよ。','うちの母、看護師として働くかたわらボランティア活動も熱心にやってるんですよ。','今度のプロジェクトはIT技術に明るい君が打って付けだと思うんだけど、どう。','企画案、立ててみたけど、果たして部長が首を縦に振るかどうか。','この店の定食、値段のわりには悪くないね。','田中さま、本日は足元の悪いなか、弊社までお運びいただきまして。','お客さま、そちら今流行ってるんですよ。よろしければお召しになりませんか。'],
    options: [
      ['もう少しはっきり話してほしいよね','もっと静かに話せないのかな','本当に聞きやすくていいよね'],['よく夜中まで見てたわね','へえ、録画しとかなかったの','ボールから目を離しちゃだめだよ'],['しっかり準備しただけのこと、あったね','なんか失敗でもしたの','ありがたい話だね、今日はついてたね'],['お褒めいただきまして','すぐに作成し直します','努力した甲斐がありました'],['へえ、落ち込んでるように見える','ちょっと大事な連絡を待ってるんだ','うん、元気いっぱいだよ'],['久々に待ち合わせしたんだ','あの交差点、見通し悪いからね','それはすごい偶然だね'],['へえ、3日も続いてるのね','親としても自慢したくなるよね','そんなことないでしょう'],['それはどうぞお大事に','それって本当嫌になるね','そんなに用事が多かったんだね'],['ボランティア活動のついでなんですね','仕事一筋のお母さんなんですね','見習いたいものですね'],['ご期待に添えるよう頑張ります','どなたが適任なんですか','私じゃ、技術力が足りないんですが'],['どっちにしても、不採用になったんだ','見せてみなきゃ始まらないよ','部長が承認してくれてこれでいけるね'],['でしょう、ほかの店ならもうちょっとするよ','確かにあまりにも高すぎるよね','そう、そんなにまずいかな'],['足のおけがはいかがでしょう','そちらにおいでいただけますか','こちらこそお時間をいただいて'],['じゃあ、試してみます','よろしければ差し上げます','それならご馳走になります'],
    ],
  },
];

function block(text, number, nextNumber) {
  const start = text.search(new RegExp(`(?:^|\\n)${number}\\s*番[：:]`));
  if (start < 0) throw new Error(`Transcript block ${number} not found`);
  const tail = text.slice(start).replace(/^\n/, '');
  if (!nextNumber) return tail.trim();
  const end = tail.search(new RegExp(`\\n${nextNumber}\\s*番[：:]`));
  return (end < 0 ? tail : tail.slice(0, end)).trim();
}

const pageText = Object.fromEntries([8,9,10,11,12,13].map((n) => [n, page(n)]));
const p1Text = `${pageText[8]}\n${pageText[9].split('問題2')[0]}`;
const p2Text = `${pageText[9].split('問題2')[1]}\n${pageText[10].split('問題3')[0]}`;
const p3Text = `${pageText[10].split('問題3')[1]}\n${pageText[11]}`;
const p4Text = pageText[12].split('1番：電気店')[0];
const p5Text = `1番：電気店${pageText[12].split('1番：電気店')[1]}\n${pageText[13]}`;
const transcriptTexts = { 1: p1Text, 2: p2Text, 3: p3Text, 4: p4Text };

const listening = [];
let answerIndex = 0;
for (const group of groups) {
  for (let index = 0; index < group.starts.length; index += 1) {
    const number = index + 1;
    const endMs = group.starts[index + 1] ?? group.end;
    const transcript = block(transcriptTexts[group.problem], number, index + 1 < group.starts.length ? number + 1 : null);
    listening.push({
      questionId: `n1-2013-07-p${group.problem}-q${String(number).padStart(2, '0')}`,
      sectionId: 'listening', problemNumber: group.problem, questionNumber: number, family: 'listening',
      instructionJa: instruction[group.problem], promptJa: group.prompts[index],
      options: group.options[index].map((textJa, optionIndex) => ({ optionId: String(optionIndex + 1), textJa })),
      correctOptionId: String(listeningKey[answerIndex++]),
      audio: { segmentId: `n1-2013-07-p${group.problem}-q${String(number).padStart(2, '0')}`, startMs: group.starts[index], endMs, timingConfidence: 'verified', timingVerificationStatus: 'verified', transcriptJa: transcript, transcriptSourcePages: group.pages },
      source: { questionPages: group.problem <= 2 ? [12,13] : [13], answerScriptPages: group.pages },
      answerVerificationStatus: 'verified', transcriptVerificationStatus: 'verified', verificationStatus: 'verified',
    });
  }
}

const p5Starts = [2352660,2383060,2525340];
const p5Ends = [2383060,2525340,2700200];
const p5Prompts = ['女の人はどのテレビを買うことにしましたか。','会社説明会をどのように行うことになりましたか。','女の人が買おうと思っているのはどれですか。','男の人が買おうと思っているのはどれですか。'];
const p5Options = [['一番のテレビ','二番のテレビ','三番のテレビ','四番のテレビ'],['別の日にもう一度する','同じ日の午前と午後にする','同じ日の同じ時間に一つの会場でする','同じ日の同じ時間に二つの会場でする'],['一番','二番','三番','四番'],['一番','二番','三番','四番']];
const p5Blocks = [block(p5Text,1,2), block(p5Text,2,3), block(p5Text,3,null)];
for (let index = 0; index < 4; index += 1) {
  const segmentIndex = Math.min(index, 2);
  const suffix = index === 2 ? 'a' : index === 3 ? 'b' : null;
  const number = index < 2 ? index + 1 : 3;
  const id = `n1-2013-07-p5-q${String(number).padStart(2, '0')}${suffix ? `-${suffix}` : ''}`;
  listening.push({ questionId: id, sectionId: 'listening', problemNumber: 5, questionNumber: number, family: 'listening', instructionJa: instruction[5], promptJa: p5Prompts[index], options: p5Options[index].map((textJa, i) => ({ optionId: String(i + 1), textJa })), correctOptionId: String(listeningKey[answerIndex++]), audio: { segmentId: `n1-2013-07-p5-q${String(number).padStart(2, '0')}`, startMs: p5Starts[segmentIndex], endMs: p5Ends[segmentIndex], timingConfidence: 'verified', timingVerificationStatus: 'verified', transcriptJa: p5Blocks[segmentIndex], transcriptSourcePages: [12,13] }, source: { questionPages: [13], answerScriptPages: [12,13] }, answerVerificationStatus: 'verified', transcriptVerificationStatus: 'verified', verificationStatus: 'verified' });
}

if (listening.length !== 36 || answerIndex !== 36) throw new Error(`Listening response count mismatch: ${listening.length}/${answerIndex}`);
if (new Set(listening.map((q) => q.audio.segmentId)).size !== 35) throw new Error('Expected 35 unique listening segments');

const passages = {};
const writtenQuestions = writtenReview.map((question) => {
  const passageId = question.passageId ?? (question.passageJa ? `n1-2013-07-passage-q${String(question.questionNumber).padStart(2, '0')}` : undefined);
  if (passageId && question.passageJa) passages[passageId] = { text: question.passageJa };
  return { questionId: `n1-2013-07-written-q${String(question.questionNumber).padStart(2, '0')}`, sectionId: 'written', problemNumber: question.problemNumber, questionNumber: question.questionNumber, family: question.family, instructionJa: question.instructionJa, promptJa: question.promptJa, passageId, options: question.options.map((option) => ({ optionId: String(option.optionId ?? option.id), textJa: option.textJa ?? option.text })), correctOptionId: String(question.correctOptionId), verificationStatus: 'verified', source: { questionPage: question.sourcePage ?? question.source?.questionPage ?? 1, answerPage: 1 } };
});

const dataset = { schemaVersion: 1, examId: 'n1-2013-07-exam-03', status: 'structured_ready', counts: { writtenResponses: 70, listeningResponses: 36, totalResponses: 106, uniqueAudioSegments: 35 }, source: { questionPdfSha256: 'bc2b6844f328f0ef8dd081abe038310bd5a809970eb60a9464f576415de20477', answerScriptPdfSha256: '4b54b175d93c7c14a3b7d51b2a42907d7d90b61afaf04f390b5d707bd05c6aee', audioSha256: '515a0365abeedd70fdf4641adc17520b227af9dcdd0ceb217e7a86487c9da08b' }, passages, questions: [...writtenQuestions, ...listening] };
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'exam.verified.json'), `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`Wrote ${dataset.questions.length} responses (${new Set(listening.map((q) => q.audio.segmentId)).size} audio segments)`);
