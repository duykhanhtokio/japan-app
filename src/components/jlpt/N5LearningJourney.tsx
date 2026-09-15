import { Text } from '@/components/app/LocalizedText';
import { useAppLanguage } from '@/context/LanguageContext';
import {
    generatedGrammar,
    generatedVocabulary,
    getGrammarExampleTranslation,
    getGrammarMeaning,
    getVocabularyExampleTranslation,
    getVocabularyMeaning,
    type GeneratedGrammar,
    type GeneratedVocabulary,
} from '@/data/jlpt-learning';
import curriculum from '@/game/data/n5/n5-curriculum-data';
import type { N5GrammarItem, N5StudyDay, N5VocabularyItem } from '@/game/data/n5/n5-curriculum-types';
import { getJlptProgress, saveN5JourneyPosition, toggleLearnedId } from '@/services/jlpt-progress-storage';
import * as Speech from 'expo-speech';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ImageBackground,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoyalPositioning } from '@/components/ui/RoyalPositioning';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

type JourneyMode = 'vocabulary' | 'grammar';

type Props = {
    mode: JourneyMode;
    onBack: () => void;
    onOpenCharacters: () => void;
};

type VocabEntry = {
    id: string;
    word: string;
    reading: string;
    meaning: string;
    exampleJa?: string;
    exampleReading?: string;
    exampleTranslation?: string;
};

type GrammarEntry = {
    id: string;
    name: string;
    reading?: string;
    meaning: string;
    pattern?: string;
    formation?: string;
    exampleJa?: string;
    exampleReading?: string;
    exampleTranslation?: string;
};

type JourneyEntry = VocabEntry | GrammarEntry;

type DayGroup = {
    day: number;
    week: number;
    title: string;
    vocabulary: VocabEntry[];
    grammar: GrammarEntry[];
};

const N5_VOCABULARY = generatedVocabulary.filter((item) => item.jlpt === 'N5' && item.status !== 'Rejected');
const N5_GRAMMAR = generatedGrammar.filter((item) => item.jlpt === 'N5' && item.status !== 'Rejected');

