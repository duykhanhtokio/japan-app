const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const out=__dirname+'/',rel='docs/ssw-workspace/agriculture/continuation-20261103e/vegetable/',lp='src/data/agriculture/lessons.ja.json',rp='src/data/agriculture/reader-moisture-checks.json';
const ledger=JSON.parse(fs.readFileSync('docs/ssw-workspace/source-coverage-v2/agriculture.json')),lessons=JSON.parse(fs.readFileSync(lp)).lessons,checks=JSON.parse(fs.readFileSync(rp)).checks,h=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
// Every translation is authored directly from the frozen Japanese prompt/answer below.
const translations={
en:[
['Summarize carrots: the component introduced here, food uses, preferred climate, growing areas and sowing method.','Carrots are rich in carotene and used in cooking and juice. They grow well in cool climates, are cultivated across Japan and are direct-sown.'],
['For tomatoes, name the cultivation/seedling methods and when to remove the many side shoots.','Transplant cultivation and grafted seedlings are used. The many side shoots are removed while still small.'],
['What approximate fruit length is given as the cucumber harvest example? Does it set one value for every variety?','The example is about 20 cm. It is an example in the material, not one fixed harvest value for every variety.'],
['What kind of shrub is the tea plant, can it be harvested for several years after planting, and what is its field called?','It is an evergreen shrub. After planting, it can be harvested for many years. Its field is called a tea garden (茶園, chaen).'],
['What are forage crops? Name all five examples or groups listed in this lesson.','They are crops used as livestock feed. The listed examples are forage grasses, rice, maize, sorghum and oats.']
],
vi:[
['Tóm tắt về cà rốt: thành phần được giới thiệu, cách dùng làm thực phẩm, khí hậu thích hợp, vùng trồng và cách gieo.','Cà rốt giàu caroten, dùng trong nấu ăn và làm nước ép. Cây phát triển tốt ở khí hậu mát, được trồng khắp Nhật Bản và gieo thẳng.'],
['Đối với cà chua, nêu phương pháp trồng, loại cây giống được sử dụng và thời điểm tỉa nhiều chồi nách mọc ra.','Có phương pháp trồng bằng cây con và sử dụng cây giống ghép. Các chồi nách mọc nhiều được tỉa khi còn nhỏ.'],
['Ví dụ thu hoạch dưa chuột trong tài liệu nêu chiều dài quả khoảng bao nhiêu? Có quy định một giá trị chung cho mọi giống không?','Ví dụ là khoảng 20 cm. Đây là ví dụ trong tài liệu, không phải chiều dài thu hoạch cố định cho mọi giống.'],
['Cây chè thuộc loại cây bụi nào, sau khi trồng có thể thu hoạch nhiều năm không và ruộng trồng chè gọi là gì?','Đó là cây bụi thường xanh. Sau khi trồng có thể thu hoạch trong nhiều năm. Ruộng chè gọi là 茶園 (ちゃえん, chaen).'],
['Cây thức ăn chăn nuôi là gì? Nêu đủ năm ví dụ hoặc nhóm được liệt kê trong bài.','Đó là cây dùng làm thức ăn cho gia súc. Các ví dụ được nêu là cỏ thức ăn chăn nuôi, lúa, ngô, cao lương và yến mạch.']
],
id:[
['Ringkaslah wortel: kandungan yang diperkenalkan, penggunaan pangan, iklim yang disukai, daerah budidaya dan cara menabur.','Wortel kaya karoten dan digunakan untuk masakan serta jus. Wortel tumbuh baik di iklim sejuk, dibudidayakan di berbagai wilayah Jepang dan ditanam dengan menabur langsung.'],
['Untuk tomat, sebutkan cara budidaya/jenis bibit dan kapan tunas samping yang banyak harus dibuang.','Digunakan budidaya pindah tanam dan bibit sambung. Tunas samping yang banyak dibuang saat masih kecil.'],
['Berapa kira-kira panjang buah pada contoh panen mentimun dalam materi? Apakah nilainya tetap untuk semua varietas?','Contohnya sekitar 20 cm. Ini contoh dalam materi, bukan satu panjang panen tetap untuk semua varietas.'],
['Tanaman teh termasuk semak seperti apa, apakah bisa dipanen bertahun-tahun setelah ditanam, dan apa nama lahannya?','Tanaman teh adalah semak yang selalu hijau. Setelah ditanam, dapat dipanen selama bertahun-tahun. Lahannya disebut kebun teh (茶園, chaen).'],
['Apa itu tanaman pakan? Sebutkan kelima contoh atau kelompok yang tercantum dalam pelajaran.','Tanaman pakan digunakan sebagai pakan ternak. Contohnya rumput pakan, padi, jagung, sorgum dan oat.']
],
'zh-CN':[
['概括胡萝卜的主要成分、食用方式、适宜气候、栽培地区和播种方法。','胡萝卜富含胡萝卜素，可用于烹饪和榨汁。它适宜凉爽气候，在日本各地栽培，采用直播。'],
['说出番茄使用的栽培方式、苗的类型，以及何时去除大量长出的侧芽。','采用移栽栽培，也使用嫁接苗。大量长出的侧芽要在还小时去除。'],
['资料中的黄瓜采收例子给出的果长约为多少？这是所有品种统一的数值吗？','例子约为20cm。这是资料中的例子，并非所有品种统一固定的采收长度。'],
['茶树属于哪种灌木，种植后能否多年采收，其种植田称为什么？','茶树是常绿灌木。种植后可多年采收。种植茶树的田称为茶园（日语：茶園，ちゃえん）。'],
['什么是饲料作物？说出本课列举的全部五个例子或类别。','饲料作物是用作家畜饲料的作物。列举的例子是牧草、水稻、玉米、高粱和燕麦。']
],
'zh-TW':[
['概括胡蘿蔔的主要成分、食用方式、適宜氣候、栽培地區和播種方法。','胡蘿蔔富含胡蘿蔔素，可用於烹飪和榨汁。它適宜涼爽氣候，在日本各地栽培，採用直播。'],
['說出番茄使用的栽培方式、苗的類型，以及何時去除大量長出的側芽。','採用移栽栽培，也使用嫁接苗。大量長出的側芽要在還小時去除。'],
['資料中的胡瓜採收例子給出的果長約為多少？這是所有品種統一的數值嗎？','例子約為20cm。這是資料中的例子，並非所有品種統一固定的採收長度。'],
['茶樹屬於哪種灌木，種植後能否多年採收，其種植田稱為什麼？','茶樹是常綠灌木。種植後可多年採收。種植茶樹的田稱為茶園（日語：茶園，ちゃえん）。'],
['什麼是飼料作物？說出本課列舉的全部五個例子或類別。','飼料作物是用作家畜飼料的作物。列舉的例子是牧草、水稻、玉米、高粱和燕麥。']
],
hi:[
['गाजर का सार बताइए: यहाँ बताया गया प्रमुख घटक, खाद्य उपयोग, पसंदीदा जलवायु, खेती के क्षेत्र और बुवाई की विधि।','गाजर में कैरोटीन प्रचुर होता है और इसका उपयोग पकवान व रस बनाने में होता है। यह ठंडी जलवायु में अच्छी बढ़ती है, पूरे जापान में उगाई जाती है और सीधे बोई जाती है।'],
['टमाटर की खेती/पौध के तरीके और बहुत से पार्श्व अंकुरों को हटाने का समय बताइए।','रोपाई वाली खेती और कलम-जुड़ी पौध का उपयोग होता है। बहुत से पार्श्व अंकुर छोटे रहते ही हटा दिए जाते हैं।'],
['सामग्री में खीरे की कटाई के उदाहरण में फल की लगभग कितनी लंबाई दी गई है? क्या यह सभी किस्मों के लिए एक तय मान है?','उदाहरण लगभग 20 cm है। यह सामग्री का उदाहरण है, सभी किस्मों के लिए कटाई की एक निश्चित लंबाई नहीं।'],
['चाय का पौधा किस प्रकार की झाड़ी है, रोपने के बाद क्या कई वर्षों तक कटाई हो सकती है और उसके खेत को क्या कहते हैं?','यह सदाबहार झाड़ी है। रोपने के बाद कई वर्षों तक कटाई की जा सकती है। उसके खेत को चाय बागान (茶園, chaen) कहते हैं।'],
['चारा फसलें क्या हैं? पाठ में दिए गए सभी पाँच उदाहरण या समूह बताइए।','वे पशुओं के चारे के रूप में उपयोग की जाने वाली फसलें हैं। उदाहरण हैं चारा घास, धान, मक्का, ज्वार और जई।']
],
bn:[
['গাজরের পরিচয় সংক্ষেপে বলুন: উল্লেখিত প্রধান উপাদান, খাদ্য ব্যবহার, পছন্দের জলবায়ু, চাষের অঞ্চল ও বপন পদ্ধতি।','গাজরে ক্যারোটিন বেশি থাকে এবং রান্না ও রস তৈরিতে ব্যবহার হয়। এটি শীতল জলবায়ুতে ভালো বাড়ে, জাপানের বিভিন্ন অঞ্চলে চাষ হয় এবং সরাসরি বীজ বোনা হয়।'],
['টমেটোর চাষ/চারার পদ্ধতি এবং অনেক পার্শ্বকুঁড়ি কখন সরানো হয় তা বলুন।','চারা রোপণের মাধ্যমে চাষ এবং জোড়কলমের চারা ব্যবহার করা হয়। অনেক পার্শ্বকুঁড়ি ছোট থাকতেই সরানো হয়।'],
['উপকরণে শসা সংগ্রহের উদাহরণে ফলের আনুমানিক দৈর্ঘ্য কত? এটি কি সব জাতের জন্য একই নির্দিষ্ট মান?','উদাহরণটি প্রায় 20 cm। এটি উপকরণের একটি উদাহরণ, সব জাতের জন্য একই নির্দিষ্ট সংগ্রহ দৈর্ঘ্য নয়।'],
['চা গাছ কী ধরনের গুল্ম, লাগানোর পরে কি বহু বছর ফসল সংগ্রহ করা যায় এবং এর ক্ষেতকে কী বলে?','এটি চিরসবুজ গুল্ম। লাগানোর পরে বহু বছর ফসল সংগ্রহ করা যায়। এর ক্ষেতকে চা-বাগান (茶園, chaen) বলে।'],
['পশুখাদ্য ফসল কী? পাঠে দেওয়া পাঁচটি উদাহরণ বা দলের সবগুলো বলুন।','এগুলো গবাদিপশুর খাদ্য হিসেবে ব্যবহৃত ফসল। উদাহরণ হলো পশুখাদ্যের ঘাস, ধান, ভুট্টা, জোয়ার ও ওট।']
],
ne:[
['गाजरबारे सार बताउनुहोस्: यहाँ उल्लेखित मुख्य तत्त्व, खानेकुरामा प्रयोग, मनपर्ने हावापानी, खेती हुने क्षेत्र र बीउ छर्ने तरिका।','गाजरमा क्यारोटिन धेरै हुन्छ र खाना तथा जुसमा प्रयोग हुन्छ। यो शीतल हावापानीमा राम्रो बढ्छ, जापानभरि खेती गरिन्छ र सीधै बीउ छरिन्छ।'],
['टमाटरको खेती/बिरुवाका तरिका र धेरै आउने काखे मुन्टा हटाउने समय बताउनुहोस्।','बिरुवा सारेर खेती र कलमी बिरुवा प्रयोग गरिन्छ। धेरै आउने काखे मुन्टा सानै हुँदा हटाइन्छ।'],
['सामग्रीको काँक्रो टिप्ने उदाहरणमा फलको लम्बाइ लगभग कति छ? के यो सबै जातका लागि एउटै निश्चित मान हो?','उदाहरण लगभग 20 cm हो। यो सामग्रीको उदाहरण हो, सबै जातका लागि एउटै निश्चित टिप्ने लम्बाइ होइन।'],
['चियाको बोट कस्तो झाडी हो, रोपेपछि धेरै वर्ष टिप्न मिल्छ कि मिल्दैन र त्यसको खेतलाई के भनिन्छ?','यो सदाबहार झाडी हो। रोपेपछि धेरै वर्षसम्म टिप्न सकिन्छ। त्यसको खेतलाई चिया बगान (茶園, chaen) भनिन्छ।'],
['पशु आहारा बाली भनेको के हो? पाठमा दिइएका पाँचै उदाहरण वा समूह बताउनुहोस्।','ती पशुको आहाराका रूपमा प्रयोग हुने बाली हुन्। उदाहरणहरू घाँस, धान, मकै, ज्वार र जई हुन्।']
],
my:[
['မုန်လာဥနီအကြောင်းကို ဖော်ပြထားသော အဓိကဓာတ်၊ စားသုံးပုံ၊ နှစ်သက်သောရာသီဥတု၊ စိုက်ပျိုးဒေသနှင့် မျိုးစေ့ချနည်းအလိုက် အကျဉ်းချုပ်ပါ။','မုန်လာဥနီတွင် ကာရိုတင်းများပြီး ဟင်းချက်ရန်နှင့် ဖျော်ရည်လုပ်ရန် သုံးသည်။ အေးမြသောရာသီဥတုတွင် ကောင်းစွာကြီးထွားပြီး ဂျပန်နိုင်ငံအနှံ့ စိုက်ပျိုးကာ မျိုးစေ့ကို တိုက်ရိုက်ချသည်။'],
['ခရမ်းချဉ်သီး၏ စိုက်ပျိုးနည်း၊ ပျိုးပင်အမျိုးအစားနှင့် များစွာထွက်လာသော ဘေးတက်များကို ဖယ်ရှားချိန်ကို ပြောပါ။','ပျိုးပင်ပြောင်းစိုက်နည်းနှင့် အပင်ဆက်ပျိုးပင်ကို အသုံးပြုသည်။ များစွာထွက်လာသော ဘေးတက်များကို သေးငယ်နေစဉ် ဖယ်ရှားသည်။'],
['စာတမ်းရှိ သခွားသီးရိတ်သိမ်းသည့် ဥပမာတွင် အသီးအရှည် ဘယ်လောက်ခန့် ဖော်ပြထားသနည်း။ မျိုးကွဲအားလုံးအတွက် တစ်သတ်မှတ်တည်းလား။','ဥပမာမှာ20cmခန့် ဖြစ်သည်။ စာတမ်းရှိ ဥပမာသာဖြစ်ပြီး မျိုးကွဲအားလုံးအတွက် ရိတ်သိမ်းအရှည်တစ်ခုတည်း မဟုတ်ပါ။'],
['လက်ဖက်ပင်သည် မည်သည့်ချုံပင်အမျိုးအစားလဲ၊ စိုက်ပြီးနောက် နှစ်များစွာ ရိတ်သိမ်းနိုင်သလား၊ ၎င်းစိုက်ခင်းကို ဘာခေါ်သနည်း။','အမြဲစိမ်းချုံပင် ဖြစ်သည်။ စိုက်ပြီးနောက် နှစ်များစွာ ရိတ်သိမ်းနိုင်သည်။ ၎င်းစိုက်ခင်းကို လက်ဖက်စိုက်ခင်း (茶園၊ chaen) ဟုခေါ်သည်။'],
['တိရစ္ဆာန်အစာသီးနှံဆိုသည်မှာ ဘာလဲ။ သင်ခန်းစာပါ ဥပမာ သို့မဟုတ် အုပ်စုငါးမျိုးလုံးကို ပြောပါ။','မွေးမြူရေးတိရစ္ဆာန်အစာအဖြစ် အသုံးပြုသော သီးနှံများဖြစ်သည်။ ဥပမာများမှာ အစာမြက်၊ စပါး၊ ပြောင်းဖူး၊ ဆော်ဂမ်နှင့် အုတ်ဂျုံတို့ ဖြစ်သည်။']
],
th:[
['สรุปแครอตตามสารสำคัญที่กล่าวถึง การใช้เป็นอาหาร ภูมิอากาศที่ชอบ พื้นที่ปลูก และวิธีหว่านเมล็ด','แครอตมีแคโรทีนมาก ใช้ทำอาหารและน้ำผัก เจริญดีในอากาศเย็น ปลูกทั่วญี่ปุ่น และหว่านเมล็ดโดยตรง'],
['บอกวิธีปลูกหรือชนิดต้นกล้าของมะเขือเทศ และช่วงที่กำจัดหน่อข้างที่ออกมามาก','ใช้การย้ายกล้าปลูกและต้นกล้าเสียบยอด หน่อข้างที่ออกมามากจะถูกเด็ดออกขณะยังเล็ก'],
['ตัวอย่างการเก็บแตงกวาในเอกสารให้ความยาวผลประมาณเท่าใด เป็นค่าเดียวกันสำหรับทุกพันธุ์หรือไม่','ตัวอย่างคือประมาณ20cm เป็นตัวอย่างในเอกสาร ไม่ใช่ความยาวเก็บเกี่ยวที่กำหนดตายตัวสำหรับทุกพันธุ์'],
['ต้นชาเป็นไม้พุ่มแบบใด ปลูกแล้วเก็บเกี่ยวได้หลายปีหรือไม่ และแปลงปลูกเรียกว่าอะไร','เป็นไม้พุ่มไม่ผลัดใบ ปลูกแล้วเก็บเกี่ยวได้หลายปี แปลงปลูกเรียกว่าสวนชา (茶園, chaen)'],
['พืชอาหารสัตว์คืออะไร บอกตัวอย่างหรือกลุ่มทั้งห้าที่ระบุในบทเรียน','เป็นพืชที่ใช้เป็นอาหารปศุสัตว์ ตัวอย่างคือหญ้าอาหารสัตว์ ข้าว ข้าวโพด ข้าวฟ่าง และข้าวโอ๊ต']
],
km:[
['សង្ខេបអំពីការ៉ុត៖ សារធាតុសំខាន់ដែលបានបង្ហាញ ការប្រើជាអាហារ អាកាសធាតុដែលចូលចិត្ត តំបន់ដាំ និងវិធីសាបព្រោះ។','ការ៉ុតសម្បូរការ៉ូទីន ប្រើចម្អិនអាហារនិងធ្វើទឹកបន្លែ។ វាលូតលាស់ល្អក្នុងអាកាសធាតុត្រជាក់ ដាំនៅទូទាំងជប៉ុន និងសាបព្រោះគ្រាប់ដោយផ្ទាល់។'],
['ប្រាប់វិធីដាំឬប្រភេទកូនប៉េងប៉ោះ និងពេលដកពន្លកចំហៀងដែលដុះច្រើន។','ប្រើការស្ទូងនិងកូនប៉េងប៉ោះត។ ពន្លកចំហៀងដែលដុះច្រើនត្រូវដកចេញនៅពេលនៅតូច។'],
['ឧទាហរណ៍ប្រមូលត្រសក់ក្នុងឯកសារផ្តល់ប្រវែងផ្លែប្រហែលប៉ុន្មាន? តើជាតម្លៃថេរដូចគ្នាសម្រាប់គ្រប់ពូជឬទេ?','ឧទាហរណ៍គឺប្រហែល 20 cm។ នេះជាឧទាហរណ៍ក្នុងឯកសារ មិនមែនជាប្រវែងប្រមូលផលថេរសម្រាប់គ្រប់ពូជទេ។'],
['ដើមតែជាគុម្ពឈើប្រភេទអ្វី អាចប្រមូលផលច្រើនឆ្នាំក្រោយដាំឬទេ ហើយចម្ការរបស់វាហៅថាអ្វី?','វាជាគុម្ពឈើបៃតងជានិច្ច។ ក្រោយដាំអាចប្រមូលផលច្រើនឆ្នាំ។ ចម្ការរបស់វាហៅថាចម្ការតែ (茶園, chaen)។'],
['តើដំណាំចំណីសត្វជាអ្វី? ប្រាប់ឧទាហរណ៍ឬក្រុមទាំងប្រាំដែលមានក្នុងមេរៀន។','ជាដំណាំដែលប្រើជាចំណីបសុសត្វ។ ឧទាហរណ៍គឺស្មៅចំណីសត្វ ស្រូវ ពោត ស័រហ្គុម និងអូត។']
],
tl:[
['Ibuod ang karot ayon sa pangunahing sangkap na binanggit, gamit sa pagkain, gustong klima, lugar ng pagtatanim at paraan ng paghahasik.','Mayaman sa carotene ang karot at ginagamit sa pagluluto at juice. Maganda ang paglaki nito sa malamig na klima, itinatanim sa buong Japan at direktang inihahasik.'],
['Para sa kamatis, banggitin ang paraan ng pagtatanim o uri ng punla at kung kailan inaalis ang maraming supang sa gilid.','Ginagamit ang paglilipat-tanim at mga punlang pinagdugtong. Inaalis ang maraming supang sa gilid habang maliliit pa.'],
['Anong tinatayang haba ng bunga ang ibinigay na halimbawa sa pag-aani ng pipino? Iisang takdang halaga ba ito para sa lahat ng barayti?','Ang halimbawa ay humigit-kumulang 20 cm. Halimbawa ito sa materyal, hindi iisang takdang haba ng pag-aani para sa lahat ng barayti.'],
['Anong uri ng palumpong ang halamang tsaa, maaari ba itong anihin nang maraming taon pagkatanim, at ano ang tawag sa taniman nito?','Isa itong palumpong na laging luntian. Maaari itong anihin nang maraming taon pagkatanim. Tinatawag na taniman ng tsaa (茶園, chaen) ang bukid nito.'],
['Ano ang mga pananim na pakain sa hayop? Banggitin ang lahat ng limang halimbawa o pangkat sa aralin.','Mga pananim itong ginagamit na pakain sa mga alagang hayop. Ang mga halimbawa ay damong pakain, palay, mais, sorghum at oats.']
]
};
const r=pairs=>pairs.map(([text,readingKana])=>readingKana?{text,readingKana}:{text});
const specs=[
{id:'agr-reader-carrot-use-climate-sowing',lessonId:'agr-vegwork-rootvegetables',suffixes:['ROOTVEGETABLES-04','ROOTVEGETABLES-05'],paragraphs:[3,4],promptJa:'ニンジンの成分・食用の例・好む気候・栽培地域・種のまき方をまとめてください。',modelAnswerJa:'カロテンが豊富で、料理やジュースに利用します。涼しい気候で育ち、全国各地で栽培され、直まきします。',promptRuby:r([['ニンジンの'],['成分','せいぶん'],['・'],['食用','しょくよう'],['の'],['例','れい'],['・'],['好む','このむ'],['気候','きこう'],['・'],['栽培地域','さいばいちいき'],['・'],['種','たね'],['のまき'],['方','かた'],['をまとめてください。']]),modelAnswerRuby:r([['カロテンが'],['豊富','ほうふ'],['で、'],['料理','りょうり'],['やジュースに'],['利用','りよう'],['します。'],['涼しい','すずしい'],['気候','きこう'],['で'],['育ち','そだち'],['、'],['全国各地','ぜんこくかくち'],['で'],['栽培','さいばい'],['され、'],['直まき','じかまき'],['します。']])},
{id:'agr-reader-tomato-seedling-side-shoots',lessonId:'agr-vegwork-fruitvegetables',suffixes:['FRUITVEGETABLES-02'],paragraphs:[1],promptJa:'トマトの栽培方法と苗の利用、わき芽を取る時期を答えてください。',modelAnswerJa:'移植栽培やつぎ木苗を利用します。多く出るわき芽は、小さいうちに取ります。',promptRuby:r([['トマトの'],['栽培方法','さいばいほうほう'],['と'],['苗','なえ'],['の'],['利用','りよう'],['、わき'],['芽','め'],['を'],['取る','とる'],['時期','じき'],['を'],['答えて','こたえて'],['ください。']]),modelAnswerRuby:r([['移植栽培','いしょくさいばい'],['やつぎ'],['木苗','きなえ'],['を'],['利用','りよう'],['します。'],['多く','おおく'],['出る','でる'],['わき'],['芽','め'],['は、'],['小さい','ちいさい'],['うちに'],['取り','とり'],['ます。']])},
{id:'agr-reader-cucumber-source-length-example',lessonId:'agr-vegwork-fruitvegetables',suffixes:['FRUITVEGETABLES-04'],paragraphs:[3],promptJa:'資料のキュウリの収穫例は、果長が約何センチメートルですか。全品種に共通する固定値ですか。',modelAnswerJa:'約20cmです。資料の例であり、全品種の収穫の長さを一つに固定する値ではありません。',promptRuby:r([['資料','しりょう'],['のキュウリの'],['収穫例','しゅうかくれい'],['は、'],['果長','かちょう'],['が'],['約何','やくなん'],['センチメートルですか。'],['全品種','ぜんひんしゅ'],['に'],['共通','きょうつう'],['する'],['固定値','こていち'],['ですか。']]),modelAnswerRuby:r([['約','やく'],['20cmです。'],['資料','しりょう'],['の'],['例','れい'],['であり、'],['全品種','ぜんひんしゅ'],['の'],['収穫','しゅうかく'],['の'],['長さ','ながさ'],['を'],['一つ','ひとつ'],['に'],['固定','こてい'],['する'],['値','あたい'],['ではありません。']])},
{id:'agr-reader-tea-shrub-field-name',lessonId:'agr-vegwork-industrial',suffixes:['INDUSTRIAL-03'],paragraphs:[2],promptJa:'チャノキはどのような低木で、植えた後に何年も収穫できますか。その畑の名前は何ですか。',modelAnswerJa:'常緑の低木です。一度植えると何年も収穫でき、その畑を茶園と呼びます。',promptRuby:r([['チャノキはどのような'],['低木','ていぼく'],['で、'],['植えた','うえた'],['後','あと'],['に'],['何年','なんねん'],['も'],['収穫','しゅうかく'],['できますか。その'],['畑','はたけ'],['の'],['名前','なまえ'],['は'],['何','なん'],['ですか。']]),modelAnswerRuby:r([['常緑','じょうりょく'],['の'],['低木','ていぼく'],['です。'],['一度','いちど'],['植える','うえる'],['と'],['何年','なんねん'],['も'],['収穫','しゅうかく'],['でき、その'],['畑','はたけ'],['を'],['茶園','ちゃえん'],['と'],['呼び','よび'],['ます。']])},
{id:'agr-reader-forage-definition-five-examples',lessonId:'agr-vegwork-feed',suffixes:['FEED-01'],paragraphs:[0],promptJa:'飼料作物とは何ですか。本文にある五つの例や群を全て挙げてください。',modelAnswerJa:'家畜のえさに使う作物です。本文の例は、牧草・イネ・トウモロコシ・ソルガム・エンバクです。',promptRuby:r([['飼料作物','しりょうさくもつ'],['とは'],['何','なん'],['ですか。'],['本文','ほんぶん'],['にある'],['五つ','いつつ'],['の'],['例','れい'],['や'],['群','ぐん'],['を'],['全て','すべて'],['挙げて','あげて'],['ください。']]),modelAnswerRuby:r([['家畜','かちく'],['のえさに'],['使う','つかう'],['作物','さくもつ'],['です。'],['本文','ほんぶん'],['の'],['例','れい'],['は、'],['牧草','ぼくそう'],['・イネ・トウモロコシ・ソルガム・エンバクです。']])}
];
const rows=specs.map((s,i)=>{const l=lessons.find(x=>x.id===s.lessonId);assert(l);assert(!checks.some(c=>c.id===s.id));const units=s.suffixes.map(x=>ledger.knowledgeUnits.find(u=>u.knowledgeId==='agriculture-v2-AGR-K-VEGWORK-'+x));assert(units.every(u=>u.status==='partial'));const row={id:s.id,knowledgeId:units[0].knowledgeId,lessonId:l.id,levels:l.levels,promptJa:s.promptJa,modelAnswerJa:s.modelAnswerJa,promptRuby:s.promptRuby,modelAnswerRuby:s.modelAnswerRuby,translations:Object.fromEntries(Object.entries(translations).map(([k,v])=>[k,{prompt:v[i][0],modelAnswer:v[i][1],translatedFrom:'ja'}])),nativeReviewed:false,domainReviewed:false,sourceRefs:[...new Map(units.flatMap(u=>u.sourceRefs).map(x=>[JSON.stringify(x),x])).values()],answerOrigin:{parts:[{lessonId:l.id,paragraphIds:s.paragraphs.map(p=>l.paragraphs[p].id),sourceHash:l.sourceHash}]}};return row;});
// Preserve exact prior source/teaching review; add only the missing retrieval evidence.
const updates=specs.flatMap((s,i)=>s.suffixes.map(suffix=>{const id='agriculture-v2-AGR-K-VEGWORK-'+suffix,before=ledger.knowledgeUnits.find(x=>x.knowledgeId===id),after=structuredClone(before);after.after.assessment='present';after.status='covered_ai';after.unresolved=[];after.assessmentEvidence=[{checkId:rows[i].id,path:rp,jsonPointer:'/checks/'+(checks.length+i),sha256:h(rows[i]),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote:'New ungraded retrieval elicits the previously untested source facets explicitly. Answer reveal follows learner recall;12 direct Japanese-to-target translations, contextual readings; not practical mastery.'}];after.sourceReview={...after.sourceReview,reviewRef:rel+'self-review.json'};return{knowledgeId:id,beforeSha256:h(before),before,after};}));
for(const row of rows){assert.equal(Object.keys(row.translations).length,12);for(const f of ['prompt','modelAnswer'])assert.equal(row[f+'Ruby'].map(x=>x.text).join(''),row[f+'Ja']);}
fs.writeFileSync(out+'packet.json',JSON.stringify({schemaVersion:1,canonicalUpdates:updates,readerAdditions:rows,sharedContentPatches:[]},null,2)+'\n');
fs.writeFileSync(out+'self-review.json',JSON.stringify({schemaVersion:1,sector:'agriculture',lane:'vegetable',baselineCommit:'b06efcc97d2c526538aeceb2d6bb2eb525d2fc58',groups:[{group:'carrot-use-climate-sowing',units:specs[0].suffixes,sourcePages:['AGR-S1:57']},{group:'tomato-seedling-and-cucumber-harvest-example',units:[...specs[1].suffixes,...specs[2].suffixes],sourcePages:['AGR-S1:57','AGR-S1:58']},{group:'tea-name-and-forage-examples',units:[...specs[3].suffixes,...specs[4].suffixes],sourcePages:['AGR-S1:58','AGR-S1:59']}],sourceReview:'Preserves exact prior d-batch source pixel/text/ruby self-review and mapped element IDs; originalPDF bytes checked unchanged. Only assessment gaps are reopened here, not already covered units.',priorSourceReceipt:'docs/ssw-workspace/agriculture/continuation-20261103d/vegetable/self-review.json',sourcePdfHash:'20e865c154d43f1d22c44bc36e00179ca5dea42b248f57a46fd7205a3241eb3f',canonicalUpdates:6,coveredAiDeltaIfIntegrated:6,newReaderChecks:5,localePairs:60,lessonSourceHashesUnchanged:true,seedStorageAnd55SourceDecisionsPreserved:true,sourceCoveragePercent:null,wholeSourceKnowledgeCovered:false,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,limits:['No new lesson or entire-day completeness claim.','Root resolves symbolic checkId pointers after append order is fixed and runs integration/current-hash checks.','Full-source denominator, external specialist/native/device/actual-duration acceptance remain open.']},null,2)+'\n');
console.log({canonicalUpdates:updates.length,readerAdditions:rows.length,localePairs:rows.length*12,readerBaseLength:checks.length});
