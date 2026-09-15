import type {
    AppLanguageCode,
} from '@/i18n/languages';

export type RegistrationWorkCopy = {
    step: string;

    title: string;

    subtitle: string;

    category: string;

    occupation: string;

    operation: string;

    selectCategory: string;

    selectOccupation: string;

    selectOperation: string;

    selectedJob: string;

    complete: string;

    required: string;

    officialNameNotice: string;

    occupationCount: string;

    operationCount: string;

    notStage3Eligible: string;

    back: string;
};

const en: RegistrationWorkCopy = {
    step:
        'STEP 2 / 2',

    title:
        'Work Information',

    subtitle:
        'Lessons are automatically tailored to your real work. Choose your current job accurately to receive the best possible support.',

    category:
        'Industry',

    occupation:
        'Occupation',

    operation:
        'Specific work',

    selectCategory:
        'Select an industry',

    selectOccupation:
        'Select an occupation',

    selectOperation:
        'Select your specific work',

    selectedJob:
        'Selected work',

    complete:
        'Complete registration',

    required:
        'Please select the industry, occupation, and specific work.',

    officialNameNotice:
        'The official Japanese job name is also shown for reference. Your selected language is displayed first.',

    occupationCount:
        'occupations',

    operationCount:
        'work types',

    notStage3Eligible:
        'Not eligible for Technical Intern Training (iii)',

    back:
        'Back',
};

