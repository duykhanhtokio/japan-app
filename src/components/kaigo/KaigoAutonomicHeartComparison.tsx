import React from 'react';
import {Text,View} from 'react-native';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {japaneseMasterRevision,japaneseMasterSections,japaneseLessonMetadata,japaneseLessonRevision} from '@/data/kaigo/japanese-master';
import wording from '@/data/kaigo/autonomic-heart-comparison.json';

/** Exact source-bound knowledge comparison. General physiology never fills an unmeasured result. */
export function KaigoAutonomicHeartComparison({language='ja'}:{language?:string}){
 const {colors}=useStudyAppearance();
 const section=japaneseMasterSections['kaigo-atomic-autonomic-heart'];
 const lesson=japaneseLessonMetadata['69'];
 if(!section||!lesson||japaneseMasterRevision(section)!=='ja-master-v1-c49f177e'||japaneseLessonRevision(lesson)!=='ja-master-v1-f93272fd')return null;
 const ja=wording.ja;
 const target=language==='ja'?undefined:(wording as Record<string,string[]>)[language];
 const paired=(index:number,heading=false)=><View key={index} style={{gap:4}}>
  <Text style={{color:colors.text,fontSize:heading?17:16,fontWeight:heading?'700':'400',lineHeight:25}}>{ja[index]}</Text>
  {target&&<Text style={{color:colors.text,fontSize:16,lineHeight:25}}>{target[index]}</Text>}
 </View>;
 return <View testID="kaigo-autonomic-heart-comparison" style={{gap:12,paddingVertical:12}}>
  {paired(0,true)}
  {[1,3,5].map(index=><View key={index} style={{gap:6,paddingVertical:8,borderTopWidth:1,borderColor:colors.muted}}>
   {paired(index,true)}{paired(index+1)}
  </View>)}
 </View>;
}
