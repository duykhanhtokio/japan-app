import {Image,View} from 'react-native';
import illustrations from '@/data/restaurant/illustrations.json';
import bindings from '@/data/restaurant/royal-legacy-illustration-bindings.json';
import {restaurantLesson} from '@/data/restaurant';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {RoyalContentPanel} from '@/components/ui/RoyalPanels';
import {RestaurantReading} from './RestaurantReading';
const assets:Record<string,number>={
 'rst-img-vegetables-v1':require('../../../assets/restaurant/vegetables-v1.png'),
 'rst-img-meat-trays-v1':require('../../../assets/restaurant/meat-trays-v1.png'),
 'rst-img-kitchen-tools-v1':require('../../../assets/restaurant/kitchen-tools-v1.png'),
};
type Item={id:string;asset:string;lessonIds:string[];aspectRatio:number;captionJa:string;translations:Record<string,string>;sha256:string};
const identity=(item:Item)=>({id:item.id,asset:item.asset,lessonIds:item.lessonIds,aspectRatio:item.aspectRatio,captionJa:item.captionJa,translations:item.translations,sha256:item.sha256});
export function restaurantLegacyIllustrationBinding(item:Item,lessonId:string){
 const b=bindings.bindings.find(x=>x.id===item.id),lesson=restaurantLesson(lessonId,lessonId.startsWith('rst-1-')?'1':'2');
 return b&&item.lessonIds.includes(lessonId)&&lesson?.sourceHash===(b.lessonSourceHashes as Record<string,string>)[lessonId]&&JSON.stringify(identity(item))===JSON.stringify(b.identity)?b:null;
}
/** Preserve reviewed whole-object pixels; no stale source/caption/locale identity may relabel them. */
export function RestaurantIllustrations({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 return <>{illustrations.illustrations.filter(i=>i.lessonIds.includes(lessonId)).map(i=>{const b=restaurantLegacyIllustrationBinding(i,lessonId);if(!b)return null;const target=showTranslation&&language!=='ja'?(i.translations as Record<string,string>)[language]:undefined;return <RoyalContentPanel key={i.id} testID={`restaurant-legacy-illustration-${i.id}`} style={{gap:10}}>
 <Image testID={`restaurant-legacy-image-${i.id}`} source={assets[i.id]} accessibilityLabel={target||i.captionJa} resizeMode="contain" style={{width:'100%',aspectRatio:i.aspectRatio,backgroundColor:'#fffaf0',borderRadius:8}}/>
 <RestaurantReading text={i.captionJa} segments={b.captionFurigana}/>{target&&<TranslationText>{target}</TranslationText>}
 </RoyalContentPanel>;})}</>;
}
