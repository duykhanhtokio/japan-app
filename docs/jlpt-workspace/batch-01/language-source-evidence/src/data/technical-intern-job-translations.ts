import type {
    AppLanguageCode,
} from '@/i18n/languages';

export type JobTranslationDictionary =
    Record<
        string,
        string
    >;

export type JobTranslationPack =
    Partial<
        Record<
            AppLanguageCode,
            JobTranslationDictionary
        >
    >;

/*
 * KEY phải là official code/id.
 *
 * Ví dụ:
 *
 * 3-7      = 鉄筋施工
 * 3-7-1    = 鉄筋組立て
 *
 * Không dùng tên Nhật làm key vì tên có thể
 * thay cách ghi trong dữ liệu sau này.
 */

export const technicalInternJobTranslations:
    JobTranslationPack = {
    /*
     * ==========================
     * VIETNAMESE
     * ==========================
     */

    vi: {
        /*
         * GROUPS
         */

        AGRICULTURE_FORESTRY:
            'Nông nghiệp và lâm nghiệp',

        FISHERY:
            'Ngư nghiệp',

        CONSTRUCTION:
            'Xây dựng',

        FOOD_MANUFACTURING:
            'Sản xuất thực phẩm',

        TEXTILES:
            'Dệt may và quần áo',

        MACHINERY_METAL:
            'Cơ khí và kim loại',

        OTHER:
            'Các ngành khác',

        INTERNAL_CERTIFICATION:
            'Nhóm đánh giá nội bộ',

        /*
         * SAMPLE OFFICIAL JOBS
         *
         * Toàn bộ dataset nên dùng code chính thức.
         */

        '1-1':
            'Nông nghiệp trồng trọt',

        '1-1-1':
            'Trồng trọt trong nhà kính',

        '1-1-2':
            'Trồng cây ngoài đồng và rau',

        '1-1-3':
            'Trồng cây ăn quả',

        '1-2':
            'Chăn nuôi',

        '1-2-1':
            'Chăn nuôi lợn',

        '1-2-2':
            'Chăn nuôi gà',

        '1-2-3':
            'Chăn nuôi bò sữa',

        '1-3':
            'Lâm nghiệp',

        '1-3-1':
            'Nuôi trồng rừng và khai thác gỗ',

        '3-5':
            'Mộc xây dựng',

        '3-5-1':
            'Công việc mộc xây dựng',

        '3-6':
            'Thi công cốp pha',

        '3-6-1':
            'Công việc cốp pha',

        '3-7':
            'Thi công cốt thép',

        '3-7-1':
            'Lắp ráp cốt thép',

        '3-8':
            'Giàn giáo và công việc trên cao',

        '3-8-1':
            'Công việc giàn giáo',

        '3-12':
            'Trát vữa',

        '3-12-1':
            'Công việc trát vữa',

        '3-13':
            'Đường ống',

        '3-13-1':
            'Đường ống công trình',

        '3-13-2':
            'Đường ống nhà máy',
    },

    /*
     * ==========================
     * INDONESIAN
     * ==========================
     */

    id: {
        AGRICULTURE_FORESTRY:
            'Pertanian dan kehutanan',

        FISHERY:
            'Perikanan',

        CONSTRUCTION:
            'Konstruksi',

        FOOD_MANUFACTURING:
            'Pengolahan makanan',

        TEXTILES:
            'Tekstil dan pakaian',

        MACHINERY_METAL:
            'Mesin dan logam',

        OTHER:
            'Bidang lainnya',

        INTERNAL_CERTIFICATION:
            'Kategori sertifikasi internal',

        '1-1':
            'Pertanian tanaman',

        '1-1-1':
            'Hortikultura fasilitas',

        '1-1-2':
            'Tanaman ladang dan sayuran',

        '1-1-3':
            'Budidaya buah',

        '1-2':
            'Peternakan',

        '1-2-1':
            'Peternakan babi',

        '1-2-2':
            'Peternakan ayam',

        '1-2-3':
            'Peternakan sapi perah',

        '1-3':
            'Kehutanan',

        '1-3-1':
            'Pemeliharaan hutan dan produksi kayu',

        '3-5':
            'Pertukangan bangunan',

        '3-5-1':
            'Pekerjaan pertukangan bangunan',

        '3-6':
            'Pemasangan bekisting',

        '3-6-1':
            'Pekerjaan bekisting',

        '3-7':
            'Pekerjaan tulangan baja',

        '3-7-1':
            'Perakitan tulangan baja',

        '3-8':
            'Perancah',

        '3-8-1':
            'Pekerjaan perancah',

        '3-12':
            'Plesteran',

        '3-12-1':
            'Pekerjaan plesteran',

        '3-13':
            'Perpipaan',

        '3-13-1':
            'Perpipaan bangunan',

        '3-13-2':
            'Perpipaan pabrik',
    },

    /*
     * ==========================
     * SIMPLIFIED CHINESE
     * ==========================
     */

    'zh-CN': {
        AGRICULTURE_FORESTRY:
            '农业・林业',

        FISHERY:
            '渔业',

        CONSTRUCTION:
            '建筑',

        FOOD_MANUFACTURING:
            '食品制造',

        TEXTILES:
            '纺织・服装',

        MACHINERY_METAL:
            '机械・金属',

        OTHER:
            '其他',

        INTERNAL_CERTIFICATION:
            '企业内部认证类',

        '1-1':
            '种植农业',

        '1-1-1':
            '设施园艺',

        '1-1-2':
            '旱田作物・蔬菜',

        '1-1-3':
            '果树栽培',

        '1-2':
            '畜牧业',

        '1-2-1':
            '养猪',

        '1-2-2':
            '养鸡',

        '1-2-3':
            '奶牛养殖',

        '1-3':
            '林业',

        '1-3-1':
            '育林・木材生产',

        '3-5':
            '建筑木工',

        '3-5-1':
            '木工施工',

        '3-6':
            '模板施工',

        '3-6-1':
            '模板工程',

        '3-7':
            '钢筋施工',

        '3-7-1':
            '钢筋组装',

        '3-8':
            '脚手架作业',

        '3-8-1':
            '脚手架作业',

        '3-12':
            '抹灰',

        '3-12-1':
            '抹灰作业',

        '3-13':
            '管道施工',

        '3-13-1':
            '建筑管道施工',

        '3-13-2':
            '工厂管道施工',
    },

    /*
     * ==========================
     * TRADITIONAL CHINESE
     * ==========================
     */

    'zh-TW': {
        AGRICULTURE_FORESTRY:
            '農業・林業',

        FISHERY:
            '漁業',

        CONSTRUCTION:
            '建築',

        FOOD_MANUFACTURING:
            '食品製造',

        TEXTILES:
            '紡織・服裝',

        MACHINERY_METAL:
            '機械・金屬',

        OTHER:
            '其他',

        INTERNAL_CERTIFICATION:
            '企業內部認證類',

        '1-1':
            '種植農業',

        '1-1-1':
            '設施園藝',

        '1-1-2':
            '旱田作物・蔬菜',

        '1-1-3':
            '果樹栽培',

        '1-2':
            '畜牧業',

        '1-2-1':
            '養豬',

        '1-2-2':
            '養雞',

        '1-2-3':
            '乳牛飼養',

        '1-3':
            '林業',

        '1-3-1':
            '育林・木材生產',

        '3-5':
            '建築木工',

        '3-5-1':
            '木工作業',

        '3-6':
            '模板施工',

        '3-6-1':
            '模板工程',

        '3-7':
            '鋼筋施工',

        '3-7-1':
            '鋼筋組裝',

        '3-8':
            '鷹架作業',

        '3-8-1':
            '鷹架作業',
    },

    /*
     * ==========================
     * HINDI
     * ==========================
     */

    hi: {
        AGRICULTURE_FORESTRY:
            'कृषि और वानिकी',

        FISHERY:
            'मत्स्य पालन',

        CONSTRUCTION:
            'निर्माण',

        FOOD_MANUFACTURING:
            'खाद्य निर्माण',

        TEXTILES:
            'वस्त्र और परिधान',

        MACHINERY_METAL:
            'मशीनरी और धातु',

        OTHER:
            'अन्य',

        INTERNAL_CERTIFICATION:
            'आंतरिक प्रमाणन श्रेणी',

        '1-1':
            'फसल कृषि',

        '1-1-1':
            'संरक्षित बागवानी',

        '1-1-2':
            'खेत की फसलें और सब्ज़ियाँ',

        '1-1-3':
            'फल उत्पादन',

        '1-2':
            'पशुपालन',

        '1-2-1':
            'सूअर पालन',

        '1-2-2':
            'मुर्गी पालन',

        '1-2-3':
            'डेयरी पशुपालन',

        '1-3':
            'वानिकी',

        '1-3-1':
            'वन संवर्धन और लकड़ी उत्पादन',

        '3-5':
            'भवन बढ़ईगीरी',

        '3-5-1':
            'बढ़ईगीरी कार्य',

        '3-6':
            'फॉर्मवर्क निर्माण',

        '3-6-1':
            'फॉर्मवर्क कार्य',

        '3-7':
            'रीबार निर्माण',

        '3-7-1':
            'रीबार असेंबली',

        '3-8':
            'मचान कार्य',

        '3-8-1':
            'मचान कार्य',
    },
};