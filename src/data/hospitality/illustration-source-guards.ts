// Current image/source compatibility snapshot, not content or release acceptance.
// Review image relevance before rebinding a changed source revision.
export const HOTEL_ILLUSTRATION_SOURCE_REVISIONS:Record<string,string>={
  "hotel-front-01": "c3b57208573831ce11325b31faa7294cc670e1142573b4ac8e3387221752ada8",
  "hotel-front-02": "7551031e2d7e2b14eb21551625a78c7ac6ddf2c2f076e89a0e1521d800f91dc8",
  "hotel-front-03": "3c440f6ebd275fa8c6ae49a04eab30a5193b7b95d33c36a85828631ebf667cb3",
  "hotel-front-04": "dc04d3aa513a8ef339d7890a1710b492ec9b7493fa8f843e6e3cb70e5b6c45a6",
  "hotel-front-05": "fb3ac81e7bd03a9e8c4359e387ca5322a116d40feab6153e89b6d14609f84244",
  "hotel-front-06": "6eb647c579bc1a5e6ff4ae4c9009ad287513cc6f434fea1f63ed7cb773636edc",
  "hotel-front-07": "120d38ef938009d07ae7301663b9f0fae646ea5f3c7f0883cce07d3d10e0774c",
  "hotel-front-08": "814482fe57a99a3628d22c01816c5b2442c8dd7196319471cfc47ea3208ca279",
  "hotel-planning-01": "dc8ac37ff986ec5c649c75e551850c88aa0b2298a94f65fa6198ea8dd4d5a0c0",
  "hotel-planning-02": "2602db22cb5acb1db44eca21a3a5f0dd17f234e8541f6d4bf1d466c38480524f",
  "hotel-planning-03": "9fa70e9156318f2f48fe9777f736e358b7ab4037ada18f680d9080c75507adc0",
  "hotel-planning-04": "7e1d71529fd8f302096b41b49519c764caae1644af24b14ed2d1a323c1ed6a29",
  "hotel-planning-05": "650f96939e5ea1c44a184269f589a837eeb631cb13af030c3f86cb79af9d9d30",
  "hotel-planning-06": "2487c50fc6bbcffd4f417bd6326614b8fd9d442c1d31f3b166e755535750a62c",
  "hotel-planning-07": "3dbc6b276e33f9cb49ac809131655c9698ba5c6c77bc99e62baf0658e99c453f",
  "hotel-service-01": "578941e86462eb4a73b4b1134b5f9bc35adbf7839e02802d35ab05e1fe57e9ef",
  "hotel-service-02": "00dcc624507593ecc0ebfa4c7929a7e64431e3b92e25028b0efe4aa3a8b64761",
  "hotel-service-03": "eb942d9ca15482ba6a25f88e5efd13a2a1994b1b2632df3a2ae1d61b28947e5c",
  "hotel-service-04": "9dbdc1fe6ef0422a61ad3875055801454e996476e8d5f29dc3c6ae2ad22d30e0",
  "hotel-service-05": "80f163ab67d53fc0a25f78c3312d8ba8c484bea99133dc209f718bdb95395c23",
  "hotel-service-06": "3e8f4359318641c4920542df6654b58df99aba58f1c4fa6e4cc19bcf87a213c0",
  "hotel-restaurant-01": "cd8f08d795ac17d7ff6c23341956e196eca65d52da352b3613eff036d3eee6f3",
  "hotel-restaurant-02": "c6af096eb88ae91e19dd42473a5bba2126e15271724f92a7d5715df8d8e58918",
  "hotel-restaurant-03": "89b2a0a7ae9b45fe85721b71749c3902e45ad12a6e9bdc2ee4d45decc7afc653",
  "hotel-restaurant-04": "61c59bb49669c612f3f4be126278acd39d7ea59b48b290a4b3f9edb1bfd4596a",
  "hotel-restaurant-05": "5df3daf1a74e68979b8c622124187cf374d0ac0389e277fcdb4c16aa5595bb6c",
  "hotel-restaurant-06": "7f30a59288a1c06fe68f24c0b5779cbf7e4d417d9098a3c881b9b49b3e4c1200",
  "hotel-restaurant-07": "80067c3fc8f460d530d3eb58aacb122518d2c89a6518a880e84536b346fb0d14",
  "hotel-restaurant-08": "bd10d6595151d163ac3608a8312355b92b166b531dc78e67cd007909a31317a6",
  "hotel-restaurant-09": "7cbc7c26d133daf5ff1c8c1c59d1cfcee594e8d5e0ea3dfe175b0cfb4bcc0fba",
  "hotel-safety-01": "464a5292650e7aa4b4af9dbd932e1e57b43fbc6c8e48ff313d6c1744bb529764",
  "hotel-safety-02": "2a56c50b191f4b5d0b6bdceebecd639c99c94cfad15a530298154aa76a601888",
  "hotel-safety-03": "0502f9b36c82a0adb16839e24a28ff6cf6f407d602c2e05fb7cd643ef4735837",
  "hotel-safety-04": "8cf38a99eb7fae14fe96d85a59885c2bd1165fe7de821a989f05729465250413",
  "hotel-safety-05": "3e8b50b16d4619da04958b21d1cabcd57b5ace18e8876cd5f875b7a73d8e0091",
  "hotel-safety-06": "597581b70094c3a0fc5304b0cafc37695ef80ee6f164d131cc45096eb669611a",
  "hotel-safety-07": "57ecf027ef57816c0b6d8f3fa47d47136576e9090f9a93ecdf1ad4a000b7f333",
  "hotel-safety-08": "b42940fe071d3ceeec02ed027f2cfe682fb5ce5f3238db71664a5587be9097e4"
};
export function hotelIllustrationSourceKnown(id:string):boolean{return Object.prototype.hasOwnProperty.call(HOTEL_ILLUSTRATION_SOURCE_REVISIONS,id);}
export function hotelIllustrationSourceMatches(id:string,revision:string):boolean{return typeof revision==='string'&&hotelIllustrationSourceKnown(id)&&HOTEL_ILLUSTRATION_SOURCE_REVISIONS[id]===revision;}
const messages:Record<string,[string,string]>={
  "ja": [
    "画像を表示できません。",
    "画像を再読み込み"
  ],
  "en": [
    "This illustration is unavailable.",
    "Retry illustration"
  ],
  "vi": [
    "Hiện không thể hiển thị hình minh họa.",
    "Tải lại hình"
  ],
  "id": [
    "Ilustrasi ini saat ini tidak dapat ditampilkan.",
    "Muat ulang ilustrasi"
  ],
  "zh-CN": [
    "目前无法显示此插图。",
    "重新加载插图"
  ],
  "zh-TW": [
    "目前無法顯示此插圖。",
    "重新載入插圖"
  ],
  "hi": [
    "यह चित्र अभी प्रदर्शित नहीं हो सकता।",
    "चित्र फिर लोड करें"
  ],
  "bn": [
    "এই মুহূর্তে চিত্রটি দেখানো যাচ্ছে না।",
    "চিত্রটি আবার লোড করুন"
  ],
  "ne": [
    "अहिले यो चित्र देखाउन सकिँदैन।",
    "चित्र फेरि लोड गर्नुहोस्"
  ],
  "my": [
    "ဤရှင်းပြပုံကို ယခုဖော်ပြ၍ မရပါ။",
    "ရှင်းပြပုံကို ပြန်ဖွင့်ရန်"
  ],
  "th": [
    "ขณะนี้แสดงภาพประกอบไม่ได้",
    "โหลดภาพประกอบใหม่"
  ],
  "km": [
    "មិនអាចបង្ហាញរូបពន្យល់នេះនៅពេលនេះបានទេ។",
    "ផ្ទុករូបពន្យល់ឡើងវិញ"
  ],
  "tl": [
    "Hindi maipakita ang ilustrasyong ito sa ngayon.",
    "I-load muli ang ilustrasyon"
  ]
};
export function hotelIllustrationUnavailableText(language:string):string{return (messages[language]??messages.en)[0];}
export function hotelIllustrationRetryText(language:string):string{return (messages[language]??messages.en)[1];}
