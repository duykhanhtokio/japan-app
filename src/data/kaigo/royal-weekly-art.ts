import type {ImageSourcePropType} from 'react-native';

/** Day-scoped replacements preserve shared legacy art IDs and captions. */
export const kaigoRoyalWeeklyArt:Record<number,{source:ImageSourcePropType;aspectRatio:number}>={
 1:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day01-greeting.webp'),aspectRatio:1536/1024},
 2:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day02-consent.webp'),aspectRatio:1536/1024},
 3:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day03-postcard.webp'),aspectRatio:1536/1024},
 4:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day04-private-consultation.webp'),aspectRatio:1536/1024},
 5:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day05-participation-photo-consent.webp'),aspectRatio:1536/1024},
 7:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day07-independent-reading.webp'),aspectRatio:1536/1024},
 10:{source:require('../../../assets/kaigo/royal-weekly-20261107/week02/day10-preferred-voice.webp'),aspectRatio:1536/1024},
 11:{source:require('../../../assets/kaigo/royal-weekly-20261107/week02/day11-letter-box-location.webp'),aspectRatio:1536/1024},
 12:{source:require('../../../assets/kaigo/royal-weekly-20261107/week02/day12-uncertain-appointment.webp'),aspectRatio:1536/1024},
};

/** Image-specific captions; canonical lesson and progress revisions remain unchanged. */
export const kaigoRoyalWeeklyCaptions:Record<number,Record<string,string>>={
  "7": {
    "ja": "青いしおりのページを探す援助を受けた後、本人が自分で本を読みます。",
    "en": "After receiving help finding the page marked by the blue bookmark, he reads the book independently.",
    "vi": "Sau khi được giúp tìm trang có dấu sách màu xanh, ông tự đọc sách.",
    "id": "Setelah dibantu menemukan halaman bertanda pembatas buku biru, ia membaca sendiri.",
    "tl": "Pagkatapos matulungang hanapin ang pahinang may asul na pananda, mag-isa niyang binabasa ang aklat.",
    "th": "หลังได้รับความช่วยเหลือหาหน้าที่คั่นด้วยที่คั่นหนังสือสีน้ำเงิน เขาอ่านหนังสือด้วยตนเอง",
    "ne": "नीलो पुस्तकचिनो भएको पृष्ठ खोज्न मद्दत पाएपछि उहाँ आफैँ पुस्तक पढ्नुहुन्छ।",
    "hi": "नीले बुकमार्क वाला पन्ना ढूँढने में सहायता मिलने के बाद, वे स्वयं किताब पढ़ते हैं।",
    "bn": "নীল বুকমার্ক দেওয়া পৃষ্ঠা খুঁজতে সহায়তা পাওয়ার পর তিনি নিজেই বই পড়েন।",
    "my": "အပြာရောင်စာညှပ်ပါသော စာမျက်နှာကို ရှာပေးပြီးနောက် သူကိုယ်တိုင် စာအုပ်ဖတ်သည်။",
    "km": "បន្ទាប់ពីទទួលជំនួយរកទំព័រដែលមានក្រដាសចំណាំពណ៌ខៀវ គាត់អានសៀវភៅដោយខ្លួនឯង។",
    "zh-CN": "在获得帮助找到蓝色书签标记的页面后，他自己阅读书籍。",
    "zh-TW": "在獲得協助找到藍色書籤標記的頁面後，他自己閱讀書籍。"
  },
  "10": {
    "ja": "森川さんに聞きやすい声の大きさと速さを尋ね、話し方を調整します。",
    "en": "The caregiver asks Morikawa what volume and pace are easy to hear and adjusts her speech.",
    "vi": "Nhân viên hỏi bà Morikawa về âm lượng và tốc độ dễ nghe, rồi điều chỉnh cách nói.",
    "id": "Petugas menanyakan volume dan kecepatan bicara yang nyaman didengar Morikawa, lalu menyesuaikan cara bicara.",
    "tl": "Tinatanong ng tagapag-alaga si Morikawa kung anong lakas at bilis ng pagsasalita ang madaling marinig, at inaangkop ang pagsasalita.",
    "th": "เจ้าหน้าที่ถามคุณโมริคาวะถึงระดับเสียงและความเร็วที่ฟังได้สะดวก แล้วปรับวิธีพูด",
    "ne": "हेरचाहकर्मीले मोरिकावालाई सुन्न सहज हुने आवाजको स्तर र गति सोधेर बोल्ने तरिका मिलाउँछन्।",
    "hi": "देखभालकर्मी मोरिकावा से आसानी से सुनाई देने वाली आवाज़ की तीव्रता और गति पूछकर अपनी बातचीत समायोजित करती हैं।",
    "bn": "পরিচর্যাকর্মী মোরিকাওয়াকে সহজে শোনা যায় এমন স্বরের মাত্রা ও গতি জিজ্ঞেস করে কথা বলার ধরন মানিয়ে নেন।",
    "my": "ပြုစုစောင့်ရှောက်သူက မိုရီကာဝါအား နားထောင်ရလွယ်သည့် အသံအကျယ်နှင့် အမြန်နှုန်းကို မေးပြီး ပြောဆိုပုံကို ညှိပေးသည်။",
    "km": "បុគ្គលិកសួរលោកស្រីម៉ូរីកាវ៉ាអំពីកម្រិតសំឡេង និងល្បឿនដែលងាយស្តាប់ ហើយកែសម្រួលរបៀបនិយាយ។",
    "zh-CN": "工作人员询问森川女士容易听清的音量和语速，并调整说话方式。",
    "zh-TW": "工作人員詢問森川女士容易聽清楚的音量和語速，並調整說話方式。"
  },
  "11": {
    "ja": "小野寺さんが手紙を入れる箱の場所を尋ね、職員が身体に触れず言葉で説明します。",
    "en": "Onodera asks where the letter box is, and the caregiver explains verbally without touching her.",
    "vi": "Bà Onodera hỏi vị trí hộp thư; nhân viên giải thích bằng lời, không chạm vào bà.",
    "id": "Onodera menanyakan letak kotak surat, dan petugas menjelaskannya secara lisan tanpa menyentuhnya.",
    "tl": "Itinatanong ni Onodera kung nasaan ang kahon ng mga sulat, at ipinapaliwanag ito ng tagapag-alaga nang hindi siya hinahawakan.",
    "th": "คุณโอโนเดระถามตำแหน่งกล่องใส่จดหมาย เจ้าหน้าที่อธิบายด้วยคำพูดโดยไม่สัมผัสตัวเธอ",
    "ne": "ओनोदेराले चिठी राख्ने बाकस कहाँ छ भनेर सोध्नुहुन्छ र हेरचाहकर्मीले उहाँलाई नछोई शब्दमा बताउँछन्।",
    "hi": "ओनोदेरा चिट्ठी डालने के डिब्बे का स्थान पूछती हैं और देखभालकर्मी उन्हें छुए बिना शब्दों में बताती हैं।",
    "bn": "ওনোদেরা চিঠি রাখার বাক্স কোথায় জানতে চান; পরিচর্যাকর্মী তাঁকে স্পর্শ না করে মুখে বুঝিয়ে দেন।",
    "my": "အိုနိုဒဲရက စာထည့်သည့်ပုံး၏ တည်နေရာကို မေးရာ ပြုစုစောင့်ရှောက်သူက သူမကို မထိဘဲ နှုတ်ဖြင့် ရှင်းပြသည်။",
    "km": "លោកស្រីអូណូដេរ៉ាសួរថាប្រអប់ដាក់សំបុត្រនៅឯណា ហើយបុគ្គលិកពន្យល់ដោយពាក្យសម្តី ដោយមិនប៉ះរាងកាយគាត់។",
    "zh-CN": "小野寺女士询问投信箱的位置，工作人员用语言说明，不触碰她的身体。",
    "zh-TW": "小野寺女士詢問投信箱的位置，工作人員以言語說明，不碰觸她的身體。"
  }
};
export function royalCaptionForStudyDay(day:number,language='ja'){return kaigoRoyalWeeklyCaptions[day]?.[language];}