const copies:
    Partial<
        Record<
            AppLanguageCode,
            RegistrationWorkCopy
        >
    > = {
    ja: {
        step:
            'STEP 2 / 2',

        title:
            '仕事内容',

        subtitle:
            '実際の仕事内容に合わせて学習内容を自動で最適化します。最適なサポートのため、現在の仕事を正確に選んでください。',

        category:
            '業種',

        occupation:
            '職種',

        operation:
            '作業',

        selectCategory:
            '業種を選択',

        selectOccupation:
            '職種を選択',

        selectOperation:
            '作業を選択',

        selectedJob:
            '選択した仕事',

        complete:
            '登録を完了する',

        required:
            '業種・職種・作業をすべて選択してください。',

        officialNameNotice:
            '正式な日本語の職種・作業名も確認用として表示します。',

        occupationCount:
            '職種',

        operationCount:
            '作業',

        notStage3Eligible:
            '技能実習3号対象外',

        back:
            '戻る',
    },

    vi: {
        step:
            'BƯỚC 2 / 2',

        title:
            'Thông tin công việc',

        subtitle:
            'Hệ thống sẽ tự động cá nhân hóa nội dung theo công việc thực tế của bạn. Vì vậy, hãy chọn chính xác công việc bạn đang làm để nhận được sự hỗ trợ tối ưu nhất.',

        category:
            'Nhóm ngành',

        occupation:
            'Nghề',

        operation:
            'Công việc cụ thể',

        selectCategory:
            'Chọn nhóm ngành',

        selectOccupation:
            'Chọn nghề',

        selectOperation:
            'Chọn công việc cụ thể',

        selectedJob:
            'Công việc đã chọn',

        complete:
            'Hoàn thành đăng ký',

        required:
            'Vui lòng chọn đầy đủ nhóm ngành, nghề và công việc cụ thể.',

        officialNameNotice:
            'Tên chính thức bằng tiếng Nhật được hiển thị nhỏ bên dưới để đối chiếu. Ngôn ngữ bạn chọn sẽ được hiển thị trước.',

        occupationCount:
            'nghề',

        operationCount:
            'công việc',

        notStage3Eligible:
            'Không thuộc đối tượng chuyển sang 技能実習3号',

        back:
            'Quay lại',
    },

    id: {
        step:
            'LANGKAH 2 / 2',

        title:
            'Informasi Pekerjaan',

        subtitle:
            'Pilih jenis pekerjaan yang paling sesuai dengan pekerjaan yang akan Anda lakukan di Jepang.',

        category:
            'Bidang industri',

        occupation:
            'Jenis pekerjaan',

        operation:
            'Pekerjaan khusus',

        selectCategory:
            'Pilih bidang industri',

        selectOccupation:
            'Pilih jenis pekerjaan',

        selectOperation:
            'Pilih pekerjaan khusus',

        selectedJob:
            'Pekerjaan yang dipilih',

        complete:
            'Selesaikan pendaftaran',

        required:
            'Pilih bidang industri, jenis pekerjaan, dan pekerjaan khusus.',

        officialNameNotice:
            'Nama resmi dalam bahasa Jepang juga ditampilkan sebagai referensi. Bahasa pilihan Anda ditampilkan terlebih dahulu.',

        occupationCount:
            'jenis pekerjaan',

        operationCount:
            'jenis tugas',

        notStage3Eligible:
            'Tidak memenuhi syarat untuk pelatihan teknis tahap III',

        back:
            'Kembali',
    },

    'zh-CN': {
        step:
            '第 2 / 2 步',

        title:
            '工作信息',

        subtitle:
            '请选择与您计划在日本从事的工作最接近的工种和具体作业。',

        category:
            '行业',

        occupation:
            '工种',

        operation:
            '具体作业',

        selectCategory:
            '选择行业',

        selectOccupation:
            '选择工种',

        selectOperation:
            '选择具体作业',

        selectedJob:
            '已选择的工作',

        complete:
            '完成注册',

        required:
            '请选择行业、工种和具体作业。',

        officialNameNotice:
            '正式日文名称会同时显示以便核对，您选择的语言优先显示。',

        occupationCount:
            '个工种',

        operationCount:
            '个作业',

        notStage3Eligible:
            '不属于技能实习3号对象',

        back:
            '返回',
    },

    'zh-TW': {
        step:
            '第 2 / 2 步',

        title:
            '工作資訊',

        subtitle:
            '請選擇與您預計在日本從事的工作最接近的職種及具體作業。',

        category:
            '產業',

        occupation:
            '職種',

        operation:
            '具體作業',

        selectCategory:
            '選擇產業',

        selectOccupation:
            '選擇職種',

        selectOperation:
            '選擇具體作業',

        selectedJob:
            '已選擇的工作',

        complete:
            '完成註冊',

        required:
            '請選擇產業、職種及具體作業。',

        officialNameNotice:
            '正式日文名稱亦會顯示供核對，您選擇的語言會優先顯示。',

        occupationCount:
            '個職種',

        operationCount:
            '個作業',

        notStage3Eligible:
            '不屬於技能實習3號對象',

        back:
            '返回',
    },

    hi: {
        step:
            'चरण 2 / 2',

        title:
            'कार्य की जानकारी',

        subtitle:
            'जापान में किए जाने वाले अपने काम से सबसे निकट संबंधित उद्योग, व्यवसाय और विशिष्ट कार्य चुनें।',

        category:
            'उद्योग',

        occupation:
            'व्यवसाय',

        operation:
            'विशिष्ट कार्य',

        selectCategory:
            'उद्योग चुनें',

        selectOccupation:
            'व्यवसाय चुनें',

        selectOperation:
            'विशिष्ट कार्य चुनें',

        selectedJob:
            'चुना गया कार्य',

        complete:
            'पंजीकरण पूरा करें',

        required:
            'कृपया उद्योग, व्यवसाय और विशिष्ट कार्य चुनें।',

        officialNameNotice:
            'संदर्भ के लिए आधिकारिक जापानी नाम भी दिखाया जाएगा। चुनी गई भाषा पहले दिखाई जाएगी।',

        occupationCount:
            'व्यवसाय',

        operationCount:
            'कार्य',

        notStage3Eligible:
            'तकनीकी प्रशिक्षण चरण III के लिए पात्र नहीं',

        back:
            'वापस',
    },
};

export function getRegistrationWorkCopy(
    language:
        AppLanguageCode
): RegistrationWorkCopy {
    return (
        copies[
        language
        ] ??
        en
    );
}
