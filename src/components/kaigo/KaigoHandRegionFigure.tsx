import {KaigoIllustrationText as Text} from './KaigoIllustrationText';
import React from 'react';
import {Image,View,type ImageSourcePropType} from 'react-native';

/** Controlled locations on the original 1536x1024 art base; colors identify regions, not risk or counts. */
export const handRegionPoints=[{x:71.5,y:12.7},{x:68.4,y:37.1},{x:86.3,y:46.9},{x:28.65,y:73.6}];
export const handRegionLabels:Record<string,string[]>={
 ja:['手のひら','手の甲','指先・爪の周囲','指の間','親指','手首','色と番号は部位を示します。菌数や除菌率を示しません。'],
 en:['Palm','Back of hand','Fingertips and around nails','Between fingers','Thumb','Wrist','Colors and numbers identify regions, not bacterial counts or removal rates.'],
 vi:['Lòng bàn tay','Mu bàn tay','Đầu ngón tay và quanh móng','Kẽ ngón tay','Ngón cái','Cổ tay','Màu và số chỉ vị trí, không biểu thị số lượng vi khuẩn hay tỷ lệ loại bỏ.'],
 id:['Telapak tangan','Punggung tangan','Ujung jari dan sekitar kuku','Sela jari','Ibu jari','Pergelangan tangan','Warna dan angka menunjukkan bagian tangan, bukan jumlah bakteri atau tingkat penghilangan.'],
 tl:['Palad','Likod ng kamay','Dulo ng daliri at paligid ng kuko','Pagitan ng mga daliri','Hinlalaki','Pulsuhan','Tinutukoy ng kulay at numero ang mga bahagi, hindi ang dami ng bakterya o antas ng pagtanggal.'],
 th:['ฝ่ามือ','หลังมือ','ปลายนิ้วและรอบเล็บ','ซอกนิ้ว','นิ้วหัวแม่มือ','ข้อมือ','สีและตัวเลขใช้ระบุตำแหน่ง ไม่ได้แสดงจำนวนแบคทีเรียหรืออัตราการกำจัด'],
 ne:['हत्केला','हातको पछाडिको भाग','औँलाका टुप्पा र नङ वरिपरि','औँलाबीच','बूढीऔँला','नाडी','रङ र सङ्ख्याले भाग चिनाउँछन्; जीवाणुको सङ्ख्या वा हटाउने दर देखाउँदैनन्।'],
 hi:['हथेली','हाथ का पिछला भाग','उँगलियों के सिरे और नाखूनों के आसपास','उँगलियों के बीच','अंगूठा','कलाई','रंग और संख्याएँ भागों की पहचान के लिए हैं, जीवाणुओं की संख्या या हटाने की दर के लिए नहीं।'],
 bn:['হাতের তালু','হাতের পিঠ','আঙুলের ডগা ও নখের চারপাশ','আঙুলের ফাঁক','বুড়ো আঙুল','কবজি','রং ও সংখ্যা অংশ চিহ্নিত করে; জীবাণুর সংখ্যা বা অপসারণের হার বোঝায় না।'],
 my:['လက်ဖဝါး','လက်ဖမိုး','လက်ချောင်းထိပ်နှင့် လက်သည်းပတ်ဝန်းကျင်','လက်ချောင်းကြား','လက်မ','လက်ကောက်ဝတ်','အရောင်နှင့် နံပါတ်များသည် နေရာကိုသာ ဖော်ပြပြီး ပိုးမွှားအရေအတွက် သို့မဟုတ် ဖယ်ရှားနိုင်မှုနှုန်းကို မဖော်ပြပါ။'],
 km:['បាតដៃ','ខ្នងដៃ','ចុងម្រាមដៃ និងជុំវិញក្រចក','ចន្លោះម្រាមដៃ','មេដៃ','កដៃ','ពណ៌ និងលេខបង្ហាញតំបន់ មិនមែនចំនួនបាក់តេរី ឬអត្រាកម្ចាត់ទេ។'],
 'zh-CN':['手掌','手背','指尖及指甲周围','指缝','拇指','手腕','颜色和数字仅标示部位，不表示细菌数量或去除率。'],
 'zh-TW':['手掌','手背','指尖及指甲周圍','指縫','拇指','手腕','顏色和數字僅標示部位，不表示細菌數量或去除率。'],
};
export function KaigoHandRegionFigure({source,language='ja',expanded=false}:{source:ImageSourcePropType;language?:string;expanded?:boolean}){
 const translated=handRegionLabels[language]??handRegionLabels.ja;
 const labels=translated.map((label,i)=>language==='ja'||!handRegionLabels[language]?label:handRegionLabels.ja[i]+' / '+label);
 return <View testID="kaigo-royal-hand-regions" style={{width:expanded?1000:'100%'}}>
  <View style={{flexDirection:'row',padding:6}}>{[0,1].map(i=><Text key={i} style={{flex:1,textAlign:'center',color:'#243d4d',fontSize:16,fontWeight:'600'}}>{labels[i]}</Text>)}</View>
  <View style={{width:'100%',aspectRatio:1.5}}>
   <Image source={source} resizeMode="contain" accessibilityLabel={labels[0]+' / '+labels[1]} style={{width:'100%',height:'100%'}} />
   {handRegionPoints.map((p,i)=><View key={i} accessible accessibilityLabel={`${i+1}: ${labels[i+2]}`} style={{position:'absolute',left:`${p.x}%`,top:`${p.y}%`,width:24,height:24,marginLeft:-12,marginTop:-12,borderRadius:12,backgroundColor:'#243d4d',borderWidth:2,borderColor:'#fff8e9',alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff8e9',fontSize:13,fontWeight:'700'}}>{i+1}</Text></View>)}
  </View>
  <View style={{padding:8,gap:6}}>{labels.slice(2,6).map((label,i)=><Text key={i} style={{color:'#243d4d',fontSize:16}}>{i+1} · {label}</Text>)}<Text style={{color:'#526674',fontSize:14,lineHeight:21}}>{labels[6]}</Text></View>
 </View>;
}
