import {RestaurantReading} from './RestaurantReading';
import {restaurantTechnicalVisualReading} from './RestaurantTechnicalVisualReadings';
import {sameRestaurantFigureIdentity} from './RestaurantFigureIdentity';
import {Image,Text,View} from 'react-native';
import type {SourceFigure31} from '@/data/restaurant/source31';
import data from '@/data/restaurant/royal-week03-technical.json';
import labels from '@/data/restaurant/royal-week03-technical-labels.json';
const artwork=require('../../../assets/restaurant/royal-weekly-20261107/week03/fish-body-objects.webp');
const ink='#173c4b',paper='#fffaf0';
const temperaturePaths:{index:number;points:[number,number][];color:string}[]=[
 {index:0,points:[[0,138],[180,138]],color:'#176d9b'},
 {index:1,points:[[0,138],[95,22],[180,22]],color:'#b22b50'},
 {index:2,points:[[0,138],[50,22],[110,138],[140,138],[180,22]],color:'#94601d'},
];
/** Exact original identity and row revision are required. Quiz/cropped objects cannot enter this teaching override. */
export function restaurantWeek03TechnicalKind(figure:SourceFigure31):string|null{
 const binding=data.bindings.find(x=>x.figureId===figure.id);if(!binding||figure.quizSafe!==false||figure.cropBox)return null;
 const original=binding.figure;
 if(figure.sourceHash!==original.sourceHash||figure.assetFile!==original.assetFile||figure.sha256!==original.sha256||figure.width!==original.width||figure.height!==original.height||figure.captionJa!==original.captionJa||figure.altJa!==original.altJa)return null;
 const pack=binding.level==='1'?require('../../data/restaurant/source31/1.json'):require('../../data/restaurant/source31/2.json');
 const row=pack.lessons[binding.lessonId];
 return row?.sourceHash===binding.rowSourceHash&&row.figures.some((f:SourceFigure31)=>sameRestaurantFigureIdentity(f,figure))?binding.kind:null;
}
function Label({index,language,showTranslation}:{index:number;language:string;showTranslation:boolean}){
 const ja=labels.ja[index],target=(labels as Record<string,string[]>)[language]?.[index];
 return <View style={{gap:4}}><RestaurantReading text={ja} segments={restaurantTechnicalVisualReading(ja)}/>{showTranslation&&language!=='ja'&&target&&<Text selectable style={{fontSize:17,lineHeight:27,color:'#344b61'}}>{target}</Text>}</View>;
}
/** Pixel windows select detailed object art only. All quantities and markers are code, not inferred from generated imagery. */
function FishObject({part,width=280}:{part:'whole'|'fillet'|'frame';width?:number}){
 const crop=part==='whole'?{y:0,h:480}:part==='fillet'?{y:480,h:380}:{y:860,h:452},scale=width/1199;
 return <View testID={`restaurant-fish-object-${part}`} style={{width,height:crop.h*scale,overflow:'hidden',position:'relative'}}><Image source={artwork} resizeMode="contain" accessibilityIgnoresInvertColors style={{position:'absolute',left:0,top:-crop.y*scale,width,height:1312*scale}}/></View>;
}
function Segment({from,to,color,width=2}:{from:[number,number];to:[number,number];color:string;width?:number}){
 const dx=to[0]-from[0],dy=to[1]-from[1];return <View style={{position:'absolute',left:(from[0]+to[0])/2-Math.hypot(dx,dy)/2,top:(from[1]+to[1])/2-width/2,width:Math.hypot(dx,dy),height:width,backgroundColor:color,transform:[{rotate:`${Math.atan2(dy,dx)*180/Math.PI}deg`}]}}/>;
}
export function RestaurantWeek03TechnicalFigure({kind,language='ja',showTranslation=false,width=320}:{kind:string;language?:string;showTranslation?:boolean;width?:number}){
 const usable=Math.max(180,Math.min(620,width-24)),props={language,showTranslation};
 if(kind==='temperature')return <View testID="restaurant-native-temperature-paths" style={{gap:18,padding:12,backgroundColor:paper}}>{temperaturePaths.map(({index,points,color})=><View key={String(index)} style={{gap:8}}><Label index={index} {...props}/><View accessible accessibilityRole="image" accessibilityLabel={labels.ja[index]} style={{height:170,marginLeft:50}}><View style={{position:'absolute',top:48,left:0,width:180,height:72,backgroundColor:'#ffefd8'}}/><Text style={{position:'absolute',left:-48,top:35,fontSize:17,color:ink}}>60°C</Text><Text style={{position:'absolute',left:-48,top:109,fontSize:17,color:ink}}>10°C</Text><View style={{height:156,width:190,borderLeftWidth:1,borderBottomWidth:1,borderColor:ink}}>{points.slice(1).map((p,i)=><Segment key={i} from={points[i]} to={p} color={color} width={3}/>)}</View></View></View>)}</View>;
 if(kind==='fillets')return <View testID="restaurant-native-fillet-counts" style={{gap:20,padding:12,backgroundColor:paper}}>{[2,4].map(count=><View key={count} testID={`restaurant-fillet-group-${count}`} style={{gap:8}}><Label index={count===2?3:4} {...props}/><Text style={{fontSize:22,color:ink}}>{count} + 1 = {count+1}</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:6,justifyContent:'center'}}>{Array.from({length:count},(_,i)=><FishObject key={i} part="fillet" width={count===2?usable*.46:usable*.45}/>)}</View><FishObject part="frame" width={usable}/></View>)}</View>;
 if(kind!=='preparation')return null;
 const fishWidth=Math.min(usable,440),fishHeight=fishWidth*480/1199;
 return <View testID="restaurant-native-fish-preparation" style={{gap:18,padding:12,backgroundColor:paper}}>{[5,6,7,8,9].map(index=><View key={index} style={{gap:8}}><Label index={index} {...props}/><View style={{width:fishWidth,height:fishHeight,position:'relative'}}><FishObject part="whole" width={fishWidth}/>{index===5?<><Segment from={[fishWidth*.18,fishHeight*.34]} to={[fishWidth*.78,fishHeight*.34]} color="#087d84" width={3}/><View style={{position:'absolute',left:fishWidth*.78-7,top:fishHeight*.34-6,width:0,height:0,borderTopWidth:6,borderBottomWidth:6,borderLeftWidth:12,borderTopColor:'transparent',borderBottomColor:'transparent',borderLeftColor:'#087d84'}}/></>:index===6?<View style={{position:'absolute',left:fishWidth*.74,top:fishHeight*.31,width:fishWidth*.07,height:fishHeight*.46,borderWidth:2,borderColor:'#bb4941',borderRadius:100}}/>:index===7?<Segment from={[fishWidth*.75,fishHeight*.69]} to={[fishWidth*.39,fishHeight*.86]} color="#bb4941" width={3}/>:index===8?<View style={{position:'absolute',left:fishWidth*.57,top:fishHeight*.75,width:fishWidth*.07,height:fishHeight*.08,backgroundColor:'#087d84',borderRadius:20}}/>:<Segment from={[fishWidth*.78,fishHeight*.3]} to={[fishWidth*.7,fishHeight*.85]} color="#bb4941" width={3}/>}</View></View>)}</View>;
}
