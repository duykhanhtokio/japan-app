// Shared vocational actions already have explicit translations in all supported locales.
export {manufacturingUi as hospitalityUi} from '@/data/manufacturing/ui';
const extra={
 ja:['宿泊分野','今日の目標','現場の例','振り返りの観点'],
 en:['Hospitality','Learning goals','Workplace example','Reflection points'],
 vi:['Khách sạn','Mục tiêu học','Ví dụ tại nơi làm việc','Điểm cần tự kiểm tra'],
 id:['Akomodasi','Tujuan belajar','Contoh di tempat kerja','Poin refleksi'],
 'zh-CN':['住宿领域','学习目标','工作场景示例','复习要点'],
 'zh-TW':['住宿領域','學習目標','工作情境範例','複習重點'],
 hi:['आतिथ्य क्षेत्र','सीखने के लक्ष्य','कार्यस्थल का उदाहरण','चिंतन के बिंदु'],
 bn:['আবাসন খাত','শেখার লক্ষ্য','কর্মক্ষেত্রের উদাহরণ','পর্যালোচনার বিষয়'],
 ne:['आवास क्षेत्र','सिकाइका लक्ष्य','कार्यस्थलको उदाहरण','पुनरावलोकनका बुँदा'],
 my:['တည်းခိုဝန်ဆောင်မှုကဏ္ဍ','သင်ယူမှု ရည်မှန်းချက်များ','လုပ်ငန်းခွင် ဥပမာ','ပြန်လည်သုံးသပ်ရန် အချက်များ'],
 th:['สาขาที่พัก','เป้าหมายการเรียนรู้','ตัวอย่างในสถานที่ทำงาน','ประเด็นทบทวน'],
 km:['វិស័យស្នាក់នៅ','គោលដៅសិក្សា','ឧទាហរណ៍នៅកន្លែងធ្វើការ','ចំណុចសម្រាប់ពិនិត្យឡើងវិញ'],
 tl:['Akomodasyon','Mga layunin sa pag-aaral','Halimbawa sa trabaho','Mga punto sa pagninilay'],
} as const;
export function hospitalityLabel(locale:string,index:0|1|2|3):string{return (extra[locale as keyof typeof extra]??extra.ja)[index];}
