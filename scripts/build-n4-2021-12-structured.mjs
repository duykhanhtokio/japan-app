import assert from 'node:assert/strict';
import fs from 'node:fs';

const outputDir = 'docs/jlpt-workspace/conversion/n4-2021-12';
const externalRecovery = 'https://www.scribd.com/document/1056799871/JLPT-N4-2021-12';
const written = [];
const append = (section, problemNumber, sourcePage, rows) => rows.forEach(([prompt, options, answer, extra = {}], index) => written.push({
  id: `n4-2021-12-${section}-p${problemNumber}-q${index + 1}`,
  sourcePage: typeof sourcePage === 'function' ? sourcePage(index) : sourcePage,
  prompt,
  options,
  answer,
  answerProvenance: 'external_reconstruction_unverified',
  answerSource: externalRecovery,
  ...extra,
}));

append('vocabulary', 1, 1, [
  ['バスが 8時に 出発します。', ['しゅっはつ', 'しゅうはつ', 'しゅっぱつ', 'しゅうぱつ'], 3],
  ['すぐに、答えてください。', ['おぼえて', 'おしえて', 'かんがえて', 'こたえて'], 4],
  ['あの人は 心が きれいです。', ['きもち', 'あたま', 'かたち', 'こころ'], 4],
  ['最後の ページを 見てください。', ['さいしょ', 'さいご', 'せいご', 'せいしょ'], 2],
  ['この みちを 行くと、少し 遠いです。', ['おそい', 'ちかい', 'とおい', 'はやい'], 3],
  ['おととしの 冬、日本を 旅行しました。', ['あき', 'ふゆ', 'なつ', 'はる'], 2],
  ['あしたの じゅぎょうの 予習を します。', ['よしゅう', 'ようしゅう', 'よしゅ', 'ようしゅ'], 1],
]);

append('vocabulary', 2, 2, [
  ['としょかんで えいがの ほんを かりました。', ['映語', '英語', '英画', '映画'], 4],
  ['すずきさんは なにを つくっていますか。', ['送って', '使って', '作って', '売って'], 3],
  ['たくさん うんどうを したので、つかれました。', ['運動', '連動', '運働', '連働'], 1],
  ['あそこに おおきな ふねが みえます。', ['寺', '船', '鳥', '雲'], 2],
  ['わからない かんじを じしょで しらべる。', ['探べる', '知べる', '調べる', '研べる'], 3, { sourcePage: 0, contentProvenance: 'externally_recovered_not_in_supplied_scan', recoverySource: externalRecovery }],
]);

append('vocabulary', 3, (index) => index === 7 ? 3 : 2, [
  ['たくさん 話したので（　）が いたいです。', ['のど', 'ひげ', 'ゆび', 'うで'], 1],
  ['のった 電車は とても（　）いたので、すわれませんでした。', ['あつまって', 'こんで', 'たりて', 'くりかえして'], 2],
  ['日本に 行ったとき、きものを きたり、まつりで おどったり、いろいろな（　）を しました。', ['けいけん', 'しゅうかん', 'きょうみ', 'けっか'], 1],
  ['どんな まんがが すきか、小学生に（　）を しました。', ['コンサート', 'コンピューター', 'アンケート', 'アルコール'], 3],
  ['わたしが かりている アパートの（　）は 1か月 7万円です。', ['ふりこみ', 'ちょきん', 'おつり', 'やちん'], 4],
  ['この しゃしんに（　）いるのは わたしの りょうしんです。', ['かかって', 'ついて', 'うつって', 'とどいて'], 3],
  ['しんかんせんの きっぷは、かたみちなら 1万円、（　）なら 2万円です。', ['かいてん', 'おうふく', 'うんてん', 'あんない'], 2],
  ['ひっこしの とき、さらは かみで（　）はこに 入れます。', ['ひろって', 'かたづけて', 'つかまえて', 'つつんで'], 4],
]);

