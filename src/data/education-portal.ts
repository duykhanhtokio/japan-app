export type Student = { id: string; name: string; present: boolean; birth?: string; gender?: '男性' | '女性'; nationality?: string };
export type EducationClass = {
  id: string; name: string; level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'; online: boolean;
  lesson: string; material: string; teacher: string; time: string; remaining?: string; students: Student[];
};

const n5Students: Student[] = [
  { id: 's1', name: 'グエン・アン', present: true, birth: '2001年4月12日', gender: '男性', nationality: 'ベトナム' }, { id: 's2', name: 'チャン・リン', present: true, birth: '2002年8月3日', gender: '女性', nationality: 'ベトナム' },
  { id: 's3', name: 'レ・フン', present: true, birth: '1999年11月22日', gender: '男性', nationality: 'ベトナム' }, { id: 's4', name: 'ファム・ミン', present: false, birth: '2000年2月15日', gender: '男性', nationality: 'ベトナム' },
  { id: 's5', name: 'ホアン・ナム', present: true, birth: '2001年7月9日', gender: '男性', nationality: 'ベトナム' }, { id: 's6', name: 'ブイ・ラン', present: false, birth: '2003年1月28日', gender: '女性', nationality: 'ベトナム' },
];

export const EDUCATION_CLASSES: EducationClass[] = [
  { id: 'c1', name: 'N5 基礎クラス A', level: 'N5', online: true, lesson: '第14課　て形と依頼表現', material: 'N5・第14課 教師用スライド', teacher: '佐藤 美咲', time: '09:00〜10:30', remaining: '残り 00:42:18', students: n5Students },
  { id: 'c2', name: 'N4 生活日本語 B', level: 'N4', online: true, lesson: '第22課　連体修飾', material: 'N4・第22課 会話練習', teacher: '田中 健', time: '10:00〜11:30', remaining: '残り 01:08:04', students: [
    { id: 's7', name: 'ディアス', present: true }, { id: 's8', name: 'マリア', present: true }, { id: 's9', name: 'ジョン', present: true }, { id: 's10', name: 'アミナ', present: false },
  ]},
  { id: 'c3', name: 'N3 就労日本語', level: 'N3', online: false, lesson: '第8課　職場での報告', material: 'N3・聴解トレーニング 08', teacher: '山本 彩', time: '14:00〜15:30', students: [] },
  { id: 'c4', name: 'N2 試験対策', level: 'N2', online: false, lesson: '読解・統合理解 04', material: 'N2 読解問題集・第4回', teacher: '鈴木 誠', time: '18:30〜20:00', students: [] },
];

export const ALL_STUDENTS = [
  ...n5Students, { id: 's7', name: 'ディアス', present: true, birth: '1998年6月18日', gender: '男性', nationality: 'インドネシア' }, { id: 's8', name: 'マリア', present: true, birth: '2000年9月4日', gender: '女性', nationality: 'フィリピン' },
  { id: 's9', name: 'ジョン', present: true, birth: '1997年12月30日', gender: '男性', nationality: 'フィリピン' }, { id: 's10', name: 'アミナ', present: true, birth: '2002年5月21日', gender: '女性', nationality: 'インドネシア' },
  { id: 's11', name: 'ラフル', present: true, birth: '1999年3月17日', gender: '男性', nationality: 'インド' }, { id: 's12', name: 'プリヤ', present: true, birth: '2001年10月11日', gender: '女性', nationality: 'インド' },
];

export const CLASS_MATERIALS = [
  '教師用スライド', '学生用テキスト', '語彙カード', '文法ワークシート',
  '読解プリント', '聴解音声', '確認クイズ', '宿題', '生活日本語資料',
];

export const N5_LESSONS = Array.from({ length: 25 }, (_, index) => `第${index + 1}課`);
export const N5_MATERIAL_LIBRARY = [
  ...N5_LESSONS.flatMap((lesson) => [`N5 ${lesson}・教師用スライド`, `N5 ${lesson}・学生用ワーク`, `N5 ${lesson}・語彙カード`, `N5 ${lesson}・聴解音声`]),
  'N5 総復習クイズ', 'N5 模擬試験', '生活ガイド・病院', '生活ガイド・銀行', '生活ガイド・防災',
  '専門語彙・建設', '専門語彙・介護医療', '専門語彙・銀行金融', '専門語彙・製造組立', '専門語彙・食品製造', '専門語彙・農業',
];

