import type {ImageSourcePropType} from 'react-native';

/** Day-scoped replacements preserve shared legacy art IDs and captions. */
export const kaigoRoyalWeeklyArt:Record<number,{source:ImageSourcePropType;aspectRatio:number}>={
 1:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day01-greeting.webp'),aspectRatio:1536/1024},
 2:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day02-consent.webp'),aspectRatio:1536/1024},
 3:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day03-postcard.webp'),aspectRatio:1536/1024},
 4:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day04-private-consultation.webp'),aspectRatio:1536/1024},
 5:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day05-participation-photo-consent.webp'),aspectRatio:1536/1024},
 7:{source:require('../../../assets/kaigo/royal-weekly-20261107/week01/day07-independent-reading.webp'),aspectRatio:1536/1024},
};

/** Image-specific day7 caption; canonical lesson and progress revisions remain unchanged. */
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
  }
};
export function royalCaptionForStudyDay(day:number,language='ja'){return kaigoRoyalWeeklyCaptions[day]?.[language];}
