import {StyleSheet,Text,View,type ViewStyle} from 'react-native';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {restaurantLesson,restaurantLessonTranslation,type RestaurantLesson} from '@/data/restaurant';
import dailyData from '@/data/restaurant/daily-learning.json';
import {RestaurantReading} from './RestaurantReading';

type Mark={x:number;y:number;w:number;h:number;fill:string;radius?:number;stroke?:string;rotate?:number};
const ink='#324d56',steel='#b4cbd0',paper='#fff7e6',water='#91d3e0',food='#dfad65',green='#75ad85',red='#c45e5b';
const pct=(n:number)=>`${n}%` as `${number}%`;
/** Source-independent geometry: objects, spatial relationships, and unscaled example charts.
 * No photograph/recognition claim; no temperature, duration or legal limit inferred from geometry.
 */
export function restaurantDailyDrawing(family:string):Mark[]{
 const a:Mark[]=[];
 const rect=(x:number,y:number,w:number,h:number,fill=steel,radius=2,stroke=ink,rotate=0)=>a.push({x,y,w,h,fill,radius,stroke,rotate});
 const oval=(x:number,y:number,w:number,h:number,fill=steel,stroke=ink)=>rect(x,y,w,h,fill,999,stroke);
 const line=(x:number,y:number,w:number,h=1,fill=ink,rotate=0)=>rect(x,y,w,h,fill,0,fill,rotate);
 const segment=(x1:number,y1:number,x2:number,y2:number,fill=ink)=>{const width=Math.hypot(x2-x1,(y2-y1)/1.5);line((x1+x2)/2-width/2,(y1+y2)/2-.5,width,1,fill,Math.atan2((y2-y1)/1.5,x2-x1)*180/Math.PI);};
 const cross=(x:number,y:number,w:number,h:number)=>{line(x,y,w,h,red,35);line(x,y,w,h,red,-35);};
 const plate=(x:number,y:number,w=23)=>{oval(x,y,w,w*.95,paper);oval(x+w*.15,y+w*.15,w*.7,w*.65,paper);};
 const dots=(x:number,y:number,fill=red)=>{for(let i=0;i<7;i++)oval(x+(i%3)*3,y+Math.floor(i/3)*4,1.8,2.5,fill,fill);};
 const germ=(x:number,y:number)=>{oval(x,y,9,12,green);for(let i=0;i<4;i++){line(x-1+i*3,y-2,1,4,ink);line(x-1+i*3,y+10,1,4,ink);}};
 const label=(x:number,y:number,w=23,h=24)=>{rect(x,y,w,h,paper);for(let i=0;i<3;i++)line(x+3,y+4+i*5,w-6,.6);};
 const clock=(x:number,y:number,w=16)=>{oval(x,y,w,w*1.5,paper);line(x+w*.48,y+w*.3,1,w*.45);line(x+w*.48,y+w*.72,w*.3,1);};
 const person=(x:number,y:number)=>{oval(x+3,y,7,10,paper);rect(x,y+11,13,22,green);line(x+1,y+33,3,15);line(x+9,y+33,3,15);line(x-5,y+13,5,2,ink,-20);line(x+13,y+13,5,2,ink,20);};
 const tray=(x:number,y:number,w=35,h=30)=>{rect(x,y,w,h,steel,5);rect(x+2,y+2,w-4,h-4,paper,4);};
 const thermometer=(x:number,y:number)=>{rect(x,y,8,19,paper);rect(x+2,y+3,4,5,green,0);line(x+3,y+19,2,27);};
 const fridge=(x=12,y=10)=>{rect(x,y,32,76,paper);line(x,y+23,32);line(x+6,y+47,21);line(x+6,y+63,21);line(x+27,y+8,1,9);line(x+27,y+30,1,9);rect(x+5,y+34,11,10,food);rect(x+17,y+51,10,9,green);};
 const pot=(x=20,y=40,w=48)=>{rect(x,y,w,32,steel,5);oval(x,y-5,w,12,paper);line(x-7,y+5,7,3);line(x+w,y+5,7,3);};
 const hand=(x=30,y=40)=>{oval(x,y,24,24,paper);for(let i=0;i<4;i++)rect(x+i*5,y-12-i%2*3,4,24,paper,3);rect(x+20,y+8,12,5,paper,3,ink,-30);};
 const tap=()=>{rect(13,12,8,27,steel);rect(13,12,42,8,steel);rect(46,17,9,15,steel);line(24,8,18,3);for(let i=0;i<3;i++)line(47+i*3,34,1,12,water);};
 const board=(x:number,y:number,fill=food)=>{rect(x,y,31,29,fill,3);oval(x+26,y+3,2,3,paper);};
 const knife=(x:number,y:number)=>{rect(x,y,23,7,steel,0);rect(x+23,y,12,7,ink,2);};
 const bin=(x=18,y=27)=>{rect(x,y,28,48,steel,4);rect(x-2,y-7,32,8,green,2);line(x+8,y+8,1,26);line(x+18,y+8,1,26);};
 const table=(x=30,y=29,w=40,h=36)=>{rect(x,y,w,h,wood,3);};
 const wood='#c5a477';
 const floor=()=>{rect(9,10,82,76,paper,0);rect(63,10,17,4,green,0,green);rect(15,19,22,23,steel);rect(15,52,22,23,steel);line(53,29,2,40,green);line(53,29,15,2,green);};
 const chart=()=>{line(13,12,1,70);line(13,82,75,1);};
 const bars=(xs:number[],hs:number[])=>xs.forEach((x,i)=>rect(x,81-hs[i],9,hs[i],i%2?green:water,0));
 switch(family){
 case 'hazard':tray(30,30,39,36);germ(13,16);rect(75,12,13,29,paper);rect(79,7,6,6,red);rect(17,67,7,7,steel,0,ink,35);rect(79,68,6,11,steel,0,ink,-30);dots(43,40);break;
 case 'microbes':board(12,38);board(57,38,green);germ(23,20);germ(30,55);line(49,13,2,73,red);dots(63,42,green);break;
 case 'receiving':rect(12,28,40,45,food);line(12,44,40);line(32,28,1,45);label(60,24);thermometer(82,32);break;
 case 'cold-storage':fridge();thermometer(65,20);label(62,66,22,17);break;
 case 'separation':board(9,31);board(60,31,green);knife(7,68);knife(58,68);oval(17,37,14,16,red);oval(68,37,14,16,food);line(49,13,2,73,red);break;
 case 'washing':tray(8,35,37,38);tap();rect(66,25,17,43,paper);rect(70,17,9,9,red);line(69,46,11,2,water);oval(18,47,18,16,steel);break;
 case 'cleaning':floor();rect(59,40,8,24,green);line(63,23,1,30);bin(70,52);break;
 case 'health':person(16,17);hand(55,25);rect(66,37,7,3,paper);label(59,65,25,19);break;
 case 'handwashing':tap();hand(33,48);dots(35,45);dots(51,50);break;
 case 'cold-plate':plate(12,35,39);oval(20,43,22,16,green);thermometer(64,16);label(63,66,25,17);break;
 case 'probe':oval(13,35,57,36,food);oval(23,42,37,22,paper);oval(39,49,5,8,red);rect(76,15,10,15,paper);rect(78,18,6,5,green,0);segment(41.5,53,80,30);break;
 case 'cooling':chart();line(19,27,22,2,red,27);line(38,43,21,2,red,27);line(56,58,23,2,red,7);oval(18,22,3,5,red);oval(75,59,3,5,red);clock(69,14,10);break;
 case 'records':label(18,13,64,71);for(let i=1;i<3;i++)line(18+i*21,13,1,71);for(let i=0;i<5;i++)line(18,27+i*10,64,.6);[30,45,60].forEach(x=>oval(x,55,4,6,green));break;
 case 'water':tap();rect(65,17,21,40,paper);rect(68,34,15,19,water);rect(66,68,10,17,paper);rect(67,63,8,5,green);line(75,56,1,10,water);break;
 case 'pest':rect(14,12,71,71,paper);rect(36,12,10,12,ink,0);rect(66,58,13,17,food);oval(43,50,14,8,steel);oval(39,47,6,7,steel);line(55,54,12,1,ink,20);for(let i=0;i<3;i++)line(20+i*4,67,7,1,red,35);break;
 case 'waste':bin();rect(61,52,23,24,steel,0);for(let i=0;i<4;i++)line(64+i*5,56,1,16);rect(62,21,18,16,paper);line(71,38,1,10,water);break;
 case 'allergy':plate(12,40,35);label(53,20,30,42);for(let i=0;i<3;i++)rect(57,26+i*10,4,5,i===1?red:green,0);line(43,64,16,1);break;
 case 'recall':rect(13,22,26,42,food);label(15,37,22,16);label(58,20,27,54);line(37,47,21,1,red);line(37,52,21,1,green);break;
 case 'sample':for(let i=0;i<3;i++){rect(12+i*28,30,21,44,paper);rect(11+i*28,24,23,7,green);label(15+i*28,45,15,17);}break;
 case 'statistics':chart();bars([21,35,61,75],[34,53,51,24]);line(51,18,1,61,ink);label(40,4,18,11);break;
 case 'meat':tray(10,38,37,34);tray(55,38,37,34);oval(16,46,22,18,red);oval(62,46,22,18,food);label(16,14,23,18);label(61,14,23,18);break;
 case 'fish':oval(25,31,52,35,steel);rect(13,36,20,24,steel,0,ink,45);oval(68,41,3,5,ink);line(63,35,1,27);rect(43,24,13,14,steel,0,ink,35);line(33,49,25,1,ink);break;
 case 'vegetable':oval(12,22,19,35,green);line(21,26,1,41,green);oval(42,49,18,20,food);line(51,18,1,33,green);oval(45,17,12,13,green);oval(69,38,20,28,red);line(78,24,1,16,green);break;
 case 'defrost':tray(17,48,45,27);rect(23,33,32,25,food);line(29,45,18,1);thermometer(76,17);rect(14,24,50,55,'transparent',3,water);break;
 case 'cuts':for(let i=0;i<3;i++)oval(11+i*8,28,12,20,food);for(let i=0;i<3;i++)rect(42+i*8,31,8,16,food,6);for(let i=0;i<4;i++)rect(19+i*14,66,35,4,green,0,ink,-20);break;
 case 'browning':oval(15,24,28,41,paper);oval(57,24,28,41,food);line(29,22,1,42);line(71,22,1,42);oval(25,40,5,9,wood);oval(67,40,5,9,wood);clock(43,66,12);break;
 case 'boiling':pot();oval(22,39,44,9,water);for(let i=0;i<5;i++)oval(28+i*7,46+(i%2)*8,5,6,food);line(37,15,1,16,water,-15);line(49,15,1,16,water,15);break;
 case 'frying':pot(8,44,34);oval(9,42,32,9,food);oval(16,40,14,12,red);rect(58,51,32,16,steel);line(79,52,14,3);oval(63,47,14,8,food);break;
 case 'heat-methods':pot(9,45,35);oval(11,43,31,8,water);pot(56,45,34);line(58,41,29,1);for(let i=0;i<3;i++)line(61+i*9,20,1,20,water,10);line(13,81,27,2,red);line(60,81,26,2,red);break;
 case 'mixing':oval(21,45,59,33,steel);oval(21,39,59,21,paper);oval(31,43,39,14,green);line(58,22,3,32,ink,25);oval(52,47,13,6,food);break;
 case 'equipment':rect(9,39,34,40,steel);oval(16,28,19,18,ink);rect(52,14,32,65,paper);line(52,37,32);line(77,24,1,8);line(77,48,1,8);break;
 case 'tools':pot(9,45,36);knife(53,26);rect(62,54,17,22,paper);for(let i=0;i<4;i++)line(65,59+i*4,6,1);break;
 case 'measure':rect(10,53,39,18,steel);rect(8,49,43,5,paper);rect(18,58,18,7,green);oval(19,28,19,21,food);thermometer(72,19);break;
 case 'carry':rect(8,10,84,76,paper);rect(13,17,27,24,steel);rect(61,56,25,22,steel);rect(41,31,17,21,food);line(48,59,2,20,green);line(48,17,2,10,green);break;
 case 'blades':board(15,50);knife(15,28);hand(60,43);line(52,17,2,64,red);oval(22,54,13,16,green);break;
 case 'glass':plate(9,29,37);rect(21,39,21,4,paper,0,red,35);rect(30,55,9,6,paper,0,red,-25);plate(59,29,31);line(50,13,2,70,red);break;
 case 'fire':floor();rect(59,48,14,17,red);cross(57,51,18,2);line(45,68,2,10,green);line(45,68,9,2,green);break;
 case 'standard':plate(10,27,33);plate(57,27,33);oval(17,34,19,15,food);oval(64,34,19,15,food);line(44,45,11,1);label(37,69,26,15);break;
 case 'greeting':person(20,20);person(64,20);line(40,62,20,1);line(40,58,1,8);line(60,58,1,8);break;
 case 'tray':tray(12,24,76,55);plate(20,32,30);oval(62,33,13,17,paper);rect(66,49,3,14,paper);line(60,65,15,1);break;
 case 'japanese-table':tray(9,16,82,70);oval(17,50,24,20,paper);oval(59,50,24,20,wood);plate(37,24,28);line(21,78,58,1,wood);line(21,82,58,1,wood);break;
 case 'cutlery':plate(32,26,36);line(19,30,2,48);for(let i=0;i<3;i++)line(16+i*3,25,1,15);rect(78,26,3,51,steel);oval(87,26,7,17,steel);line(90,42,1,33);break;
 case 'roundtable':oval(21,10,60,78,wood);oval(35,28,32,42,paper);for(let i=0;i<6;i++){const t=i*Math.PI/3;oval(45+40*Math.cos(t),44+46*Math.sin(t),9,12,steel);}plate(40,35,20);break;
 case 'access':table(43,22,41,42);oval(13,51,23,31,steel);line(25,37,1,27);line(25,38,15,1);line(37,38,1,28);line(39,67,25,2,green);break;
 case 'takeaway':rect(14,40,47,31,paper,5);rect(12,32,51,9,steel,5);line(20,48,35,1);clock(72,24,17);label(20,76,34,13);break;
 case 'order':label(13,18,36,62);for(let i=0;i<3;i++)rect(17,32+i*11,6,7,green,0);person(65,25);line(47,52,17,1);break;
 case 'beverages':rect(14,34,12,38,green);rect(16,21,8,14,green);oval(39,29,18,30,paper);line(47,59,1,17);line(39,77,18,1);label(66,31,22,36);break;
 case 'nutrition':plate(26,17,52);oval(34,25,17,28,green);oval(54,26,15,17,food);oval(51,46,18,15,red);line(51,24,1,37,paper);break;
 case 'opening':floor();clock(63,40,16);rect(19,23,15,10,paper);rect(19,57,15,10,paper);break;
 case 'cashier':rect(11,38,37,32,steel);rect(18,24,23,17,green);line(15,62,28,1);label(61,21,23,42);oval(66,72,7,10,food);oval(77,72,7,10,food);break;
 case 'complaint':plate(10,33,31);label(48,22,23,46);person(78,30);line(35,55,13,1);break;
 case 'emergency':person(39,29);oval(14,20,72,67,'transparent',green);label(71,16,18,20);line(19,48,14,1,green);break;
 case 'queue':table(59,19,25,20);table(59,58,25,20);for(let i=0;i<3;i++){oval(12+i*10,30,7,10,paper);rect(11+i*10,41,9,16,green);}line(42,47,13,1,green);break;
 case 'additives':label(21,13,59,72);rect(25,21,50,12,water,0);rect(25,41,23,33,food,0);rect(52,41,23,33,green,0);line(30,51,14,1);line(56,61,15,1);break;
 case 'cost':rect(12,25,77,43,paper,0);rect(13,26,47,41,food,0);rect(60,26,28,41,green,0);line(12,78,77,1);line(12,74,1,8);line(89,74,1,8);break;
 case 'staffing':chart();bars([21,40,59,78],[24,48,60,30]);for(let i=0;i<4;i++)oval(22+i*19,10,7,10,paper);break;
 case 'marketing':chart();bars([25,42,65,82],[28,42,43,53]);line(57,14,1,66);break;
 case 'worktime':line(11,69,78,1);rect(13,41,25,20,water,0);rect(38,41,14,20,paper,0);rect(52,41,34,20,water,0);line(13,34,1,40);line(86,34,1,40);clock(44,9,12);break;
 case 'calendar':rect(16,16,69,68,paper,0);for(let i=1;i<7;i++)line(16+i*69/7,16,1,68);for(let i=1;i<5;i++)line(16,16+i*68/5,69,1);oval(39,43,7,10,green);oval(59,57,7,10,water);break;
 default:return [];
 }
 return a;
}