type N5Unit = { title: string; vocabulary: string; grammar: string; reading: string; listening: string };
const N5_UNITS: N5Unit[] = [
  { title: '文字とあいさつ', vocabulary: 'ひらがな・基本あいさつ・教室表現', grammar: 'AはBです／か／も', reading: '名札・教室の表示', listening: '自己紹介とあいさつ' },
  { title: '人・国・仕事', vocabulary: '国籍・職業・家族・数字', grammar: 'これ／それ／あれ・この／その／あの', reading: '簡単なプロフィール', listening: '人を紹介する会話' },
  { title: '時間と毎日', vocabulary: '時刻・曜日・毎日の動作', grammar: 'Vます／ません／ました／ませんでした', reading: '一日の予定表', listening: '時間と予定を聞く' },
  { title: '移動と交通', vocabulary: '駅・電車・乗り物・場所', grammar: 'へ／に／で・行きます／来ます／帰ります', reading: '駅の案内・時刻表', listening: '行き方と乗り換え' },
  { title: '買い物', vocabulary: '商品・値段・色・大きさ・数え方', grammar: 'いくらですか・ください・助数詞', reading: '値札・レシート・広告', listening: '店員との買い物会話' },
  { title: '食事と好み', vocabulary: '食べ物・飲み物・味・店', grammar: '好き／嫌い・上手／下手・あります／います', reading: 'メニューと注文票', listening: '注文と好みを伝える' },
  { title: '形容詞と町', vocabulary: 'い形容詞・な形容詞・町の施設', grammar: '形容詞の現在・過去・否定', reading: '町の紹介文', listening: '場所の感想を聞く' },
  { title: 'て形と依頼', vocabulary: '動作・設備・生活用品', grammar: 'Vてください・Vてもいいです・Vてはいけません', reading: '注意書き・利用規則', listening: '依頼・許可・禁止' },
  { title: '生活と順序', vocabulary: '家事・身支度・一日の流れ', grammar: 'Vています・Vてから・VたりVたりします', reading: '生活手順と短い日記', listening: '生活習慣の説明' },
  { title: '経験と希望', vocabulary: '旅行・趣味・休日・季節', grammar: 'Vたいです・Vたことがあります', reading: '旅行案内と体験談', listening: '希望と経験を話す' },
  { title: '健康と緊急時', vocabulary: '体・症状・病院・薬・災害', grammar: 'ない形・なければなりません・ないでください', reading: '問診票・薬の説明', listening: '症状と緊急案内' },
  { title: '比較と数量', vocabulary: '数・量・期間・頻度・位置', grammar: 'より／ほうが／いちばん・ぐらい・だけ', reading: '比較表・料金表・簡単なグラフ', listening: '数と比較を聞き取る' },
  { title: '予定と約束', vocabulary: '予定・約束・連絡・天気', grammar: 'つもりです・予定です・でしょう', reading: 'カレンダー・連絡メッセージ', listening: '予定変更と約束' },
  { title: '職場の基本日本語', vocabulary: '作業・報告・確認・安全・担当', grammar: 'V方・V前に・V後で・もう／まだ', reading: '作業指示・安全掲示', listening: '指示・報告・確認' },
  { title: '生活手続き', vocabulary: '市役所・銀行・郵便・契約・書類', grammar: 'Nがほしいです・Vてもらいます・Vてくれます', reading: '申請書・案内文', listening: '窓口での質問と説明' },
  { title: '総復習とN5対策', vocabulary: 'N5重要語彙・漢字総復習', grammar: '助詞・活用・N5文法総復習', reading: '短文・掲示・情報検索', listening: '課題理解・即時応答' },
];

const DAY_FOCUS = [
  { label: '導入', task: '語彙導入・発音練習・基本文型' },
  { label: '定着', task: '文法練習・例文作成・ペア会話' },
  { label: '読解', task: '短文読解・漢字確認・内容質問' },
  { label: '聴解', task: '音声理解・会話練習・ロールプレイ' },
  { label: '評価', task: '週の復習・確認クイズ・個別課題' },
];

export const N5_SCHEDULE = N5_UNITS.flatMap((unit, weekIndex) => DAY_FOCUS.map((focus, dayIndex) => ({
  day: weekIndex * 5 + dayIndex + 1,
  week: weekIndex + 1,
  focus: focus.label,
  title: `${unit.title}・${focus.label}`,
  vocabulary: unit.vocabulary,
  grammar: unit.grammar,
  reading: unit.reading,
  listening: unit.listening,
  exercise: focus.task,
  materials: dayIndex === 4 ? ['週末確認クイズ', '採点基準', '個別復習課題'] : ['教師用スライド', '学生用ワーク', '音声・例文カード'],
})));

export const RELATED_MATERIALS = [
  { icon: '総', title: 'N5〜N1 総合教材', description: 'レベル別の授業・語彙・文法・読解・聴解' },
  { icon: '問', title: 'クイズ・模擬試験', description: '授業確認、週末テスト、JLPT形式問題' },
  { icon: '生', title: '生活ガイド', description: '行政、住居、病院、交通、防災、生活ルール' },
  { icon: '師', title: '教師用専門資料', description: '指導法、評価基準、授業運営、配慮事項' },
];

export const INDUSTRY_VOCABULARY = [
  { icon: '建', title: '建設', words: '足場・型枠・鉄筋・工具・安全指示' },
  { icon: '介', title: '介護・医療', words: '身体部位・症状・介助・服薬・記録' },
  { icon: '銀', title: '銀行・金融', words: '口座・振込・引落・本人確認・手数料' },
  { icon: '製', title: '製造・組立', words: '部品・工程・検品・不良・作業指示' },
  { icon: '食', title: '食品製造', words: '衛生・温度・異物・包装・清掃' },
  { icon: '農', title: '農業', words: '播種・収穫・選別・農薬・農機具' },
  { icon: '宿', title: '宿泊・外食', words: '接客・予約・注文・会計・清掃' },
  { icon: '運', title: '物流・運輸', words: '荷物・積込・配送・伝票・安全確認' },
];
