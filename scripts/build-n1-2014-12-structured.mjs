import assert from 'node:assert/strict';
import fs from 'node:fs';

const reviewDir = 'docs/jlpt-workspace/conversion/n1-2014-12';
const sourceOnly = JSON.parse(fs.readFileSync(`${reviewDir}/source-only-structured.candidate.json`, 'utf8'));
const alignment = JSON.parse(fs.readFileSync(`${reviewDir}/audio-alignment-realigned.candidate.json`, 'utf8'));
const written = fs.readdirSync(reviewDir).filter((name) => /^written-page-\d+\.review\.json$/.test(name)).sort()
  .flatMap((name) => JSON.parse(fs.readFileSync(`${reviewDir}/${name}`, 'utf8'))).sort((a, b) => a.questionNumber - b.questionNumber);
const listening = sourceOnly.questions.filter((question) => question.sectionId === 'listening');
const segmentByReview = new Map(alignment.segments.map((segment) => [segment.sourceReview, segment]));
assert.equal(written.length, 70);
assert.equal(listening.length, 37);
assert.equal(segmentByReview.size, 36);

const familyMap = {
  'kanji-reading': 'vocabulary', 'vocabulary-context': 'vocabulary', 'vocabulary-synonym': 'vocabulary',
  'vocabulary-usage': 'vocabulary', grammar: 'grammar', 'grammar-choice': 'grammar',
  'grammar-order': 'sentenceComposition', 'sentence-composition': 'sentenceComposition',
  'grammar-text': 'grammar', 'reading-comprehension': 'reading',
};
const supplementalPassages = {
  50: `不安は、正体がつかみきれないときほど膨らんでいく。長く引きずる。
人間だれでも、自分に都合の悪いこと、恐ろしいことは考えたくない。そういう心理が働くから、無意識のうちに問題をあいまいにして解決を保留にする。そうして結局、いつまでも不安をダラダラと抱え続けてしまう。
逆に自分の何がどのように不安なのか、不安に思う必要があるのかどうかを把握すれば、それだけで不安は減る。不安の正体が明確になって、これは何かしなくてはまずいと認識されれば、それは「危機感」になる。
危機感は不安と違う。危機感をもてば、行動を起こそうという意欲が湧く。さらに情報を集めて、行動計画をたてようとする。やるべきことが明確になる。だからスタートが切れるのだ。
問題は鍵となる不安は何なのかということだ。様々な不安の中から、それを特定して意識する。その不安に、思いきり光を当てて自分で正体を見極められれば、次にどうすればいいかの対策も講じられる。
（中略）
不安には、しばらく保留にしておいても大丈夫な不安もある。それがわかった瞬間、不安は、また少し減る。
こうして、自分が何をやらなければいけないかが見えてくる。やる気が出てくる。動く気になる。不安の解決策を考えながら、夢が膨らんでくることもある。
（佐々木直彦『「仕事も人生もうまくいく人」の考え方』による）`,
  53: `自分の泣いているときの表情や、笑ったときの表情をまともに見たことのある人は、まずない。
写真やビデオになれば、自然な笑いがおさめられることもあるかもしれないが、そこに映っているのは過去のそれであって、いま内側から生きている感情と重なり合うものではない。その点、鏡ならばそれを同時的に捉えられそうにもみえる。しかし、じっさいには自分が笑っているとき、その笑っている自分の顔を見たとたん、もはや笑いつづけられなくて、さっと笑いがさめてしまうものである。泣いているときも同じである。
（中略）
自分の表情を視覚的に捉えることには、そもそも無理がある。他方、他者の表情を内的に捉えることも、私たちが他者の身体を内側から生きることができない以上、不可能である。ならば他者の表情の理解はほんらい不可能なことだということになるはずだが、私たちは日頃から、表情の理解が不可能だとか、困難だとか、ほとんど思いもしない。現に私たちは他者のわずかな表情の変化にも敏感であるし、その表情の理解を土台にすることで人間関係の基本部分を成り立たせている。
表情は、ほぼ人類に共通であって、微妙な表情は別として、人種がちがっても、それを読み間違うことはまずない。含み笑いとか、苦笑い、あるいは愛想笑いとかいったものだと、同じく笑いでも文化差があって、読み間違うことがあるかもしれないが、典型的な表情に関してはまず間違わない。そうだとすれば類としての人間のなかに、表情を通して人どうしわかり合うメカニズムが、個の単位を越えて存在するものと考えねばならない。
（浜田寿美男『「私」とは何か』による）`,
  56: `多くの大人は、子供よりも先に生きているから、自分の方が人生を知っていると思っている。しかしこれはウソである。彼らが知っているのは「生活」であって、決して「人生」ではない。生活の仕方、いかに生活するかを知っているのを、人生を知っていることだと思っている。そして生活を教えることが、人生を教えることだと間違えているのである。
しかし、「生活」と「人生」とはどちらも「ライフ」だが、この両者は大違いである。「何のために」生活するのと問われたら、どう答えるだろう。こういう基本的なところで大間違いをしているから、小中学校で仕事体験をさせようといった愚にもつかない教育になる。
（中略）
生活の必要のない年齢には、生活に必要のないことを学ぶ必要があるのだ。それはこの年齢、このわずかな期間にのみ許された、きわめて貴重な時間なのだ。生活に必要のないことは、人生に必要なことだ。すなわち、人生とは何かを考えるための時間があるのは、この年代の特権なのである。
「人生とは何か」とは、そこにおいて生活が可能となるところの生存そのもの、これを問う問いである。「生きている」、すなわち「存在する」とは、どういうことなのか。
この問いの不思議に気がつけば、どの教科も、それを純粋に知ることの面白さがわかるはずだ。国語においては言葉、算数においては数と図形、理科においては物質と生命、社会においては人倫、どれもこの存在と宇宙の不思議を知ろうとするものだと知るはずだ。人間精神の普遍的な営みとして、自分と無縁なものはひとつもない。どれも自分の人生の役に立つ学びだと知るはずなのだ。
（池田晶子『人間自身――考えることに終わりなく』による）`,
  59: `以下は、ある芸術家が書いた文章である。
人間は動物とちがって、知的な活動、その情熱をもっている。おさなくたって、魂の衝動は強いのだ。だから子供は描きたがる。形、色にして確かめる。だが問題は自分のなかにあるものを外に突き出す、投げ出すという行為自体であって、決して出来上りの効果ではない。
だから子供は描きおわってしまったものはふり向きもしない。捨てられたって何とも思わないのだ。（中略）それを大事そうに拾いあげて、「これは面白い。」「坊やは才能がある。これをうまく伸ばせば、将来えらい画家になるかもしれない。」などと、観賞したり評価するのは、いつでも大人で、子供自身は、もしほめられても、そんなものかなと聞いているだけである。
だから「子供の絵」というような言い方の、根本に何か間違いがある、と私は思う。描いたものには違いないが、「作品」ではない。その以前の、もっと根源的な何ものかなのである。
「絵」などというから、大人の「絵画作品」と混同して考えてしまう。そこにズレがおこる。大人のは見せる芸であり、商品である。はじめから観賞すること、してもらうことを目的とし、結果を予測しながら作り上げたものなのだ。
いわゆる「絵描きさん」となると、描いている瞬間瞬間に、結果がわかっている。こうやれば、こうなる。習練と経験によって、色やタッチの効果が計算できるし、生命の衝動、情熱、無目的な行動よりも、結果の方に神経が働いてしまう。出来ばえに、逆にひきずり回されているのだ。
しかも、大向こうの気配まですでに見すかして、こんな趣向は喜ばれるだろう、これはちょっとやりすぎかな、などと意識・無意識に、そんな手応えにあわせながら仕事をすすめている。評判をとり、買手がついてくれなければ食ってゆけないし、社会が許さない。生活はきびしいのだ。無償の行為というわけにはいかない。明らかに「作品」つまり「商品」を作っているのである。
大人の作品だって、本質的には生命力こそ肝要なのだ。自分の存在を純粋に外に投げ出す、突き出すアクションの質、強さによって、猛烈な魅力になる。
私自身は、少なくともそのつもりである。よく、あなたの絵はわけがわからないと言われるが、「絵」でございます、というようなものは作りたくない。それ以前、そして以後のものをひたすらつきつける。――絵ではなく、芸術。そして出来るかぎり他の評価を無視したいと思っている。
（岡本太郎『美しく怒れ』による）`,
  63: `A
世界遺産への関心が高まるのは喜ばしい。各地で登録をめざす動きも活発化している。新聞をはじめとしたメディアがそれらを報じる機会も増えた。ただ、いつも気になるのは、そこに「地元では観光振興に結びつくのを期待している」といったたぐいの文言が、必ずと言ってよいほど目につくことだ。
私としては、観光・経済効果の拡大を否定はしないし、文化財保護との両立はできると考えている。しかし、近年の状況を眺めると、遺産の保護という基本理念が、あまりにも置き去りにされてしまってはいないだろうか。
（中村俊介『世界遺産が消えてゆく』による）

B
日本では映像や書籍など、さまざまなメディアで世界遺産を商品化し、パッケージ・ツアーが数多く組まれ、観光産業と深く結び付く。だが、それは本当に建築や自然を愛し、歴史への理解を深める人間を増やしているのだろうか。
（中略）
世界遺産であろうとなかろうと、建築の価値は個別に判断すればいい。人間も肩書きだけで、すべてを理解できないだろう。世界遺産に認定されたからといって、株のように、建築の価値が上昇するわけではない。むろん、観光資源として巨額の富をもたらすだろうが、モノとしては同じままである。私が気になるのは、世界遺産だけを特別視するあまり、逆にそれ以外のものはがんばって保存しなくてもいいという風潮を助長するのではないかということだ。
（五十嵐太郎『建築はいかに社会と回路をつなぐのか』による）`,
  65: `本というのは、人間と同じようなものだ。一律の価値によって優劣を決めることはできない。人気者がいるのと同じように、ベストセラーがある。嫌われ者がいるように、誰からも手に取られない本もある。だが、どれもがそれぞれの価値を持っている。それを求めている人の手に求めているときに渡れば、それは良書になる。
それゆえ、私はインターネットの書評サイトなどで、まるで自分を神であるかのように本の優劣を断定しているものには激しい抵抗を感じる。もちろん、書評をするのは悪いことではない。本を批判したりほめたりするのも、もちろん大事なことだ。だが、あくまでもそれは、その人の知識と関心と人柄によっての判断でしかない。つい神の立場でものを言いたくなる気持ちはわからないでもないが、それはあまりに傲慢というものだろう。
私の本も、インターネットの書評サイトでかなり叩かれているものがある。それはそれでやむをえないと思っている。ある程度売れると、それをけなしたがる人間がいるものだ。本をけなすと、自分が著者よりも偉くなったような気がするのだろう。私自身も本を書くようになる前、いや、正直に言うとある程度売れる本を出すようになる前、他人の本をずいぶんけなしたものだ。ただきわめて心外なのは、ないものねだりをしている評があまりに多いことだ。たとえば、私はある参考書を出している。その趣旨としていることは、「大学の小論文試験に何とか合格できるだけのレベルの小論文が書けるようにするため、最低限これだけの知識は持っていてほしい」という知識を整理した参考書だ。だから、私はその本の中では、敢えて難しいことは書いていない。ところが、その参考書を酷評する書評がある。そして、その評の中には「この本を読んでも、かろうじて合格するくらいの力しかつかない」と書かれている。
私は、まさしくかろうじて合格するくらいの力をつけるためにその本を書いているのだ。かろうじて合格すれば、その本は最高の良書だろう。私がそのような意味で敢えてカットしたことを取り上げて、それが書かれていないからと批判されても、こちらとしては困ってしまう。
そのような身勝手な書評がなんと多いことか。知識のある人間が入門書を幼稚すぎるとけなし、知識のない人間が専門書をわかりにくいとけなす。しかし、それは単に自分の背丈にあっていない本を求めただけのことに過ぎない。きちんと自分の背丈にあった本を探して買うのが、読者の務めだと、私は思う。
本について語るからには、あらゆる本に愛情を持つべきだと私は考えている。そうしてこそ、本を批判する資格を持つと思うのだ。
（樋口裕一『差がつく読書』による）`,
  69: `就職支援行事（9月―12月）のスケジュール
就職活動を行う学生のために、各種行事を実施しています。全行事、申し込みは不要です。当日、学生証を持参のうえ、会場へお越しください。
①9月19日（金）就職ガイダンス、②9月24日（水）留学生ガイダンス、③10月3日（金）就職活動体験談（広告・マスコミ）、④10月16日（水）就職ガイダンス、⑤10月23日（木）留学生ガイダンス、⑥11月7日（金）留学生マナー講座、⑦11月20日（木）就職活動体験談（金融・証券）、⑧12月1日（月）合同企業説明会、⑨12月12日（金）就職活動体験談（貿易・流通）、⑩12月17日（水）合同企業説明会。
就職希望者（留学生含む）は、「就職ガイダンス」のどちらかに必ず出席してください。「留学生ガイダンス」は希望者のみ出席してください。
合同企業説明会：12月1日17:15–18:15は広告・マスコミ、12月17日16:00–17:00は広告・マスコミ。各回約50社参加予定、途中入退場自由。`,
};
const passageStartFor = (number) => number >= 50 && number <= 52 ? 50 : number >= 53 && number <= 55 ? 53 : number >= 56 && number <= 58 ? 56 : number >= 59 && number <= 62 ? 59 : number >= 63 && number <= 64 ? 63 : number >= 65 && number <= 68 ? 65 : number >= 69 && number <= 70 ? 69 : undefined;
const passages = {};
const passageIds = new Map();
let grammarPassageId;
const writtenQuestions = written.map((question) => {
  let passageId;
  const passageStart = passageStartFor(question.questionNumber);
  const passageText = question.passageJa ?? (passageStart ? supplementalPassages[passageStart] : undefined);
  if (passageText) {
    passageId = passageIds.get(passageText);
    if (!passageId) {
      passageId = `n1-2014-12-passage-q${String(question.questionNumber).padStart(2, '0')}`;
      passageIds.set(passageText, passageId);
      passages[passageId] = { text: passageText };
    }
    if (question.questionNumber === 41) grammarPassageId = passageId;
  }
  if (question.questionNumber >= 42 && question.questionNumber <= 45) passageId = grammarPassageId;
  const family = familyMap[question.family];
  assert.ok(family, `Unknown family ${question.family}`);
  return {
    questionId: `n1-2014-12-written-q${String(question.questionNumber).padStart(2, '0')}`,
    sectionId: 'written', problemNumber: question.problemNumber, questionNumber: question.questionNumber,
    family, sourceFamily: question.family, instructionJa: question.instructionJa,
    promptJa: question.promptJa ?? question.wordJa, underlinedText: question.underlinedText,
    passageId, options: question.options.map((textJa, index) => ({ optionId: String(index + 1), textJa })),
    correctOptionId: question.correctOptionId, verificationStatus: 'verified_against_source_image',
    source: { questionPage: question.sourcePage, questionPages: question.sourcePages ?? [question.sourcePage], answerPage: 1 },
  };
});
const listeningQuestions = listening.map((question) => {
  const segment = segmentByReview.get(question.sourceReview);
  assert.ok(segment, question.sourceReview);
  return {
    ...question, family: 'listening',
    instructionJa: '音声を聞いて、最もよいものを一つ選びなさい。',
    verificationStatus: 'candidate_unverified',
    source: { questionPages: [12, 13, 14], answerScriptPages: question.transcriptSourcePages },
    audio: {
      segmentId: segment.segmentId, startMs: segment.startMs, endMs: segment.endMs,
      transcriptJa: question.transcriptJa, transcriptSourcePages: question.transcriptSourcePages,
      timingVerificationStatus: 'candidate_unverified',
      timingEvidence: 'Whisper word-timestamp realignment candidate; human perceptual review deferred.',
      sourceAudioSha256: alignment.audioSha256, candidateDate: '2026-09-21',
      humanReviewed: false, perceptualApproval: false, reviewDisposition: 'needs_later_review',
    },
  };
});
const questions = [...writtenQuestions, ...listeningQuestions];
assert.equal(questions.length, 107);
assert.equal(new Set(questions.map((question) => question.questionId)).size, 107);
assert.equal(new Set(listeningQuestions.map((question) => question.audio.segmentId)).size, 36);
const dataset = {
  schemaVersion: 1, examId: 'n1-2014-12-exam-06', status: 'candidate_complete',
  counts: { writtenResponses: 70, listeningResponses: 37, totalResponses: 107, uniqueAudioSegments: 36 },
  blockers: [], source: { audioSha256: alignment.audioSha256 },
  review: { audioTiming: 'Candidate/unverified; later perceptual review required.', explanations: 'Translations and explanations deferred.' },
  passages, questions,
};
const output = `${JSON.stringify(dataset, null, 2)}\n`;
const outputPath = 'src/data/jlpt-official/n1-2014-12/exam.candidate.json';
if (process.argv.includes('--check')) assert.equal(fs.readFileSync(outputPath, 'utf8'), output);
else { fs.mkdirSync('src/data/jlpt-official/n1-2014-12', { recursive: true }); fs.writeFileSync(outputPath, output); }
console.log('N1 2014-12 built: 70 written + 37 listening responses; 36 candidate audio segments.');
