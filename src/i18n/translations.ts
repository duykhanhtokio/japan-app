import type {
    AppLanguageCode,
} from '@/i18n/languages';

export type TranslationKey =
    | 'common.home'
    | 'common.game'
    | 'common.tasks'
    | 'common.profile'
    | 'common.settings'
    | 'common.back'
    | 'common.language'
    | 'common.save'

    | 'home.learningMode'
    | 'home.selectLearning'
    | 'home.writing'
    | 'home.writingDescription'
    | 'home.speaking'
    | 'home.speakingDescription'
    | 'home.skills'
    | 'home.skillsDescription'
    | 'home.start'

    | 'settings.title'
    | 'settings.language'
    | 'settings.languageDescription'
    | 'settings.saved';

type TranslationTable =
    Record<
        TranslationKey,
        string
    >;

const ja: TranslationTable = {
    'common.home':
        'ホーム',

    'common.game':
        'ゲーム',

    'common.tasks':
        'ミッション',

    'common.profile':
        'プロフィール',

    'common.settings':
        '設定',

    'common.back':
        '戻る',

    'common.language':
        '言語',

    'common.save':
        '保存',

    'home.learningMode':
        '学習モード',

    'home.selectLearning':
        '学習内容を選んでください',

    'home.writing':
        '筆記学習',

    'home.writingDescription':
        '単語・文法・漢字・読解を学ぶ',

    'home.speaking':
        '会話練習',

    'home.speakingDescription':
        '日本全国で生活会話を練習する',

    'home.skills':
        '特定技能学習',

    'home.skillsDescription':
        '仕事で必要な日本語と技能を学ぶ',

    'home.start':
        '始める',

    'settings.title':
        '設定',

    'settings.language':
        '言語設定',

    'settings.languageDescription':
        'アプリで使用する言語を変更します。',

    'settings.saved':
        '言語設定を保存しました。',
};

const vi: TranslationTable = {
    ...ja,

    'common.home':
        'Trang chủ',

    'common.game':
        'Trò chơi',

    'common.tasks':
        'Nhiệm vụ',

    'common.profile':
        'Hồ sơ',

    'common.settings':
        'Cài đặt',

    'common.back':
        'Quay lại',

    'common.language':
        'Ngôn ngữ',

    'common.save':
        'Lưu',

    'home.learningMode':
        'Chế độ học',

    'home.selectLearning':
        'Chọn nội dung bạn muốn học',

    'home.writing':
        'Học viết',

    'home.writingDescription':
        'Từ vựng, ngữ pháp, Kanji và đọc hiểu',

    'home.speaking':
        'Luyện hội thoại',

    'home.speakingDescription':
        'Luyện hội thoại đời sống trên khắp Nhật Bản',

    'home.skills':
        'Học kỹ năng đặc định',

    'home.skillsDescription':
        'Tiếng Nhật và kỹ năng cần thiết cho công việc',

    'home.start':
        'Bắt đầu',

    'settings.title':
        'Cài đặt',

    'settings.language':
        'Ngôn ngữ',

    'settings.languageDescription':
        'Thay đổi ngôn ngữ sử dụng trong ứng dụng.',

    'settings.saved':
        'Đã lưu cài đặt ngôn ngữ.',
};

const en: TranslationTable = {
    ...ja,

    'common.home':
        'Home',

    'common.game':
        'Game',

    'common.tasks':
        'Missions',

    'common.profile':
        'Profile',

    'common.settings':
        'Settings',

    'common.back':
        'Back',

    'common.language':
        'Language',

    'common.save':
        'Save',

    'home.learningMode':
        'Learning Mode',

    'home.selectLearning':
        'Choose what you want to study',

    'home.writing':
        'Writing Study',

    'home.writingDescription':
        'Vocabulary, grammar, Kanji and reading',

    'home.speaking':
        'Conversation Practice',

    'home.speakingDescription':
        'Practice everyday conversations across Japan',

    'home.skills':
        'Specified Skills',

    'home.skillsDescription':
        'Learn workplace Japanese and job skills',

    'home.start':
        'Start',

    'settings.title':
        'Settings',

    'settings.language':
        'Language',

    'settings.languageDescription':
        'Change the language used in the app.',

    'settings.saved':
        'Language setting saved.',
};

