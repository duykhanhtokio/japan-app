import {useState} from 'react';
import {Text,View,StyleSheet,type ViewStyle} from 'react-native';
import guideData from '@/data/restaurant/additional-guides.json';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';

type Segment={text:string;reading?:string};
type Label={id:string;labelJa:string;segments:Segment[];translations:Record<string,string>};
type Point=Label&{x:number;y:number;targetX:number;targetY:number};
type Form=Label&{descriptionJa:string;descriptionSegments:Segment[];descriptionTranslations:Record<string,string>};
type Guide={id:string;lessonIds:string[];titleJa:string;titleSegments:Segment[];titleTranslations:Record<string,string>;noteJa:string;noteSegments:Segment[];noteTranslations:Record<string,string>;labels?:Point[];forms?:Form[];results?:Label[];instruments?:Label[]};
const guides=guideData.guides as Guide[];
const pct=(n:number)=>`${n}%` as `${number}%`;
const ink='#315b63',body='#a5cdd1',fin='#6c9eaa',flesh='#e7af83';
function LabelText({item,language,translated}:{item:Label;language:string;translated:boolean}){
 return <><RestaurantReading text={item.labelJa} segments={item.segments}/>{translated&&item.translations[language]&&<TranslationText>{item.translations[language]}</TranslationText>}</>;
}
/** Original geometric side view, reversed relative to the reference page. Not species identification. */
function FishShape({state='round'}:{state?:string}){
 const fillet=state==='fillet',dress=state==='dress';
 if(fillet)return <View style={[s.fillet,{left:'12%',top:'34%',width:'75%',height:'35%'}]}><View style={s.filletSeam}/></View>;
 return <>
  <View style={s.tail}/>
  <View style={s.dorsal}/><View style={s.anal}/><View style={s.pelvic}/>
  <View style={[s.fishBody,dress&&{width:'62%',borderTopRightRadius:3,borderBottomRightRadius:3}]}/>
  <View style={s.lateral}/>
  {!dress&&<><View style={s.gill}/><View style={s.eye}/><View style={s.mouth}/><View style={s.pectoral}/></>}
  {state==='semidress'&&<View style={s.bellyOpening}/>}
 </>;
}
function FishAnatomy({labels}:{labels:Point[]}){
 const [width,setWidth]=useState(320),height=width/1.9;
 return <View testID="restaurant-fish-anatomy-drawing" accessible accessibilityLabel="魚の側面図。頭は右、尾は左。番号は下の部位一覧に対応します。" onLayout={e=>setWidth(e.nativeEvent.layout.width)} style={[s.canvas,{aspectRatio:1.9}]}>
  <FishShape/>
  {labels.map((p,i)=>{const x=p.x*width/100,y=p.y*height/100,tx=p.targetX*width/100,ty=p.targetY*height/100,dx=tx-x,dy=ty-y,length=Math.hypot(dx,dy);const line:ViewStyle={position:'absolute',left:(x+tx)/2-length/2,top:(y+ty)/2,width:length,height:1,backgroundColor:ink,transform:[{rotate:`${Math.atan2(dy,dx)*180/Math.PI}deg`}]};return <View key={p.id} accessible={false} style={StyleSheet.absoluteFill}><View style={line}/><View style={[s.number,{left:x-10,top:y-10}]}><Text allowFontScaling={false} style={s.numberText}>{i+1}</Text></View></View>;})}
 </View>;
}
function BoneFrame(){
 return <View accessible={false} style={s.smallCanvas}><View style={s.backbone}/>{Array.from({length:7},(_,i)=><View key={i} style={{position:'absolute',left:pct(19+i*9),top:'30%',height:'40%',width:2,backgroundColor:'#855d3d',transform:[{rotate:i%2?'18deg':'-18deg'}]}}/>)}</View>;
}
function Processing({forms,results,language,translated}:{forms:Form[];results:Label[];language:string;translated:boolean}){
 return <>
  <View testID="restaurant-three-part-result" style={s.grid}>{results.map((item,i)=><View key={item.id} style={s.resultCard}>{i===1?<BoneFrame/>:<View style={s.smallCanvas}><FishShape state="fillet"/></View>}<LabelText item={item} language={language} translated={translated}/></View>)}</View>
  <View style={s.grid}>{forms.map(item=><View key={item.id} testID={`restaurant-fish-state-${item.id}`} style={s.formCard}><View accessible accessibilityLabel={item.descriptionJa} style={s.smallCanvas}><FishShape state={item.id}/></View><LabelText item={item} language={language} translated={translated}/><RestaurantReading text={item.descriptionJa} segments={item.descriptionSegments}/>{translated&&item.descriptionTranslations[language]&&<TranslationText>{item.descriptionTranslations[language]}</TranslationText>}</View>)}</View>
 </>;
}
function Measurement({instruments,language,translated}:{instruments:Label[];language:string;translated:boolean}){
 return <View style={s.grid}>{instruments.map((item,i)=><View key={item.id} testID={`restaurant-measure-${item.id}`} style={s.formCard}>
  <View accessible accessibilityLabel={i===0?'中心温度計の先端が食品の中心に入る模式図。':'赤外線放射温度計が食品の表面を測る模式図。'} style={[s.smallCanvas,{height:150}]}>
   <View style={s.food}/>
   {i===0?<><View style={s.probeHandle}><View style={s.blankDisplay}/></View><View style={s.probe}/><View style={[s.measurePoint,{top:'68%'}]}/></>:<><View style={s.infraredHead}><View style={s.blankDisplay}/></View><View style={s.infraredGrip}/><View style={s.beam}/><View style={[s.measurePoint,{top:'47%'}]}/></>}
  </View>
  <LabelText item={item} language={language} translated={translated}/>
 </View>)}</View>;
}
export function RestaurantAdditionalGuides({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance(),translated=showTranslation&&language!=='ja';
 return <>{guides.filter(g=>g.lessonIds.includes(lessonId)).map(g=><View key={g.id} testID={`restaurant-additional-${g.id}`} style={[s.box,{borderColor:colors.border}]}>
  <RestaurantReading heading text={g.titleJa} segments={g.titleSegments}/>{translated&&g.titleTranslations[language]&&<TranslationText>{g.titleTranslations[language]}</TranslationText>}
  {g.id==='anatomy'&&g.labels&&<><FishAnatomy labels={g.labels}/><View style={s.grid}>{g.labels.map((item,i)=><View key={item.id} testID={`restaurant-fish-label-${item.id}`} style={s.legend}><Text style={[s.legendNumber,{color:colors.text}]}>{i+1}.</Text><View style={{flex:1,minWidth:0}}><LabelText item={item} language={language} translated={translated}/></View></View>)}</View></>}
  {g.id==='processing'&&g.forms&&g.results&&<Processing forms={g.forms} results={g.results} language={language} translated={translated}/>}
  {g.id==='measurement'&&g.instruments&&<Measurement instruments={g.instruments} language={language} translated={translated}/>}
  <RestaurantReading text={g.noteJa} segments={g.noteSegments}/>{translated&&g.noteTranslations[language]&&<TranslationText>{g.noteTranslations[language]}</TranslationText>}
 </View>)}</>;
}
const s=StyleSheet.create({
 box:{padding:12,gap:12,borderWidth:1,borderRadius:10},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},legend:{flexBasis:180,flexGrow:1,minWidth:140,flexDirection:'row',gap:7,alignItems:'flex-start'},legendNumber:{fontSize:17,lineHeight:43},
 canvas:{width:'100%',maxWidth:520,alignSelf:'center',backgroundColor:'#f4f4e9',borderRadius:8},smallCanvas:{height:115,width:'100%',maxWidth:300,alignSelf:'center',backgroundColor:'#f4f4e9',borderRadius:8,overflow:'hidden'},
 fishBody:{position:'absolute',left:'17%',top:'28%',width:'75%',height:'45%',borderRadius:999,borderWidth:2,borderColor:ink,backgroundColor:body},tail:{position:'absolute',left:'5%',top:'36%',width:'16%',height:'28%',borderWidth:2,borderColor:ink,backgroundColor:fin,transform:[{rotate:'45deg'}]},dorsal:{position:'absolute',left:'35%',top:'17%',width:'29%',height:'21%',backgroundColor:fin,borderTopLeftRadius:30,borderTopRightRadius:60,transform:[{rotate:'-12deg'}]},anal:{position:'absolute',left:'29%',top:'64%',width:'21%',height:'17%',backgroundColor:fin,borderBottomLeftRadius:25,borderBottomRightRadius:4,transform:[{rotate:'-12deg'}]},pelvic:{position:'absolute',left:'52%',top:'65%',width:'9%',height:'17%',backgroundColor:fin,borderBottomRightRadius:20,transform:[{rotate:'20deg'}]},pectoral:{position:'absolute',left:'61%',top:'51%',width:'15%',height:'13%',backgroundColor:fin,borderBottomLeftRadius:30,borderTopLeftRadius:3,transform:[{rotate:'-20deg'}]},gill:{position:'absolute',left:'73%',top:'31%',width:'8%',height:'39%',borderLeftWidth:2,borderColor:ink,borderRadius:30},eye:{position:'absolute',left:'83%',top:'39%',width:9,height:9,borderRadius:8,backgroundColor:'#172d33'},mouth:{position:'absolute',left:'88%',top:'51%',width:'4%',height:2,backgroundColor:ink},lateral:{position:'absolute',left:'22%',top:'51%',width:'48%',height:1,borderTopWidth:1,borderColor:ink,borderStyle:'dashed'},bellyOpening:{position:'absolute',left:'30%',top:'67%',width:'49%',height:5,backgroundColor:'#dfad7b',borderRadius:4},
 number:{position:'absolute',width:20,height:20,backgroundColor:'#fffdf4',borderWidth:1,borderColor:ink,borderRadius:12,alignItems:'center',justifyContent:'center'},numberText:{fontSize:12,lineHeight:17,color:ink,fontWeight:'700'},
 formCard:{flexBasis:220,flexGrow:1,minWidth:180,borderWidth:1,borderColor:'#8caaa8',borderRadius:8,padding:10,gap:7},resultCard:{flexBasis:130,flexGrow:1,minWidth:110,gap:6},fillet:{position:'absolute',backgroundColor:flesh,borderColor:'#aa704b',borderWidth:2,borderTopLeftRadius:35,borderBottomLeftRadius:35,borderTopRightRadius:5,borderBottomRightRadius:5,transform:[{rotate:'-6deg'}]},filletSeam:{position:'absolute',left:'9%',top:'46%',width:'80%',height:2,backgroundColor:'#fff5de'},backbone:{position:'absolute',left:'14%',top:'50%',width:'72%',height:3,backgroundColor:'#855d3d'},
 food:{position:'absolute',left:'17%',top:'48%',width:'67%',height:'42%',backgroundColor:'#e6b179',borderColor:'#9f6a3f',borderWidth:2,borderRadius:8},probeHandle:{position:'absolute',left:'44%',top:'6%',width:'14%',height:'29%',borderRadius:8,backgroundColor:'#477d85',padding:4},blankDisplay:{height:12,width:'70%',backgroundColor:'#dcebd6',alignSelf:'center',borderRadius:2},probe:{position:'absolute',left:'50%',top:'33%',width:3,height:'37%',backgroundColor:'#65767b'},measurePoint:{position:'absolute',left:'48%',width:10,height:10,borderWidth:2,borderColor:'#9c382e',borderRadius:8,backgroundColor:'#fffdf4'},infraredHead:{position:'absolute',left:'26%',top:'7%',width:'34%',height:'18%',backgroundColor:'#477d85',borderRadius:5,padding:4},infraredGrip:{position:'absolute',left:'30%',top:'23%',width:'10%',height:'21%',backgroundColor:'#477d85',borderRadius:4,transform:[{rotate:'14deg'}]},beam:{position:'absolute',left:'50%',top:'24%',width:1,height:'26%',backgroundColor:'#c2563c'},
});
