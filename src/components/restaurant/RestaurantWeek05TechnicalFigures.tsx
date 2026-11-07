import {RestaurantReading} from './RestaurantReading';
import {sameRestaurantFigureIdentity} from './RestaurantFigureIdentity';
import {Image,Text,View} from 'react-native';
import type {SourceFigure31} from '@/data/restaurant/source31';
import data from '@/data/restaurant/royal-week05-technical.json';
import {RoyalContentPanel} from '@/components/ui/RoyalPanels';
const artwork=require('../../../assets/restaurant/royal-weekly-20261107/week05/emergency-support-roles.webp');
export function restaurantWeek05TechnicalKind(figure:SourceFigure31):string|null{
 const b=data.bindings.find(x=>x.figureId===figure.id);if(!b||figure.quizSafe!==false||figure.cropBox)return null;
 const f=b.figure;if(['sourceHash','assetFile','sha256','width','height','captionJa','altJa'].some(k=>(figure as any)[k]!==(f as any)[k]))return null;
 const pack=require('../../data/restaurant/source31/2.json'),row=pack.lessons[b.lessonId];return row?.sourceHash===b.rowSourceHash&&row.figures.some((x:SourceFigure31)=>sameRestaurantFigureIdentity(x,figure))?'emergency-roles':null;
}
export function RestaurantWeek05TechnicalFigure({language='ja',showTranslation=false,width=320}:{language?:string;showTranslation?:boolean;width?:number}){
 const w=Math.max(1,Math.min(480,width-24)),labels=data.labels as Record<string,string[]>,target=labels[language];
 const label=(i:number)=><View style={{gap:6}}><RestaurantReading paper text={labels.ja[i]} segments={data.labelRuby?.[i]?.textJa===labels.ja[i]?data.labelRuby[i].segments:undefined}/>{showTranslation&&language!=='ja'&&target?.[i]&&<Text selectable style={{fontSize:17,lineHeight:28,color:'#344b61'}}>{target[i]}</Text>}</View>;
 return <View testID="restaurant-week05-native-emergency-roles" style={{padding:12,gap:18}}>{[0,1,2].map(i=><RoyalContentPanel key={i} style={{gap:10}}>{label(i)}<View testID={`restaurant-emergency-role-${i}`} style={{width:'100%',maxWidth:w,aspectRatio:.5,position:'relative',overflow:'hidden'}}><Image source={artwork} accessibilityLabel={showTranslation&&language!=='ja'&&target?target[i]:labels.ja[i]} resizeMode="contain" style={{position:'absolute',width:'300%',height:'100%',left:`-${i*100}%`,top:0}}/></View></RoyalContentPanel>)}{label(3)}</View>;
}