const id: TranslationTable = {
    ...en,

    'common.home': 'Beranda',
    'common.game': 'Permainan',
    'common.tasks': 'Misi',
    'common.profile': 'Profil',
    'common.settings': 'Pengaturan',
    'common.back': 'Kembali',
    'common.language': 'Bahasa',
    'common.save': 'Simpan',

    'home.learningMode':
        'Mode Belajar',

    'home.selectLearning':
        'Pilih materi yang ingin dipelajari',

    'home.writing':
        'Belajar Tertulis',

    'home.writingDescription':
        'Kosakata, tata bahasa, Kanji, dan membaca',

    'home.speaking':
        'Latihan Percakapan',

    'home.speakingDescription':
        'Latihan percakapan sehari-hari di seluruh Jepang',

    'home.skills':
        'Keterampilan Khusus',

    'home.skillsDescription':
        'Bahasa Jepang dan keterampilan untuk pekerjaan',

    'home.start':
        'Mulai',

    'settings.title':
        'Pengaturan',

    'settings.language':
        'Bahasa',

    'settings.languageDescription':
        'Ubah bahasa yang digunakan dalam aplikasi.',

    'settings.saved':
        'Pengaturan bahasa disimpan.',
};

const zhCN: TranslationTable = {
    ...en,

    'common.home': '首页',
    'common.game': '游戏',
    'common.tasks': '任务',
    'common.profile': '个人资料',
    'common.settings': '设置',
    'common.back': '返回',
    'common.language': '语言',
    'common.save': '保存',

    'home.learningMode':
        '学习模式',

    'home.selectLearning':
        '请选择学习内容',

    'home.writing':
        '笔记学习',

    'home.writingDescription':
        '词汇、语法、汉字和阅读',

    'home.speaking':
        '会话练习',

    'home.speakingDescription':
        '练习日本生活中的实际会话',

    'home.skills':
        '特定技能学习',

    'home.skillsDescription':
        '学习工作所需的日语和技能',

    'home.start':
        '开始',

    'settings.title':
        '设置',

    'settings.language':
        '语言设置',

    'settings.languageDescription':
        '更改应用程序使用的语言。',

    'settings.saved':
        '语言设置已保存。',
};

const hi: TranslationTable = {
    ...en,

    'common.home': 'होम',
    'common.game': 'गेम',
    'common.tasks': 'मिशन',
    'common.profile': 'प्रोफ़ाइल',
    'common.settings': 'सेटिंग्स',
    'common.back': 'वापस',
    'common.language': 'भाषा',
    'common.save': 'सहेजें',

    'home.learningMode':
        'अध्ययन मोड',

    'home.selectLearning':
        'आप क्या पढ़ना चाहते हैं चुनें',

    'home.writing':
        'लिखित अध्ययन',

    'home.writingDescription':
        'शब्दावली, व्याकरण, कांजी और पढ़ना',

    'home.speaking':
        'बातचीत अभ्यास',

    'home.speakingDescription':
        'जापान में दैनिक बातचीत का अभ्यास',

    'home.skills':
        'निर्दिष्ट कौशल अध्ययन',

    'home.skillsDescription':
        'काम के लिए जापानी और आवश्यक कौशल',

    'home.start':
        'शुरू करें',

    'settings.title':
        'सेटिंग्स',

    'settings.language':
        'भाषा',

    'settings.languageDescription':
        'ऐप में उपयोग की जाने वाली भाषा बदलें।',

    'settings.saved':
        'भाषा सेटिंग सहेजी गई।',
};

/*
 * Những ngôn ngữ chưa dịch đầy đủ
 * tạm fallback English.
 *
 * Sau này chỉ cần thêm TranslationTable
 * tương ứng, không cần sửa UI.
 */

export const translations:
    Record<
        AppLanguageCode,
        TranslationTable
    > = {
    ja,

    en,

    vi,

    id,

    'zh-CN':
        zhCN,

    'zh-TW':
        zhCN,

    hi,

    bn: en,

    ne: en,

    my: en,

    th: en,

    km: en,

    tl: en,
};