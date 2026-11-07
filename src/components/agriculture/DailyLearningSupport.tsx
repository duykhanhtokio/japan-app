import {MulchColorSupport} from './MulchColorSupport';
import {FruitManagementSupport} from './FruitManagementSupport';
import {Text,View} from 'react-native';
import {agricultureLesson,agricultureTranslation,type AgricultureLesson,type AgricultureLevel} from '@/data/agriculture';
import support from '@/data/agriculture/daily-learning-support.json';
import figures from '@/data/agriculture/recognition-images.json';
import {getAgricultureFigureAsset,recognitionImageTranslation} from './RecognitionImages';
import {ZoomableFigure} from './ZoomableFigure';
import {DailyInstructionDiagram,type DailyDiagramKind} from './DailyInstructionDiagram';
import {Statistics2019Figure} from './Statistics2019Figure';
import {WinterClimateFigure} from './WinterClimateFigure';
import {WinterSpatialReference} from './WinterSpatialReference';
import {CropCalendarFigure} from './CropCalendarFigure';
import {SoilGroupComparison} from './SoilGroupComparison';
import {CropClassificationFigure} from './CropClassificationFigure';
import {PlantResponseFigure} from './PlantResponseFigure';
import {FertilizerNativeFigure,isFertilizerNativeContext} from './FertilizerNativeFigure';
import {DrainageMethodComparison} from './DrainageMethodComparison';
import {NativeProcessDiagram,isNativeProcessContext} from './NativeProcessDiagram';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
type Colors={text:string;translation:string;translationText:string;border:string};
type Companion={lessonId:string;sourceHash:string;paragraphIds:string[]};
type Binding={lessonSourceHash:string;figureId:string;assetSha256:string;scopeLevels:string[];reuseReasonJa:string};
type Diagram={kind:string;titleJa:string;captionJa:string;altJa:string;lessonSourceHash:string};
const pairs=support.companionReadings as Record<string,Companion[]>;
const sourceVersions=support.sourceVersions as Record<string,string>;
const bindings=support.figureBindings as Record<string,Binding>;
const diagrams=support.controlledDiagrams as Record<string,Diagram>;
export function agricultureDailyCompanions(lesson:AgricultureLesson,level:AgricultureLevel){
 if(sourceVersions[lesson.id]!==lesson.sourceHash)return [];
 return (pairs[lesson.id]||[]).flatMap(p=>{const l=agricultureLesson(p.lessonId,level);return l&&l.sourceHash===p.sourceHash?[{lesson:l,paragraphIds:p.paragraphIds}]:[];});
}
export function DailyLearningFigure({lesson,level,colors,includeExisting=false,language='ja',showTranslation=false,paragraphIds}:{lesson:AgricultureLesson;level:AgricultureLevel;colors:Colors;includeExisting?:boolean;language?:string;showTranslation?:boolean;paragraphIds?:string[]}){
 if(lesson.id==='agr-cover-mulch'){
  if(paragraphIds&&lesson.paragraphs.some(p=>!paragraphIds.includes(p.id)))return null;
  return <MulchColorSupport lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 }
 if(lesson.id==='agr-fruit-manage-persimmon-pear-peach'){
  if(paragraphIds&&lesson.paragraphs.some(p=>!paragraphIds.includes(p.id)))return null;
  return <FruitManagementSupport lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 }
 if(!lesson.levels.includes(level))return null;
 const b=bindings[lesson.id],d=diagrams[lesson.id];
 const currentBinding=b?.lessonSourceHash===lesson.sourceHash&&b.scopeLevels.includes(level)?b:null;
 if(level==='2'&&lesson.id==='agr-climate'&&d?.kind==='winter-climate'&&d.lessonSourceHash===lesson.sourceHash)return <View style={{padding:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.translation,borderRadius:10}}><WinterSpatialReference lesson={lesson} level={level} diagram={d} language={language} showTranslation={showTranslation} colors={colors}/><WinterClimateFigure lesson={lesson} level={level} language={language} showTranslation={showTranslation} translation={showTranslation?agricultureTranslation(lesson,language):null} colors={colors}/></View>;
 if(level==='2'&&lesson.id==='agr-statistics'&&d?.kind==='statistics-2019'&&d.lessonSourceHash===lesson.sourceHash)return <View style={{padding:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.translation,borderRadius:10}}><Statistics2019Figure lesson={lesson} level={level} language={language} showTranslation={showTranslation} translation={showTranslation?agricultureTranslation(lesson,language):null} colors={colors}/></View>;
 if(lesson.id==='agr-soil-groups')return <SoilGroupComparison lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 if(lesson.id==='agr-crop-types')return <CropClassificationFigure lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 if(lesson.id==='agr-plant-responses')return <PlantResponseFigure lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 if(isFertilizerNativeContext(lesson.id))return <FertilizerNativeFigure lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 if(lesson.id==='agr-drainage-comparison')return <DrainageMethodComparison lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 if(isNativeProcessContext(lesson.id)){
  if(paragraphIds&&lesson.paragraphs.some(p=>!paragraphIds.includes(p.id)))return null;
  return <NativeProcessDiagram lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 }
 if(d&&d.lessonSourceHash===lesson.sourceHash)return <View style={{padding:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.translation,borderRadius:10}}><DailyInstructionDiagram kind={d.kind as DailyDiagramKind} title={d.titleJa} caption={d.captionJa} alt={d.altJa} colors={colors}/></View>;
 const f=currentBinding?figures.images.find(f=>f.id===currentBinding.figureId&&f.assetSha256===currentBinding.assetSha256):includeExisting?figures.images.find(f=>f.lessonIds.includes(lesson.id)&&f.lessonSourceHashes[lesson.id as keyof typeof f.lessonSourceHashes]===lesson.sourceHash&&f.scopeLevels.includes(level)):null;
 if(f?.id==='agr-f40-general-cropping-example-flow')return <CropCalendarFigure lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;

 const currentLesson=agricultureLesson(lesson.id,level);
 const translated=showTranslation&&language!=='ja'&&f&&currentLesson?.sourceHash===lesson.sourceHash&&currentLesson.revision===lesson.revision?f.lessonIds.flatMap(sourceId=>{
  const source=f.scopeLevels.flatMap(sourceLevel=>{const l=agricultureLesson(sourceId,sourceLevel as AgricultureLevel);return l?[l]:[];})[0];
  if(!source||source.sourceHash!==f.lessonSourceHashes[sourceId as keyof typeof f.lessonSourceHashes])return [];
  const t=recognitionImageTranslation(f,source.id,source.sourceHash,source.revision,language);
  return t?[t]:[];
 })[0]:null;
 const asset=f?getAgricultureFigureAsset(f.assetKey):null;
 return f&&asset?<View testID={`agri-daily-support-${lesson.id}`} style={{padding:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.translation,borderRadius:10,gap:10}}>
 <Text style={{color:colors.translationText,fontSize:19,lineHeight:29,fontWeight:'700'}}>{f.titleJa}</Text>
 {!!translated&&<Text testID={`agri-daily-support-${lesson.id}-localized-title`} style={{color:colors.translationText,fontSize:18,lineHeight:28,fontWeight:'700'}}>{translated.title}</Text>}
 <ZoomableFigure source={asset} width={f.width} height={f.height} altJa={translated?.alt||f.altJa} testID={`agri-daily-support-${lesson.id}`} colors={colors} allowExpandedView/>
 <Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{currentBinding?.reuseReasonJa||f.observationJa}</Text>
 <Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{f.observationJa}{'\n'}{f.limitJa}</Text>
 {!!translated&&<View testID={`agri-daily-support-${lesson.id}-localized-metadata`} style={{gap:6}}><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.observation}</Text><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.limit}</Text>{!!translated.labels?.length&&f.labelsJa?.map((label,i)=><View key={i} style={{gap:3}}><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{label}</Text><Text testID={`agri-daily-support-${lesson.id}-localized-label-${i}`} style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.labels![i]}</Text></View>)}</View>}
 </View>:null;
}
export function DailyCompanionReadings({lesson,level,language,showTranslation,colors}:{lesson:AgricultureLesson;level:AgricultureLevel;language:string;showTranslation:boolean;colors:Colors}){
 const entries=agricultureDailyCompanions(lesson,level);
 if(!entries.length)return null;
 return <View testID={`agri-daily-context-${lesson.id}`} style={{gap:12,marginTop:12,borderTopWidth:1,borderColor:colors.border,paddingTop:18}}>
 <Text style={{color:colors.text,fontSize:20,lineHeight:30,fontWeight:'700'}}>関連する基礎と合わせて考える</Text>
 <Text style={{color:colors.text,fontSize:16,lineHeight:27}}>この日の短い補足を理解するため、同じ主題の基礎を抜き出して確認します。別の授業を自動で完了にはしません。</Text>
 {entries.map(({lesson:l,paragraphIds})=>{const t=showTranslation?agricultureTranslation(l,language):null;return <View key={l.id} style={{gap:10}}>
 <Text style={{color:colors.text,fontSize:19,lineHeight:29,fontWeight:'700'}}>{l.titleJa}</Text>
 {l.paragraphs.filter(p=>paragraphIds.includes(p.id)).map(p=><View key={p.id} style={{gap:6}}><Text style={{color:colors.text,fontSize:17,lineHeight:28,fontWeight:'700'}}>{p.titleJa}</Text><Text selectable style={{color:colors.text,fontSize:17,lineHeight:29}}>{p.textJa}</Text>{t&&<TranslationText>{t.paragraphTitles[p.id]}{'\n'}{t.paragraphs[p.id]}</TranslationText>}</View>)}
 <DailyLearningFigure lesson={l} level={level} colors={colors} includeExisting language={language} showTranslation={showTranslation} paragraphIds={paragraphIds}/>
 </View>;})}
 </View>;
}
