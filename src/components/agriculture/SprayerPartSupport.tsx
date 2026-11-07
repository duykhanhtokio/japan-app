import {Text,View} from 'react-native';
import type {ReactNode} from 'react';
import data from '@/data/agriculture/sprayer-part-support.json';
import content from '@/data/agriculture/lessons.ja.json';
import figures from '@/data/agriculture/recognition-images.json';
type Colors={text:string;translation:string;translationText:string;border:string};
type SourceLesson={id:string;sourceHash:string;revision:string;titleJa:string;objectiveJa:string;levels:string[];paragraphs:{id:string;titleJa:string;textJa:string}[];sources:unknown};
export function sprayerPartLessonMatches(lesson:SourceLesson,level:string|undefined){
 return !!level&&data.levels.includes(level)&&lesson.levels.includes(level)&&lesson.id===data.lessonId&&lesson.sourceHash===data.sourceHash&&lesson.revision===data.revision&&lesson.titleJa===data.lessonSourceJapanese.title&&lesson.objectiveJa===data.lessonSourceJapanese.objective&&JSON.stringify(lesson.paragraphs.map(p=>({id:p.id,titleJa:p.titleJa,textJa:p.textJa})))===JSON.stringify(data.lessonSourceJapanese.paragraphs)&&JSON.stringify(lesson.sources)===JSON.stringify(data.lessonSources);
}
/** Qualitative source component map accompanying detailed existing appearance art, not assembly instructions. */
export function sprayerPartSupportMatches(lessonId:string,sourceHash:string,revision:string|undefined,level:string|undefined,assetSha256:string){
 const l=content.lessons.find(l=>l.id===lessonId),f=figures.images.find(f=>f.id===data.figureId);
 return data.schemaVersion===1&&lessonId===data.lessonId&&sourceHash===data.sourceHash&&revision===data.revision&&!!level&&data.levels.includes(level)&&!!l&&sprayerPartLessonMatches(l,level)&&l.levels.includes(level)&&l.sourceHash===sourceHash&&l.revision===revision&&l.paragraphs[0].id===data.paragraphId&&l.paragraphs[0].textJa===data.paragraphSourceJapanese&&!!f&&f.titleJa===data.figureSourceJapanese.title&&f.altJa===data.figureSourceJapanese.alt&&f.observationJa===data.figureSourceJapanese.observation&&f.limitJa===data.figureSourceJapanese.limit&&f.assetSha256===assetSha256&&assetSha256===data.assetSha256&&JSON.stringify(f.labelsJa)===JSON.stringify(data.labelsJapanese)&&f.lessonSourceHashes[lessonId as keyof typeof f.lessonSourceHashes]===sourceHash;
}
export function SprayerPartSupport({lessonId,lessonSourceHash,lessonRevision,level,assetSha256,alt,renderLabel,colors}:{lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;assetSha256:string;alt:string;renderLabel:(index:number)=>ReactNode;colors:Colors}){
 if(!sprayerPartSupportMatches(lessonId,lessonSourceHash,lessonRevision,level,assetSha256))return null;
 const order=[2,1,4,3,0],label=(index:number)=>renderLabel(order[index]);
 const line={backgroundColor:colors.translationText};
 return <View accessibilityRole="image" accessibilityLabel={alt} testID="agri-native-sprayer-parts" style={{gap:18,borderWidth:1,borderColor:colors.border,padding:12,borderRadius:8}}>
  <View style={{flexDirection:'row',alignItems:'center',gap:4,flexWrap:'wrap'}}>
   <View style={{alignItems:'center',gap:8,minWidth:95}}>{label(0)}<View style={{width:20,height:30,backgroundColor:'#636f72',borderRadius:4,transform:[{rotate:'30deg'}]}}/></View>
   <View style={{alignItems:'center',gap:8,flexGrow:1,minWidth:120}}>{label(1)}<View style={[line,{height:5,width:'100%',minWidth:100}]}/></View>
   <View style={{alignItems:'center',gap:8,minWidth:95}}>{label(3)}<View style={{width:20,height:20,backgroundColor:'#697579',borderRadius:3}}/></View>
  </View>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:24}}>
   <View style={{alignItems:'center',gap:8,minWidth:120}}>{label(2)}<View style={{width:38,height:38,borderWidth:8,borderColor:'#3e474a',borderRadius:19}}/></View>
   <View style={{alignItems:'center',gap:8,minWidth:120}}>{label(4)}<View style={{height:64,width:22,backgroundColor:'#4f5c60',borderRadius:5}}/></View>
  </View>
  <Text style={{color:colors.translationText,fontSize:14}}>AGR-S1 · PDF p.40 / p.34 · AGR-S2 · PDF p.56 / p.54</Text>
 </View>;
}
