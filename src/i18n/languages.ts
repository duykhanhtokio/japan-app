export type AppLanguageCode =
    | 'ja'
    | 'en'
    | 'vi'
    | 'id'
    | 'zh-CN'
    | 'zh-TW'
    | 'hi'
    | 'bn'
    | 'ne'
    | 'my'
    | 'th'
    | 'km'
    | 'tl';

export type AppLanguage = {
    code: AppLanguageCode;

    nativeName: string;

    japaneseName: string;

    flag: string;
};

export const appLanguages: AppLanguage[] = [
    {
        code: 'ja',

        nativeName: '日本語',

        japaneseName: '日本語',

        flag: '🇯🇵',
    },

    {
        code: 'en',

        nativeName: 'English',

        japaneseName: '英語',

        flag: '🇺🇸',
    },

    {
        code: 'vi',

        nativeName: 'Tiếng Việt',

        japaneseName: 'ベトナム語',

        flag: '🇻🇳',
    },

    {
        code: 'id',

        nativeName: 'Bahasa Indonesia',

        japaneseName: 'インドネシア語',

        flag: '🇮🇩',
    },

    {
        code: 'zh-CN',

        nativeName: '简体中文',

        japaneseName: '中国語（簡体字）',

        flag: '🇨🇳',
    },

    {
        code: 'zh-TW',

        nativeName: '繁體中文',

        japaneseName: '中国語（繁体字）',

        flag: '🇹🇼',
    },

    {
        code: 'hi',

        nativeName: 'हिन्दी',

        japaneseName: 'ヒンディー語',

        flag: '🇮🇳',
    },

    {
        code: 'bn',

        nativeName: 'বাংলা',

        japaneseName: 'ベンガル語',

        flag: '🇧🇩',
    },

    {
        code: 'ne',

        nativeName: 'नेपाली',

        japaneseName: 'ネパール語',

        flag: '🇳🇵',
    },

    {
        code: 'my',

        nativeName: 'မြန်မာဘာသာ',

        japaneseName: 'ミャンマー語',

        flag: '🇲🇲',
    },

    {
        code: 'th',

        nativeName: 'ภาษาไทย',

        japaneseName: 'タイ語',

        flag: '🇹🇭',
    },

    {
        code: 'km',

        nativeName: 'ភាសាខ្មែរ',

        japaneseName: 'クメール語',

        flag: '🇰🇭',
    },

    {
        code: 'tl',

        nativeName: 'Filipino',

        japaneseName: 'フィリピン語',

        flag: '🇵🇭',
    },
];

export function getLanguage(
    code: AppLanguageCode
) {
    return appLanguages.find(
        (item) =>
            item.code === code
    );
}