append('vocabulary', 4, (index) => index === 3 ? 3 : 3, [
  ['この 話は ひみつです。', ['この 話を みんなに はなしてください。', 'この 話は だれにも 言わないでください。', 'この 話を みんなにも 聞きましょう。', 'この 話は だれも しりたくないです。'], 2],
  ['もりさんは にこにこしていました。', ['もりさんは やすんでいました。', 'もりさんは あそんでいました。', 'もりさんは うたっていました。', 'もりさんは わらっていました。'], 4],
  ['たなかさんは どくしんです。', ['たなかさんは けっこんしています。', 'たなかさんは けっこんしていません。', 'たなかさんは ひとりで すんでいます。', 'たなかさんは はたらいていません。'], 2],
  ['これは やわらかいですね。', ['これは かたくないですね。', 'これは にがくないですね。', 'これは つめたくないですね。', 'これは きたなくないですね。'], 1],
]);

append('vocabulary', 5, 4, [
  ['「れんらく」の 使い方として いちばん いいものを 選んでください。', ['きこくしたら、おれいの てがみを やまださんに れんらくします。', 'アルバイトに 行く日を カレンダーに れんらくしておきます。', 'はじめて 会った人に めいしを れんらくして、あいさつを しました。', 'あしたの かいぎの 時間を はやしさんに れんらくしました。'], 4],
  ['「むしあつい」の 使い方として いちばん いいものを 選んでください。', ['ゆうべは むしあつくて、あまり ねられませんでした。', 'あの人は むしあついので、すきでは ありません。', 'この りょうりは むしあつい ほうが おいしいです。', 'この コートは むしあつくて、きやすいです。'], 1],
  ['「けいかく」の 使い方として いちばん いいものを 選んでください。', ['ひこうきの チケットは 電話か メールで けいかくが できます。', 'あしたは ゆうがたから 雨が ふる けいかくです。', '来月 行く りょこうの けいかくが まだ きまっていません。', '来週は しごとが いそがしくなる けいかくです。'], 3],
  ['「そだてる」の 使い方として いちばん いいものを 選んでください。', ['母が そだてた 花が きれいに さきました。', '外国に 行きたいので、お金を そだてています。', 'おきゃくさんが 来るので、あさから ごちそうを そだてました。', '1年前から そだてている ビルが もうすぐ できます。'], 1],
]);

append('grammar-reading', 1, (index) => index < 5 ? 5 : index < 12 ? 6 : 7, [
  ['わたしも ピアノを 習うこと（　）しました。', ['へ', 'が', 'に', 'を'], 3],
  ['山田「ジョンさんは 日本に どのくらい いる予定ですか。」\nジョン「ざんねんですが、一週間（　）いられません。」', ['だけ', 'しか', 'くらい', 'でも'], 2],
  ['今日は 午後から 雨が 降る（　）聞いたので、かさを 持ってきました。', ['は', 'を', 'の', 'と'], 4],
  ['私の 兄は、テニスも サッカー（　）上手です。', ['が', 'も', 'で', 'を'], 2],
  ['A「きのうの 夜、（　）電話に 出なかったんですか。」\nB「ごめんなさい。おふろに 入っていました。」', ['どう', 'どうやって', 'どんな', 'どうして'], 4],
  ['父は 朝ごはんの 前に（　）新聞を 読む。', ['もうすぐ', 'かならず', 'なかなか', 'だんだん'], 2],
  ['この アニメは 世界（　）の 子どもたちに 人気が ある。', ['など', 'ずつ', '間', '中'], 4],
  ['この パソコンは 何回（　）また すぐ こわれる。', ['なおすまえ', 'なおすとき', 'なおしても', 'なおしてから'], 3],
  ['田中さんは 先生に 作文を（　）よろこんでいました。', ['ほめて', 'ほめてしまって', 'ほめられて', 'ほめさせて'], 3],
  ['私は 医者に（　）ために いっしょうけんめい 勉強しています。', ['なる', 'なり', 'なれる', 'なって'], 1],
  ['A「すみません。山田さんの けいたい電話の ばんごうを（　）。」\nB「いいですよ。090-1111-1111です。」', ['教えてくれませんか', '教えましょうか', '教えてもいいです', '教えましょう'], 1],
  ['田中さんの けっこんパーティーが、今週の 土曜日に（　）。', ['開きます', '開きましょう', '開くでしょう', '開かれます'], 4],
  ['（学校で）\n西山「森さんが アルバイトを 始めたそうですよ。」\n中田「ああ、だから 最近 じゅぎょうの あと 急いで（　）ね。」', ['帰っているんです', '帰っていることです', '帰っているからです', '帰っているところです'], 1],
]);

