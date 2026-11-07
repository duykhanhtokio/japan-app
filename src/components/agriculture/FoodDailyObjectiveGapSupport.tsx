import React from 'react';
import {Text, View} from 'react-native';
import content from '@/data/agriculture/lessons.ja.json';
import data from '@/data/agriculture/food-daily-objective-gaps.json';
import {agricultureLocaleTranslations} from '@/data/agriculture/translations';

type Colors = {text:string;translation:string;translationText:string;border:string};
type Lesson = {id:string;revision:string;sourceHash:string;levels:string[];titleJa:string;paragraphs:{id:string;titleJa:string;textJa:string}[]};
type Translation = {sourceHash:string;title:string;objective:string;paragraphs:Record<string,string>;paragraphTitles:Record<string,string>;activity:string};
type Entry = {kind:'flow'|'conditional'|'matrix'|'sequence'|'formats';sourceHash:string;revision:string;scopeLevels:string[];lessonSnapshot:Lesson;canonicalTranslations:Record<string,Translation>;sourceRefs:{documentId:string;pdfPage:number;printedPage:number}[]};
const registry = data as unknown as {schemaVersion:number;kind:string;studyOnly:boolean;labelsJa:Record<string,string>;readingsKana:Record<string,string>;locales:Record<string,Record<string,string>>;localeSourceJapanese:Record<string,Record<string,string>>;entries:Record<string,Entry>};
const lessons = content.lessons as unknown as Lesson[];
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const kinds:Record<string,string>={'agr-facility-env-solution-circulation-2':'flow','agr-f40-facility-fruit-bud-options2':'conditional','agr-facility-structure-cover-functions-2':'matrix','agr-fruit-manage-harvest':'sequence','agr-flower-work-production':'formats'};
const labelKeys=['tank','bed','return','treatment','circulation','discharge','condition','purpose','action','weakYoung','vigorous','removeAll','largeFlowerFruit','retainSome','sourceExample','scope','diffusion','water','ultraviolet','heat','board','storage','ripeTree','harvest','postRipen','separate','trim','cutFlower','potted','bedding'];
export const isFoodDailyObjectiveGapContext=(id:string)=>Object.prototype.hasOwnProperty.call(kinds,id);
export function foodDailyObjectiveGapEntry(id:string,hash:string,revision?:string,level?:string,paragraphIds?:string[]){
 const entry=registry.entries[id],lesson=lessons.find(l=>l.id===id);
 if(registry.schemaVersion!==1||registry.kind!=='food-daily-objective-gaps'||!registry.studyOnly||!isFoodDailyObjectiveGapContext(id)||!entry||entry.kind!==kinds[id]||!lesson||!revision||!level||entry.sourceHash!==hash||entry.revision!==revision||lesson.sourceHash!==hash||lesson.revision!==revision||!same(entry.scopeLevels,lesson.levels)||!same(entry.sourceRefs,(lesson as Lesson & {sources:unknown}).sources)||!entry.scopeLevels.includes(level)||!lesson.levels.includes(level)||!same(lesson,entry.lessonSnapshot)||!same(registry.labelsJa,registry.locales.ja))return null;
 if(paragraphIds&&lesson.paragraphs.some(p=>!paragraphIds.includes(p.id)))return null;
 if(!labelKeys.every(k=>registry.labelsJa[k]?.trim()&&registry.readingsKana[k]?.trim()&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー・。、\s]+$/u.test(registry.readingsKana[k])))return null;
 return entry;
}
export function foodDailyObjectiveGapLabels(id:string,hash:string,revision:string|undefined,level:string|undefined,language:string,paragraphIds?:string[]){
 const entry=foodDailyObjectiveGapEntry(id,hash,revision,level,paragraphIds),labels=registry.locales[language];
 if(!entry||!labels||!labelKeys.every(k=>labels[k]?.trim()))return null;
 if(language==='ja')return {labels,translation:null};
 const current=agricultureLocaleTranslations(language)?.[id];
 if(!same(registry.localeSourceJapanese[language],registry.labelsJa)||!current||current.sourceHash!==hash||!same(current,entry.canonicalTranslations[language]))return null;
 return {labels,translation:current};
}
type Props={lessonId:string;lessonSourceHash:string;lessonRevision?:string;level?:string;language?:string;showTranslation?:boolean;colors:Colors;paragraphIds?:string[]};
export function FoodDailyObjectiveGapSupport({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors,paragraphIds}:Props){
 const entry=foodDailyObjectiveGapEntry(lessonId,lessonSourceHash,lessonRevision,level,paragraphIds);
 if(!entry)return null;
 const localized=showTranslation&&language!=='ja'?foodDailyObjectiveGapLabels(lessonId,lessonSourceHash,lessonRevision,level,language,paragraphIds):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27};
 const label=(key:string)=><View testID={'gap-label-'+key} style={{minWidth:0,maxWidth:'100%'}}><Text style={{...text,fontSize:12,lineHeight:20}}>{registry.readingsKana[key]}</Text><Text style={{...text,fontWeight:'700'}}>{registry.labelsJa[key]}</Text>{localized&&<Text style={text}>{localized.labels[key]}</Text>}</View>;
 const box=(key:string)=><View key={key} testID={'gap-node-'+key} style={{minWidth:0,maxWidth:'100%',borderWidth:1,borderColor:colors.border,borderRadius:9,padding:10}}>{label(key)}</View>;
 const arrow=<Text accessibilityLabel="↓" style={{...text,alignSelf:'center',padding:6}}>↓</Text>;
 const paragraph=(index:number)=>{const p=entry.lessonSnapshot.paragraphs[index];return <View key={p.id} testID="gap-source-paragraph" style={{minWidth:0,maxWidth:'100%',paddingVertical:10}}><Text style={{...text,fontWeight:'700'}}>{p.titleJa}</Text><Text style={text}>{p.textJa}</Text>{localized&&<Text testID="gap-translated-paragraph" style={{...text,marginTop:8}}>{localized.translation!.paragraphs[p.id]}</Text>}</View>;};
 const flow=(head:string,tail:string)=><View key={head} testID={'gap-flow-'+head} style={{minWidth:0,maxWidth:'100%',borderWidth:1,borderColor:colors.border,padding:12,borderRadius:10,marginVertical:8,flexBasis:280,flexGrow:1}}>{label(head)}<View style={{marginTop:10}}>{box('tank')}{arrow}{box('bed')}{arrow}{box(tail)}</View></View>;
 const branch=(purpose:string,action:string,condition?:string)=><View key={action} testID={'gap-branch-'+action} style={{minWidth:0,maxWidth:'100%',flexBasis:280,flexGrow:1,borderWidth:1,borderColor:colors.border,borderRadius:10,padding:12,marginVertical:8}}>{condition&&<View>{label('condition')}{label(condition)}</View>}<View style={{paddingVertical:10}}>{label('purpose')}{label(purpose)}</View><Text style={{...text,textAlign:'center'}}>↓</Text>{label('action')}{label(action)}</View>;
 return <View testID={'food-daily-gap-'+entry.kind} style={{minWidth:0,maxWidth:'100%',borderColor:colors.border,borderWidth:1,borderRadius:14,padding:12,marginVertical:12,backgroundColor:colors.translation}}>
 <Text style={{...text,fontSize:19,fontWeight:'700'}}>{entry.lessonSnapshot.titleJa}</Text>
 {entry.kind==='flow'?<View><View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{flow('circulation','return')}{flow('discharge','treatment')}</View><View testID="gap-comparison-matrix" style={{borderTopWidth:1,borderColor:colors.border,marginTop:12}}>{[1,2,3,4].map(paragraph)}</View>{paragraph(0)}{paragraph(5)}</View>
 :entry.kind==='conditional'?<View>{label('sourceExample')}<View testID="gap-condition-branches" style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{branch('vigorous','removeAll','weakYoung')}{branch('largeFlowerFruit','retainSome')}</View>{paragraph(0)}</View>
 :entry.kind==='matrix'?<View testID="gap-cover-function-matrix">{['diffusion','water','ultraviolet','heat','board','storage'].map((key,index)=><View key={key} testID={'gap-matrix-row-'+key} style={{flexDirection:'row',flexWrap:'wrap',gap:12,borderTopWidth:1,borderColor:colors.border,paddingVertical:12}}><View style={{flexBasis:190,flexGrow:1,minWidth:0,maxWidth:'100%'}}>{label(key)}</View><View style={{flexBasis:350,flexGrow:3,minWidth:0,maxWidth:'100%'}}>{paragraph(index)}</View></View>)}</View>
 :entry.kind==='sequence'?<View><View testID="gap-ripening-comparison" style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{[['ripeTree','harvest','リンゴ・ニホンナシ・カンキツ類','リンゴ・ニホンナシ・カンキツるい'],['harvest','postRipen','セイヨウナシ・キウイフルーツ','セイヨウナシ・キウイフルーツ']].map(([first,last,names,reading])=><View key={last} testID={'gap-ripening-'+last} style={{flexBasis:280,flexGrow:1,minWidth:0,maxWidth:'100%',borderWidth:1,borderColor:colors.border,borderRadius:10,padding:12,marginVertical:8}}><Text style={{...text,fontSize:12,lineHeight:20}}>{reading}</Text><Text style={{...text,fontWeight:'700'}}>{names}</Text>{label(first)}{arrow}{label(last)}</View>)}</View>{[0,1,2,3].map(paragraph)}<View testID="gap-two-cut-relation" style={{borderWidth:1,borderColor:colors.border,borderRadius:10,padding:12}}><Text style={{...text,fontWeight:'700'}}>ウンシュウミカン</Text>{label('separate')}{paragraph(4)}{arrow}{label('trim')}{paragraph(5)}</View></View>
 :<View><View testID="gap-shipping-classification-root" style={{alignItems:'center',padding:12,borderBottomWidth:1,borderColor:colors.border}}><Text style={{...text,fontSize:12,lineHeight:20}}>しゅっかするすがたでわける</Text><Text style={{...text,fontWeight:'700'}}>{entry.lessonSnapshot.paragraphs[0].titleJa}</Text>{localized&&<Text style={text}>{localized.translation!.paragraphTitles[entry.lessonSnapshot.paragraphs[0].id]}</Text>}</View><View testID="gap-flower-shipping-formats" style={{borderLeftWidth:2,borderColor:colors.border,marginLeft:10,paddingVertical:12}}>{['cutFlower','potted','bedding'].map(key=><View key={key} testID={'gap-format-'+key} style={{flexDirection:'row',alignItems:'center',minWidth:0,maxWidth:'100%',marginVertical:8}}><View style={{width:18,flexBasis:18,borderTopWidth:2,borderColor:colors.border}}/><View style={{flexGrow:1,flexShrink:1,minWidth:0,maxWidth:'100%',borderWidth:1,borderColor:colors.border,borderRadius:10,padding:12}}>{label(key)}</View></View>)}</View>{entry.lessonSnapshot.paragraphs.map((_,index)=>paragraph(index))}</View>}

 <View style={{borderTopWidth:1,borderColor:colors.border,paddingTop:12,marginTop:12}}>{label('scope')}<Text style={{...text,fontSize:13}}>{entry.sourceRefs.map(s=>`${s.documentId} · PDF p.${s.pdfPage} / p.${s.printedPage}`).join(' / ')}</Text></View>
 </View>;
}
