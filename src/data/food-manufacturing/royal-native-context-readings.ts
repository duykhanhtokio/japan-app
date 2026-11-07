import data from './royal-native-context-readings.json';
import {foodManufacturingLesson,type FoodManufacturingLesson} from './index';

type ReadingSource={lessonId?:string;sourceHash?:string;referenceUrl?:string;wordJa:string;reading:string};
type LabelToken={text:string;reading?:string;sourceId?:string};
export function foodRoyalNativeLabelHasContext(lesson:FoodManufacturingLesson,text:string){
 return data.labels.some(e=>e.lessonId===lesson.id&&e.labelJa===text);
}
/** Readings apply to this exact visual label and source revision only. */
export function foodRoyalNativeLabelRuby(lesson:FoodManufacturingLesson,text:string):LabelToken[]|null{
 const entry=data.labels.find(e=>e.lessonId===lesson.id&&e.lessonSourceHash===lesson.sourceHash&&e.labelJa===text);
 if(!entry||entry.tokens.map(t=>t.text).join('')!==text)return null;
 const sources=data.sources as Record<string,ReadingSource>;
 for(const token of entry.tokens as LabelToken[]){
  if(!token.reading)continue;
  const source=token.sourceId?sources[token.sourceId]:undefined;
  if(!source||source.wordJa!==token.text||source.reading!==token.reading)return null;
  if(source.lessonId){
   const original=foodManufacturingLesson(source.lessonId,source.lessonId.startsWith('food-1-')?'1':'2');
   if(!original||original.sourceHash!==source.sourceHash)return null;
  }else if(!source.referenceUrl)return null;
 }
 return entry.tokens;
}