append('grammar-reading', 2, 7, [
  ['A「すみません。山下さんが 今 ___ ___ ★ ___ わかりますか。」\nB「となりの へやに いますよ。」', ['か', 'に', 'いる', 'どこ'], 3],
  ['来週、友だちが うちに ___ ___ ★ ___ に なりました。', ['とまり', '来る', 'に', 'こと'], 2],
  ['（学校で）先生「日本語Aの じゅぎょうの日は、じしょを ___ ___ ★ ___ ようにしてください。」', ['持ってくる', '忘れない', 'を', 'の'], 3],
  ['私は いつも コーヒーは ___ ___ ★ ___ コーヒーも 飲みたくなる。', ['ときどき', 'さとうを 入れないで', 'あまい', '飲むが'], 1],
]);

const libraryPassage = `留学生の イワンさんは 作文を 書いて、クラスの みんなの 前で 読みました。\n\n町の図書館\nスミルノフ イワン\n\nみなさんは この町に ある 森図書館を 知っていますか。私は 先月 初めて 知りました。日本人の（18）のです。\n\n森図書館には 大学の 図書館には ないものが あります。（19）、ようふくの ざっしや 映画の ざっしです。私が 好きな 旅行の ざっしも あります。ざっしの 日本語は 難しいです。でも、写真を 見て、日本の ことを 知ることが できるので、楽しいです。\n\nいろいろな CDや DVDも あります。先週 借りた DVDは 京都を しょうかいする DVDです。古い お寺や 大きい 橋が きれいでした。私は まだ 京都に 行ったことが ありません。DVDを 見たあと、京都を（20）\n\n森図書館には 楽しめるものが たくさん あります。一度（21）。`;
append('grammar-reading', 3, 8, [
  [`${libraryPassage}\n\n（18）に 入るものは どれですか。`, ['ともだちが 教えてあげた', 'ともだちが 教えてくれた', 'ともだちに 教えてあった', 'ともだちに 教えておいた'], 2],
  [`${libraryPassage}\n\n（19）に 入るものは どれですか。`, ['たとえば', 'ですから', 'それに', 'しかし'], 1],
  [`${libraryPassage}\n\n（20）に 入るものは どれですか。`, ['旅行したところです', '旅行するようになりました', '旅行したくなりました', '旅行していました'], 3],
  [`${libraryPassage}\n\n（21）に 入るものは どれですか。`, ['行ってみるそうです', '行ってみるかもしれません', '行ってみたほうがいいですか', '行ってみてください'], 4],
]);

const basketball = 'この紙が 日本語学校に はってあります。\n\nバスケットボールを しませんか\n10月14日（日）の 夜7時から9時まで、市の体育館で バスケットボールを しませんか。利用料金は 2時間 1,000円なので、10人 集まれば、一人100円で できます。一緒に やりたい人は、今週中に 私（ユン）の ところに 来て、クラスと 名前を 教えてください。\n10月1日（月）\nユン・ジホン（Aクラス）';
const soccer = '私と 妹は サッカークラブに 入っています。毎日、授業の あとに 練習が あって、とても 疲れますから、私は 夜 早く 寝てしまいます。宿題を しないで 学校に 行ったことも あります。でも、妹は 宿題が 全部 終わるまで 寝ません。予習も します。すごいと 思います。';
const email = '友だちから メールが きました。\n\n田中さん\nこんにちは。\n仕事で 日本へ 2週間くらい 行くことに なりました。大阪に 1週間いて、それから 東京に 行きます。\n新東京ホテルに とまるので、いっしょに おすしを 食べませんか。\nご都合を 教えてください。\nリン';
append('grammar-reading', 4, (index) => 9 + index, [
  [`${basketball}\n\nユンさんと 一緒に バスケットボールを したい人は、まず どうしなければなりませんか。`, ['今週中に、バスケットボールを したい人を 10人 集めます。', '今週中に、ユンさんの ところに 行って クラスと 名前を 言います。', '10月14日（日）までに、ユンさんに 100円を 払います。', '10月14日（日）の 夜7時までに、体育館に 行きます。'], 2],
  [`${soccer}\n\nなぜ「私」は 妹を すごいと 思っていますか。`, ['妹は 早起きをして、宿題と 予習を しているから。', '妹は 毎日、夜遅くまで サッカーの 練習を しているから。', '妹は「私」より 宿題を 遅く 始めても、いつも 早く 終わるから。', '妹は サッカーの 練習の あとでも、宿題と 予習を してから 寝るから。'], 4],
  [`${email}\n\n田中さんは リンさんに 返事を 書きたいと 思っていますが、こまっています。どうしてですか。`, ['リンさんが 東京に いつ 来るか わからないから。', 'リンさんが 東京に なぜ 来たのか わからないから。', 'リンさんが 東京で どこに とまるか わからないから。', 'リンさんが 東京で 何を 食べたいか わからないから。'], 1],
]);

