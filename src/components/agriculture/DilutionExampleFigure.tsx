import {Text,View} from 'react-native';
import type {ReactNode} from 'react';
import data from '@/data/agriculture/dilution-example-native.json';
import content from '@/data/agriculture/lessons.ja.json';
import figures from '@/data/agriculture/recognition-images.json';
type Colors={text:string;translation:string;translationText:string;border:string};
type SourceLesson={id:string;sourceHash:string;revision:string;titleJa:string;objectiveJa:string;levels:string[];paragraphs:{id:string;titleJa:string;textJa:string}[];sources:unknown};
export function dilutionLessonMatches(lesson:SourceLesson,level:string|undefined){
 return !!level&&data.levels.includes(level)&&lesson.levels.includes(level)&&lesson.id===data.lessonId&&lesson.sourceHash===data.sourceHash&&lesson.revision===data.revision&&lesson.titleJa===data.lessonSourceJapanese.title&&lesson.objectiveJa===data.lessonSourceJapanese.objective&&JSON.stringify(lesson.paragraphs.map(p=>({id:p.id,titleJa:p.titleJa,textJa:p.textJa})))===JSON.stringify(data.lessonSourceJapanese.paragraphs)&&JSON.stringify(lesson.sources)===JSON.stringify(data.lessonSources);
}
export function dilutionExampleMatches(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined){
 const l=content.lessons.find(l=>l.id===lessonId),f=figures.images.find(f=>f.id===data.figureId);
 return data.schemaVersion===1&&lessonId===data.lessonId&&sourceHash===data.sourceHash&&revision===data.revision&&!!level&&data.levels.includes(level)&&!!l&&dilutionLessonMatches(l,level)&&l.sourceHash===sourceHash&&l.revision===revision&&l.levels.includes(level)&&!!f&&f.assetSha256===data.assetSha256&&f.lessonSourceHashes[lessonId as keyof typeof f.lessonSourceHashes]===sourceHash&&JSON.stringify(f.labelsJa)===JSON.stringify(data.labelsJapanese)&&f.titleJa===data.figureSourceJapanese.title&&f.altJa===data.figureSourceJapanese.alt&&f.observationJa===data.figureSourceJapanese.observation&&f.limitJa===data.figureSourceJapanese.limit&&JSON.stringify(data.sourceExample)===JSON.stringify({finalLiters:20,finalMilliliters:20000,factor:1000,liquidMilliliters:20,separatePowderGrams:20})&&JSON.stringify(data.independentExample)===JSON.stringify({finalLiters:12,finalMilliliters:12000,factor:600,liquidMilliliters:20});
}
/** Exact source arithmetic and unit distinction; never a real-product prescription or mL-to-g conversion. */
export function DilutionExampleFigure({lessonId,lessonSourceHash,lessonRevision,level,alt,renderLabel,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;alt:string;renderLabel:(index:number)=>ReactNode;colors:Colors}){
 if(!dilutionExampleMatches(lessonId,lessonSourceHash,lessonRevision,level))return null;
 const text={color:colors.translationText,fontSize:20,lineHeight:32,fontWeight:'700' as const};
 return <View testID="agri-native-dilution-example" accessibilityRole="image" accessibilityLabel={alt} style={{padding:14,borderWidth:1,borderColor:colors.border,borderRadius:8,gap:16}}>
  <View style={{gap:6}}>{renderLabel(0)}<Text style={text}>20 L = 20,000 mL</Text></View>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:12}}><Text style={text}>20,000 mL ÷</Text><View style={{alignItems:'center'}}>{renderLabel(1)}<Text style={text}>1,000</Text></View><Text style={text}>= 20 mL</Text></View>
  {renderLabel(2)}
  <View style={{borderTopWidth:1,borderColor:colors.border,paddingTop:12,gap:6}}>{renderLabel(3)}<Text style={text}>20 g</Text></View>
  <View style={{borderTopWidth:1,borderColor:colors.border,paddingTop:12,gap:6}}>{renderLabel(4)}<Text style={text}>12 L = 12,000 mL</Text><Text style={text}>12,000 mL ÷ 600 = 20 mL</Text></View>
  <Text style={{color:colors.translationText,fontSize:14}}>AGR-S1 · PDF p.41 / p.35 · AGR-S2 · PDF p.50 / p.48</Text>
 </View>;
}
