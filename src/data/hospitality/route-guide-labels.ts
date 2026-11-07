/* Independent short diagram labels; native review pending. */
const labels:Record<string,string[]>={
  "ja": [
    "客室",
    "階段",
    "学習用の仮定図であり、実際の施設図や安全の保証ではありません。"
  ],
  "en": [
    "Guest room",
    "Stairs",
    "Hypothetical learning diagram; not an actual facility plan or a guarantee of safety."
  ],
  "vi": [
    "Phòng khách",
    "Cầu thang",
    "Sơ đồ giả định để học; không phải sơ đồ cơ sở thực tế hay bảo đảm an toàn."
  ],
  "id": [
    "Kamar tamu",
    "Tangga",
    "Diagram belajar rekaan; bukan denah fasilitas nyata atau jaminan keselamatan."
  ],
  "zh-CN": [
    "客房",
    "楼梯",
    "学习用假设图，并非实际设施图或安全保证。"
  ],
  "zh-TW": [
    "客房",
    "樓梯",
    "學習用假設圖，並非實際設施圖或安全保證。"
  ],
  "hi": [
    "अतिथि कक्ष",
    "सीढ़ियाँ",
    "काल्पनिक अध्ययन चित्र; वास्तविक भवन की योजना या सुरक्षा की गारंटी नहीं।"
  ],
  "bn": [
    "অতিথিকক্ষ",
    "সিঁড়ি",
    "শেখার কাল্পনিক চিত্র; প্রকৃত ভবনের নকশা বা নিরাপত্তার নিশ্চয়তা নয়।"
  ],
  "ne": [
    "अतिथि कोठा",
    "सिँढी",
    "सिकाइको काल्पनिक चित्र; वास्तविक भवनको योजना वा सुरक्षाको प्रत्याभूति होइन।"
  ],
  "my": [
    "ဧည့်ခန်း",
    "လှေကား",
    "သင်ယူရန်စိတ်ကူးပုံဖြစ်ပြီး အဆောက်အအုံအမှန်၏ပုံစံ သို့မဟုတ် ဘေးကင်းကြောင်းအာမခံချက်မဟုတ်ပါ။"
  ],
  "th": [
    "ห้องพัก",
    "บันได",
    "แผนภาพสมมติเพื่อการเรียน ไม่ใช่ผังสถานที่จริงหรือการรับรองความปลอดภัย"
  ],
  "km": [
    "បន្ទប់ភ្ញៀវ",
    "ជណ្ដើរ",
    "គំនូរសន្មតសម្រាប់សិក្សា មិនមែនជាប្លង់អគារពិត ឬការធានាសុវត្ថិភាពទេ។"
  ],
  "tl": [
    "Silid ng bisita",
    "Hagdan",
    "Kathang diagram para sa pag-aaral; hindi aktuwal na plano ng gusali o garantiya ng kaligtasan."
  ]
};
export function hotelRouteLabels(language:string){return labels[language]||labels.ja;}