const envelope = `3歳に なる 私の 娘は 絵を かくのが 大好きです。でも、私は 絵が 上手では ないので 娘と 一緒に 絵を かいたことは ありません。ですから、娘は いつも 一人で 絵を かいています。先週、母が うちに 来たとき、娘と 絵を かいて 遊んでくれました。母と 二人で 絵を かいている 娘は、いつもより ずっと 楽しそうでした。\n\n私も 娘と 一緒に 絵を かいてあげたほうが いいかもしれないと 考えていたとき、テレビで 面白いものを 見ました。「絵封筒」です。「絵封筒」は、封筒に はった 切手の 周りに 自分で 絵を かいて 作ります。テレビで 見た 絵封筒の 中には、上手な 絵では なくても、とても いいものが ありました。鳥の 絵の 切手の 周りに、木を かいたものです。簡単に かいたものでしたが、かわいいと 思いました。\n\n絵封筒なら、私にも できるかもしれないと 思いました。ちょうど、母に 娘の 写真を 送ろうと 思っていたので、私も やってみました。犬の 絵の 切手を はって、周りに 草や 太陽を かきました。けっこう うまく できました。\n\n絵封筒みたいに、娘の かいている 絵の 周りに 私が 簡単に 絵を かく やり方だったら、私でも できそうです。娘は きっと 喜んでくれるでしょう。`;
append('grammar-reading', 5, (index) => index === 0 ? 10 : 11, [
  [`${envelope}\n\n娘は 絵を かくとき、いつも どうしていましたか。`, ['一人で かいていました。', '母と 二人で かいていました。', '「私」と 二人で かいていました。', '「私」と 母と 三人で かいていました。'], 1],
  [`${envelope}\n\nテレビを 見たあと、「私」は どうやって 絵封筒を 作りましたか。`, ['封筒に 鳥と 木の 絵を かきました。', '封筒に 犬の 絵の 切手と、草と 太陽の 絵の 切手を はりました。', '封筒に はった 鳥の 絵の 切手の 周りに、木の 絵を かきました。', '封筒に はった 犬の 絵の 切手の 周りに、草や 太陽の 絵を かきました。'], 4],
  [`${envelope}\n\n娘は きっと 喜んでくれるでしょうと ありますが、どうして「私」は、娘が 喜ぶと 思っていますか。`, ['「私」の 絵が 上手に なったから。', '「私」が きれいな 封筒を 作ったから。', 'これからは「私」が 娘と 一緒に 絵を かくから。', 'これからは「私」が 娘に 絵を 教えるから。'], 3],
]);

const computer = 'パソコン教室のお知らせ\n外国人の みなさんに、やさしい 日本語で パソコンの 使い方を 説明します。\n月・日：9月8日（木）、15日（木）、22日（木）（全部で3回）\n時間：18:00〜20:00\n場所：山名中学校（コンピューター教室）\n料金：1500円（3回）\n勉強できる人：日本語を100時間以上 勉強したことがある人、3回全部 出られる人。\n申し込み：8月24日（水）までに 電話で 予約してください。9月1日（木）18時から 山名中学校で 説明会を 行います。説明会に 出られない人は、予約の ときに 言ってください。料金は 説明会の ときに 集めます。説明会に 出られない人は、9月7日（水）までに 払ってください。';
append('grammar-reading', 6, 12, [
  [`${computer}\n\n次の4人の 中で、パソコン教室で 勉強できる人は だれですか。\nジェムさん：日本語150時間、出られる日 8日・15日・22日。\nマリオさん：日本語50時間、出られる日 8日・15日・22日。\nソニアさん：日本語200時間、出られる日 15日・22日。\nリナさん：日本語100時間、出られる日 8日・22日。`, ['ジェムさん', 'マリオさん', 'ソニアさん', 'リナさん'], 1],
  [`${computer}\n\nジェーンさんは パソコン教室で 勉強したいと 思っていますが、9月1日の 説明会に ジェーンさんは 出られません。ジェーンさんは、いつまでに お金を 払う 必要が ありますか。`, ['8月24日', '9月1日', '9月7日', '9月8日'], 3],
]);

