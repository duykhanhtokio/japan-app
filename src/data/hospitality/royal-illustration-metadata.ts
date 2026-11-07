// Descriptions of the active replacement pixels; lesson knowledge/revisions stay independent.
const currentImageAlt:Record<string,Record<string,string>> = {
  "hotel-front-01": {
    "ja": "宿泊希望日を聞く受付担当者と予約情報を確認する担当者。客室と朝食の例を併せて示すイラスト。",
    "en": "A receptionist asks about the desired stay dates while a colleague checks reservation information, with examples of a guest room and breakfast.",
    "vi": "Nhân viên lễ tân hỏi ngày khách muốn lưu trú, đồng nghiệp kiểm tra thông tin đặt phòng; bên cạnh là ví dụ phòng lưu trú và bữa sáng.",
    "id": "Resepsionis menanyakan tanggal menginap yang diinginkan sementara rekan memeriksa informasi reservasi, disertai contoh kamar dan sarapan.",
    "zh-CN": "前台人员询问希望入住的日期，同事核对预订信息，旁边展示客房与早餐的示例。",
    "zh-TW": "櫃檯人員詢問希望入住的日期，同事核對訂房資訊，旁邊展示客房與早餐的示例。",
    "hi": "रिसेप्शन कर्मचारी ठहरने की इच्छित तारीखें पूछ रहा है और सहकर्मी आरक्षण की जानकारी जाँच रहा है। साथ में अतिथि कक्ष और नाश्ते के उदाहरण हैं।",
    "bn": "রিসেপশনের কর্মী অতিথির কাঙ্ক্ষিত থাকার তারিখ জিজ্ঞাসা করছেন এবং সহকর্মী বুকিংয়ের তথ্য যাচাই করছেন। পাশে অতিথিকক্ষ ও সকালের খাবারের উদাহরণ দেখানো হয়েছে।",
    "ne": "रिसेप्सन कर्मचारीले बस्न चाहेको मिति सोध्दै छन् र सहकर्मीले बुकिङको जानकारी जाँच्दै छन्। साथमा अतिथि कोठा र बिहानको खानाका उदाहरण छन्।",
    "my": "ဧည့်ကြိုဝန်ထမ်းက တည်းခိုလိုသည့်ရက်များကို မေးမြန်းနေပြီး လုပ်ဖော်ကိုင်ဖက်က ကြိုတင်မှာယူမှုအချက်အလက်ကို စစ်ဆေးနေသည်။ ဘေးတွင် ဟိုတယ်တည်းခိုခန်းနှင့် နံနက်စာ နမူနာများကို ပြထားသည်။",
    "th": "พนักงานต้อนรับถามวันที่ต้องการเข้าพัก ขณะที่เพื่อนร่วมงานตรวจสอบข้อมูลการจอง พร้อมตัวอย่างห้องพักและอาหารเช้า",
    "km": "បុគ្គលិកទទួលភ្ញៀវសួរអំពីថ្ងៃដែលភ្ញៀវចង់ស្នាក់នៅ ខណៈមិត្តរួមការងារពិនិត្យព័ត៌មានកក់បន្ទប់។ នៅជាប់គ្នាមានឧទាហរណ៍បន្ទប់ស្នាក់នៅ និងអាហារពេលព្រឹក។",
    "tl": "Tinatanong ng receptionist ang nais na mga petsa ng pananatili habang sinusuri ng katrabaho ang impormasyon ng reserbasyon, kasama ang mga halimbawa ng kuwarto at almusal."
  }
};
export function hotelIllustrationAlt(id:string,language:string,fallback:string):string {
 const descriptions=currentImageAlt[id];
 if(!descriptions)return fallback;
 return descriptions[language]??descriptions.en;
}
