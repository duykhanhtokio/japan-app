import {Text,View} from 'react-native';
import {agricultureLesson,agricultureTranslation,type AgricultureLesson,type AgricultureLevel} from '@/data/agriculture';
import support from '@/data/agriculture/daily-learning-support.json';
import figures from '@/data/agriculture/recognition-images.json';
import {getAgricultureFigureAsset} from './RecognitionImages';
import {ZoomableFigure} from './ZoomableFigure';
import {DailyInstructionDiagram,type DailyDiagramKind} from './DailyInstructionDiagram';
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
export function DailyLearningFigure({lesson,level,colors,includeExisting=false}:{lesson:AgricultureLesson;level:AgricultureLevel;colors:Colors;includeExisting?:boolean}){
 const b=bindings[lesson.id],d=diagrams[lesson.id];
 if(d&&d.lessonSourceHash===lesson.sourceHash)return <View style={{padding:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.translation,borderRadius:10}}><DailyInstructionDiagram kind={d.kind as DailyDiagramKind} title={d.titleJa} caption={d.captionJa} alt={d.altJa} colors={colors}/></View>;
 const f=b?.lessonSourceHash===lesson.sourceHash?figures.images.find(f=>f.id===b.figureId&&f.assetSha256===b.assetSha256&&b.scopeLevels.includes(level)):includeExisting?figures.images.find(f=>f.lessonIds.includes(lesson.id)&&f.lessonSourceHashes[lesson.id as keyof typeof f.lessonSourceHashes]===lesson.sourceHash&&f.scopeLevels.includes(level)):null;
 const asset=f?getAgricultureFigureAsset(f.assetKey):null;
 return f&&asset?<View testID={`agri-daily-support-${lesson.id}`} style={{padding:12,borderWidth:1,borderColor:colors.border,backgroundColor:colors.translation,borderRadius:10,gap:10}}>
 <Text style={{color:colors.translationText,fontSize:19,lineHeight:29,fontWeight:'700'}}>{f.titleJa}</Text>
 <ZoomableFigure source={asset} width={f.width} height={f.height} altJa={f.altJa} testID={`agri-daily-support-${lesson.id}`} colors={colors} allowExpandedView/>
 <Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{b?.reuseReasonJa||f.observationJa}</Text>
 <Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{f.observationJa}{'\n'}{f.limitJa}</Text>
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
 <DailyLearningFigure lesson={l} level={level} colors={colors} includeExisting/>
 </View>;})}
 </View>;
}
