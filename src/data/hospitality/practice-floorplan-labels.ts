export type HotelPracticeMapLabels = {title:string;reception:string;breakfast:string;guestRoom:string;exit:string;normal:string;escape:string;caveat:string;description:string};
const labels:Record<string,HotelPracticeMapLabels> = {
  "ja": {
    "title": "館内案内の練習",
    "reception": "受付",
    "breakfast": "朝食会場",
    "guestRoom": "客室",
    "exit": "非常口",
    "normal": "通常の館内案内",
    "escape": "客室から非常口へ",
    "caveat": "練習用の配置・経路です。実施設では確認済みの経路を使用します。",
    "description": "鍵と館内図を使って案内する受付担当者。右の練習図では受付が左下、朝食会場が左上、客室が右下、非常口が右。青は通常の案内、緑は客室から非常口への経路。実施設では確認済みの経路を使います。"
  },
  "en": {
    "title": "Practice hotel map",
    "reception": "Reception",
    "breakfast": "Breakfast room",
    "guestRoom": "Guest room",
    "exit": "Emergency exit",
    "normal": "Normal guidance route",
    "escape": "Guest room to emergency exit",
    "caveat": "This layout and these routes are for practice. Use verified routes in the actual facility.",
    "description": "A receptionist explains a key and hotel map. In the practice diagram, reception is lower left, breakfast upper left, the guest room lower right and the emergency exit on the right. Blue shows normal guidance and green the route from the room to the exit. Use verified routes in the actual facility."
  },
  "vi": {
    "title": "Sơ đồ khách sạn để luyện tập",
    "reception": "Lễ tân",
    "breakfast": "Nơi ăn sáng",
    "guestRoom": "Phòng lưu trú",
    "exit": "Cửa thoát hiểm",
    "normal": "Đường hướng dẫn thông thường",
    "escape": "Từ phòng tới cửa thoát hiểm",
    "caveat": "Bố trí và đường đi này chỉ dùng để luyện tập. Tại cơ sở thực tế, phải dùng đường đã được xác nhận.",
    "description": "Lễ tân dùng chìa khóa và sơ đồ để hướng dẫn. Sơ đồ luyện tập có lễ tân dưới trái, nơi ăn sáng trên trái, phòng lưu trú dưới phải và cửa thoát hiểm bên phải. Xanh lam là đường hướng dẫn thông thường; xanh lá là đường từ phòng đến cửa thoát. Tại cơ sở thực tế phải dùng đường đã xác nhận."
  },
  "id": {
    "title": "Peta hotel untuk latihan",
    "reception": "Resepsionis",
    "breakfast": "Ruang sarapan",
    "guestRoom": "Kamar tamu",
    "exit": "Pintu darurat",
    "normal": "Rute panduan biasa",
    "escape": "Kamar ke pintu darurat",
    "caveat": "Tata letak dan rute ini untuk latihan. Di fasilitas nyata gunakan rute yang telah diverifikasi.",
    "description": "Resepsionis menjelaskan kunci dan peta hotel. Pada diagram latihan, resepsionis di kiri bawah, tempat sarapan kiri atas, kamar kanan bawah dan pintu darurat di kanan. Biru menunjukkan rute biasa, hijau rute dari kamar ke pintu darurat. Di fasilitas nyata gunakan rute yang telah diverifikasi."
  },
  "zh-CN": {
    "title": "馆内导引练习图",
    "reception": "前台",
    "breakfast": "早餐会场",
    "guestRoom": "客房",
    "exit": "非常出口",
    "normal": "通常导引路线",
    "escape": "客房至非常出口",
    "caveat": "此布局与路线仅供练习。实际设施应使用已确认的路线。",
    "description": "前台人员用钥匙和馆内图进行说明。练习图中前台在左下，早餐会场在左上，客房在右下，非常出口在右侧。蓝线为通常导引，绿线为客房至非常出口的路线。实际设施应使用已确认的路线。"
  },
  "zh-TW": {
    "title": "館內導引練習圖",
    "reception": "櫃檯",
    "breakfast": "早餐會場",
    "guestRoom": "客房",
    "exit": "緊急出口",
    "normal": "一般導引路線",
    "escape": "客房至緊急出口",
    "caveat": "此配置與路線僅供練習。實際設施應使用已確認的路線。",
    "description": "櫃檯人員用鑰匙和館內圖進行說明。練習圖中櫃檯在左下，早餐會場在左上，客房在右下，緊急出口在右側。藍線為一般導引，綠線為客房至緊急出口的路線。實際設施應使用已確認的路線。"
  },
  "hi": {
    "title": "होटल के नक्शे का अभ्यास",
    "reception": "रिसेप्शन",
    "breakfast": "नाश्ते का कक्ष",
    "guestRoom": "अतिथि कक्ष",
    "exit": "आपात निकास",
    "normal": "सामान्य मार्ग",
    "escape": "अतिथि कक्ष से आपात निकास",
    "caveat": "यह विन्यास और ये मार्ग अभ्यास के लिए हैं। वास्तविक भवन में सत्यापित मार्ग का उपयोग करें।",
    "description": "रिसेप्शन कर्मचारी चाबी और होटल के नक्शे से समझा रहा है। अभ्यास नक्शे में रिसेप्शन नीचे बाएँ, नाश्ते का स्थान ऊपर बाएँ, अतिथि कक्ष नीचे दाएँ और आपात निकास दाईं ओर है। नीला सामान्य मार्ग और हरा कमरे से निकास का मार्ग दिखाता है। वास्तविक भवन में सत्यापित मार्ग का उपयोग करें।"
  },
  "bn": {
    "title": "হোটেলের মানচিত্রের অনুশীলন",
    "reception": "রিসেপশন",
    "breakfast": "সকালের খাবারের কক্ষ",
    "guestRoom": "অতিথিকক্ষ",
    "exit": "জরুরি নির্গমন",
    "normal": "সাধারণ পথ",
    "escape": "অতিথিকক্ষ থেকে জরুরি নির্গমন",
    "caveat": "এই বিন্যাস ও পথগুলো অনুশীলনের জন্য। প্রকৃত ভবনে যাচাই করা পথ ব্যবহার করুন।",
    "description": "রিসেপশনের কর্মী চাবি ও হোটেলের মানচিত্র দিয়ে বোঝাচ্ছেন। অনুশীলনের চিত্রে রিসেপশন নিচের বামে, সকালের খাবারের স্থান উপরের বামে, অতিথিকক্ষ নিচের ডানে এবং জরুরি নির্গমন ডানে। নীল সাধারণ পথ ও সবুজ ঘর থেকে নির্গমনের পথ দেখায়। প্রকৃত ভবনে যাচাই করা পথ ব্যবহার করতে হবে।"
  },
  "ne": {
    "title": "होटलको नक्साको अभ्यास",
    "reception": "रिसेप्सन",
    "breakfast": "बिहानको खाना खाने कक्ष",
    "guestRoom": "अतिथि कोठा",
    "exit": "आपतकालीन निकास",
    "normal": "सामान्य मार्ग",
    "escape": "अतिथि कोठाबाट आपतकालीन निकास",
    "caveat": "यो संरचना र यी मार्ग अभ्यासका लागि हुन्। वास्तविक भवनमा पुष्टि गरिएको मार्ग प्रयोग गर्नुहोस्।",
    "description": "रिसेप्सन कर्मचारीले साँचो र होटलको नक्सा देखाउँदै जानकारी दिँदै छन्। अभ्यास नक्सामा रिसेप्सन तल बायाँ, बिहानको खाना खाने ठाउँ माथि बायाँ, अतिथि कोठा तल दायाँ र आपतकालीन निकास दायाँ छ। निलो सामान्य मार्ग र हरियो कोठाबाट निकासको मार्ग हो। वास्तविक भवनमा पुष्टि गरिएको मार्ग प्रयोग गर्नुपर्छ।"
  },
  "my": {
    "title": "ဟိုတယ်မြေပုံ လေ့ကျင့်ခန်း",
    "reception": "ဧည့်ကြိုနေရာ",
    "breakfast": "နံနက်စာစားခန်း",
    "guestRoom": "တည်းခိုခန်း",
    "exit": "အရေးပေါ်ထွက်ပေါက်",
    "normal": "ပုံမှန်လမ်းကြောင်း",
    "escape": "တည်းခိုခန်းမှ အရေးပေါ်ထွက်ပေါက်သို့",
    "caveat": "ဤနေရာဖွဲ့စည်းပုံနှင့် လမ်းကြောင်းများသည် လေ့ကျင့်ရန်သာ ဖြစ်သည်။ အမှန်တကယ် အဆောက်အအုံတွင် အတည်ပြုပြီးသော လမ်းကြောင်းကို အသုံးပြုပါ။",
    "description": "ဧည့်ကြိုဝန်ထမ်းက သော့နှင့် ဟိုတယ်မြေပုံကို အသုံးပြု၍ ရှင်းပြနေသည်။ လေ့ကျင့်ရေးပုံတွင် ဧည့်ကြိုနေရာသည် ဘယ်အောက်၊ နံနက်စာစားရာ ဘယ်အပေါ်၊ တည်းခိုခန်း ညာအောက်နှင့် အရေးပေါ်ထွက်ပေါက် ညာဘက်တွင် ရှိသည်။ အပြာရောင်သည် ပုံမှန်လမ်း၊ အစိမ်းရောင်သည် အခန်းမှ ထွက်ပေါက်သို့ လမ်းဖြစ်သည်။ အမှန်တကယ် အဆောက်အအုံတွင် အတည်ပြုပြီးသောလမ်းကိုသာ အသုံးပြုရမည်။"
  },
  "th": {
    "title": "แผนผังโรงแรมสำหรับฝึก",
    "reception": "เคาน์เตอร์ต้อนรับ",
    "breakfast": "ห้องอาหารเช้า",
    "guestRoom": "ห้องพัก",
    "exit": "ทางออกฉุกเฉิน",
    "normal": "เส้นทางนำทางปกติ",
    "escape": "จากห้องพักไปทางออกฉุกเฉิน",
    "caveat": "ผังและเส้นทางนี้ใช้สำหรับฝึกเท่านั้น ในสถานที่จริงให้ใช้เส้นทางที่ตรวจสอบแล้ว",
    "description": "พนักงานต้อนรับอธิบายด้วยกุญแจและแผนผังโรงแรม แผนผังฝึกมีเคาน์เตอร์ล่างซ้าย ห้องอาหารเช้าบนซ้าย ห้องพักล่างขวา และทางออกฉุกเฉินด้านขวา สีน้ำเงินคือเส้นทางปกติ สีเขียวคือเส้นทางจากห้องพักไปทางออก ในสถานที่จริงต้องใช้เส้นทางที่ตรวจสอบแล้ว"
  },
  "km": {
    "title": "ផែនទីសណ្ឋាគារសម្រាប់ហាត់",
    "reception": "កន្លែងទទួលភ្ញៀវ",
    "breakfast": "បន្ទប់អាហារពេលព្រឹក",
    "guestRoom": "បន្ទប់ស្នាក់នៅ",
    "exit": "ច្រកចេញបន្ទាន់",
    "normal": "ផ្លូវណែនាំធម្មតា",
    "escape": "ពីបន្ទប់ទៅច្រកចេញបន្ទាន់",
    "caveat": "ប្លង់ និងផ្លូវទាំងនេះសម្រាប់ហាត់ប៉ុណ្ណោះ។ នៅអគារពិត ត្រូវប្រើផ្លូវដែលបានផ្ទៀងផ្ទាត់។",
    "description": "បុគ្គលិកទទួលភ្ញៀវពន្យល់ដោយប្រើសោ និងផែនទីសណ្ឋាគារ។ ក្នុងផែនទីលំហាត់ កន្លែងទទួលភ្ញៀវនៅក្រោមឆ្វេង កន្លែងអាហារពេលព្រឹកនៅលើឆ្វេង បន្ទប់ស្នាក់នៅនៅក្រោមស្តាំ និងច្រកចេញបន្ទាន់នៅខាងស្តាំ។ ខ្សែពណ៌ខៀវជាផ្លូវធម្មតា ពណ៌បៃតងជាផ្លូវពីបន្ទប់ទៅច្រកចេញ។ នៅអគារពិត ត្រូវប្រើផ្លូវដែលបានផ្ទៀងផ្ទាត់។"
  },
  "tl": {
    "title": "Pagsasanay sa mapa ng hotel",
    "reception": "Reception",
    "breakfast": "Kainan ng almusal",
    "guestRoom": "Kuwarto ng bisita",
    "exit": "Emergency exit",
    "normal": "Karaniwang daan",
    "escape": "Kuwarto patungong emergency exit",
    "caveat": "Para sa pagsasanay lamang ang ayos at mga daang ito. Gamitin ang beripikadong ruta sa tunay na gusali.",
    "description": "Ipinapaliwanag ng receptionist ang susi at mapa. Sa pagsasanay na mapa, nasa ibabang kaliwa ang reception, itaas na kaliwa ang kainan ng almusal, ibabang kanan ang kuwarto at kanan ang emergency exit. Asul ang karaniwang daan at berde ang daan mula kuwarto patungong exit. Gamitin ang beripikadong ruta sa tunay na gusali."
  }
};
export function hotelPracticeMapLabels(language:string):HotelPracticeMapLabels{return labels[language]??labels.en;}
