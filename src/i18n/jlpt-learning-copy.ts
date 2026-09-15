import type { AppLanguageCode } from '@/i18n/languages';

const en = {
    basic: 'Basic sounds',
    voiced: 'Voiced sounds',
    combination: 'Combined sounds',
    kanaHelp: 'Each cell contains Japanese, Romaji and a pronunciation button.',
    patterns: 'patterns',
    autoLoad: 'loads automatically while scrolling',
    learned: 'Learned',
    mark: 'Mark',
    structure: 'Structure',
    formation: 'Formation',
    loading: 'Loading more…',
    vocabulary: 'vocabulary items',
    results: 'results',
    searchingAll: 'Searching all N5–N1 levels',
    searchPlaceholder: 'Search JLPT vocabulary by Japanese, reading or meaning…',
    learnedWord: 'Learned',
    markWord: 'Mark as learned',
} as const;

type Copy = {
    [Key in keyof typeof en]: string;
};

const vi: Copy = {
    basic: 'Âm cơ bản', voiced: 'Âm đục', combination: 'Âm ghép',
    kanaHelp: 'Mỗi ô gồm chữ Nhật, Romaji và nút nghe phát âm.',
    patterns: 'mẫu', autoLoad: 'tự động tải khi cuộn', learned: 'Đã học',
    mark: 'Đánh dấu', structure: 'Cấu trúc', formation: 'Cách tạo',
    loading: 'Đang tải thêm…', vocabulary: 'từ vựng', results: 'kết quả',
    searchingAll: 'Đang tìm trong toàn bộ N5–N1',
    searchPlaceholder: 'Tra từ JLPT theo tiếng Nhật, cách đọc hoặc nghĩa…',
    learnedWord: 'Đã thuộc', markWord: 'Đánh dấu đã học',
};

const ja: Copy = {
    basic: '清音', voiced: '濁音・半濁音', combination: '拗音',
    kanaHelp: '各マスには日本語、ローマ字、発音ボタンがあります。',
    patterns: '文型', autoLoad: 'スクロールで自動読込', learned: '学習済み',
    mark: 'チェック', structure: '構造', formation: '作り方', loading: '読込中…',
    vocabulary: '語', results: '件', searchingAll: 'N5～N1を検索中',
    searchPlaceholder: '日本語・読み方・意味でJLPT単語を検索…',
    learnedWord: '習得済み', markWord: '学習済みにする',
};

const id: Copy = { ...en, basic: 'Bunyi dasar', voiced: 'Bunyi bersuara', combination: 'Bunyi gabungan', learned: 'Dipelajari', mark: 'Tandai', structure: 'Struktur', formation: 'Pembentukan', results: 'hasil' };
const zhCN: Copy = { ...en, basic: '清音', voiced: '浊音和半浊音', combination: '拗音', learned: '已学习', mark: '标记', structure: '结构', formation: '构成', results: '条结果' };
const zhTW: Copy = { ...zhCN, voiced: '濁音和半濁音', learned: '已學習', mark: '標記', structure: '結構', formation: '構成', results: '筆結果' };
const hi: Copy = { ...en, basic: 'मूल ध्वनियाँ', voiced: 'सघोष ध्वनियाँ', combination: 'संयुक्त ध्वनियाँ', learned: 'सीखा हुआ', mark: 'चिह्नित करें', structure: 'संरचना', formation: 'निर्माण', results: 'परिणाम' };

export const jlptLearningCopy: Record<AppLanguageCode, Copy> = {
    ja, en, vi, id, 'zh-CN': zhCN, 'zh-TW': zhTW, hi,
    bn: ja, ne: ja, my: ja, th: ja, km: ja, tl: ja,
};
