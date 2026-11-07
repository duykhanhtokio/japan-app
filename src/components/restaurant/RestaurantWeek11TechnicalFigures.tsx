import {Image,Text,View} from 'react-native';
import type {SourceFigure31} from '@/data/restaurant/source31';
import {sameRestaurantFigureIdentity} from './RestaurantFigureIdentity';
import {RestaurantReading} from './RestaurantReading';
import data from '@/data/restaurant/royal-week11-technical.json';
const originalAnatomy=require('../../../assets/restaurant/source31/service1/rst31-service1-fig010.png');
export function restaurantWeek11TechnicalKind(figure:SourceFigure31):string|null{
 const b=data.bindings.find(x=>x.figureId===figure.id);if(!b||figure.quizSafe!==false||figure.cropBox||!sameRestaurantFigureIdentity(b.figure,figure))return null;
 const row=require('../../data/restaurant/source31/1.json').lessons[b.lessonId];return row?.sourceHash===b.rowSourceHash&&row.figures.some((f:SourceFigure31)=>sameRestaurantFigureIdentity(f,figure))?b.kind:null;
}
export function restaurantWeek11CaptionReading(figure:SourceFigure31){
 const b=data.captionReadings.find(x=>sameRestaurantFigureIdentity(x.figure,figure));if(!b||figure.quizSafe!==false||figure.cropBox)return undefined;const row=require('../../data/restaurant/source31/1.json').lessons[b.lessonId];return row?.sourceHash===b.rowSourceHash&&row.figures.some((f:SourceFigure31)=>sameRestaurantFigureIdentity(f,figure))?b.furigana:undefined;
}
/** Existing qualified cue conditions and original anatomy reference; no force/posture demonstration or clinical certification. */
export function RestaurantWeek11TechnicalFigure({kind,label,language='ja',showTranslation=false,width=320}:{kind:string;label:string;language?:string;showTranslation?:boolean;width?:number}){
 const w=Math.max(1,Math.min(760,width-24)),ink='#173c4b',labels=data.labels as Record<string,{ja:string;furigana:{text:string;reading?:string}[];translations:Record<string,string>}>,translated=showTranslation&&language!=='ja';
 const text=(key:string)=><View style={{gap:5,minWidth:0}}><RestaurantReading text={labels[key].ja} segments={labels[key].furigana}/>{translated&&labels[key].translations[language]&&<Text selectable style={{fontSize:17,lineHeight:28,color:'#344b61'}}>{labels[key].translations[language]}</Text>}</View>;
 if(kind==='choking-cues')return <View testID="restaurant-week11-native-choking-cues" style={{padding:12,gap:16,backgroundColor:'#fffaf0'}}>{[['cough','watch'],['weak','call']].map((keys,i)=><View key={i} testID={`restaurant-choking-cue-${i}`} style={{gap:10,padding:14,borderWidth:1,borderLeftWidth:5,borderColor:i?'#b37149':'#668c84',borderRadius:8}}><Text style={{fontSize:20,color:ink}}>{i+1}</Text>{text(keys[0])}<Text accessible={false} style={{fontSize:23,color:ink}}>↓</Text>{text(keys[1])}</View>)}{text('official')}</View>;
 if(kind==='anatomical-reference'){const b=data.bindings.find(x=>x.kind===kind);if(!b)return null;return <View testID="restaurant-week11-native-anatomical-reference" style={{padding:12,gap:14,backgroundColor:'#fffaf0'}}><Image testID="restaurant-original-anatomical-reference" source={originalAnatomy} accessibilityLabel={label} resizeMode="contain" style={{width:w,height:w*b.figure.height/b.figure.width}}/>{['adultBack','between','heel','exceptions','official'].map(key=><View key={key}>{text(key)}</View>)}</View>;}
 return null;
}