assert.equal(written.length, 57);

// Filled after the single local transcription pass completes; this source is never exposed by the UI.
const listeningContentPath = `${outputDir}/listening-content.candidate.json`;
assert.ok(fs.existsSync(listeningContentPath), 'Listening content candidate must exist before building structured data.');
const listeningContent = JSON.parse(fs.readFileSync(listeningContentPath, 'utf8'));
const listeningAudit = JSON.parse(fs.readFileSync(`${outputDir}/listening.audit.json`, 'utf8'));
assert.equal(listeningContent.length, 28);
const listening = listeningAudit.records.map((audit, index) => ({
  id: `n4-2021-12-${audit.auditId}`,
  sourcePage: audit.questionSourcePages[0] ?? 0,
  prompt: listeningContent[index].prompt,
  options: listeningContent[index].options,
  answer: listeningContent[index].answer,
  answerProvenance: 'external_reconstruction_unverified_audio_cross_checked',
  answerSource: externalRecovery,
  candidateStartMs: audit.timingMs.start,
  candidateEndMs: audit.timingMs.end,
  timingVerificationStatus: 'candidate_unverified',
  humanReviewed: false,
  perceptualApproval: false,
  reviewDisposition: 'needs_later_review',
  visualOptionAsset: listeningContent[index].visualOptionAsset ?? null,
}));

assert.equal(new Set(written.map((question) => question.id)).size, 57);
assert.equal(new Set(listening.map((question) => question.id)).size, 28);
assert.ok([...written, ...listening].every((question) => question.prompt.trim() && [3, 4].includes(question.options.length) && question.options.every((option) => option.trim())));

const writtenAudit = JSON.parse(fs.readFileSync(`${outputDir}/written.audit.json`, 'utf8'));
writtenAudit.records.forEach((record, index) => {
  const question = written[index];
  record.correctOptionId = String(question.answer);
  record.answerAudit = 'external_reconstruction_unverified_ai_cross_checked';
  record.answerProvenance = { source: externalRecovery, official: false, aiCrossChecked: true };
  record.runtimeTranscriptionStatus = index === 11
    ? 'externally_recovered_not_in_supplied_scan'
    : 'verified_against_supplied_pdf';
  if (index === 11) {
    record.recoverySources = [externalRecovery];
    record.questionVisualAudit = 'externally_recovered_not_in_supplied_scan';
  }
});
listeningAudit.records.forEach((record, index) => {
  record.correctOptionId = String(listening[index].answer);
  record.answerAudit = 'external_reconstruction_unverified_audio_cross_checked';
  record.answerProvenance = { source: externalRecovery, official: false, audioCrossChecked: true };
  record.transcriptAudit = 'audio_runtime_transcribed_for_question_content_not_exposed';
});

fs.writeFileSync(`${outputDir}/written.partial.json`, `${JSON.stringify({ status: 'candidate_unverified', questions: written, remainingWritten: 0, remainingListening: 0 }, null, 2)}\n`);
fs.writeFileSync(`${outputDir}/listening.partial.json`, `${JSON.stringify({ status: 'candidate_unverified', questions: listening, remainingListening: 0, timingReview: { humanReviewed: false, perceptualApproval: false, reviewDisposition: 'needs_later_review' } }, null, 2)}\n`);
fs.writeFileSync(`${outputDir}/written.audit.json`, `${JSON.stringify(writtenAudit, null, 2)}\n`);
fs.writeFileSync(`${outputDir}/listening.audit.json`, `${JSON.stringify(listeningAudit, null, 2)}\n`);
console.log(`N4 2021-12 STRUCTURED DATA: ${written.length} written and ${listening.length} listening responses.`);
