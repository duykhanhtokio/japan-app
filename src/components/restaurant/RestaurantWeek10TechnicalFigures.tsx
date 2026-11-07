import {Text,View} from 'react-native';
import type {SourceFigure31} from '@/data/restaurant/source31';
import {sameRestaurantFigureIdentity} from './RestaurantFigureIdentity';
import {RestaurantReading} from './RestaurantReading';
import data from '@/data/restaurant/royal-week10-technical.json';
export function restaurantWeek10TechnicalKind(figure:SourceFigure31):string|null{
 const b=data.bindings.find(x=>x.figureId===figure.id);if(!b||figure.quizSafe!==false||figure.cropBox||!sameRestaurantFigureIdentity(b.figure,figure))return null;
 const row=require('../../data/restaurant/source31/2.json').lessons[b.lessonId];return row?.sourceHash===b.rowSourceHash&&row.figures.some((f:SourceFigure31)=>sameRestaurantFigureIdentity(f,figure))?b.kind:null;
}
export function restaurantWeek10CaptionReading(figure:SourceFigure31){return restaurantWeek10TechnicalKind(figure)?data.bindings.find(x=>x.figureId===figure.id)?.captionFurigana:undefined;}
/** Controlled schematic relationships; no measured scale, damper operation or actual inspection procedure. */
export function RestaurantWeek10TechnicalFigure({label,language='ja',showTranslation=false,width=320}:{label:string;language?:string;showTranslation?:boolean;width?:number}){
 const w=Math.max(1,Math.min(680,width-24)),k=w/400,g=data.geometry,ink='#173c4b',paper='#fffaf0',labels=data.labels as Record<string,{ja:string;furigana?:{text:string;reading?:string}[];translations:Record<string,string>}>,translated=showTranslation&&language!=='ja';
 const text=(key:string)=><View style={{gap:5,minWidth:0}}><RestaurantReading text={labels[key].ja} segments={labels[key].furigana}/>{translated&&labels[key].translations[language]&&<Text selectable style={{fontSize:17,lineHeight:28,color:'#344b61'}}>{labels[key].translations[language]}</Text>}</View>;
 const line=(x1:number,y1:number,x2:number,y2:number,key:string,color=ink,thickness=3)=>{const l=Math.hypot(x2-x1,y2-y1)*k;return <View key={key} testID={key} pointerEvents="none" style={{position:'absolute',left:(x1+x2)/2*k-l/2,top:(y1+y2)/2*k-thickness*k/2,width:l,height:thickness*k,backgroundColor:color,transform:[{rotate:`${Math.atan2(y2-y1,x2-x1)*180/Math.PI}deg`}]}}/>;};
 const badge=(n:number,x:number,y:number)=><View style={{position:'absolute',left:x*k-12,top:y*k-12,width:24,height:24,borderRadius:12,backgroundColor:paper,borderWidth:1,borderColor:'#b78b41',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:17,color:ink}}>{n}</Text></View>;
 return <View style={{padding:12,gap:14,backgroundColor:paper}}><View testID="restaurant-week10-native-hood-damper" accessible accessibilityRole="image" accessibilityLabel={label} style={{width:w,height:300*k,position:'relative',overflow:'hidden',backgroundColor:paper}}>
 <View testID="restaurant-hood-duct" style={{position:'absolute',left:g.duct[0]*k,top:g.duct[1]*k,width:g.duct[2]*k,height:g.duct[3]*k,borderWidth:2,borderColor:ink,backgroundColor:'#d9e5e9'}}/>
 <View testID="restaurant-hood-damper-blade" style={{position:'absolute',left:g.damper[0]*k,top:g.damper[1]*k,width:g.damper[2]*k,height:g.damper[3]*k,borderRadius:3*k,backgroundColor:'#547485'}}/><View style={{position:'absolute',left:196*k,top:41*k,width:8*k,height:8*k,borderRadius:4*k,backgroundColor:ink}}/>
 {Array.from({length:85},(_,i)=>{const t=i/85,x=g.hoodTop[0]+(g.hoodBottom[0]-g.hoodTop[0])*t,ww=g.hoodTop[2]+(g.hoodBottom[2]-g.hoodTop[2])*t;return <View key={i} testID={`restaurant-hood-section-band-${i}`} style={{position:'absolute',left:x*k,top:(85+i)*k,width:ww*k,height:1.2*k,backgroundColor:'#afc3cd'}}/>;})}
 {line(130,85,270,85,'restaurant-hood-upper-edge')}{line(130,85,80,170,'restaurant-hood-left-edge')}{line(270,85,320,170,'restaurant-hood-right-edge')}{line(80,170,320,170,'restaurant-hood-lower-edge')}
 <View testID="restaurant-hood-cooker" style={{position:'absolute',left:g.cooker[0]*k,top:g.cooker[1]*k,width:g.cooker[2]*k,height:g.cooker[3]*k,borderWidth:2,borderColor:ink,backgroundColor:'#d9e5e9'}}/><View style={{position:'absolute',left:145*k,top:222*k,width:110*k,height:16*k,borderRadius:55*k,backgroundColor:'#dfb665'}}/>
 {g.exhaustX.map(x=><View key={x}>{line(x,222,x,180,'restaurant-exhaust-arrow-'+x,'#087d75',3)}{line(x-6,190,x,180,'restaurant-exhaust-arrow-head-a-'+x,'#087d75',3)}{line(x+6,190,x,180,'restaurant-exhaust-arrow-head-b-'+x,'#087d75',3)}</View>)}
 {line(295,130,345,130,'restaurant-hood-label-pointer')}{badge(1,358,130)}{line(160,45,110,45,'restaurant-duct-label-pointer')}{badge(2,96,45)}{line(235,45,325,45,'restaurant-damper-label-pointer')}{badge(3,340,45)}
 </View>{['hood','duct','damper'].map((key,i)=><View key={key} style={{flexDirection:'row',gap:10}}><Text style={{fontSize:18,color:ink}}>{i+1}.</Text><View style={{flex:1,minWidth:0}}>{text(key)}</View></View>)}{text('exhaust')}{text('note')}</View>;
}