const COPY = {
    vi: {
        vocabulary: '語彙', grammar: '文法', route: 'Lịch trình N5',
        day: 'Ngày', week: 'Tuần', today: 'Nội dung sẽ học trong ngày',
        learned: 'Đã nhớ', unlearned: 'Chưa nhớ', allLearned: 'Đã hoàn thành ngày này',
        unlearnedBox: 'Kho chưa nhớ', open: 'Mở danh sách', close: 'Đóng',
        quiz: 'Game chó cắn', quizHint: 'Chọn đúng trước khi chú chó kịp phản ứng.',
        extraOneVocabulary: 'Vòng quay ôn nhanh', extraOneGrammar: 'Xếp câu đúng',
        extraTwoVocabulary: 'Thử thách nghe 3 phút', extraTwoGrammar: 'Điền mẫu hội thoại',
        supplementary: 'Ngân hàng N5 bổ sung', noItems: 'Ngày này không có nội dung mới.',
        correct: 'Đúng rồi! Cậu bé rụt chân kịp.', wrong: 'Chưa đúng! Hãy thử lại.',
        question: 'Chọn đáp án đúng', progress: 'Tiến trình', reviewByDay: 'Từ chưa nhớ theo ngày',
    },
    ja: {
        vocabulary: '語彙', grammar: '文法', route: 'N5 学習カレンダー',
        day: '日', week: '第', today: '今日学ぶ内容',
        learned: '覚えた', unlearned: '未習得', allLearned: 'この日の学習は完了しました',
        unlearnedBox: '未習得ボックス', open: '一覧を開く', close: '閉じる',
        quiz: '犬ゲーム', quizHint: '犬が反応する前に正解を選びましょう。',
        extraOneVocabulary: '復習ルーレット', extraOneGrammar: '文の並べ替え',
        extraTwoVocabulary: '3分リスニング', extraTwoGrammar: '会話穴埋め',
        supplementary: 'N5 追加語彙・文法', noItems: 'この日は新しい内容がありません。',
        correct: '正解！男の子は足を引っ込めました。', wrong: 'もう一度考えてみましょう。',
        question: '正しい答えを選んでください', progress: '進捗', reviewByDay: '日別の未習得項目',
    },
    en: {
        vocabulary: 'Vocabulary', grammar: 'Grammar', route: 'N5 Study Calendar',
        day: 'Day', week: 'Week', today: 'Today’s learning set',
        learned: 'Learned', unlearned: 'Not learned', allLearned: 'This day is complete',
        unlearnedBox: 'Review box', open: 'Open list', close: 'Close',
        quiz: 'Dog quiz', quizHint: 'Choose correctly before the dog reacts.',
        extraOneVocabulary: 'Review roulette', extraOneGrammar: 'Sentence builder',
        extraTwoVocabulary: '3-minute listening', extraTwoGrammar: 'Dialogue gap-fill',
        supplementary: 'Additional N5 bank', noItems: 'No new items today.',
        correct: 'Correct! The boy pulled his foot back.', wrong: 'Not yet. Try once more.',
        question: 'Choose the correct answer', progress: 'Progress', reviewByDay: 'Unlearned items by day',
    },
    id: {
        vocabulary: 'Kosakata', grammar: 'Tata bahasa', route: 'Kalender Belajar N5', day: 'Hari', week: 'Minggu', today: 'Materi hari ini', learned: 'Sudah hafal', unlearned: 'Belum hafal', allLearned: 'Hari ini selesai', unlearnedBox: 'Kotak pengulangan', open: 'Buka daftar', close: 'Tutup', quiz: 'Kuis anjing', quizHint: 'Pilih jawaban sebelum anjing bereaksi.', extraOneVocabulary: 'Roda pengulangan', extraOneGrammar: 'Susun kalimat', extraTwoVocabulary: 'Menyimak 3 menit', extraTwoGrammar: 'Lengkapi dialog', supplementary: 'Bank tambahan N5', noItems: 'Tidak ada materi baru hari ini.', correct: 'Benar! Anak itu menarik kakinya.', wrong: 'Belum benar. Coba lagi.', question: 'Pilih jawaban yang benar', progress: 'Kemajuan', reviewByDay: 'Materi belum hafal per hari',
    },
    'zh-CN': {
        vocabulary: '词汇', grammar: '语法', route: 'N5学习日历', day: '第', week: '周', today: '今天学习的内容', learned: '已掌握', unlearned: '未掌握', allLearned: '今天的内容已完成', unlearnedBox: '待复习箱', open: '打开列表', close: '关闭', quiz: '小狗问答', quizHint: '在小狗反应前选出正确答案。', extraOneVocabulary: '快速复习转盘', extraOneGrammar: '句子排序', extraTwoVocabulary: '3分钟听力', extraTwoGrammar: '会话填空', supplementary: 'N5补充题库', noItems: '今天没有新内容。', correct: '答对了！男孩及时收回了脚。', wrong: '还不对，再试一次。', question: '请选择正确答案', progress: '进度', reviewByDay: '按天整理的未掌握内容',
    },
    'zh-TW': {
        vocabulary: '詞彙', grammar: '文法', route: 'N5學習日曆', day: '第', week: '週', today: '今天學習的內容', learned: '已掌握', unlearned: '未掌握', allLearned: '今天的內容已完成', unlearnedBox: '待複習箱', open: '開啟清單', close: '關閉', quiz: '小狗問答', quizHint: '在小狗反應前選出正確答案。', extraOneVocabulary: '快速複習轉盤', extraOneGrammar: '句子排序', extraTwoVocabulary: '3分鐘聽力', extraTwoGrammar: '會話填空', supplementary: 'N5補充題庫', noItems: '今天沒有新內容。', correct: '答對了！男孩及時收回了腳。', wrong: '還不對，再試一次。', question: '請選擇正確答案', progress: '進度', reviewByDay: '按天整理的未掌握內容',
    },
    hi: {
        vocabulary: 'शब्दावली', grammar: 'व्याकरण', route: 'N5 अध्ययन कैलेंडर', day: 'दिन', week: 'सप्ताह', today: 'आज की अध्ययन सामग्री', learned: 'याद किया', unlearned: 'अभी याद नहीं', allLearned: 'आज का अध्ययन पूरा', unlearnedBox: 'पुनरावृत्ति बॉक्स', open: 'सूची खोलें', close: 'बंद करें', quiz: 'कुत्ता क्विज़', quizHint: 'कुत्ते की प्रतिक्रिया से पहले सही उत्तर चुनें।', extraOneVocabulary: 'त्वरित पुनरावृत्ति', extraOneGrammar: 'वाक्य क्रम', extraTwoVocabulary: '3 मिनट श्रवण', extraTwoGrammar: 'संवाद रिक्त स्थान', supplementary: 'अतिरिक्त N5 बैंक', noItems: 'आज कोई नई सामग्री नहीं है।', correct: 'सही! बच्चे ने समय पर पैर खींच लिया।', wrong: 'अभी सही नहीं। फिर कोशिश करें।', question: 'सही उत्तर चुनें', progress: 'प्रगति', reviewByDay: 'दिन के अनुसार भूली सामग्री',
    },
    bn: {
        vocabulary: 'শব্দভাণ্ডার', grammar: 'ব্যাকরণ', route: 'N5 অধ্যয়ন ক্যালেন্ডার', day: 'দিন', week: 'সপ্তাহ', today: 'আজকের শেখার বিষয়', learned: 'মনে আছে', unlearned: 'এখনও মনে নেই', allLearned: 'আজকের পড়া শেষ', unlearnedBox: 'পুনরাবৃত্তি বাক্স', open: 'তালিকা খুলুন', close: 'বন্ধ করুন', quiz: 'কুকুর কুইজ', quizHint: 'কুকুর প্রতিক্রিয়া করার আগে সঠিক উত্তর দিন।', extraOneVocabulary: 'দ্রুত পুনরাবৃত্তি', extraOneGrammar: 'বাক্য সাজানো', extraTwoVocabulary: '৩ মিনিট শোনা', extraTwoGrammar: 'কথোপকথনের শূন্যস্থান', supplementary: 'অতিরিক্ত N5 ব্যাংক', noItems: 'আজ নতুন বিষয় নেই।', correct: 'সঠিক! ছেলেটি সময়মতো পা সরিয়েছে।', wrong: 'এখনও ঠিক নয়। আবার চেষ্টা করুন।', question: 'সঠিক উত্তর বেছে নিন', progress: 'অগ্রগতি', reviewByDay: 'দিন অনুযায়ী না-শেখা বিষয়',
    },
    ne: {
        vocabulary: 'शब्दावली', grammar: 'व्याकरण', route: 'N5 अध्ययन पात्रो', day: 'दिन', week: 'हप्ता', today: 'आजको अध्ययन सामग्री', learned: 'सम्झिएको', unlearned: 'अझै नसम्झिएको', allLearned: 'आजको अध्ययन पूरा', unlearnedBox: 'पुनरावृत्ति बाकस', open: 'सूची खोल्नुहोस्', close: 'बन्द गर्नुहोस्', quiz: 'कुकुर क्विज', quizHint: 'कुकुरले प्रतिक्रिया दिनुअघि सही उत्तर छान्नुहोस्।', extraOneVocabulary: 'छिटो पुनरावृत्ति', extraOneGrammar: 'वाक्य मिलाउनुहोस्', extraTwoVocabulary: '३ मिनेट सुन्ने अभ्यास', extraTwoGrammar: 'संवाद खाली ठाउँ', supplementary: 'थप N5 बैंक', noItems: 'आज नयाँ सामग्री छैन।', correct: 'सही! बालकले समयमै खुट्टा तान्यो।', wrong: 'अझै सही भएन। फेरि प्रयास गर्नुहोस्।', question: 'सही उत्तर छान्नुहोस्', progress: 'प्रगति', reviewByDay: 'दिनअनुसार नसम्झिएका विषय',
    },
    my: {
        vocabulary: 'ဝေါဟာရ', grammar: 'သဒ္ဒါ', route: 'N5 လေ့လာရေးပြက္ခဒိန်', day: 'ရက်', week: 'အပတ်', today: 'ယနေ့လေ့လာမည့်အကြောင်းအရာ', learned: 'မှတ်မိပြီး', unlearned: 'မမှတ်မိသေး', allLearned: 'ယနေ့စာပြီးပါပြီ', unlearnedBox: 'ပြန်လေ့လာရန်', open: 'စာရင်းဖွင့်ရန်', close: 'ပိတ်ရန်', quiz: 'ခွေးမေးခွန်း', quizHint: 'ခွေးတုံ့ပြန်မီ အဖြေမှန်ကိုရွေးပါ။', extraOneVocabulary: 'အမြန်ပြန်လည်လေ့လာ', extraOneGrammar: 'ဝါကျစီခြင်း', extraTwoVocabulary: '၃ မိနစ်နားထောင်', extraTwoGrammar: 'စကားပြောကွက်လပ်', supplementary: 'N5 အပိုဘဏ်', noItems: 'ယနေ့အကြောင်းအရာအသစ်မရှိပါ။', correct: 'မှန်ပါတယ်! ကလေးက ခြေထောက်ကို အချိန်မီပြန်ဆွဲလိုက်တယ်။', wrong: 'မမှန်သေးပါ။ ထပ်ကြိုးစားပါ။', question: 'အဖြေမှန်ကိုရွေးပါ', progress: 'တိုးတက်မှု', reviewByDay: 'နေ့အလိုက်မမှတ်မိသေးသောအကြောင်းအရာ',
    },
    th: {
        vocabulary: 'คำศัพท์', grammar: 'ไวยากรณ์', route: 'ปฏิทินการเรียน N5', day: 'วันที่', week: 'สัปดาห์', today: 'เนื้อหาที่เรียนวันนี้', learned: 'จำได้แล้ว', unlearned: 'ยังจำไม่ได้', allLearned: 'เรียนวันนี้ครบแล้ว', unlearnedBox: 'กล่องทบทวน', open: 'เปิดรายการ', close: 'ปิด', quiz: 'ควิซสุนัข', quizHint: 'เลือกคำตอบให้ถูกก่อนสุนัขจะตอบสนอง', extraOneVocabulary: 'วงล้อทบทวน', extraOneGrammar: 'เรียงประโยค', extraTwoVocabulary: 'ฟัง 3 นาที', extraTwoGrammar: 'เติมบทสนทนา', supplementary: 'คลัง N5 เพิ่มเติม', noItems: 'วันนี้ไม่มีเนื้อหาใหม่', correct: 'ถูกต้อง! เด็กดึงเท้ากลับทันเวลา', wrong: 'ยังไม่ถูก ลองอีกครั้ง', question: 'เลือกคำตอบที่ถูกต้อง', progress: 'ความคืบหน้า', reviewByDay: 'เนื้อหาที่ยังจำไม่ได้แยกตามวัน',
    },
    km: {
        vocabulary: 'វាក្យសព្ទ', grammar: 'វេយ្យាករណ៍', route: 'ប្រតិទិនសិក្សា N5', day: 'ថ្ងៃ', week: 'សប្ដាហ៍', today: 'មេរៀនសម្រាប់ថ្ងៃនេះ', learned: 'ចងចាំហើយ', unlearned: 'មិនទាន់ចងចាំ', allLearned: 'បានបញ្ចប់មេរៀនថ្ងៃនេះ', unlearnedBox: 'ប្រអប់រំលឹក', open: 'បើកបញ្ជី', close: 'បិទ', quiz: 'សំណួរឆ្កែ', quizHint: 'ជ្រើសចម្លើយត្រឹមត្រូវមុនឆ្កែឆ្លើយតប។', extraOneVocabulary: 'រំលឹករហ័ស', extraOneGrammar: 'រៀបប្រយោគ', extraTwoVocabulary: 'ស្តាប់ ៣ នាទី', extraTwoGrammar: 'បំពេញសន្ទនា', supplementary: 'ឃ្លាំង N5 បន្ថែម', noItems: 'ថ្ងៃនេះគ្មានមេរៀនថ្មីទេ។', correct: 'ត្រឹមត្រូវ! ក្មេងប្រុសដកជើងទាន់ពេល។', wrong: 'មិនទាន់ត្រឹមត្រូវទេ។ សាកម្តងទៀត។', question: 'ជ្រើសចម្លើយត្រឹមត្រូវ', progress: 'វឌ្ឍនភាព', reviewByDay: 'មេរៀនមិនទាន់ចាំតាមថ្ងៃ',
    },
    tl: {
        vocabulary: 'Talasalitaan', grammar: 'Gramatika', route: 'Kalendaryo ng Pag-aaral N5', day: 'Araw', week: 'Linggo', today: 'Aralin ngayong araw', learned: 'Kabisado na', unlearned: 'Hindi pa kabisado', allLearned: 'Tapos na ang aralin ngayon', unlearnedBox: 'Kahon ng pagrepaso', open: 'Buksan ang listahan', close: 'Isara', quiz: 'Dog quiz', quizHint: 'Piliin ang tamang sagot bago kumilos ang aso.', extraOneVocabulary: 'Mabilis na pagrepaso', extraOneGrammar: 'Ayusin ang pangungusap', extraTwoVocabulary: '3 minutong pakikinig', extraTwoGrammar: 'Punan ang usapan', supplementary: 'Karagdagang N5 bank', noItems: 'Walang bagong aralin ngayon.', correct: 'Tama! Naibalik ng bata ang paa niya.', wrong: 'Hindi pa tama. Subukan muli.', question: 'Piliin ang tamang sagot', progress: 'Progreso', reviewByDay: 'Hindi pa kabisado ayon sa araw',
    },
} as const;

