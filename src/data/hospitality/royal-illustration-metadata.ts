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
  },
  "hotel-front-02": {
    "ja": "電話で予約情報を聞き取り記録する受付担当者と、スタッフ側で予約の記録を確認し、食事と到着対応の担当者へ情報を引き継ぐ同僚。",
    "en": "A receptionist records reservation information by phone while a colleague checks a staff-held record with the dining and guest-arrival staff.",
    "vi": "Lễ tân nghe điện thoại và ghi thông tin đặt phòng; đồng nghiệp kiểm tra hồ sơ ở phía nhân viên, trao đổi với người phụ trách bữa ăn và đón khách.",
    "id": "Resepsionis mencatat informasi reservasi melalui telepon, sementara rekan memeriksa catatan di area staf bersama petugas makanan dan penyambutan tamu.",
    "zh-CN": "前台人员通过电话听取并记录预订信息，同事在员工区域与餐饮及迎接客人的负责人核对记录、交接信息。",
    "zh-TW": "櫃檯人員透過電話聽取並記錄訂房資訊，同事在員工區域與餐飲及迎接客人的負責人核對紀錄、交接資訊。",
    "hi": "रिसेप्शन कर्मचारी फोन पर आरक्षण की जानकारी लिख रहा है। सहकर्मी कर्मचारियों के क्षेत्र में भोजन और अतिथि आगमन के कर्मचारियों के साथ रिकॉर्ड जाँचकर जानकारी साझा कर रहा है।",
    "bn": "রিসেপশনের কর্মী ফোনে বুকিংয়ের তথ্য শুনে লিখছেন। সহকর্মী কর্মীদের এলাকায় খাবার ও অতিথি অভ্যর্থনার দায়িত্বে থাকা কর্মীদের সঙ্গে রেকর্ড যাচাই করে তথ্য হস্তান্তর করছেন।",
    "ne": "रिसेप्सन कर्मचारीले फोनबाट बुकिङको जानकारी सुनेर लेख्दै छन्। सहकर्मीले कर्मचारी क्षेत्रमा खाना र अतिथि आगमनका जिम्मेवार कर्मचारीसँग अभिलेख जाँचेर जानकारी हस्तान्तरण गर्दै छन्।",
    "my": "ဧည့်ကြိုဝန်ထမ်းက ဖုန်းဖြင့် ကြိုတင်မှာယူမှုအချက်အလက်ကို နားထောင်၍ မှတ်တမ်းတင်နေသည်။ လုပ်ဖော်ကိုင်ဖက်က ဝန်ထမ်းများအတွက်နေရာတွင် စားသောက်ရေးနှင့် ဧည့်သည်ရောက်ရှိမှုကို တာဝန်ယူသူများနှင့်အတူ မှတ်တမ်းကို စစ်ဆေးပြီး အချက်အလက် လွှဲပြောင်းပေးနေသည်။",
    "th": "พนักงานต้อนรับรับข้อมูลการจองทางโทรศัพท์และจดบันทึก ขณะที่เพื่อนร่วมงานตรวจสอบบันทึกในพื้นที่พนักงานและส่งต่อข้อมูลให้ผู้รับผิดชอบอาหารกับการต้อนรับเมื่อแขกมาถึง",
    "km": "បុគ្គលិកទទួលភ្ញៀវស្តាប់ព័ត៌មានកក់បន្ទប់តាមទូរសព្ទ និងកត់ត្រា។ មិត្តរួមការងារពិនិត្យកំណត់ត្រានៅផ្នែកបុគ្គលិក ហើយប្រគល់ព័ត៌មានដល់អ្នកទទួលបន្ទុកអាហារ និងការទទួលភ្ញៀវពេលមកដល់។",
    "tl": "Itinatala ng receptionist ang impormasyon ng reserbasyon sa telepono habang sinusuri ng katrabaho ang rekord sa lugar ng staff kasama ang mga namamahala sa pagkain at pagdating ng mga bisita."
  }
};
export function hotelIllustrationAlt(id:string,language:string,fallback:string):string {
 const descriptions=currentImageAlt[id];
 if(!descriptions)return fallback;
 return descriptions[language]??descriptions.en;
}
