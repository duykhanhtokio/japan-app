import {useEffect,useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import guideData from '@/data/restaurant/qsc-guide.json';
import {RestaurantReading} from './RestaurantReading';

type Label={ja:string;segments:{text:string;reading?:string}[];translations:Record<string,string>};
type Guide={lessonIds:string[];groups:{id:string;label:string;items:string[]}[];labels:Record<string,Label>};
const guide:Guide=guideData;

/** Original learning checklist. It never reads or writes exam/lesson records. */
export function RestaurantQscGuide({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();
 const [checked,setChecked]=useState<Set<string>>(()=>new Set());
 useEffect(()=>setChecked(new Set()),[lessonId]);
 if(!guide.lessonIds.includes(lessonId))return null;
 const translated=showTranslation&&language!=='ja';
 const itemCount=guide.groups.reduce((sum,group)=>sum+group.items.length,0);
 function LabelText({name,heading=false}:{name:string;heading?:boolean}){
  const label=guide.labels[name];
  return <View style={s.label}>
   <RestaurantReading text={label.ja} segments={label.segments} heading={heading}/>
   {translated&&label.translations[language]&&<TranslationText>{label.translations[language]}</TranslationText>}
  </View>;
 }
 function accessibleLabel(name:string){
  const label=guide.labels[name];
  return translated?`${label.ja} — ${label.translations[language]||label.ja}`:label.ja;
 }
 function toggle(key:string){
  setChecked(previous=>{
   const next=new Set(previous);
   if(next.has(key))next.delete(key);else next.add(key);
   return next;
  });
 }
 return <View testID="restaurant-qsc-guide" style={[s.box,{borderColor:colors.border}]}>
  <LabelText name="title" heading/>
  <LabelText name="instruction"/>
  <View style={s.grid}>{guide.groups.map(group=><View key={group.id} testID={`restaurant-qsc-${group.id}`} style={[s.card,{borderColor:colors.border}]}>
   <LabelText name={group.label} heading/>
   {group.items.map(key=><Pressable key={key} testID={`restaurant-qsc-check-${key}`} accessibilityRole="checkbox" accessibilityLabel={accessibleLabel(key)} accessibilityState={{checked:checked.has(key)}} onPress={()=>toggle(key)} style={[s.item,{borderColor:colors.border,backgroundColor:checked.has(key)?colors.translation:colors.background}]}>
    <View accessible={false} style={[s.check,{borderColor:colors.border}]}>{checked.has(key)&&<View style={[s.mark,{backgroundColor:colors.text}]}/>}</View>
    <View style={s.itemLabel}><LabelText name={key}/></View>
   </Pressable>)}
  </View>)}</View>
  <View style={[s.note,{borderColor:colors.border,backgroundColor:colors.translation}]}>
   <LabelText name="timing"/>
   <LabelText name="timingScope"/>
  </View>
  <View style={s.summary}><LabelText name="confirmed"/><Text testID="restaurant-qsc-count" style={[s.count,{color:colors.text}]}>{checked.size} / {itemCount}</Text></View>
  <LabelText name="scope"/>
  <Pressable testID="restaurant-qsc-reset" accessibilityRole="button" accessibilityLabel={accessibleLabel('reset')} onPress={()=>setChecked(new Set())} style={[s.reset,{borderColor:colors.border,backgroundColor:colors.translation}]}>
   <LabelText name="reset"/>
  </Pressable>
 </View>;
}

const s=StyleSheet.create({
 box:{padding:12,borderWidth:1,borderRadius:10,gap:12},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:12,alignItems:'flex-start'},
 card:{flexBasis:260,flexGrow:1,flexShrink:1,minWidth:0,padding:10,gap:10,borderWidth:1,borderRadius:8},
 label:{minWidth:0,maxWidth:'100%'},
 item:{flexDirection:'row',alignItems:'flex-start',gap:10,minHeight:48,padding:10,borderWidth:1,borderRadius:8,minWidth:0},
 itemLabel:{flex:1,minWidth:0},
 check:{width:22,height:22,borderWidth:2,borderRadius:4,marginTop:13,alignItems:'center',justifyContent:'center',flexShrink:0},
 mark:{width:12,height:12,borderRadius:2},
 note:{padding:12,borderWidth:1,borderRadius:8,gap:8},
 summary:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:10},
 count:{fontSize:18,lineHeight:30,fontWeight:'700',flexShrink:1},
 reset:{minHeight:48,padding:12,borderWidth:1,borderRadius:8},
});
