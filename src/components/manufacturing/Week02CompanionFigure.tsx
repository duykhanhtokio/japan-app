import {ManufacturingIllustrationText as Text} from './ManufacturingIllustrationText';
import {View} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';
import data from '@/data/manufacturing/royal-week02-companion-figures.json';
const sources:Record<string,ReturnType<typeof require>>={
 "assets/manufacturing/royal-weekly-20261107/week02/companions/mechanical-sign-roles.png":require("../../../assets/manufacturing/royal-weekly-20261107/week02/companions/mechanical-sign-roles.png"),
 "assets/manufacturing/royal-weekly-20261107/week02/companions/mechanical-qc-reading.png":require("../../../assets/manufacturing/royal-weekly-20261107/week02/companions/mechanical-qc-reading.png"),
 "assets/manufacturing/royal-weekly-20261107/week02/companions/surface-analysis-charge.png":require("../../../assets/manufacturing/royal-weekly-20261107/week02/companions/surface-analysis-charge.png"),
 "assets/manufacturing/royal-weekly-20261107/week02/companions/surface-six-buff-families.png":require("../../../assets/manufacturing/royal-weekly-20261107/week02/companions/surface-six-buff-families.png"),
 "assets/manufacturing/royal-weekly-20261107/week02/companions/surface-specific-gravity-six.png":require("../../../assets/manufacturing/royal-weekly-20261107/week02/companions/surface-specific-gravity-six.png"),
};
type Entry={sourceHash:string;assetFile:string;width:number;height:number;captionJa:string;paragraphIds:string[];locales:Record<string,{sourceHash:string;title:string;summary:string;paragraphs:{id:string;title:string;text:string}[]}>};
/** Explicit saved paragraph selection for the direct supplement reader. */
export function week02CompanionParagraphIds(lesson:ManufacturingLesson):string[]{
 const row=(data.lessons as Record<string,Entry>)[lesson.id];
 const source=row?.locales.ja;
 if(!row||!source||row.sourceHash!==lesson.sourceHash||row.captionJa!==lesson.summaryJa||source.paragraphs.some(p=>{const current=lesson.paragraphs.find(x=>x.id===p.id);return !current||current.titleJa!==p.title||current.textJa!==p.text;}))return [];
 return [...row.paragraphIds];
}
/** Current bound companion sections: exact controlled artwork plus native localized equivalents. */
export function Week02CompanionFigure({lesson,paragraphIds,language,showTranslation}:{lesson:ManufacturingLesson;paragraphIds:string[];language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();
 const row=(data.lessons as Record<string,Entry>)[lesson.id];
 if(!week02CompanionParagraphIds(lesson).length||!row||row.sourceHash!==lesson.sourceHash||row.captionJa!==lesson.summaryJa||paragraphIds.length!==row.paragraphIds.length||paragraphIds.some((id,i)=>id!==row.paragraphIds[i]))return null;
 const locale=showTranslation?language:'ja';
 const target=row.locales[locale]??row.locales.ja;
 if(!target||target.sourceHash!==lesson.sourceHash||!sources[row.assetFile])return null;
 return <View testID={`manufacturing-week02-companion-figure-${lesson.id}`} style={{gap:12}}>
  <SupplementalFigure item={{id:'week02-companion-'+lesson.id,lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,assetFile:row.assetFile,width:row.width,height:row.height,captionJa:row.captionJa,scopeLimits:['controlled_conceptual_figure_only']}} imageSource={sources[row.assetFile]} imageAlt={target.summary} language={language} showTranslation={showTranslation} translatedCaption={showTranslation&&language!=='ja'?target.summary:null}/>
  <View testID={`manufacturing-week02-companion-native-${lesson.id}`} style={{gap:8,padding:14,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
   <Text readingLanguage={target===row.locales.ja?'ja':locale} style={{fontSize:18,lineHeight:30,fontWeight:'700',color:colors.text}}>{target.title}</Text>
   {target.paragraphs.map(p=><View key={p.id} style={{gap:6}}><Text readingLanguage={target===row.locales.ja?'ja':locale} style={{fontSize:17,lineHeight:29,fontWeight:'600',color:colors.text}}>{p.title}</Text><Text readingLanguage={target===row.locales.ja?'ja':locale} selectable style={{fontSize:17,lineHeight:29,color:colors.text}}>{p.text}</Text></View>)}
  </View>
 </View>;
}
