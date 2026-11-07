export type HotelServiceGuideLabels = {upright:string;bowCaveat:string;staff:string;guest:string;direction:string;guiding:string};
const labels:Record<string,HotelServiceGuideLabels> = {
  "ja": {
    "upright": "直立からの傾き",
    "bowCaveat": "言葉を伝えてから、腰から上体を傾けます。角度は場面に合わせた目安です。",
    "staff": "従業員",
    "guest": "お客様",
    "direction": "同じ進行方向",
    "guiding": "お客様の左前方、二〜三歩を目安に進み、歩調を合わせます。"
  },
  "en": {
    "upright": "Tilt from upright",
    "bowCaveat": "Speak before bowing, bending the upper body from the hips. Angles are approximate guides for each situation.",
    "staff": "Staff",
    "guest": "Guest",
    "direction": "Same forward direction",
    "guiding": "Walk at the guest’s front-left, approximately two to three steps ahead, matching their pace."
  },
  "vi": {
    "upright": "Góc nghiêng so với tư thế thẳng",
    "bowCaveat": "Nói trước rồi cúi thân trên từ hông. Góc là mức tham khảo theo tình huống.",
    "staff": "Nhân viên",
    "guest": "Khách",
    "direction": "Cùng hướng di chuyển",
    "guiding": "Đi phía trước bên trái khách, khoảng hai đến ba bước, theo nhịp bước của khách."
  },
  "id": {
    "upright": "Kemiringan dari posisi tegak",
    "bowCaveat": "Sampaikan kata-kata sebelum membungkukkan tubuh dari pinggul. Sudut merupakan panduan perkiraan sesuai situasi.",
    "staff": "Staf",
    "guest": "Tamu",
    "direction": "Arah maju yang sama",
    "guiding": "Berjalan di depan kiri tamu, kira-kira dua hingga tiga langkah di depan, menyesuaikan langkah tamu."
  },
  "zh-CN": {
    "upright": "相对直立姿势的倾角",
    "bowCaveat": "先说话，再从髋部前倾上身。角度是按场景使用的大致标准。",
    "staff": "员工",
    "guest": "客人",
    "direction": "相同前进方向",
    "guiding": "位于客人左前方，约领先两至三步，并配合客人的步速。"
  },
  "zh-TW": {
    "upright": "相對直立姿勢的傾角",
    "bowCaveat": "先說話，再從髖部前傾上身。角度是按情境使用的大致標準。",
    "staff": "員工",
    "guest": "客人",
    "direction": "相同前進方向",
    "guiding": "位於客人左前方，約領先兩至三步，並配合客人的步速。"
  },
  "hi": {
    "upright": "सीधे खड़े होने से झुकाव",
    "bowCaveat": "पहले बोलें, फिर कूल्हों से ऊपरी शरीर झुकाएँ। कोण परिस्थिति के अनुसार अनुमानित मार्गदर्शक हैं।",
    "staff": "कर्मचारी",
    "guest": "अतिथि",
    "direction": "एक ही आगे की दिशा",
    "guiding": "अतिथि के आगे बाईं ओर लगभग दो से तीन कदम चलें और उनकी चाल से मेल रखें।"
  },
  "bn": {
    "upright": "সোজা অবস্থান থেকে ঝোঁক",
    "bowCaveat": "আগে কথা বলে তারপর কোমর থেকে ওপরের শরীর ঝুঁকান। পরিস্থিতি অনুযায়ী কোণ আনুমানিক নির্দেশনা।",
    "staff": "কর্মী",
    "guest": "অতিথি",
    "direction": "একই সামনের দিক",
    "guiding": "অতিথির বাম সামনে প্রায় দুই থেকে তিন পা এগিয়ে চলুন এবং তাঁর গতির সঙ্গে মিল রাখুন।"
  },
  "ne": {
    "upright": "सीधा उभिएको अवस्थाबाट झुकाव",
    "bowCaveat": "पहिले बोल्नुहोस्, त्यसपछि कम्मरबाट माथिल्लो शरीर झुकाउनुहोस्। कोण परिस्थिति अनुसारका अनुमानित मार्गदर्शन हुन्।",
    "staff": "कर्मचारी",
    "guest": "अतिथि",
    "direction": "अगाडि जाने एउटै दिशा",
    "guiding": "अतिथिको बायाँ अगाडि करिब दुईदेखि तीन पाइला अघि हिँड्दै उहाँको चालसँग मिलाउनुहोस्।"
  },
  "my": {
    "upright": "မတ်တတ်အနေအထားမှ စောင်းထောင့်",
    "bowCaveat": "ဦးစွာစကားပြောပြီးမှ တင်ပါးမှအထက်ကိုယ်ကို ကိုင်းပါ။ ထောင့်များသည် အခြေအနေအလိုက် ခန့်မှန်းလမ်းညွှန်သာ ဖြစ်သည်။",
    "staff": "ဝန်ထမ်း",
    "guest": "ဧည့်သည်",
    "direction": "တူညီသော ရှေ့သွားဦးတည်ချက်",
    "guiding": "ဧည့်သည်၏ ဘယ်ရှေ့ဘက်တွင် ခြေလှမ်းနှစ်လှမ်းမှ သုံးလှမ်းခန့် အရှေ့မှ လျှောက်ပြီး ဧည့်သည်၏ လျှောက်နှုန်းနှင့် ကိုက်ညီအောင် လုပ်ပါ။"
  },
  "th": {
    "upright": "มุมเอียงจากแนวยืนตรง",
    "bowCaveat": "พูดก่อนแล้วจึงโค้งลำตัวจากสะโพก มุมเป็นแนวทางโดยประมาณตามสถานการณ์",
    "staff": "พนักงาน",
    "guest": "แขก",
    "direction": "ทิศทางเดินเดียวกัน",
    "guiding": "เดินด้านหน้าซ้ายของแขกประมาณสองถึงสามก้าว และปรับจังหวะให้ตรงกับแขก"
  },
  "km": {
    "upright": "មុំផ្អៀងពីជំហរត្រង់",
    "bowCaveat": "និយាយមុន រួចឱនដងខ្លួនពីត្រគាក។ មុំជាគោលដៅប្រហាក់ប្រហែលតាមស្ថានភាព។",
    "staff": "បុគ្គលិក",
    "guest": "ភ្ញៀវ",
    "direction": "ទិសដៅទៅមុខដូចគ្នា",
    "guiding": "ដើរនៅខាងមុខឆ្វេងភ្ញៀវ ប្រហែលពីរទៅបីជំហាន ហើយសម្របល្បឿនតាមភ្ញៀវ។"
  },
  "tl": {
    "upright": "Pagkahilig mula sa tuwid na tayo",
    "bowCaveat": "Magsalita muna bago iyuko ang itaas na katawan mula sa balakang. Tinatayang gabay lamang ang anggulo ayon sa sitwasyon.",
    "staff": "Kawani",
    "guest": "Bisita",
    "direction": "Parehong direksiyon pasulong",
    "guiding": "Maglakad sa unahang kaliwa ng bisita, humigit-kumulang dalawa hanggang tatlong hakbang sa unahan, ayon sa bilis niya."
  }
};
export function hotelServiceGuideLabels(language:string):HotelServiceGuideLabels{return labels[language]??labels.en;}
