import {Text,View} from 'react-native';
import type {AgricultureLesson,AgricultureLevel} from '@/data/agriculture';
import metadata from '@/data/agriculture/winter-spatial-reference-locales.json';
import {DailyInstructionDiagram} from './DailyInstructionDiagram';
type Diagram={kind:string;titleJa:string;altJa:string;captionJa:string;lessonSourceHash:string;assetSha256?:string};
type Colors={text:string;translation:string;translationText:string;border:string};
export function winterSpatialTranslation(lesson:AgricultureLesson,level:AgricultureLevel,diagram:Diagram,language:string){
 const m=metadata;
 if(m.schemaVersion!==1||!m.studyOnly||lesson.id!==m.lessonId||!lesson.levels.includes(level)||level!=='2'||lesson.sourceHash!==m.lessonSourceHash||lesson.revision!==m.lessonRevision||diagram.kind!=='winter-climate'||diagram.lessonSourceHash!==lesson.sourceHash||diagram.assetSha256!==m.assetSha256||diagram.titleJa!==m.sourceJapanese.title||diagram.altJa!==m.sourceJapanese.alt||diagram.captionJa!==m.sourceJapanese.caption)return null;
 return m.locales[language as keyof typeof m.locales]||null;
}
export function WinterSpatialReference({lesson,level,diagram,language,showTranslation,colors}:{lesson:AgricultureLesson;level:AgricultureLevel;diagram:Diagram;language:string;showTranslation:boolean;colors:Colors}){
 const t=showTranslation?winterSpatialTranslation(lesson,level,diagram,language):null;
 return <View><DailyInstructionDiagram kind="winter-climate" title={diagram.titleJa} caption={diagram.captionJa} alt={t?.alt||diagram.altJa} colors={colors}/>{t?<View testID="agri-winter-spatial-translation" style={{gap:8}}><Text style={{color:colors.translationText,fontSize:19,lineHeight:29,fontWeight:'700'}}>{t.title}</Text><Text style={{color:colors.translationText,fontSize:16,lineHeight:27}}>{t.caption}</Text></View>:null}</View>;
}
