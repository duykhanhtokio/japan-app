import {Image,Text,View} from 'react-native';
import illustrations from '@/data/restaurant/illustrations.json';
import {useStudyAppearance,TranslationText} from '@/components/tokutei/StudyAppearance';
const assets:Record<string,number>={
 'rst-img-vegetables-v1':require('../../../assets/restaurant/vegetables-v1.png'),
 'rst-img-meat-trays-v1':require('../../../assets/restaurant/meat-trays-v1.png'),
 'rst-img-kitchen-tools-v1':require('../../../assets/restaurant/kitchen-tools-v1.png'),
};
export function RestaurantIllustrations({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();
 return <>{illustrations.illustrations.filter(i=>i.lessonIds.includes(lessonId)).map(i=><View key={i.id} style={{gap:8,paddingVertical:12}}>
 <Image source={assets[i.id]} accessibilityLabel={i.captionJa} resizeMode="contain" style={{width:'100%',aspectRatio:i.aspectRatio,backgroundColor:'#faf6ed',borderRadius:8}}/>
 <Text style={{fontSize:16,lineHeight:26,color:colors.text}}>{i.captionJa}</Text>
 {showTranslation&&language!=='ja'&&(i.translations as Record<string,string>)[language]&&<TranslationText>{(i.translations as Record<string,string>)[language]}</TranslationText>}
 </View>)}</>;
}