const figureHeading=[{text:'図',reading:'ず'},{text:'で'},{text:'確かめる',reading:'たしかめる'}];
const companionHeading=[{text:'関連',reading:'かんれん'},{text:'する'},{text:'場面',reading:'ばめん'},{text:'と'},{text:'照合',reading:'しょうごう'},{text:'する'}];
const noteSegments=[{text:'学習用',reading:'がくしゅうよう'},{text:'の'},{text:'模式図',reading:'もしきず'},{text:'です。'},{text:'寸法',reading:'すんぽう'},{text:'・'},{text:'数量',reading:'すうりょう'},{text:'・'},{text:'時間',reading:'じかん'},{text:'・'},{text:'安全限界',reading:'あんぜんげんかい'},{text:'を'},{text:'図',reading:'ず'},{text:'の'},{text:'比率',reading:'ひりつ'},{text:'から'},{text:'判断',reading:'はんだん'},{text:'しないでください。'},{text:'本文',reading:'ほんぶん'},{text:'の'},{text:'条件',reading:'じょうけん'},{text:'と'},{text:'照合',reading:'しょうごう'},{text:'してください。'}];
const bindingFor=(lesson:RestaurantLesson)=>dailyData.bindings.find(b=>b.lessonId===lesson.id&&b.sourceHash===lesson.sourceHash);
const labels:Record<string,{figure:string;note:string;companion:string}>={
 ja:{figure:'図で確かめる',note:'学習用の模式図です。寸法・数量・時間・安全限界を図の比率から判断しないでください。本文の条件と照合してください。',companion:'関連する場面と照合する'},
 en:{figure:'Check the illustration',note:'Schematic learning figure. Do not infer dimensions, quantities, times or safety limits from its proportions. Check the conditions in the text.',companion:'Compare a related situation'},
 vi:{figure:'Quan sát hình minh họa',note:'Hình khái quát dùng để học. Không suy kích thước, số lượng, thời gian hoặc giới hạn an toàn từ tỉ lệ hình; hãy đối chiếu điều kiện trong bài.',companion:'Đối chiếu với tình huống liên quan'},
 id:{figure:'Periksa ilustrasi',note:'Gambar skematis untuk belajar. Jangan menyimpulkan ukuran, jumlah, waktu atau batas aman dari proporsinya. Cocokkan dengan syarat dalam teks.',companion:'Bandingkan situasi terkait'},
 'zh-CN':{figure:'看图核对',note:'本图为学习示意图。不可从图中比例推断尺寸、数量、时间或安全限值，请核对正文条件。',companion:'对照相关场景'},
 'zh-TW':{figure:'看圖核對',note:'本圖為學習示意圖。不可從圖中比例推斷尺寸、數量、時間或安全限值，請核對正文條件。',companion:'對照相關場景'},
 hi:{figure:'चित्र देखकर जाँचें',note:'यह सीखने का सांकेतिक चित्र है। अनुपात से आकार, मात्रा, समय या सुरक्षा सीमा न निकालें। पाठ की शर्तें जाँचें।',companion:'संबंधित स्थिति से तुलना करें'},
 bn:{figure:'ছবি দেখে মিলিয়ে নিন',note:'এটি শেখার জন্য প্রতীকী ছবি। অনুপাত থেকে মাপ, পরিমাণ, সময় বা নিরাপত্তার সীমা অনুমান করবেন না। পাঠের শর্ত মিলিয়ে নিন।',companion:'সংশ্লিষ্ট পরিস্থিতির সঙ্গে তুলনা করুন'},
 ne:{figure:'चित्र हेरेर जाँच्नुहोस्',note:'यो सिकाइका लागि सांकेतिक चित्र हो। अनुपातबाट नाप, मात्रा, समय वा सुरक्षा सीमा ननिकाल्नुहोस्। पाठका सर्तसँग मिलाउनुहोस्।',companion:'सम्बन्धित अवस्थासँग तुलना गर्नुहोस्'},
 my:{figure:'ပုံကိုကြည့်၍စစ်ဆေးပါ',note:'သင်ယူရန် သရုပ်ပြပုံဖြစ်သည်။ ပုံအချိုးအစားမှ အရွယ်၊ ပမာဏ၊ အချိန် သို့မဟုတ် ဘေးကင်းကန့်သတ်ချက်ကို မခန့်မှန်းပါနှင့်။ စာပါအခြေအနေများနှင့်တိုက်ဆိုင်ပါ။',companion:'ဆက်စပ်အခြေအနေနှင့်နှိုင်းယှဉ်ပါ'},
 th:{figure:'ตรวจสอบจากภาพ',note:'ภาพนี้เป็นแผนภาพเพื่อการเรียนรู้ ห้ามอนุมานขนาด ปริมาณ เวลา หรือขีดจำกัดความปลอดภัยจากสัดส่วนภาพ โปรดเทียบเงื่อนไขในเนื้อหา',companion:'เทียบกับสถานการณ์ที่เกี่ยวข้อง'},
 km:{figure:'ពិនិត្យតាមរូបភាព',note:'នេះជារូបគំនូសសម្រាប់រៀន។ កុំសន្និដ្ឋានទំហំ បរិមាណ ពេលវេលា ឬកម្រិតសុវត្ថិភាពពីសមាមាត្ររូប។ ត្រូវផ្ទៀងផ្ទាត់លក្ខខណ្ឌក្នុងអត្ថបទ។',companion:'ប្រៀបធៀបនឹងស្ថានភាពពាក់ព័ន្ធ'},
 tl:{figure:'Suriin ang larawan',note:'Eskematiko ang larawang ito para sa pag-aaral. Huwag hulaan ang sukat, dami, oras o ligtas na hangganan batay sa proporsiyon. Tingnan ang mga kondisyon sa teksto.',companion:'Ihambing ang kaugnay na sitwasyon'},
};
export function RestaurantDailyFigure({lesson,language,showTranslation}:{lesson:RestaurantLesson;language:string;showTranslation:boolean}){
 const b=bindingFor(lesson),{colors}=useStudyAppearance();if(!b)return null;
 const marks=restaurantDailyDrawing(b.figureId.replace('rst-daily-',''));if(!marks.length)return null;
 const ui=labels[language]||labels.ja,t=restaurantLessonTranslation(lesson,language);
 return <View testID={`restaurant-daily-figure-${lesson.id}`} style={[s.figure,{borderColor:colors.border}]}>
  <RestaurantReading heading text={labels.ja.figure} segments={figureHeading}/>{showTranslation&&language!=='ja'&&<TranslationText>{ui.figure}</TranslationText>}
  <View accessible accessibilityRole="image" accessibilityLabel={showTranslation&&t?t.objective:lesson.objectiveJa} style={s.canvas}>{marks.map((m,i)=><View key={i} pointerEvents="none" style={{position:'absolute',left:pct(m.x),top:pct(m.y),width:pct(m.w),height:pct(m.h),backgroundColor:m.fill,borderRadius:m.radius??0,borderWidth:m.stroke?1:0,borderColor:m.stroke,transform:m.rotate?[{rotate:`${m.rotate}deg`}]:undefined} as ViewStyle}/>)}</View>
  <RestaurantReading text={lesson.objectiveJa} segments={lesson.furigana?.objective} terms={lesson.terms}/>{showTranslation&&t&&<TranslationText>{t.objective}</TranslationText>}
  <RestaurantReading text={labels.ja.note} segments={noteSegments}/>{showTranslation&&language!=='ja'&&<TranslationText>{ui.note}</TranslationText>}
 </View>;
}
export function RestaurantDailyCompanions({lesson,language,showTranslation}:{lesson:RestaurantLesson;language:string;showTranslation:boolean}){
 const binding=bindingFor(lesson),{colors}=useStudyAppearance();if(!binding?.companionReadings.length)return null;
 const ui=labels[language]||labels.ja;
 return <View testID={`restaurant-daily-companions-${lesson.id}`} style={[s.figure,{borderColor:colors.border}]}><RestaurantReading heading text={labels.ja.companion} segments={companionHeading}/>{showTranslation&&language!=='ja'&&<TranslationText>{ui.companion}</TranslationText>}
 {binding.companionReadings.map(b=>{const donor=restaurantLesson(b.lessonId,lesson.level);if(!donor||donor.sourceHash!==b.sourceHash)return null;const t=restaurantLessonTranslation(donor,language);return <View key={donor.id} style={s.companion}><RestaurantReading heading text={donor.titleJa} segments={donor.furigana?.title} terms={donor.terms}/>{showTranslation&&t&&<TranslationText>{t.title}</TranslationText>}{b.paragraphIds.map(id=>{const p=donor.paragraphs.find(x=>x.id===id);return p?<View key={id} style={s.paragraph}><RestaurantReading heading text={p.titleJa} segments={donor.furigana?.paragraphTitles?.[id]} terms={donor.terms}/><RestaurantReading text={p.textJa} segments={p.furigana} terms={donor.terms}/>{showTranslation&&t&&<TranslationText>{t.paragraphTitles[id]}{'\n'}{t.paragraphs[id]}</TranslationText>}</View>:null;})}</View>;})}
 </View>;
}
const s=StyleSheet.create({figure:{borderWidth:1,borderRadius:10,padding:12,gap:12},canvas:{width:'100%',maxWidth:680,aspectRatio:1.5,backgroundColor:paper,borderRadius:8,alignSelf:'center',overflow:'hidden'},companion:{gap:12},paragraph:{gap:8}});
