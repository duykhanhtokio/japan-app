import {Text,View} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {manufacturingDailySupport} from '@/data/manufacturing/daily-support';
import {manufacturingSourceGuideTranslation,manufacturingSourceGuidesLabel} from '@/data/manufacturing/source-guides';
import {manufacturingCompletionLessonTranslation} from '@/data/manufacturing/completion37';
import {manufacturingTranslation} from '@/data/manufacturing/translations';
import {manufacturingLessonParagraph} from '@/data/manufacturing/lesson-editorial';
import {manufacturingUi} from '@/data/manufacturing/ui';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {ManufacturingDiagram} from './ManufacturingDiagram';
import {SupplementalManufacturingDiagrams} from './SupplementalManufacturingDiagrams';
import {CompletionManufacturingDiagrams} from './CompletionManufacturingDiagrams';
/** Companion content is inside the day; its original identity and translations remain intact. */
export function ManufacturingDailySupport({lesson,language,showTranslation}:{lesson:ManufacturingLesson;language:string;showTranslation:boolean}){
 const found=manufacturingDailySupport(lesson),{colors}=useStudyAppearance();if(!found)return null;
 const {binding,companion}=found;
 const translated=showTranslation?(companion.id.includes('-completion37-')?manufacturingCompletionLessonTranslation(companion,language):companion.id.includes('-source-guide-')?manufacturingSourceGuideTranslation(companion,language):manufacturingTranslation(companion,language)):null;
 return <View testID={`manufacturing-day-companion-${lesson.id}`} style={{gap:12,paddingTop:20,borderTopWidth:2,borderColor:colors.border}}>
  <Text style={{fontSize:18,lineHeight:29,fontWeight:'700',color:colors.text}}>{manufacturingSourceGuidesLabel(language)} · {companion.titleJa}</Text>
  <Text style={{fontSize:16,lineHeight:27,color:colors.muted}}>{companion.objectiveJa}</Text>{translated&&<TranslationText>{translated.objective}</TranslationText>}
  {binding.paragraphIds.map(id=>{const p=companion.paragraphs.find(p=>p.id===id)!,target=translated?.paragraphs.find(p=>p.id===id);return <View key={id} style={{gap:8}}><Text style={{fontSize:17,lineHeight:28,fontWeight:'600',color:colors.text}}>{p.titleJa}</Text><Text selectable style={{fontSize:17,lineHeight:29,color:colors.text}}>{manufacturingLessonParagraph(companion,id,'ja',p.textJa)}</Text>{translated&&<TranslationText>{target?.title}{'\n'}{manufacturingLessonParagraph(companion,id,language,target?.text)}</TranslationText>}</View>;})}
  <ManufacturingDiagram lessonId={companion.id} language={language} showTranslation={showTranslation}/>
  <SupplementalManufacturingDiagrams lesson={companion} language={language} showTranslation={showTranslation}/>
  <CompletionManufacturingDiagrams lesson={companion} language={language} showTranslation={showTranslation}/>
  <Text style={{fontSize:17,lineHeight:28,fontWeight:'600',color:colors.text}}>{manufacturingUi(language,'activity')}</Text><Text selectable style={{fontSize:17,lineHeight:29,color:colors.text}}>{companion.activityJa}</Text>{translated&&<TranslationText>{translated.activity}</TranslationText>}
 </View>;
}