function copyFor(language: string) {
    return COPY[language as keyof typeof COPY] ?? COPY.ja;
}

function normalize(value: string | undefined) {
    return (value ?? '').replace(/[\s・~～〜]/g, '').toLocaleLowerCase();
}

function matchesGrammar(item: GeneratedGrammar, planned: N5GrammarItem) {
    const pattern = normalize(planned.pattern);
    return normalize(item.name) === pattern
        || normalize(item.pattern) === pattern
        || normalize(item.name).includes(pattern)
        || pattern.includes(normalize(item.name));
}

export default function N5LearningJourney({ mode, onBack, onOpenCharacters }: Props) {
    const { language } = useAppLanguage();
    const copy = copyFor(language);
    const { width } = useRoyalPositioning();
    const compact = width < 720;
    const scrollRef = useRef<ScrollView>(null);
    const [learnedIds, setLearnedIds] = useState<string[]>([]);
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selectedDay, setSelectedDay] = useState(1);
    const [reviewOpen, setReviewOpen] = useState(false);

    useEffect(() => {
        void getJlptProgress().then((progress) => {
            setLearnedIds(progress.learnedIds);
            setSelectedWeek(progress.n5JourneyPosition?.week ?? 1);
            setSelectedDay(progress.n5JourneyPosition?.day ?? 1);
        });
    }, []);

    const groups = useMemo<DayGroup[]>(() => {
        const usedVocabulary = new Set<string>();
        const usedGrammar = new Set<string>();
        const vocabularyByWord = indexBy(N5_VOCABULARY, (item) => normalize(item.word));
        const vocabularyByReading = indexBy(N5_VOCABULARY, (item) => normalize(item.reading));
        const grammarByName = indexBy(N5_GRAMMAR, (item) => normalize(item.name));
        const grammarByPattern = indexBy(N5_GRAMMAR, (item) => normalize(item.pattern));

        function firstUnused<T extends { id: string }>(candidates: T[] | undefined, used: Set<string>) {
            return candidates?.find((item) => !used.has(item.id));
        }

        function findVocabulary(entry: N5VocabularyItem) {
            return firstUnused(vocabularyByWord.get(normalize(entry.japanese)), usedVocabulary)
                ?? firstUnused(vocabularyByReading.get(normalize(entry.reading)), usedVocabulary);
        }

        function findGrammar(entry: N5GrammarItem) {
            const key = normalize(entry.pattern);
            return firstUnused(grammarByName.get(key), usedGrammar)
                ?? firstUnused(grammarByPattern.get(key), usedGrammar)
                ?? N5_GRAMMAR.find((item) => !usedGrammar.has(item.id) && matchesGrammar(item, entry));
        }

        const planned: DayGroup[] = curriculum.days.map((day: N5StudyDay) => {
            const vocabulary = day.vocabulary.map((entry, index) => {
                const source = findVocabulary(entry);
                if (source) usedVocabulary.add(source.id);
                return source
                    ? toVocabulary(source)
                    : {
                        id: `n5-plan:vocabulary:${day.day}:${index}`,
                        word: entry.japanese,
                        reading: entry.reading,
                        meaning: language === 'vi' ? (entry.reviewMeaningVi ?? entry.japanese) : entry.japanese,
                    };
            });
            const grammar = day.grammar.map((entry, index) => {
                const source = findGrammar(entry);
                if (source) usedGrammar.add(source.id);
                return source
                    ? toGrammar(source)
                    : {
                        id: `n5-plan:grammar:${day.day}:${index}`,
                        name: entry.pattern,
                        meaning: language === 'vi' ? (entry.reviewExplanationVi ?? entry.pattern) : entry.pattern,
                        pattern: entry.pattern,
                        exampleJa: entry.example.japanese,
                        exampleReading: entry.example.reading,
                        exampleTranslation: language === 'vi' ? entry.example.reviewTranslationVi : undefined,
                    };
            });
            return { day: day.day, week: day.week, title: day.title, vocabulary, grammar };
        });

        return planned;

        function toVocabulary(item: GeneratedVocabulary): VocabEntry {
            return {
                id: item.id,
                word: item.word,
                reading: item.reading,
                meaning: getVocabularyMeaning(item, language),
                exampleJa: item.exampleJa,
                exampleReading: item.exampleReading,
                exampleTranslation: getVocabularyExampleTranslation(item, language),
            };
        }

        function toGrammar(item: GeneratedGrammar): GrammarEntry {
            return {
                id: item.id,
                name: item.name,
                reading: item.reading,
                meaning: getGrammarMeaning(item, language),
                pattern: item.pattern,
                formation: item.formation,
                exampleJa: item.exampleJa,
                exampleReading: item.exampleReading,
                exampleTranslation: getGrammarExampleTranslation(item, language),
            };
        }

        function indexBy<T>(items: T[], keyFor: (item: T) => string) {
            const index = new Map<string, T[]>();
            items.forEach((item) => {
                const key = keyFor(item);
                if (!key) return;
                const bucket = index.get(key);
                if (bucket) bucket.push(item);
                else index.set(key, [item]);
            });
            return index;
        }
    }, [language]);

    const visibleGroups = useMemo(
        () => groups.filter((group) => (mode === 'vocabulary' ? group.vocabulary.length : group.grammar.length)),
        [groups, mode],
    );
    const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds]);
    const selectedGroup = groups.find((group) => group.day === selectedDay);
    const currentGroup = selectedGroup ?? visibleGroups[0];
    const currentItems: JourneyEntry[] = currentGroup
        ? (mode === 'vocabulary' ? currentGroup.vocabulary : currentGroup.grammar)
        : [];
    const allItems: JourneyEntry[] = visibleGroups.flatMap(
        (group) => (mode === 'vocabulary' ? group.vocabulary : group.grammar) as JourneyEntry[],
    );
    const unlearned = allItems.filter((item) => !learnedSet.has(item.id));
    const weekDays = groups.filter((group) => group.week === selectedWeek && group.day !== 0);
    const weeks = curriculum.weeks.map((week) => week.week);

    async function toggle(id: string) {
        const next = await toggleLearnedId(id);
        setLearnedIds(next.learnedIds);
    }

    function selectDay(day: number) {
        const group = groups.find((item) => item.day === day);
        const items = group ? (mode === 'vocabulary' ? group.vocabulary : group.grammar) : [];
        if (group?.week === 1 && items.length === 0) {
            onOpenCharacters();
            return;
        }
        setSelectedDay(day);
        if (group) void saveN5JourneyPosition(group.week, group.day);
        requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 520, animated: true }));
    }

    function speakCurrent() {
        const first = currentItems.find((item) => !learnedSet.has(item.id)) ?? currentItems[0];
        if (!first) return;
        const text = 'word' in first ? first.word : (first.exampleJa ?? first.name);
        Speech.stop();
        Speech.speak(text, { language: 'ja-JP', rate: 0.68 });
    }

    return <ImageBackground source={require('../../../assets/app/learn/learn-bg.jpg')} style={styles.background} resizeMode="cover">
        <View pointerEvents="none" style={styles.overlay}/>
        <SafeAreaView style={styles.safe}>
            <ScrollView ref={scrollRef} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <RoyalBackButton onPress={onBack} />
                    <View style={styles.headerCopy}><Text style={styles.level}>JLPT N5</Text><Text style={styles.title}>{mode === 'vocabulary' ? copy.vocabulary : copy.grammar}</Text><Text style={styles.subtitle}>{copy.route}</Text></View>
                    <View style={styles.totalProgress}><Text style={styles.totalProgressLabel}>{copy.progress}</Text><Text style={styles.totalProgressValue}>{allItems.length - unlearned.length}/{allItems.length}</Text></View>
                </View>

                <View style={[styles.dashboard, compact && styles.dashboardCompact]}>
                    <View style={[styles.calendar, compact && styles.fullWidth]}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekRow}>
                            {weeks.map((week) => <Pressable key={week} onPress={() => { const first = groups.find((group) => group.week === week); setSelectedWeek(week); if (first) { setSelectedDay(first.day); void saveN5JourneyPosition(week, first.day); } }} style={[styles.weekChip, selectedWeek === week && styles.weekChipActive]}>
                                <Text style={[styles.weekText, selectedWeek === week && styles.whiteText]}>{copy.week} {week}</Text>
                            </Pressable>)}
                        </ScrollView>
                        <View style={styles.dayGrid}>
                            {weekDays.map((group) => {
                                const items = mode === 'vocabulary' ? group.vocabulary : group.grammar;
                                const done = items.filter((item) => learnedSet.has(item.id)).length;
                                return <Pressable key={group.day} onPress={() => selectDay(group.day)} style={[styles.dayCell, selectedDay === group.day && styles.dayCellActive]}>
                                    <View style={styles.dayCellTop}><Text style={[styles.dayNumber, selectedDay === group.day && styles.whiteText]}>{copy.day} {group.day}</Text>{done === items.length && items.length > 0 && <Text style={styles.doneTick}>✓</Text>}</View>
                                    <Text numberOfLines={2} style={[styles.dayTitle, selectedDay === group.day && styles.whiteText]}>{group.title}</Text>
                                    <Text style={[styles.dayProgress, selectedDay === group.day && styles.whiteMuted]}>{done}/{items.length}</Text>
                                </Pressable>;
                            })}
                        </View>
                    </View>

                    <View style={[styles.sideRail, compact && styles.fullWidth]}>
                        <Pressable style={[styles.sideCard, styles.reviewCard]} onPress={() => setReviewOpen(true)}>
                            <Text style={styles.sideIcon}>📥</Text><Text style={styles.sideTitle}>{copy.unlearnedBox}</Text><Text style={styles.sideValue}>{unlearned.length}</Text><Text style={styles.sideHint}>{copy.open}</Text>
                        </Pressable>
                        <Pressable style={[styles.sideCard, styles.extraCard]} onPress={() => unlearned[0] && selectDay(visibleGroups.find((group) => (mode === 'vocabulary' ? group.vocabulary : group.grammar).some((item) => item.id === unlearned[0].id))?.day ?? selectedDay)}>
                            <Text style={styles.sideIcon}>🎡</Text><Text style={styles.sideTitle}>{mode === 'vocabulary' ? copy.extraOneVocabulary : copy.extraOneGrammar}</Text>
                        </Pressable>
                        <Pressable style={[styles.sideCard, styles.listenCard]} onPress={speakCurrent}>
                            <Text style={styles.sideIcon}>🎧</Text><Text style={styles.sideTitle}>{mode === 'vocabulary' ? copy.extraTwoVocabulary : copy.extraTwoGrammar}</Text>
                        </Pressable>
                    </View>
                </View>

                {currentGroup && <View style={styles.todayBanner}>
                    <Text style={styles.todayLabel}>{copy.today}</Text><Text style={styles.todayTitle}>{copy.day} {currentGroup.day} · {currentGroup.title}</Text>
                    <Text style={styles.todayItems} numberOfLines={3}>{currentItems.map((item) => 'word' in item ? item.word : item.name).join('　')}</Text>
                </View>}

                {currentGroup && (() => {
                    const items = currentItems;
                    return <View style={styles.daySection}>
                        <View style={styles.sectionHeading}><View><Text style={styles.sectionDay}>{copy.day} {currentGroup.day}</Text><Text style={styles.sectionName}>{currentGroup.title}</Text></View><Text style={styles.sectionCount}>{items.filter((item) => learnedSet.has(item.id)).length}/{items.length}</Text></View>
                        {!items.length && currentGroup.week === 1 && <Pressable onPress={onOpenCharacters} style={styles.kanaRouteCard}><Text style={styles.kanaRouteIcon}>🔤</Text><View style={styles.kanaRouteCopy}><Text style={styles.kanaRouteTitle}>文字の基礎へ</Text><Text style={styles.kanaRouteText}>第1週はひらがな・カタカナを学習します。文字学習画面で進めてください。</Text></View><Text style={styles.kanaRouteArrow}>›</Text></Pressable>}
                        {!items.length && currentGroup.week !== 1 && <Text style={styles.noItems}>{copy.noItems}</Text>}
                        {mode === 'vocabulary'
                            ? (items as VocabEntry[]).map((item) => <VocabularyCard key={item.id} item={item} learned={learnedSet.has(item.id)} onToggle={() => void toggle(item.id)}/>)
                            : (items as GrammarEntry[]).map((item) => <GrammarCard key={item.id} item={item} learned={learnedSet.has(item.id)} onToggle={() => void toggle(item.id)}/>)}
                    </View>;
                })()}
            </ScrollView>
        </SafeAreaView>

        {reviewOpen && <Modal visible animationType="slide" transparent onRequestClose={() => setReviewOpen(false)}>
            <View style={styles.modalShade}><View style={styles.modalSheet}>
                <View style={styles.modalHeader}><View><Text style={styles.modalTitle}>{copy.reviewByDay}</Text><Text style={styles.modalSubtitle}>{unlearned.length} {copy.unlearned}</Text></View><Pressable onPress={() => setReviewOpen(false)} style={styles.closeButton}><Text style={styles.closeText}>×</Text></Pressable></View>
                <ScrollView contentContainerStyle={styles.modalContent}>{weekDays.map((group) => {
                    const items = (mode === 'vocabulary' ? group.vocabulary : group.grammar).filter((item) => !learnedSet.has(item.id));
                    if (!items.length) return null;
                    return <View key={group.day} style={styles.reviewGroup}><Text style={styles.reviewDay}>{copy.day} {group.day} · {group.title}</Text>{items.map((item) => <Pressable key={item.id} onPress={() => void toggle(item.id)} style={styles.reviewItem}><Text style={styles.reviewWord}>{'word' in item ? item.word : item.name}</Text><Text style={styles.reviewMeaning} numberOfLines={2}>{item.meaning}</Text><Text style={styles.emptyCheck}>○</Text></Pressable>)}</View>;
                })}</ScrollView>
            </View></View>
        </Modal>}

    </ImageBackground>;
}

