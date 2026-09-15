import type { JlptLevel } from '@/data/jlpt-learning';
import type { JlptMockQuestion } from '@/data/jlpt-mock/types';

type Template={prefix:string;chunks:[string,string,string,string];suffix:string};
const templates:Record<JlptLevel,readonly Template[]>={
 N5:[
  {prefix:'わたしは',chunks:['友だち','と','映画を見','に'],suffix:'行きます。'},
  {prefix:'これは',chunks:['きのう','母が','買った','本'],suffix:'です。'},
  {prefix:'日曜日は',chunks:['本を','読んだり','音楽を','聞いたり'],suffix:'します。'},
  {prefix:'駅まで',chunks:['どのぐらい','時間が','かかり','ます'],suffix:'か。'},
  {prefix:'この料理は',chunks:['とても','食べ','やすくて','おいしい'],suffix:'です。'},
 ],
 N4:[
  {prefix:'日本へ',chunks:['来る','前に','日本語を','勉強しました'],suffix:'。'},
  {prefix:'雨が',chunks:['降って','いる','かもしれ','ません'],suffix:'。'},
  {prefix:'先生は',chunks:['学生に','本を','読ませ','ました'],suffix:'。'},
  {prefix:'この店は',chunks:['駅から','近い','だけでなく','安い'],suffix:'です。'},
  {prefix:'宿題を',chunks:['して','からでないと','遊びに','行けません'],suffix:'。'},
 ],
 N3:[
  {prefix:'この仕事は',chunks:['経験が','なくても','応募する','ことができます'],suffix:'。'},
  {prefix:'会議は',chunks:['予定していた','時間より','早く','終わりました'],suffix:'。'},
  {prefix:'彼は',chunks:['何も','言わずに','部屋を','出ていきました'],suffix:'。'},
  {prefix:'日本語を',chunks:['勉強すれば','するほど','面白く','なります'],suffix:'。'},
  {prefix:'この薬は',chunks:['食事の','あとで','飲む','ことになっています'],suffix:'。'},
 ],
 N2:[
  {prefix:'計画は',chunks:['変更せざるを','得ない','状況に','なりました'],suffix:'。'},
  {prefix:'彼の説明は',chunks:['分かりやすい','上に','具体的で','説得力がある'],suffix:'。'},
  {prefix:'この制度は',chunks:['利用者の','増加に','伴って','改善されました'],suffix:'。'},
  {prefix:'結果が',chunks:['どうであれ','最後まで','努力する','つもりです'],suffix:'。'},
  {prefix:'その発言は',chunks:['誤解を','招き','かねない','表現でした'],suffix:'。'},
 ],
 N1:[
  {prefix:'この問題は',chunks:['専門家で','さえ','判断に','迷う'],suffix:'ほど複雑だ。'},
  {prefix:'彼の功績は',chunks:['長年の','努力の','積み重ねに','ほかならない'],suffix:'。'},
  {prefix:'状況を',chunks:['改善すべく','新たな','対策が','講じられた'],suffix:'。'},
  {prefix:'その提案は',chunks:['現実性に','欠けると','言わざるを','得ない'],suffix:'。'},
  {prefix:'技術の進歩は',chunks:['私たちの','想像を','はるかに','超えている'],suffix:'。'},
 ],
};
const starPositions=[1,2,0,2,1] as const;

export function replaceSentenceComposition(examQuestions:readonly JlptMockQuestion[],level:JlptLevel){
 let compositionIndex=0;
 return examQuestions.map(question=>{
  if(question.family!=='sentenceComposition')return question;
  const template=templates[level][compositionIndex%templates[level].length],starPosition=starPositions[compositionIndex%starPositions.length];compositionIndex++;
  const slots=template.chunks.map((_,index)=>index===starPosition?'★':'＿＿＿').join('　');
  const correctChunk=template.chunks[starPosition];
  return{...question,prompt:`次の文を正しく組み立てるとき、★に入るものを一つ選びなさい。\n${template.prefix}　${slots}　${template.suffix}`,options:template.chunks.map((text,index)=>({id:`chunk-${index}`,text})),correctOptionId:`chunk-${starPosition}`,explanation:`正しい文：${template.prefix}${template.chunks.join('')}${template.suffix}\n★の位置には「${correctChunk}」が入ります。`};
 });
}
