/* Independent short labels; native language review pending. */
const labels:Record<string,string[]>={
  "ja": [
    "予約",
    "調理場",
    "提供",
    "対象者",
    "申告された食材",
    "料理"
  ],
  "en": [
    "Reservation",
    "Kitchen",
    "Service",
    "Guest concerned",
    "Declared ingredients",
    "Dish"
  ],
  "vi": [
    "Đặt bàn",
    "Bếp",
    "Phục vụ",
    "Khách liên quan",
    "Thực phẩm khách khai báo",
    "Món ăn"
  ],
  "id": [
    "Reservasi",
    "Dapur",
    "Penyajian",
    "Tamu terkait",
    "Bahan yang dilaporkan",
    "Hidangan"
  ],
  "zh-CN": [
    "预订",
    "厨房",
    "上菜",
    "对应客人",
    "客人申报的食材",
    "菜肴"
  ],
  "zh-TW": [
    "預訂",
    "廚房",
    "上菜",
    "對應客人",
    "客人申報的食材",
    "菜餚"
  ],
  "hi": [
    "आरक्षण",
    "रसोई",
    "परोसना",
    "संबंधित अतिथि",
    "बताई गई सामग्री",
    "व्यंजन"
  ],
  "bn": [
    "সংরক্ষণ",
    "রান্নাঘর",
    "পরিবেশন",
    "সংশ্লিষ্ট অতিথি",
    "জানানো উপাদান",
    "পদ"
  ],
  "ne": [
    "आरक्षण",
    "भान्सा",
    "परोस्ने काम",
    "सम्बन्धित अतिथि",
    "बताइएको खाद्य सामग्री",
    "परिकार"
  ],
  "my": [
    "ကြိုတင်မှာယူမှု",
    "မီးဖိုချောင်",
    "တည်ခင်းမှု",
    "သက်ဆိုင်ရာဧည့်သည်",
    "ဧည့်သည်အသိပေးသော ပါဝင်ပစ္စည်း",
    "ဟင်းလျာ"
  ],
  "th": [
    "การจอง",
    "ครัว",
    "การเสิร์ฟ",
    "แขกที่เกี่ยวข้อง",
    "วัตถุดิบที่แขกแจ้ง",
    "อาหาร"
  ],
  "km": [
    "ការកក់",
    "ផ្ទះបាយ",
    "ការបម្រើ",
    "ភ្ញៀវពាក់ព័ន្ធ",
    "គ្រឿងផ្សំដែលភ្ញៀវបានប្រាប់",
    "ម្ហូប"
  ],
  "tl": [
    "Reserbasyon",
    "Kusina",
    "Paghahain",
    "Tinutukoy na bisita",
    "Iniulat na sangkap",
    "Pagkain"
  ]
};
export function hotelFoodHandoffLabels(language:string){return labels[language]||labels.ja;}