function VocabularyCard({ item, learned, onToggle }: { item: VocabEntry; learned: boolean; onToggle: () => void }) {
    return <View style={[styles.itemCard, learned && styles.itemCardLearned]}>
        <View style={styles.itemTop}><View style={styles.itemHeading}><Text style={styles.word}>{item.word}</Text><Text style={styles.reading}>{item.reading}</Text></View><Pressable onPress={onToggle} style={[styles.checkButton, learned && styles.checkButtonActive]}><Text style={[styles.checkText, learned && styles.whiteText]}>{learned ? '✓' : '○'}</Text></Pressable></View>
        <Text style={styles.meaning}>{item.meaning}</Text>
        {item.exampleJa && <View style={styles.example}><Text style={styles.exampleReading}>{item.exampleReading}</Text><Text style={styles.exampleJa}>{item.exampleJa}</Text>{item.exampleTranslation && <Text style={styles.exampleTranslation}>{item.exampleTranslation}</Text>}</View>}
    </View>;
}

function GrammarCard({ item, learned, onToggle }: { item: GrammarEntry; learned: boolean; onToggle: () => void }) {
    return <View style={[styles.itemCard, learned && styles.itemCardLearned]}>
        <View style={styles.itemTop}><View style={styles.itemHeading}><Text style={styles.grammarName}>{item.name}</Text>{item.reading && <Text style={styles.reading}>{item.reading}</Text>}</View><Pressable onPress={onToggle} style={[styles.checkButton, learned && styles.checkButtonActive]}><Text style={[styles.checkText, learned && styles.whiteText]}>{learned ? '✓' : '○'}</Text></Pressable></View>
        <Text style={styles.meaning}>{item.meaning}</Text>{item.pattern && <Text style={styles.detail}>構造: {item.pattern}</Text>}{item.formation && <Text style={styles.detail}>接続: {item.formation}</Text>}
        {item.exampleJa && <View style={styles.example}><Text style={styles.exampleReading}>{item.exampleReading}</Text><Text style={styles.exampleJa}>{item.exampleJa}</Text>{item.exampleTranslation && <Text style={styles.exampleTranslation}>{item.exampleTranslation}</Text>}</View>}
    </View>;
}

