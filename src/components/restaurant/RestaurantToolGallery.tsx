import {View,StyleSheet,type ViewStyle} from 'react-native';
import galleryData from '@/data/restaurant/tool-gallery.json';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';

type Segment={text:string;reading?:string};
type Label={labelJa:string;segments:Segment[];translations:Record<string,string>};
type Item=Label&{id:string;group:string;lessonIds:string[]};
type Group=Label&{id:string};
type Mark={x:number;y:number;w:number;h:number;fill:string;stroke?:string;radius?:number;rotate?:number;lineWidth?:number};
const data=galleryData as unknown as {titleJa:string;titleSegments:Segment[];titleTranslations:Record<string,string>;noteJa:string;noteSegments:Segment[];noteTranslations:Record<string,string>;groups:Group[];items:Item[]};
const steel='#a9bec4',edge='#304e59',dark='#40535a',wood='#cfa875',paper='#f1f5ee',blue='#4c9eae',screen='#d7e8ca';
const pct=(n:number)=>`${n}%` as `${number}%`;
/** All geometry is original. Shape examples do not specify a manufacturer, operating method or safe settings. */
function drawing(id:string):Mark[]{
 const a:Mark[]=[];
 const rect=(x:number,y:number,w:number,h:number,fill=steel,radius=2,rotate=0,stroke=edge)=>a.push({x,y,w,h,fill,radius,rotate,stroke,lineWidth:1.5});
 const oval=(x:number,y:number,w:number,h:number,fill=steel,stroke=edge)=>rect(x,y,w,h,fill,999,0,stroke);
 const line=(x:number,y:number,w:number,h:number,fill=edge,rotate=0)=>a.push({x,y,w,h,fill,rotate});
 const loop=(x:number,y:number,w:number,h:number)=>oval(x,y,w,h,'transparent');
 const holes=(x:number,y:number,cols:number,rows:number,dx:number,dy:number,size=2)=>{for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)oval(x+c*dx,y+r*dy,size,size*1.5,paper,paper);};
 const twoHandles=(y:number)=>{loop(12,y,16,10);loop(72,y,16,10);};
 const rim=(x:number,y:number,w:number,h:number)=>oval(x,y,w,h,paper);
 const dial=(x:number,y:number,size:number,hand=-35)=>{oval(x,y,size,size*1.5,paper);line(x+size*.5,y+size*.25,1,size*.55,edge,hand);for(let i=0;i<8;i++){const t=i*Math.PI/4;oval(x+size*.48+Math.cos(t)*size*.35,y+size*.72+Math.sin(t)*size*.53,1,1.5,edge,edge);}};
 const display=(x:number,y:number,w:number,h:number)=>rect(x,y,w,h,screen,2);
 if(['frying-pan','beijing-wok','canton-wok','perforated-pan','cooking-pan','deep-fryer-pan','yukihira','saucepan'].includes(id)){
  const single=['frying-pan','beijing-wok','perforated-pan','yukihira','saucepan'].includes(id);
  const black=['frying-pan','beijing-wok','canton-wok','deep-fryer-pan'].includes(id);
  const deep=['cooking-pan','deep-fryer-pan','saucepan'].includes(id),wok=['beijing-wok','canton-wok','perforated-pan'].includes(id);
  if(single)rect(62,25,31,6,id==='yukihira'?wood:dark,3,-20);
  else twoHandles(38);
  rect(single?12:24,wok?38:40,single?54:52,deep?35:wok?31:19,black?dark:steel,deep?8:24);
  oval(single?12:24,wok?32:34,single?54:52,wok?30:22,black?'#596970':steel);
  if(id==='perforated-pan')holes(23,40,5,3,7,7,2.2);
  if(id==='yukihira'){holes(21,47,5,2,7,6,1.5);line(12,39,8,3,steel,-20);}
  if(id==='saucepan'){oval(12,31,54,16,steel);rect(35,27,9,5,dark);}
  return a;
 }
 if(['stockpot','kitchen-pot','steamer'].includes(id)){
  const stock=id==='stockpot',steamer=id==='steamer';twoHandles(37);
  rect(27,stock?23:35,46,stock?57:steamer?39:35,steel,6);oval(27,stock?18:30,46,17,steel);
  oval(40,stock?15:27,20,6,dark);
  if(steamer){line(28,56,44,2);line(28,68,44,2);rect(28,38,44,12,'#cadade',0);holes(34,43,6,1,5,5,1.2);}
  if(id==='kitchen-pot')rect(48,18,5,10,steel,3);
  return a;
 }
 if(id==='kettle'){
  loop(30,13,40,46);rect(24,41,50,37,steel,16);oval(24,35,50,15,steel);oval(43,31,12,7,dark);
  rect(69,41,20,9,steel,3,-35);rect(81,28,8,20,steel,3,16);return a;
 }
 if(['santoku','nakiri','sashimi','cleaver','bread-knife'].includes(id)){
  const slim=id==='sashimi'||id==='bread-knife',tall=id==='cleaver';
  rect(10,slim?51:tall?36:43,29,9,wood,4);oval(16,54,2,3,edge);oval(27,54,2,3,edge);
  if(id==='sashimi')rect(76,45,9,13,steel,0,45);
  rect(38,slim?45:tall?27:34,id==='sashimi'?43:45,slim?13:tall?38:28,steel,id==='santoku'?10:1);
  line(39,slim?57:tall?64:61,id==='sashimi'?50:43,1,'#f4fbff');
  if(id==='bread-knife')for(let i=0;i<9;i++)rect(39+i*5,56,3,3,paper,0,45,paper);
  if(id==='cleaver')loop(74,32,3,4);return a;
 }
 if(id==='cutting-board'){
  for(let i=2;i>=0;i--)rect(15+i*2,31+i*5,68,36,i===0?paper:i===1?'#8dbda6':'#77a9c0',4);
  loop(22,39,8,5);return a;
 }
 if(['hotel-pan','shallow-tray'].includes(id)){
  const deep=id==='hotel-pan';rect(14,deep?32:43,72,deep?39:20,steel,5);rect(14,deep?30:41,72,deep?22:17,paper,5);rect(19,deep?35:46,62,deep?13:7,'#bed0d5',3);line(20,deep?60:59,60,2,'#7e989f');return a;
 }
 if(['bowl','steel-colander','plastic-colander'].includes(id)){
  const plastic=id==='plastic-colander',colander=id!=='bowl';
  rect(21,36,58,38,plastic?blue:steel,24);oval(18,29,64,28,plastic?'#9dcdd2':'#d6e3e5');oval(24,34,52,17,plastic?'#5498a5':steel);
  if(colander){for(let r=0;r<3;r++)for(let c=0;c<7;c++)rect(28+c*7,49+r*6,plastic?2:1,plastic?5:2,paper,1,0,paper);if(!plastic)for(let i=0;i<6;i++)line(26+i*9,42,1,25,'#78959b');}
  return a;
 }
 if(['wood-spatula','turner','rice-paddle'].includes(id)){
  const paddle=id==='rice-paddle';rect(47,15,6,42,id==='turner'?dark:wood,3,15);
  rect(paddle?36:id==='turner'?29:36,49,paddle?30:id==='turner'?42:28,paddle?31:27,id==='turner'?steel:wood,paddle?17:3,15);
  if(paddle)for(let i=0;i<4;i++)line(41+i*5,58,1,15,'#ac8654',15);
  if(id==='turner')line(48,46,3,10,steel,25);return a;
 }
 if(id==='chopsticks'){rect(32,14,2.5,70,wood,2,18);rect(52,14,2.5,70,wood,2,18);return a;}
 if(['otama','chinese-ladle','ladle','skimmer'].includes(id)){
  const chinese=id==='chinese-ladle',skim=id==='skimmer';rect(chinese?47:50,13,4,47,chinese?wood:steel,3,chinese?-15:10);
  oval(skim?31:35,55,skim?39:31,skim?22:27,skim?paper:steel);
  if(skim){for(let i=0;i<6;i++)line(35+i*5,59,1,15,'#92a7aa');for(let i=0;i<3;i++)line(34,60+i*5,31,1,'#92a7aa');}
  else oval(39,57,23,15,'#7d969e');
  if(id==='ladle')rect(49,9,9,8,steel,5);return a;
 }
 if(id==='whisk'){
  rect(47,11,7,30,dark,4);for(let i=0;i<4;i++)oval(34+i*5,36,33-i*10,47,'transparent');line(49,36,2,44);return a;
 }
 if(id==='noodle-basket'){
  rect(66,14,5,41,wood,3,12);rect(28,44,39,36,steel,9);oval(25,38,44,17,paper);for(let i=0;i<7;i++)line(31+i*5,53,1,22,'#617f88');for(let i=0;i<4;i++)line(30,55+i*6,34,1,'#617f88');return a;
 }
 if(id==='measuring-cup'){
  loop(67,36,18,30);rect(27,28,42,48,'#d4e4e6',4);oval(27,24,42,12,paper);for(let i=0;i<5;i++)line(34,39+i*6,i%2?8:15,1);return a;
 }
 if(id==='measuring-spoons'){
  loop(65,20,9,12);for(let i=0;i<4;i++){const bx=29+i*4,by=40+i*10,tx=69,ty=26,dx=(tx-bx)*1.5,dy=ty-by,len=Math.hypot(dx,dy),w=len/1.5;rect((bx+tx)/2-w/2,(by+ty)/2-1,w,2,steel,1,Math.atan2(dy,dx)*180/Math.PI);oval(bx-9+i,by-5,18-i*2,11-i,steel);}return a;
 }
 if(['digital-scale','dial-scale'].includes(id)){
  rect(24,66,52,14,steel,4);rect(34,36,32,34,steel,4);rect(22,26,56,7,steel,2);
  if(id==='digital-scale'){rect(27,54,46,20,dark,4);display(35,58,29,10);}else dial(36,40,28);return a;
 }
 if(['digital-probe','dial-probe'].includes(id)){
  if(id==='digital-probe'){rect(40,13,20,30,steel,6);display(43,21,14,10);rect(46,38,8,10,blue,2);}else dial(35,13,30);
  line(49,49,2,37,steel);return a;
 }
 if(id==='liquid-thermometer'){
  rect(37,12,26,76,paper,4);rect(48,20,5,54,'#d9e7e1',2);line(49,44,3,30,'#ba5441');oval(45,69,11,13,'#ba5441');for(let i=0;i<8;i++)line(39,23+i*6,6,1);return a;
 }
 if(id==='fridge-thermometer'){
  rect(17,30,48,35,steel,5);display(23,37,30,17);oval(56,39,5,8,blue);
  line(64,59,16,2,dark,10);rect(77,59,3,15,dark,3);line(78,73,9,2,steel,10);return a;
 }
 if(id==='hygrometer'){dial(29,19,42,20);return a;}
 if(id==='infrared'){
  rect(24,24,46,21,dark,5);display(31,27,24,13);rect(45,42,15,35,blue,5,15);rect(69,29,7,12,steel,2);return a;
 }
 if(id==='timer'){
  rect(30,19,41,61,steel,8);display(36,27,29,19);line(49,32,1.5,2);line(49,39,1.5,2);for(let i=0;i<3;i++)oval(36+i*10,57,7,10,i===2?'#be6655':paper);return a;
 }
 return a;
}
export function RestaurantToolDrawing({id,label}:{id:string;label:string}){
 const marks=drawing(id);
 return <View testID={`restaurant-tool-drawing-${id}`} accessible accessibilityRole="image" accessibilityLabel={label} style={s.canvas}>
  {marks.map((m,i)=>{const style:ViewStyle={position:'absolute',left:pct(m.x),top:pct(m.y),width:pct(m.w),height:pct(m.h),backgroundColor:m.fill,borderRadius:m.radius??0,borderColor:m.stroke,borderWidth:m.stroke?m.lineWidth??1:0,transform:m.rotate?[{rotate:`${m.rotate}deg`}]:undefined};return <View key={i} accessible={false} style={style}/>;})}
 </View>;
}
/** Scoped to matching lessons; importing this component does not alter other course content. */
export function RestaurantToolGallery({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance(),translated=showTranslation&&language!=='ja';
 const items=data.items.filter(item=>item.lessonIds.includes(lessonId));if(!items.length)return null;
 return <View testID="restaurant-tool-gallery" style={[s.box,{borderColor:colors.border}]}>
  <RestaurantReading heading text={data.titleJa} segments={data.titleSegments}/>{translated&&data.titleTranslations[language]&&<TranslationText>{data.titleTranslations[language]}</TranslationText>}
  <RestaurantReading text={data.noteJa} segments={data.noteSegments}/>{translated&&data.noteTranslations[language]&&<TranslationText>{data.noteTranslations[language]}</TranslationText>}
  {data.groups.filter(group=>items.some(item=>item.group===group.id)).map(group=><View key={group.id} style={s.group} testID={`restaurant-tool-group-${group.id}`}>
   <RestaurantReading heading text={group.labelJa} segments={group.segments}/>{translated&&group.translations[language]&&<TranslationText>{group.translations[language]}</TranslationText>}
   <View style={s.grid}>{items.filter(item=>item.group===group.id).map(item=><View key={item.id} testID={`restaurant-tool-card-${item.id}`} style={[s.card,{borderColor:colors.border}]}>
    <RestaurantToolDrawing id={item.id} label={translated?item.translations[language]??item.labelJa:item.labelJa}/>
    <RestaurantReading text={item.labelJa} segments={item.segments}/>{translated&&item.translations[language]&&<TranslationText>{item.translations[language]}</TranslationText>}
   </View>)}</View>
  </View>)}
 </View>;
}
const s=StyleSheet.create({box:{borderWidth:1,borderRadius:10,padding:12,gap:12},group:{gap:8},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},card:{flexBasis:200,flexGrow:1,minWidth:160,padding:10,gap:7,borderWidth:1,borderRadius:8},canvas:{width:'100%',maxWidth:240,aspectRatio:1.5,alignSelf:'center',backgroundColor:paper,borderRadius:8,overflow:'hidden'}});
