"""Source-reviewed assessment repair. No source text/assets are redistributed.

Run once against the stated baseline; the existing question bodies and answers
are preserved. New localized records are authored directly for the two new
competencies, not generated from a public translation service.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/hospitality'
DOC = ROOT / 'docs/ssw-workspace/hospitality'

def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

# Each tuple contains prompt, four ordered choices and explanation.
AUTHORED = {
'ja': [
('景色と料理を重視するお客様に宿泊施設を案内するとき、適切なのはどれですか。', ['どの客室でも同じ景色と料理だと確認せず約束する','関心を聞き、客室の眺望や料理の内容を確かめて説明する','景色や料理は予約に関係しないとして説明しない','地域の行事の日程だけを伝えて質問への回答を終える'], '眺望や料理も予約を判断する情報です。お客様の関心を確かめ、実際の客室やプランと照合して案内します。未確認の内容を一律に約束しません。'),
('販売できる客室の有無と用語の組合せとして正しいものはどれですか。', ['空室は空きがない状態、満室は空きがある状態','空室は宿泊料金が無料になる状態、満室は全室が同じ料金になる状態','空室は販売できる部屋がある状態、満室は空きがない状態','空室はチェックアウト後の清掃中だけ、満室は予約取消しがあった状態'], '空室・満室は、その宿泊希望日に提供できる部屋があるかを区別する語です。名称だけで料金や清掃状態を表すものではありません。予約の確約前に対象日の情報を確認します。')],
'en': [
('How should you advise a guest who values both the view and the food?', ['Promise the same view and food in every room without checking','Ask about their interests, check the room view and food offered, then explain','Decline to explain because views and food do not affect booking decisions','End the answer after giving only the dates of local events'], 'Views and food also inform booking decisions. Ask what matters to the guest and check the actual room and plan. Do not make blanket promises about unverified services.'),
('Which pairing correctly describes whether rooms are available for sale?', ['空室 means no vacancy; 満室 means rooms are available','空室 means a free stay; 満室 means every room has the same price','空室 means a room is available for sale; 満室 means there is no vacancy','空室 means only post-checkout cleaning; 満室 means a booking was cancelled'], '空室 and 満室 distinguish whether a room can be provided for the requested date. The terms alone do not describe prices or cleaning status. Check the relevant date before confirming a booking.')],
'vi': [
('Khi tư vấn cho khách coi trọng cả cảnh quan và món ăn, cách nào phù hợp?', ['Chưa kiểm tra nhưng hứa mọi phòng đều có cảnh quan và món ăn giống nhau','Hỏi điều khách quan tâm, kiểm tra cảnh nhìn từ phòng và món ăn rồi giải thích','Không giải thích vì cho rằng cảnh quan và món ăn không liên quan đến đặt phòng','Chỉ thông báo lịch sự kiện địa phương rồi kết thúc câu trả lời'], 'Cảnh quan và món ăn cũng giúp khách quyết định đặt phòng. Hãy hỏi điều khách coi trọng và đối chiếu với phòng, gói đang bán. Không hứa đồng loạt những nội dung chưa kiểm tra.'),
('Cặp giải thích nào đúng về tình trạng có phòng để bán?', ['空室 là không còn phòng; 満室 là còn phòng','空室 là được ở miễn phí; 満室 là mọi phòng cùng giá','空室 là còn phòng có thể bán; 満室 là không còn phòng trống','空室 chỉ là đang dọn sau trả phòng; 満室 là có khách hủy đặt phòng'], '空室 và 満室 phân biệt có thể cung cấp phòng vào ngày khách muốn ở hay không. Hai từ này tự chúng không mô tả giá hoặc tình trạng dọn phòng. Cần kiểm tra đúng ngày trước khi xác nhận đặt phòng.')],
'id': [
('Bagaimana melayani tamu yang mengutamakan pemandangan dan makanan?', ['Menjanjikan pemandangan dan makanan yang sama di semua kamar tanpa memeriksa','Menanyakan minat tamu, memeriksa pemandangan kamar serta makanan, lalu menjelaskan','Menolak menjelaskan karena pemandangan dan makanan dianggap tidak terkait pemesanan','Mengakhiri jawaban setelah hanya menyebut tanggal acara setempat'], 'Pemandangan dan makanan juga menjadi dasar keputusan pemesanan. Tanyakan hal yang penting bagi tamu dan cocokkan dengan kamar serta paket yang sebenarnya. Jangan menjanjikan secara menyeluruh hal yang belum diperiksa.'),
('Pasangan istilah mana yang benar tentang ketersediaan kamar untuk dijual?', ['空室 berarti tidak ada kamar kosong; 満室 berarti kamar tersedia','空室 berarti menginap gratis; 満室 berarti semua kamar berharga sama','空室 berarti ada kamar yang dapat dijual; 満室 berarti tidak ada kamar kosong','空室 hanya berarti sedang dibersihkan setelah check-out; 満室 berarti ada pembatalan'], '空室 dan 満室 membedakan apakah kamar dapat disediakan pada tanggal yang diminta. Istilah tersebut sendiri tidak menyatakan harga atau status pembersihan. Periksa tanggal terkait sebelum memastikan pemesanan.')],
'zh-CN': [
('向重视景观和餐食的客人介绍住宿设施时，哪种做法合适？', ['未经确认就承诺所有客房的景观和餐食都相同','了解客人的关注点，核实客房景观和餐食内容后说明','认为景观和餐食与预订无关，因此不作说明','只告知当地活动日期便结束回答'], '景观和餐食也是客人判断是否预订的信息。应了解客人重视什么，并与实际客房和套餐核对。不可对尚未确认的内容作统一承诺。'),
('关于是否有可销售客房，哪组术语说明正确？', ['空室表示没有空房，満室表示有空房','空室表示免费住宿，満室表示所有客房价格相同','空室表示有可销售的客房，満室表示没有空房','空室仅表示退房后正在清扫，満室表示发生了取消预订'], '空室和満室用于区分客人希望入住的日期是否可提供客房。这些名称本身不表示价格或清扫状态。确认预订前应核实相应日期的信息。')],
'zh-TW': [
('向重視景觀和餐食的客人介紹住宿設施時，哪種做法合適？', ['未經確認就承諾所有客房的景觀和餐食都相同','了解客人的關注點，核實客房景觀和餐食內容後說明','認為景觀和餐食與訂房無關，因此不作說明','只告知當地活動日期便結束回答'], '景觀和餐食也是客人判斷是否訂房的資訊。應了解客人重視什麼，並與實際客房和套裝方案核對。不可對尚未確認的內容作一致承諾。'),
('關於是否有可銷售客房，哪組術語說明正確？', ['空室表示沒有空房，満室表示有空房','空室表示免費住宿，満室表示所有客房價格相同','空室表示有可銷售的客房，満室表示沒有空房','空室僅表示退房後正在清掃，満室表示發生了取消訂房'], '空室和満室用於區分客人希望入住的日期是否可提供客房。這些名稱本身不表示價格或清掃狀態。確認訂房前應核實相應日期的資訊。')],
'hi': [
('दृश्य और भोजन दोनों को महत्त्व देने वाले अतिथि को ठहरने की सुविधा के बारे में कैसे बताना चाहिए?', ['जाँच किए बिना सभी कमरों में समान दृश्य और भोजन का वादा करना','अतिथि की रुचि पूछना, कमरे का दृश्य और भोजन जाँचना, फिर बताना','दृश्य और भोजन को बुकिंग से असंबंधित मानकर न बताना','केवल स्थानीय आयोजनों की तारीख बताकर उत्तर समाप्त करना'], 'दृश्य और भोजन भी बुकिंग के निर्णय में उपयोगी जानकारी हैं। अतिथि की प्राथमिकता पूछकर वास्तविक कमरे और पैकेज से मिलान करें। बिना जाँची बातों का सभी के लिए वादा न करें।'),
('बेचने के लिए कमरा उपलब्ध होने के बारे में शब्दों की कौन-सी जोड़ी सही है?', ['空室 का अर्थ कोई खाली कमरा नहीं; 満室 का अर्थ कमरा उपलब्ध है','空室 का अर्थ मुफ्त ठहरना; 満室 का अर्थ सभी कमरों की समान कीमत','空室 का अर्थ बेचने योग्य कमरा उपलब्ध है; 満室 का अर्थ कोई खाली कमरा नहीं','空室 केवल चेक-आउट के बाद सफाई को; 満室 बुकिंग रद्द होने को दर्शाता है'], '空室 और 満室 बताते हैं कि माँगी गई तारीख पर कमरा दिया जा सकता है या नहीं। ये शब्द अपने आप कीमत या सफाई की स्थिति नहीं बताते। बुकिंग पक्की करने से पहले संबंधित तारीख की जानकारी जाँचें।')],
'bn': [
('দৃশ্য ও খাবারকে গুরুত্ব দেওয়া অতিথিকে আবাসন সম্পর্কে কীভাবে জানানো উচিত?', ['যাচাই না করে সব কক্ষে একই দৃশ্য ও খাবারের প্রতিশ্রুতি দেওয়া','অতিথির আগ্রহ জেনে কক্ষের দৃশ্য ও খাবার যাচাই করে ব্যাখ্যা করা','দৃশ্য ও খাবার বুকিংয়ের সঙ্গে সম্পর্কিত নয় বলে ব্যাখ্যা না করা','শুধু স্থানীয় অনুষ্ঠানের তারিখ বলে উত্তর শেষ করা'], 'দৃশ্য ও খাবারও বুকিংয়ের সিদ্ধান্তে সাহায্য করে। অতিথির অগ্রাধিকার জেনে প্রকৃত কক্ষ ও প্যাকেজের সঙ্গে মিলিয়ে জানান। যাচাই না করা বিষয়ে সবার জন্য একরকম প্রতিশ্রুতি দেবেন না।'),
('বিক্রির জন্য কক্ষ পাওয়া যাওয়া সম্পর্কে কোন শব্দজোড়ার ব্যাখ্যা সঠিক?', ['空室 মানে কোনো খালি কক্ষ নেই; 満室 মানে কক্ষ আছে','空室 মানে বিনা মূল্যে থাকা; 満室 মানে সব কক্ষের একই দাম','空室 মানে বিক্রয়যোগ্য কক্ষ আছে; 満室 মানে খালি কক্ষ নেই','空室 শুধু চেক-আউটের পর পরিষ্কার করা; 満室 বুকিং বাতিল হওয়া বোঝায়'], '空室 ও 満室 দিয়ে বোঝানো হয় চাওয়া তারিখে কক্ষ দেওয়া সম্ভব কি না। শব্দ দুটি নিজে থেকে দাম বা পরিষ্কারের অবস্থা বোঝায় না। বুকিং নিশ্চিত করার আগে সংশ্লিষ্ট তারিখের তথ্য যাচাই করুন।')],
'ne': [
('दृश्य र खानालाई महत्त्व दिने पाहुनालाई आवासबारे जानकारी दिँदा कुन तरिका उचित हुन्छ?', ['नजाँची सबै कोठाको दृश्य र खाना उस्तै हुन्छ भनेर वाचा गर्ने','पाहुनाको रुचि सोध्ने, कोठाको दृश्य र खाना जाँचेर जानकारी दिने','दृश्य र खाना बुकिङसँग सम्बन्धित छैन भनेर जानकारी नदिने','स्थानीय कार्यक्रमको मिति मात्र बताएर उत्तर सक्ने'], 'दृश्य र खाना पनि बुकिङको निर्णयका लागि उपयोगी जानकारी हुन्। पाहुनाको प्राथमिकता सोधेर वास्तविक कोठा र प्याकेजसँग मिलाउनुहोस्। नजाँचेको कुरा सबैका लागि एउटै हुन्छ भनेर वाचा नगर्नुहोस्।'),
('बेच्न मिल्ने कोठाको उपलब्धताबारे कुन शब्दजोडीको व्याख्या सही छ?', ['空室 भनेको खाली कोठा छैन; 満室 भनेको कोठा उपलब्ध छ','空室 भनेको निःशुल्क बसाइ; 満室 भनेको सबै कोठाको एउटै मूल्य','空室 भनेको बेच्न मिल्ने कोठा उपलब्ध छ; 満室 भनेको खाली कोठा छैन','空室 ले चेक-आउटपछिको सरसफाइ मात्र र 満室 ले बुकिङ रद्द भएको जनाउँछ'], '空室 र 満室 ले मागिएको मितिमा कोठा दिन सकिन्छ कि सकिँदैन भन्ने छुट्याउँछन्। यी शब्दले आफैँ मूल्य वा सरसफाइको अवस्था जनाउँदैनन्। बुकिङ पक्का गर्नुअघि सम्बन्धित मितिको जानकारी जाँच्नुहोस्।')],
'my': [
('ရှုခင်းနှင့်အစားအစာကို အလေးထားသောဧည့်သည်အား တည်းခိုရာအကြောင်း မည်သို့ရှင်းပြသင့်သနည်း။', ['မစစ်ဆေးဘဲ အခန်းအားလုံးတွင် ရှုခင်းနှင့်အစားအစာတူညီသည်ဟု ကတိပေးခြင်း','ဧည့်သည်၏စိတ်ဝင်စားမှုကိုမေးပြီး အခန်းမှမြင်ကွင်းနှင့် အစားအစာကို စစ်ဆေးကာရှင်းပြခြင်း','ရှုခင်းနှင့်အစားအစာသည် ကြိုတင်စာရင်းသွင်းခြင်းနှင့်မဆိုင်ဟုဆိုကာ မရှင်းပြခြင်း','ဒေသပွဲရက်များကိုသာပြောပြီး အဖြေကိုအဆုံးသတ်ခြင်း'], 'ရှုခင်းနှင့်အစားအစာသည်လည်း ကြိုတင်စာရင်းသွင်းရန်ဆုံးဖြတ်ရာတွင် အသုံးဝင်သောအချက်အလက်များဖြစ်သည်။ ဧည့်သည်အလေးထားသည့်အရာကိုမေးပြီး တကယ့်အခန်းနှင့်အစီအစဉ်ကိုစစ်ဆေးပါ။ မစစ်ဆေးရသေးသောအရာကို တစ်ပုံစံတည်းကတိမပေးပါနှင့်။'),
('ရောင်းချနိုင်သောအခန်း ရှိမရှိနှင့်ပတ်သက်သည့် မည်သည့်ဝေါဟာရတွဲက မှန်သနည်း။', ['空室 သည် အခန်းလွတ်မရှိ၊ 満室 သည် အခန်းလွတ်ရှိဟုဆိုသည်','空室 သည် အခမဲ့တည်းခိုရခြင်း၊ 満室 သည် အခန်းအားလုံးဈေးတူခြင်းဖြစ်သည်','空室 သည် ရောင်းချနိုင်သောအခန်းရှိခြင်း၊ 満室 သည် အခန်းလွတ်မရှိခြင်းဖြစ်သည်','空室 သည် ထွက်ခွာပြီးသန့်ရှင်းရေးလုပ်နေခြင်းသာဖြစ်ပြီး 満室 သည် စာရင်းပယ်ဖျက်မှုရှိခြင်းဖြစ်သည်'], '空室 နှင့် 満室 သည် တောင်းဆိုထားသောနေ့တွင် အခန်းပေးနိုင်ခြင်းရှိမရှိကို ခွဲခြားသောဝေါဟာရများဖြစ်သည်။ ထိုစကားလုံးများက ဈေးနှုန်း သို့မဟုတ် သန့်ရှင်းရေးအခြေအနေကို မဆိုလိုပါ။ စာရင်းအတည်မပြုမီ သက်ဆိုင်ရာနေ့၏အချက်အလက်ကိုစစ်ဆေးပါ။')],
'th': [
('ควรแนะนำที่พักแก่ลูกค้าที่ให้ความสำคัญกับวิวและอาหารอย่างไร?', ['รับปากโดยไม่ตรวจสอบว่าทุกห้องมีวิวและอาหารเหมือนกัน','ถามความสนใจ ตรวจสอบวิวจากห้องและรายละเอียดอาหาร แล้วอธิบาย','ไม่อธิบายเพราะเห็นว่าวิวและอาหารไม่เกี่ยวกับการจอง','บอกเพียงวันจัดงานในท้องถิ่นแล้วจบคำตอบ'], 'วิวและอาหารก็เป็นข้อมูลประกอบการตัดสินใจจอง ควรถามสิ่งที่ลูกค้าให้ความสำคัญและตรวจสอบกับห้องและแพ็กเกจจริง ไม่รับปากแบบเหมารวมในเรื่องที่ยังไม่ได้ตรวจสอบ'),
('คำอธิบายคู่ใดถูกต้องเกี่ยวกับการมีห้องที่สามารถขายได้?', ['空室 หมายถึงไม่มีห้องว่าง ส่วน 満室 หมายถึงมีห้องว่าง','空室 หมายถึงพักฟรี ส่วน 満室 หมายถึงทุกห้องราคาเท่ากัน','空室 หมายถึงมีห้องที่สามารถขายได้ ส่วน 満室 หมายถึงไม่มีห้องว่าง','空室 หมายถึงกำลังทำความสะอาดหลังเช็กเอาต์เท่านั้น ส่วน 満室 หมายถึงมีการยกเลิกจอง'], '空室 และ 満室 ใช้แยกว่ามีห้องให้บริการในวันที่ลูกค้าต้องการหรือไม่ คำเหล่านี้ไม่ได้บอกราคาหรือสถานะการทำความสะอาดในตัวเอง ต้องตรวจสอบข้อมูลของวันที่เกี่ยวข้องก่อนยืนยันการจอง')],
'km': [
('តើគួរណែនាំកន្លែងស្នាក់នៅដល់ភ្ញៀវដែលឱ្យតម្លៃលើទេសភាពនិងអាហារយ៉ាងដូចម្តេច?', ['សន្យាថាបន្ទប់ទាំងអស់មានទេសភាពនិងអាហារដូចគ្នាដោយមិនពិនិត្យ','សួរចំណាប់អារម្មណ៍ ពិនិត្យទេសភាពពីបន្ទប់និងអាហារ រួចពន្យល់','មិនពន្យល់ដោយថាទេសភាពនិងអាហារមិនទាក់ទងនឹងការកក់','ប្រាប់តែថ្ងៃព្រឹត្តិការណ៍ក្នុងតំបន់ រួចបញ្ចប់ចម្លើយ'], 'ទេសភាពនិងអាហារក៏ជាព័ត៌មានសម្រាប់សម្រេចចិត្តកក់ដែរ។ ត្រូវសួរអ្វីដែលភ្ញៀវឱ្យតម្លៃ ហើយផ្ទៀងផ្ទាត់នឹងបន្ទប់និងកញ្ចប់សេវាពិតប្រាកដ។ កុំសន្យាដូចគ្នាទាំងអស់លើអ្វីដែលមិនទាន់ពិនិត្យ។'),
('តើការពន្យល់គូណាត្រឹមត្រូវអំពីការមានបន្ទប់អាចលក់បាន?', ['空室 មានន័យថាគ្មានបន្ទប់ទំនេរ ហើយ 満室 មានន័យថាមានបន្ទប់ទំនេរ','空室 មានន័យថាស្នាក់នៅឥតគិតថ្លៃ ហើយ 満室 មានន័យថាបន្ទប់ទាំងអស់តម្លៃដូចគ្នា','空室 មានន័យថាមានបន្ទប់អាចលក់បាន ហើយ 満室 មានន័យថាគ្មានបន្ទប់ទំនេរ','空室 មានន័យតែថាកំពុងសម្អាតក្រោយចាកចេញ ហើយ 満室 មានន័យថាមានការលុបការកក់'], '空室 និង 満室 បែងចែកថាតើអាចផ្តល់បន្ទប់នៅថ្ងៃដែលភ្ញៀវចង់ស្នាក់បានឬអត់។ ពាក្យទាំងនេះមិនបញ្ជាក់តម្លៃឬស្ថានភាពសម្អាតដោយខ្លួនវាទេ។ ត្រូវពិនិត្យព័ត៌មាននៃថ្ងៃនោះមុនបញ្ជាក់ការកក់។')],
'tl': [
('Paano dapat magpaliwanag sa bisitang pinahahalagahan ang tanawin at pagkain?', ['Ipangako nang hindi sinusuri na pareho ang tanawin at pagkain sa lahat ng kuwarto','Alamin ang interes, tiyakin ang tanawin mula sa kuwarto at ang pagkain, saka ipaliwanag','Huwag magpaliwanag dahil walang kaugnayan sa booking ang tanawin at pagkain','Ibigay lamang ang petsa ng lokal na mga pagtitipon at tapusin ang sagot'], 'Mahalaga rin ang tanawin at pagkain sa pagpapasya sa booking. Alamin ang prayoridad ng bisita at ihambing sa aktuwal na kuwarto at package. Huwag mangako nang pangkalahatan tungkol sa hindi pa nasusuri.'),
('Aling pares ng paliwanag ang tama tungkol sa pagkakaroon ng kuwartong maaaring ibenta?', ['Ang 空室 ay walang bakante; ang 満室 ay may bakanteng kuwarto','Ang 空室 ay libreng pananatili; ang 満室 ay pare-pareho ang presyo ng lahat ng kuwarto','Ang 空室 ay may kuwartong maaaring ibenta; ang 満室 ay walang bakante','Ang 空室 ay paglilinis lamang matapos mag-check-out; ang 満室 ay may kinanselang booking'], 'Ipinagkaiba ng 空室 at 満室 kung may kuwartong maibibigay sa hinihiling na petsa. Hindi ipinapahiwatig ng mga salita mismo ang presyo o kalagayan ng paglilinis. Suriin ang petsang iyon bago kumpirmahin ang booking.')],
}

def apply():
    data = json.loads((DATA/'front.json').read_text())
    lesson = data['lessons'][0]
    assert lesson['id'] == 'hotel-front-01'
    assert len(lesson['questions']) == 8, 'Already applied or unexpected baseline'
    old_revision = lesson['revision']
    q4 = lesson['questions'][3]
    view_ids = [k for k in q4['knowledgeIds'] if '-k0401-' in k]
    vacant_ids = [k for k in lesson['questions'][0]['knowledgeIds'] if '-k0202-' in k]
    assert len(view_ids) == len(vacant_ids) == 2
    q4['knowledgeIds'] = [k for k in q4['knowledgeIds'] if k not in view_ids]
    for i, (prompt, choices, explanation) in enumerate(AUTHORED['ja']):
        lesson['questions'].append({'id':f'hotel-front-01-q{9+i:02}', 'prompt':prompt,
            'choices':choices,'answerIndex':[1,2][i], 'explanation':explanation,
            'knowledgeIds':[view_ids,vacant_ids][i]})
    write(DATA/'front.json', data)
    for locale, authored in AUTHORED.items():
        if locale == 'ja': continue
        f = DATA/'translations'/locale/'front.json'
        t = json.loads(f.read_text()); target = next(l for l in t['lessons'] if l['id'] == lesson['id'])
        assert target['sourceRevision'] == old_revision
        assert len(target['questions']) == 8
        target['questions'][3]['knowledgeIds'] = q4['knowledgeIds']
        for i,(prompt,choices,explanation) in enumerate(authored):
            target['questions'].append({**lesson['questions'][8+i], 'prompt':prompt,'choices':choices,'explanation':explanation})
        write(f,t)
    ledger=json.loads((DOC/'front-ledger.json').read_text())
    for r in ledger:
        if r['knowledge_id'] in view_ids:r['question_ids']=['hotel-front-01-q09']
        if r['knowledge_id'] in vacant_ids:r['question_ids']=['hotel-front-01-q10']
    write(DOC/'front-ledger.json',ledger)
    atoms=json.loads((DOC/'source-atoms-authoring.json').read_text())
    question_map={q['id']:q for l in data['lessons'] for q in l['questions']}
    for aid,qid in [('HF1-007-06','hotel-front-01-q09'),('HF1-007-02','hotel-front-01-q10'),('HF2-011-03','hotel-front-06-q07')]:
        a=next(a for a in atoms['atoms'] if a['atomId']==aid);old=a['after']['questionIds']
        q=question_map[qid];a['after']['questionIds']=[qid]
        a['after']['questionEvidence']=[{'questionId':qid,'prompt':q['prompt'],'correctChoice':q['choices'][q['answerIndex']]}]
        a['review']['coverageV2AssessmentRepair']={'date':'2026-11-02','previousQuestionIds':old,
            'reason':'Exact competency self-review: old question did not directly assess this source claim; use the independently authored or already existing exact question.'}
    write(DOC/'source-atoms-authoring.json',atoms)
    print(json.dumps({'addedQuestions':2,'newQuestionLocalePairs':24,'correctedBindings':3,'oldRevision':old_revision}))

if __name__ == '__main__':apply()
