import {View} from 'react-native';
import type {RestaurantLesson} from '@/data/restaurant';
import {RoyalContentPanel} from '@/components/ui/RoyalPanels';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';
import data from '@/data/restaurant/royal-week09-reference-tables.json';
export function restaurantWeek09Reference(lesson:Pick<RestaurantLesson,'id'|'sourceHash'>){return data.figures.find(x=>x.lessonId===lesson.id&&x.lessonSourceHash===lesson.sourceHash);}
/** Exact name/category/purpose relationships, not occupational-scene substitutes or species photos. */
export function RestaurantWeek09ReferenceTables({lesson,language,showTranslation}:{lesson:Pick<RestaurantLesson,'id'|'sourceHash'>;language:string;showTranslation:boolean}){
 const figure=restaurantWeek09Reference(lesson);if(!figure)return null;
 const target=(figure.caption.translations as Record<string,{sourceHash:string;text:string}>)[language],valid=showTranslation&&language!=='ja'&&target?.sourceHash===figure.caption.sourceHash&&JSON.stringify({rows:figure.rows,captionJa:figure.caption.textJa})===figure.sourceSignature;
 const labels=valid?(figure.labels as Record<string,string[]>)[language]:undefined;
 return <View testID={`restaurant-native-week09-${figure.kind}`} style={{width:'100%',gap:10}}>
  {figure.rows.map((row,i)=><RoyalContentPanel key={row.id} style={{gap:8,borderLeftWidth:4,borderLeftColor:row.group==='category'?'#a48443':'#507c86'}}>
   <View testID={`week09-reference-${row.id}`} style={{gap:6}}><RestaurantReading heading text={row.ja} segments={row.segments}/>{labels?.[i]&&<TranslationText>{labels[i]}</TranslationText>}</View>
  </RoyalContentPanel>)}
  <RestaurantReading text={figure.caption.textJa} segments={figure.caption.furigana}/>{valid&&<TranslationText>{target.text}</TranslationText>}
 </View>;
}