const styles = StyleSheet.create({
    background: { flex: 1 }, overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(238,244,255,.46)' }, safe: { flex: 1 }, content: { padding: 16, paddingBottom: 70 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(232,226,214,.94)', borderRadius: 22, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#dbe4f0' },
    back: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#e9effa', alignItems: 'center', justifyContent: 'center' }, backText: { fontSize: 30, color: '#315cb5', lineHeight: 32 }, headerCopy: { flex: 1 }, level: { color: '#4771c9', fontSize: 11, fontWeight: '900', letterSpacing: 1 }, title: { fontSize: 27, fontWeight: '900', color: '#1c2b42' }, subtitle: { color: '#69788d', fontSize: 11 }, totalProgress: { minWidth: 78, backgroundColor: '#244f9f', borderRadius: 13, padding: 10, alignItems: 'center' }, totalProgressLabel: { color: '#dce8ff', fontSize: 9 }, totalProgressValue: { color: '#fff', fontWeight: '900', fontSize: 16, marginTop: 2 },
    dashboard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 }, dashboardCompact: { flexDirection: 'column' }, calendar: { flex: 3, backgroundColor: 'rgba(232,226,214,.95)', borderRadius: 20, padding: 13, borderWidth: 1, borderColor: '#dce5f0' }, fullWidth: { width: '100%', flex: 0 },
    weekRow: { gap: 7, paddingBottom: 11 }, weekChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#edf1f7' }, weekChipActive: { backgroundColor: '#315fbd' }, weekText: { color: '#41506a', fontSize: 11, fontWeight: '800' }, whiteText: { color: '#fff' }, whiteMuted: { color: '#dfe9ff' },
    dayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 }, dayCell: { width: '31.8%', minWidth: 100, minHeight: 88, borderRadius: 13, padding: 10, backgroundColor: '#f4f7fb', borderWidth: 1, borderColor: '#e0e7ef' }, dayCellActive: { backgroundColor: '#4976d6', borderColor: '#4976d6' }, dayCellTop: { flexDirection: 'row', justifyContent: 'space-between' }, dayNumber: { color: '#47649c', fontSize: 9, fontWeight: '900' }, doneTick: { color: '#39d98a', fontWeight: '900' }, dayTitle: { color: '#263750', fontWeight: '800', fontSize: 10, lineHeight: 14, marginTop: 7 }, dayProgress: { color: '#78869a', fontSize: 9, marginTop: 5 },
    sideRail: { flex: 1, gap: 8 }, sideCard: { borderRadius: 16, padding: 11, borderWidth: 1, minHeight: 82 }, reviewCard: { backgroundColor: '#fff7df', borderColor: '#f0d991' }, dogCard: { backgroundColor: '#fff0e9', borderColor: '#efc4b0' }, extraCard: { backgroundColor: '#f2edff', borderColor: '#d9caf6' }, listenCard: { backgroundColor: '#e9f7f5', borderColor: '#bce3dc' }, sideIcon: { fontSize: 20 }, sideTitle: { fontSize: 11, fontWeight: '900', color: '#273750', marginTop: 3 }, sideValue: { fontSize: 22, fontWeight: '900', color: '#ae7600' }, sideHint: { color: '#6d7888', fontSize: 9, lineHeight: 13, marginTop: 3 },
    todayBanner: { backgroundColor: 'rgba(34,67,126,.94)', borderRadius: 18, padding: 14, marginTop: 13 }, todayLabel: { color: '#bed0f4', fontSize: 10, fontWeight: '900' }, todayTitle: { color: '#fff', fontSize: 17, fontWeight: '900', marginTop: 3 }, todayItems: { color: '#e3ebfa', lineHeight: 21, marginTop: 7, fontSize: 12 },
    daySection: { marginTop: 16 }, sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 9, paddingHorizontal: 3 }, sectionDay: { color: '#4269ba', fontSize: 10, fontWeight: '900' }, sectionName: { color: '#203149', fontSize: 17, fontWeight: '900', marginTop: 2 }, sectionCount: { color: '#60718a', fontWeight: '800' },
    kanaRouteCard: { minHeight: 96, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, padding: 15, backgroundColor: 'rgba(232,226,214,.96)', borderWidth: 1, borderColor: '#cbdcf7' }, kanaRouteIcon: { fontSize: 32 }, kanaRouteCopy: { flex: 1 }, kanaRouteTitle: { color: '#315ca9', fontSize: 17, fontWeight: '900' }, kanaRouteText: { color: '#63738a', fontSize: 12, lineHeight: 18, marginTop: 4 }, kanaRouteArrow: { color: '#5279bd', fontSize: 30, fontWeight: '700' }, noItems: { backgroundColor: 'rgba(232,226,214,.92)', borderRadius: 15, padding: 18, color: '#6d7b8f', textAlign: 'center' },
    itemCard: { backgroundColor: 'rgba(232,226,214,.96)', borderRadius: 17, padding: 15, marginBottom: 9, borderWidth: 1, borderColor: '#dfe6ef' }, itemCardLearned: { backgroundColor: 'rgba(237,250,242,.97)', borderColor: '#acd8be' }, itemTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 }, itemHeading: { flex: 1 }, word: { fontSize: 24, fontWeight: '900', color: '#1e304b' }, grammarName: { fontSize: 20, fontWeight: '900', color: '#6741a5' }, reading: { color: '#5270a2', fontSize: 13, marginTop: 2 }, checkButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#eef2f7', alignItems: 'center', justifyContent: 'center' }, checkButtonActive: { backgroundColor: '#2d9b61' }, checkText: { color: '#6f7d90', fontWeight: '900', fontSize: 20 }, meaning: { color: '#34445b', fontSize: 15, lineHeight: 22, marginTop: 9 }, detail: { color: '#5f6f84', fontSize: 12, lineHeight: 18, marginTop: 6 }, example: { backgroundColor: '#f4f7fb', borderRadius: 12, padding: 11, marginTop: 10 }, exampleReading: { color: '#5875a4', fontSize: 12, lineHeight: 18 }, exampleJa: { color: '#22334d', fontSize: 16, fontWeight: '700', lineHeight: 23, marginTop: 2 }, exampleTranslation: { color: '#66758a', lineHeight: 20, marginTop: 5 },
    modalShade: { flex: 1, backgroundColor: 'rgba(12,21,38,.58)', justifyContent: 'flex-end' }, modalSheet: { height: '82%', backgroundColor: '#f5f7fb', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingTop: 16 }, modalHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 17, paddingBottom: 12 }, modalTitle: { fontSize: 21, fontWeight: '900', color: '#20314a' }, modalSubtitle: { color: '#728095', marginTop: 3 }, closeButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#e6eaf0', alignItems: 'center', justifyContent: 'center' }, closeText: { fontSize: 25, color: '#46566e', lineHeight: 27 }, modalContent: { padding: 15, paddingBottom: 50 }, reviewGroup: { marginBottom: 16 }, reviewDay: { fontWeight: '900', color: '#385fae', marginBottom: 7 }, reviewItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#e8e2d6', borderRadius: 13, padding: 11, marginBottom: 6 }, reviewWord: { width: 100, fontSize: 16, fontWeight: '900', color: '#24344d' }, reviewMeaning: { flex: 1, color: '#68768a', fontSize: 12 }, emptyCheck: { color: '#8592a5', fontSize: 20 },
    quizSheet: { backgroundColor: '#e8e2d6', borderTopLeftRadius: 27, borderTopRightRadius: 27, padding: 20, paddingBottom: 35 }, quizClose: { alignSelf: 'flex-end' }, dogScene: { fontSize: 48, textAlign: 'center', marginVertical: 8 }, quizTitle: { textAlign: 'center', color: '#273951', fontWeight: '900', fontSize: 17 }, quizPrompt: { textAlign: 'center', color: '#5e6d80', marginTop: 8, fontSize: 15 }, quizOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }, quizOption: { width: '48.5%', minHeight: 48, borderRadius: 13, backgroundColor: '#edf2fb', alignItems: 'center', justifyContent: 'center', padding: 9 }, quizOptionText: { color: '#294c8c', fontWeight: '900', fontSize: 16 }, quizFeedback: { textAlign: 'center', fontWeight: '900', marginTop: 14 }, correct: { color: '#218653' }, wrong: { color: '#cc5a3c' },
});
