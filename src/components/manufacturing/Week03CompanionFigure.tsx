import {CompletionManufacturingDiagrams} from './CompletionManufacturingDiagrams';
import {Text,View} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {manufacturingCompletionLessonTranslation} from '@/data/manufacturing/completion37';
import {manufacturingSourceGuideTranslation} from '@/data/manufacturing/source-guides';
import {manufacturingTranslation} from '@/data/manufacturing/translations';
import {manufacturingLessonParagraph} from '@/data/manufacturing/lesson-editorial';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';
import data from '@/data/manufacturing/royal-week03-companion-figures.json';

type Figure={id:string;paragraphId?:string;paragraphIds?:string[];assetFile:string;width:number;height:number;labels?:Record<string,string>};
type Entry={sourceHash:string;captionJa:string;paragraphIds:string[];bindingScopes?:string[][];expectedParagraphsJa:Record<string,string>;nativeParagraphIds?:string[];expectedNativeParagraphsJa?:Record<string,string>;images:Figure[];exactSelectionOnly?:boolean;retainedExistingFigure?:boolean;fullReader?:Entry};
const sources:Record<string,ReturnType<typeof require>>={
 'assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-feature-radius-diameter-thickness.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-feature-radius-diameter-thickness.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-feature-surface-texture.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-feature-surface-texture.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-feature-weld-symbols.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-feature-weld-symbols.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-drawing-selected-four-lines.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-drawing-selected-four-lines.png'),
 'assets/manufacturing/royal-weekly-20261107/week05/surface-day32-filter-condition-report.webp':require('../../../assets/manufacturing/royal-weekly-20261107/week05/surface-day32-filter-condition-report.webp'),
 'assets/manufacturing/royal-weekly-20261107/week05/surface-day35-robot-entry-hold.webp':require('../../../assets/manufacturing/royal-weekly-20261107/week05/surface-day35-robot-entry-hold.webp'),
 'assets/manufacturing/royal-weekly-20261107/week07/electrical-day45-fixed-tool-location-review.webp':require('../../../assets/manufacturing/royal-weekly-20261107/week07/electrical-day45-fixed-tool-location-review.webp'),
 'assets/manufacturing/royal-weekly-20261107/week07/companions/mechanical-third-angle-section-selected.png':require('../../../assets/manufacturing/royal-weekly-20261107/week07/companions/mechanical-third-angle-section-selected.png'),
 'assets/manufacturing/diagrams/batch36-hall.png':require('../../../assets/manufacturing/diagrams/batch36-hall.png'),
 'assets/manufacturing/diagrams/batch36-thermocouple.png':require('../../../assets/manufacturing/diagrams/batch36-thermocouple.png'),
 'assets/manufacturing/royal-weekly-20261107/week06/companions/electrical-analog-range-twenty-of-fifty.png':require('../../../assets/manufacturing/royal-weekly-20261107/week06/companions/electrical-analog-range-twenty-of-fifty.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-vblock-micrometer-selected.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-vblock-micrometer-selected.png'),
 'assets/manufacturing/royal-weekly-20261107/week05/companions/electrical-leakage-protection-roles.png':require('../../../assets/manufacturing/royal-weekly-20261107/week05/companions/electrical-leakage-protection-roles.png'),
 'assets/manufacturing/royal-weekly-20261107/week04/companions/surface-test-purpose-roles.png':require('../../../assets/manufacturing/royal-weekly-20261107/week04/companions/surface-test-purpose-roles.png'),
 'assets/manufacturing/royal-weekly-20261107/week04/companions/surface-electrode-electron-roles.png':require('../../../assets/manufacturing/royal-weekly-20261107/week04/companions/surface-electrode-electron-roles.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-caliper-three-checks.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-caliper-three-checks.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-tolerance-dimension-roles.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-tolerance-dimension-roles.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/electrical-lcr-measurement-flow.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/electrical-lcr-measurement-flow.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/surface-alloy-roles-diecast.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/surface-alloy-roles-diecast.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/surface-pretreatment-jig-roles.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/surface-pretreatment-jig-roles.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/surface-transport-pause-report.webp':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/surface-transport-pause-report.webp'),
 'assets/manufacturing/diagrams/batch23-mechanical-caliper-contacts.png':require('../../../assets/manufacturing/diagrams/batch23-mechanical-caliper-contacts.png'),
 'assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-knoop-plan.png':require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-knoop-plan.png'),
};
const imageParagraphIds=(item:Figure)=>item.paragraphIds??(item.paragraphId?[item.paragraphId]:[]);
function registration(lessonId:string,paragraphIds:string[]):Entry|null{
 const main=(data.lessons as Record<string,Entry>)[lessonId];
 for(const row of [main,main?.fullReader])if(row&&row.paragraphIds.length>0&&(row.exactSelectionOnly?row.paragraphIds.length===paragraphIds.length&&row.paragraphIds.every((id,i)=>id===paragraphIds[i]):(row.bindingScopes??[row.paragraphIds]).some(scope=>scope.length>0&&scope.every(id=>paragraphIds.includes(id)))))return row;
 return null;
}
/** A registered exact selection takes precedence over broader legacy art, including when source drift makes its renderer fail closed. */
export function hasWeek03CompanionRegistration(lessonId:string,paragraphIds:string[]):boolean{return !!registration(lessonId,paragraphIds);}
/** The same source-bound figures serve the scheduled companion and its direct supplement reader. */
export function Week03CompanionFigure({lesson,paragraphIds,language,showTranslation}:{lesson:ManufacturingLesson;paragraphIds:string[];language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();
 const row=registration(lesson.id,paragraphIds);
 if(paragraphIds.some(id=>!lesson.paragraphs.some(p=>p.id===id)))return null;
 if(!row||row.sourceHash!==lesson.sourceHash||row.captionJa!==lesson.summaryJa||!row.paragraphIds.length||!(row.bindingScopes??[row.paragraphIds]).some(scope=>scope.length>0&&scope.every(id=>paragraphIds.includes(id))))return null;
 const paragraphs=row.paragraphIds.map(id=>lesson.paragraphs.find(p=>p.id===id));
 if(paragraphs.some(p=>!p||manufacturingLessonParagraph(lesson,p.id,'ja',p.textJa)!==row.expectedParagraphsJa[p.id]))return null;
 // A scheduled binding may select only part of a retained multi-panel guide.
 // Keep native equivalents inside that exact selection; a full guide still gets every paragraph.
 const nativeIds=(row.nativeParagraphIds??row.paragraphIds).filter(id=>paragraphIds.includes(id));
 if(nativeIds.some(id=>{const p=lesson.paragraphs.find(p=>p.id===id);return !p||(row.expectedNativeParagraphsJa&&manufacturingLessonParagraph(lesson,id,'ja',p.textJa)!==row.expectedNativeParagraphsJa[id]);}))return null;
 const selectedLanguage=showTranslation?language:'ja';
 const translated=selectedLanguage==='ja'?null:lesson.id.includes('-completion37-')?manufacturingCompletionLessonTranslation(lesson,selectedLanguage):lesson.id.includes('-source-guide-')?manufacturingSourceGuideTranslation(lesson,selectedLanguage):manufacturingTranslation(lesson,selectedLanguage);
 const native=nativeIds.map(id=>{const p=lesson.paragraphs.find(p=>p.id===id)!;const target=translated?.paragraphs.find(p=>p.id===id);return {id,title:target?.title??p.titleJa,text:manufacturingLessonParagraph(lesson,id,selectedLanguage,target?.text??p.textJa)??p.textJa};});
 return <View testID={`manufacturing-week03-companion-figure-${lesson.id}`} style={{gap:16}}>
  <View testID={`manufacturing-week03-companion-native-${lesson.id}`} style={{gap:10,padding:14,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
   {native.map(p=><View key={p.id} style={{gap:6}}><Text style={{fontSize:17,lineHeight:29,fontWeight:'700',color:colors.text}}>{p.title}</Text><Text selectable style={{fontSize:17,lineHeight:29,color:colors.text}}>{p.text}</Text></View>)}
  </View>
  {row.images.map(item=>{
   const source=Object.prototype.hasOwnProperty.call(sources,item.assetFile)?sources[item.assetFile]:undefined,ids=imageParagraphIds(item),selected=ids.map(id=>lesson.paragraphs.find(p=>p.id===id));
   if(!source||!ids.length||selected.some(p=>!p)||ids.some(id=>!row.paragraphIds.includes(id))||!(item.width>0&&item.height>0))return null;
   const targets=ids.map(id=>translated?.paragraphs.find(p=>p.id===id));
   const captionJa=selected.map(p=>manufacturingLessonParagraph(lesson,p!.id,'ja',p!.textJa)??p!.textJa).join('\n\n');
   const translatedParts=targets.map((target,i)=>target?manufacturingLessonParagraph(lesson,ids[i],selectedLanguage,target.text):null);
   const caption=translatedParts.every(text=>typeof text==='string'&&!!text.trim())?translatedParts.join('\n\n'):null;
   const label=item.labels?.[caption?selectedLanguage:'ja'];
   const title=label&&(caption??captionJa).includes(label)?label:caption?targets.map(p=>p!.title).join(' / '):selected.map(p=>p!.titleJa).join(' / ');
   return <View key={item.id} style={{gap:8}}>
    <Text style={{fontSize:18,lineHeight:30,fontWeight:'700',color:colors.text}}>{title}</Text>
    <SupplementalFigure item={{id:'week03-companion-'+lesson.id+'-'+item.id,lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,assetFile:item.assetFile,width:item.width,height:item.height,captionJa,scopeLimits:['source_bound_teaching_concept_only']}} imageSource={source} imageAlt={caption??captionJa} language={language} showTranslation={showTranslation} translatedCaption={caption}/>
   </View>;
  })}
 </View>;
}

/** Preserve the full legacy supplement figure unless an exact scoped replacement is registered. */
export function ScopedManufacturingCompanionFigures({lesson,paragraphIds,language,showTranslation}:{lesson:ManufacturingLesson;paragraphIds:string[];language:string;showTranslation:boolean}){
 const registered=Object.prototype.hasOwnProperty.call(data.lessons,lesson.id),full=lesson.paragraphs.map(p=>p.id),fullSelection=full.length===paragraphIds.length&&full.every((id,i)=>id===paragraphIds[i]);
 const row=registration(lesson.id,paragraphIds),scoped=['mfg1-mechanical-completion37-lesson-003','mfg1-mechanical-completion37-lesson-005','mfg1-mechanical-completion37-lesson-007'].includes(lesson.id),replaceLegacy=scoped&&(row?!row.retainedExistingFigure:(registered&&!fullSelection));
 return <>{!replaceLegacy&&<CompletionManufacturingDiagrams lesson={lesson} language={language} showTranslation={showTranslation}/>}<Week03CompanionFigure lesson={lesson} paragraphIds={paragraphIds} language={language} showTranslation={showTranslation}/></>;
}
