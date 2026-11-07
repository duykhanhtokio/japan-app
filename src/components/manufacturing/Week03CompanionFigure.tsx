import {Text,View} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {manufacturingCompletionLessonTranslation} from '@/data/manufacturing/completion37';
import {manufacturingSourceGuideTranslation} from '@/data/manufacturing/source-guides';
import {manufacturingTranslation} from '@/data/manufacturing/translations';
import {manufacturingLessonParagraph} from '@/data/manufacturing/lesson-editorial';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';
import data from '@/data/manufacturing/royal-week03-companion-figures.json';

type Figure={id:string;paragraphId:string;assetFile:string;width:number;height:number;labels?:Record<string,string>};
type Entry={sourceHash:string;captionJa:string;paragraphIds:string[];expectedParagraphsJa:Record<string,string>;images:Figure[]};
const sources:Record<string,ReturnType<typeof require>>={
 'assets/manufacturing/diagrams/batch23-mechanical-caliper-contacts.png':require('../../../assets/manufacturing/diagrams/batch23-mechanical-caliper-contacts.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-knoop-plan.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-knoop-plan.png'),
};
/** The same source-bound figures serve the scheduled companion and its direct supplement reader. */
export function Week03CompanionFigure({lesson,paragraphIds,language,showTranslation}:{lesson:ManufacturingLesson;paragraphIds:string[];language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();
 const row=(data.lessons as Record<string,Entry>)[lesson.id];
 if(!row||row.sourceHash!==lesson.sourceHash||row.captionJa!==lesson.summaryJa||!row.paragraphIds.length||row.paragraphIds.some(id=>!paragraphIds.includes(id)))return null;
 const paragraphs=row.paragraphIds.map(id=>lesson.paragraphs.find(p=>p.id===id));
 if(paragraphs.some(p=>!p||manufacturingLessonParagraph(lesson,p.id,'ja',p.textJa)!==row.expectedParagraphsJa[p.id]))return null;
 const selectedLanguage=showTranslation?language:'ja';
 const translated=selectedLanguage==='ja'?null:lesson.id.includes('-completion37-')?manufacturingCompletionLessonTranslation(lesson,selectedLanguage):lesson.id.includes('-source-guide-')?manufacturingSourceGuideTranslation(lesson,selectedLanguage):manufacturingTranslation(lesson,selectedLanguage);
 return <View testID={`manufacturing-week03-companion-figure-${lesson.id}`} style={{gap:16}}>
  {row.images.map(item=>{
   const source=Object.prototype.hasOwnProperty.call(sources,item.assetFile)?sources[item.assetFile]:undefined,paragraph=lesson.paragraphs.find(p=>p.id===item.paragraphId);
   if(!source||!paragraph||!row.paragraphIds.includes(item.paragraphId)||!(item.width>0&&item.height>0))return null;
   const target=translated?.paragraphs.find(p=>p.id===item.paragraphId);
   const captionJa=manufacturingLessonParagraph(lesson,paragraph.id,'ja',paragraph.textJa)??paragraph.textJa;
   const caption=target?manufacturingLessonParagraph(lesson,paragraph.id,selectedLanguage,target.text):null;
   const label=item.labels?.[caption?selectedLanguage:'ja'];
   const title=label&&(caption??captionJa).includes(label)?label:target?.title??paragraph.titleJa;
   return <View key={item.id} style={{gap:8}}>
    <Text style={{fontSize:18,lineHeight:30,fontWeight:'700',color:colors.text}}>{title}</Text>
    <SupplementalFigure item={{id:'week03-companion-'+lesson.id+'-'+item.id,lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,assetFile:item.assetFile,width:item.width,height:item.height,captionJa,scopeLimits:['source_bound_teaching_concept_only']}} imageSource={source} imageAlt={caption??captionJa} language={language} showTranslation={showTranslation} translatedCaption={caption}/>
   </View>;
  })}
 </View>;
}
