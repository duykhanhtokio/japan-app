import {Text as PlainText,View,StyleSheet,type StyleProp,type TextStyle} from 'react-native';
import {week02CompanionReading} from '@/data/manufacturing/week02-companion-readings';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';
import data from '@/data/manufacturing/royal-week02-companion-figures.json';
const sources:Record<string,ReturnType<typeof require>>={
 get "assets/manufacturing/royal-weekly-20261107/week02/companions/mechanical-sign-roles.png"(){return require("../../../assets/manufacturing/royal-weekly-20261107/week02/companions/mechanical-sign-roles.png");},
 get "assets/manufacturing/royal-weekly-20261107/week02/companions/mechanical-qc-reading.png"(){return require("../../../assets/manufacturing/royal-weekly-20261107/week02/companions/mechanical-qc-reading.png");},
 get "assets/manufacturing/royal-weekly-20261107/week02/companions/surface-analysis-charge.png"(){return require("../../../assets/manufacturing/royal-weekly-20261107/week02/companions/surface-analysis-charge.png");},
 get "assets/manufacturing/royal-weekly-20261107/week02/companions/surface-six-buff-families.png"(){return require("../../../assets/manufacturing/royal-weekly-20261107/week02/companions/surface-six-buff-families.png");},
 get "assets/manufacturing/royal-weekly-20261107/week02/companions/surface-specific-gravity-six.png"(){return require("../../../assets/manufacturing/royal-weekly-20261107/week02/companions/surface-specific-gravity-six.png");},
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
  <SupplementalFigure item={{id:'week02-companion-'+lesson.id,lessonId:lesson.id,lessonSourceHash:lesson.sourceHash,assetFile:row.assetFile,width:row.width,height:row.height,captionJa:row.captionJa,scopeLimits:['controlled_conceptual_figure_only']}} japaneseCaptionRuby={week02CompanionReading(lesson,'caption',row.captionJa)??null} imageSource={sources[row.assetFile]} imageAlt={target.summary} language={language} showTranslation={showTranslation} translatedCaption={showTranslation&&language!=='ja'?target.summary:null}/>
  <View testID={`manufacturing-week02-companion-native-${lesson.id}`} style={{gap:8,padding:14,borderWidth:1,borderColor:colors.border,borderRadius:10}}>
   <Week02SourceText lesson={lesson} field="title" text={target.title} enabled={target===row.locales.ja} style={{fontSize:18,lineHeight:30,fontWeight:'700',color:colors.text}}/>
   {target.paragraphs.map(p=><View key={p.id} style={{gap:6}}><Week02SourceText lesson={lesson} field={p.id+":title"} text={p.title} enabled={target===row.locales.ja} style={{fontSize:17,lineHeight:29,fontWeight:'600',color:colors.text}}/><Week02SourceText lesson={lesson} field={p.id+":text"} text={p.text} enabled={target===row.locales.ja} style={{fontSize:17,lineHeight:29,color:colors.text}}/></View>)}
  </View>
 </View>;
}

function Week02SourceText({lesson,field,text,enabled,style}:{lesson:ManufacturingLesson;field:string;text:string;enabled:boolean;style?:StyleProp<TextStyle>}){
 const parts=enabled?week02CompanionReading(lesson,field,text):undefined;if(!parts)return <PlainText selectable style={style}>{text}</PlainText>;
 const color=StyleSheet.flatten(style)?.color,pieces=parts.flatMap(p=>p.reading?[p]:p.text.split(/(\n)/).filter(Boolean).map(text=>({text})));
 return <View accessible accessibilityLabel={text} testID={`manufacturing-week02-ruby-${lesson.id}-${field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{pieces.map((p,i)=>p.text==='\n'?<View key={i} accessible={false} style={{width:'100%',height:6}}/>:<View key={i} style={{alignItems:'center',maxWidth:'100%',minWidth:0}}><PlainText style={{fontSize:10,lineHeight:14,color}}>{'reading'in p?p.reading:' '}</PlainText><PlainText selectable style={style}>{p.text}</PlainText></View>)}</View>;
}
