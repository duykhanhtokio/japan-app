import {useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import exercise from '@/data/restaurant/ordering-exercise.json';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';

type LabelKey=keyof typeof exercise.labels;
type Label={ja:string;segments:{text:string;reading?:string}[];translations:Record<string,string>};

/** Original ordering exercise. It is separate from exam answers and saved attempts. */
export function RestaurantOrderingExercise({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const [revealed,setRevealed]=useState(false);
 const {colors}=useStudyAppearance();
 if(!exercise.lessonIds.includes(lessonId))return null;
 const translated=showTranslation&&language!=='ja';
 function LabelText({name,heading=false}:{name:LabelKey;heading?:boolean}){
  const label:Label=exercise.labels[name];
  return <View style={s.label}><RestaurantReading heading={heading} text={label.ja} segments={label.segments}/>{translated&&label.translations[language]&&<TranslationText>{label.translations[language]}</TranslationText>}</View>;
 }
 function Value({text,testID}:{text:string;testID?:string}){
  return <Text selectable testID={testID} style={[s.value,{color:colors.text}]}>{text}</Text>;
 }
 const order=exercise.orderKg,selected=exercise.plans[exercise.selectedPlan];
 const buttonName=revealed?'hide':'show';
 const buttonLabel:Label=exercise.labels[buttonName];
 return <View testID="restaurant-ordering-exercise" style={[s.box,{borderColor:colors.border}]}>
  <LabelText name="title" heading/>
  <LabelText name="note"/>
  <LabelText name="recipe" heading/>
  <View style={s.grid}>{(['curry','setMeal'] as const).map(key=><View key={key} style={[s.card,{borderColor:colors.border}]}>
   <LabelText name={key}/><Value text={`${exercise.recipeKg[key].toFixed(2)} kg`}/>
   <View style={s.inline}><Value text={String(exercise.priceYen[key])}/><LabelText name="yen"/></View>
  </View>)}</View>
  <LabelText name="sales" heading/>
  <LabelText name="forecastNote"/>
  <View style={s.grid}>{exercise.plans.map((plan,index)=><View key={plan.salesYen} testID={`restaurant-ordering-plan-${index}`} style={[s.card,{borderColor:colors.border,backgroundColor:index===exercise.selectedPlan?colors.translation:colors.background}]}>
   <View style={s.inline}><Value text={plan.salesYen.toLocaleString('en-US')}/><LabelText name="yen"/></View>
   <LabelText name="curry"/><View style={s.inline}><Value text={String(plan.curry)}/><LabelText name="portionUnit"/></View>
   <LabelText name="setMeal"/><View style={s.inline}><Value text={String(plan.setMeal)}/><LabelText name="portionUnit"/></View>
   <LabelText name="rice"/><Value testID={`restaurant-ordering-rice-${index}`} text={revealed?`${plan.riceKg.toFixed(1)} kg`:'? kg'}/>
   {revealed&&<Value text={`${plan.curry} × ${exercise.recipeKg.curry.toFixed(2)} + ${plan.setMeal} × ${exercise.recipeKg.setMeal.toFixed(2)} = ${plan.riceKg.toFixed(1)} kg`}/>}
  </View>)}</View>
  <LabelText name="order" heading/>
  <LabelText name="supplier"/>
  <LabelText name="selected"/><View style={s.inline}><Value text={selected.salesYen.toLocaleString('en-US')}/><LabelText name="yen"/></View>
  <LabelText name="period"/>
  <View style={s.grid}>{(['demand','buffer','usable','incoming'] as const).map(key=><View key={key} style={[s.card,{borderColor:colors.border}]}><LabelText name={key}/><Value text={`${order[key].toFixed(1)} kg`}/></View>)}</View>
  <LabelText name="stockNote"/>
  <LabelText name="additional"/>
  <Value testID="restaurant-ordering-result" text={revealed?`${order.additional.toFixed(1)} kg`:'? kg'}/>
  <Value testID="restaurant-ordering-formula" text={`${order.demand.toFixed(1)} + ${order.buffer.toFixed(1)} − ${order.usable.toFixed(1)} − ${order.incoming.toFixed(1)} = ${revealed?order.additional.toFixed(1):'?'} kg`}/>
  <LabelText name="schedule" heading/>
  <View style={s.grid}>{(['monday','tuesday','wednesday','thursday'] as const).map(key=><View key={key} testID={`restaurant-ordering-${key}`} style={[s.card,{borderColor:colors.border}]}><LabelText name={key}/></View>)}</View>
  <Pressable testID="restaurant-ordering-reveal" accessibilityRole="button" accessibilityLabel={translated?buttonLabel.translations[language]||buttonLabel.ja:buttonLabel.ja} accessibilityState={{expanded:revealed}} onPress={()=>setRevealed(value=>!value)} style={[s.button,{borderColor:colors.border,backgroundColor:colors.translation}]}>
   <LabelText name={buttonName}/>
  </Pressable>
 </View>;
}
const s=StyleSheet.create({
 box:{padding:12,borderWidth:1,borderRadius:10,gap:12},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:12},
 card:{flexBasis:240,flexGrow:1,flexShrink:1,minWidth:0,padding:10,gap:6,borderWidth:1,borderRadius:8},
 label:{minWidth:0,maxWidth:'100%'},inline:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:6},
 value:{fontSize:17,lineHeight:29,flexShrink:1,maxWidth:'100%'},
 button:{minHeight:48,padding:12,borderWidth:1,borderRadius:8},
});
