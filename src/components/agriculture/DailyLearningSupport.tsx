import {PestFoundationSupport} from './PestFoundationSupport';
import {MulchColorSupport} from './MulchColorSupport';
import {FruitManagementSupport} from './FruitManagementSupport';
import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import {AgricultureImageRuby,agricultureImageReading} from './AgricultureImageRuby';
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
type ReuseCaption={sourceJapanese:string;figureId:string;assetSha256:string;lessonSourceHash:string;lessonRevision:string;locales:Record<string,string>};
type Binding={lessonSourceHash:string;figureId:string;assetSha256:string;scopeLevels:string[];reuseReasonJa:string;reuseCaption?:ReuseCaption};
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
 if(!lesson.levels.includes(level))return null;
 if(lesson.id==='agr-pest-foundation'){
  if(paragraphIds&&lesson.paragraphs.some(p=>!paragraphIds.includes(p.id)))return null;
  return <PestFoundationSupport lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 }
 if(lesson.id==='agr-cover-mulch'){
  if(paragraphIds&&lesson.paragraphs.some(p=>!paragraphIds.includes(p.id)))return null;
  return <MulchColorSupport lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 }
 if(lesson.id==='agr-fruit-manage-persimmon-pear-peach'){
  if(paragraphIds&&lesson.paragraphs.some(p=>!paragraphIds.includes(p.id)))return null;
  return <FruitManagementSupport lessonId={lesson.id} lessonSourceHash={lesson.sourceHash} lessonRevision={lesson.revision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>;
 }
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
 const readingSources=currentLesson?.sourceHash===lesson.sourceHash&&currentLesson.revision===lesson.revision&&f?f.lessonIds.flatMap(sourceId=>{
  const source=f.scopeLevels.flatMap(sourceLevel=>{const l=agricultureLesson(sourceId,sourceLevel as AgricultureLevel);return l?[l]:[];})[0];
  return source&&source.sourceHash===f.lessonSourceHashes[sourceId as keyof typeof f.lessonSourceHashes]?[source]:[];
 }):[];
 const ruby=(field:string,text:string,style:StyleProp<TextStyle>)=>{
  const candidates=field.startsWith('reuse:')&&currentLesson?.sourceHash===lesson.sourceHash&&currentLesson.revision===lesson.revision?[currentLesson]:readingSources;
  const source=f?candidates.find(source=>agricultureImageReading({imageId:f.id,assetSha256:f.assetSha256,lessonId:source.id,lessonSourceHash:source.sourceHash,lessonRevision:source.revision,field,text})):undefined;
  return f&&source?<AgricultureImageRuby imageId={f.id} assetSha256={f.assetSha256} lessonId={source.id} lessonSourceHash={source.sourceHash} lessonRevision={source.revision} field={field} text={text} color={colors.translationText} style={style}/>:<Text style={style}>{text}</Text>;
 };
 const translated=showTranslation&&language!=='ja'&&f&&currentLesson?.sourceHash===lesson.sourceHash&&currentLesson.revision===lesson.revision?f.lessonIds.flatMap(sourceId=>{
  const source=f.scopeLevels.flatMap(sourceLevel=>{const l=agricultureLesson(sourceId,sourceLevel as AgricultureLevel);return l?[l]:[];})[0];
  if(!source||source.sourceHash!==f.lessonSourceHashes[sourceId as keyof typeof f.lessonSourceHashes])return [];
  const t=recognitionImageTranslation(f,source.id,source.sourceHash,source.revision,language);
  return t?[t]:[];
 })[0]:null;
 const reuseCaption=currentBinding?.reuseCaption;
 const reuseCandidate=showTranslation&&language!=='ja'&&currentLesson?.sourceHash===lesson.sourceHash&&currentLesson.revision===lesson.revision&&f&&reuseCaption?.figureId===f.id&&reuseCaption.assetSha256===f.assetSha256&&reuseCaption.lessonSourceHash===lesson.sourceHash&&reuseCaption.lessonRevision===lesson.revision&&reuseCaption.sourceJapanese===currentBinding?.reuseReasonJa?reuseCaption.locales[language]:null;
 const translatedReuseReason=typeof reuseCandidate==='string'&&reuseCandidate.trim()?reuseCandidate:null;
 const asset=f?getAgricultureFigureAsset(f.assetKey):null;
 return f&&asset?<View testID={`agri-daily-support-${lesson.id}`} style={{padding:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.translation,borderRadius:10,gap:10}}>
 {ruby('title',f.titleJa,{color:colors.translationText,fontSize:19,lineHeight:29,fontWeight:'700'})}
 {!!translated&&<Text testID={`agri-daily-support-${lesson.id}-localized-title`} style={{color:colors.translationText,fontSize:18,lineHeight:28,fontWeight:'700'}}>{translated.title}</Text>}
 <ZoomableFigure source={asset} width={f.width} height={f.height} altJa={translated?.alt||f.altJa} testID={`agri-daily-support-${lesson.id}`} colors={colors} allowExpandedView/>
 {ruby(currentBinding?`reuse:${lesson.id}`:'observation',currentBinding?.reuseReasonJa||f.observationJa,{color:colors.translationText,fontSize:16,lineHeight:27})}
 {!!translatedReuseReason&&<Text testID={`agri-daily-support-${lesson.id}-localized-reuse-reason`} style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translatedReuseReason}</Text>}
 <View style={{gap:6}}>{ruby('observation',f.observationJa,{color:colors.translationText,fontSize:16,lineHeight:27})}{ruby('limit',f.limitJa,{color:colors.translationText,fontSize:16,lineHeight:27})}</View>
 {!!translated&&<View testID={`agri-daily-support-${lesson.id}-localized-metadata`} style={{gap:6}}><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.observation}</Text><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.limit}</Text></View>}
 {!!f.labelsJa?.length&&<View style={{gap:6}}>{f.labelsJa.map((label,i)=><View key={i} style={{gap:3}}>{ruby(`label:${i}`,label,{color:colors.translationText,fontSize:16,lineHeight:27})}{!!translated?.labels?.[i]&&<Text testID={`agri-daily-support-${lesson.id}-localized-label-${i}`} style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{translated.labels[i]}</Text>}</View>)}</View>}
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
