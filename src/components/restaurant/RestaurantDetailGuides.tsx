import {useState} from 'react';
import {Pressable,StyleSheet,Text,View} from 'react-native';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import data from '@/data/restaurant/detail-guides.json';
import {RestaurantReading} from './RestaurantReading';

type Key=keyof typeof data.labels;
type Label={ja:string;segments:{text:string;reading?:string}[];translations:Record<string,string>};
/** Original teaching figures; independent of saved tests and their answers. */
export function RestaurantDetailGuides({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const [revealed,setRevealed]=useState(false),{colors}=useStudyAppearance();
 const guides=data.guides.filter(guide=>guide.lessonIds.includes(lessonId));
 if(!guides.length)return null;
 const translated=showTranslation&&language!=='ja';
 function LabelText({name,heading=false}:{name:Key;heading?:boolean}){
  const label:Label=data.labels[name];
  return <View style={s.label}><RestaurantReading heading={heading} text={label.ja} segments={label.segments}/>{translated&&label.translations[language]&&<TranslationText>{label.translations[language]}</TranslationText>}</View>;
 }
 function Value({text}:{text:string}){return <Text selectable style={[s.value,{color:colors.text}]}>{text}</Text>;}
 const f=data.figures;
 return <View testID="restaurant-detail-guides" style={s.group}>{guides.map(guide=><View key={guide.id} testID={`restaurant-detail-${guide.id}`} style={[s.box,{borderColor:colors.border}]}>
  <LabelText name={guide.title as Key} heading/>
  {guide.kind==='flow'?<View style={s.flow}>{guide.steps?.map((step,index)=><View key={step} style={s.step}>
   <View style={[s.card,s.flowCard,{borderColor:colors.border,backgroundColor:colors.translation}]}><Value text={String(index+1)}/><LabelText name={step as Key}/>{step==='manager'&&<LabelText name="wish"/>}</View>
   {index<(guide.steps?.length??0)-1&&<Text accessibilityElementsHidden importantForAccessibility="no" style={[s.arrow,{color:colors.text}]}>↓</Text>}
  </View>)}</View>:<>
   <LabelText name="fiction"/>
   <LabelText name="grossFormula"/>
   <View style={s.grid}>{(['sales','cost','gross','labor'] as const).map(key=><View key={key} style={[s.card,{borderColor:colors.border}]}><LabelText name={key}/><LabelText name="amount"/><Value text={f[key].toLocaleString('en-US')}/></View>)}</View>
   <LabelText name="hours"/><Value text={String(f.hours)}/>
   <View style={s.grid}>{(['grossRate','salesRate'] as const).map(key=><View key={key} style={[s.card,{borderColor:colors.border}]}><LabelText name={key}/><Value text={`${f.labor.toLocaleString('en-US')} ÷ ${(key==='grossRate'?f.gross:f.sales).toLocaleString('en-US')} × 100 = ${revealed?String(f.labor/(key==='grossRate'?f.gross:f.sales)*100):'?'}%`}/></View>)}</View>
   <LabelText name="hourFormula"/>
   <View style={s.grid}>{(['sales','cost','gross','labor'] as const).map(key=><View key={key} style={[s.card,{borderColor:colors.border}]}><LabelText name={key}/><LabelText name="perHour"/><LabelText name="amount"/><Value text={`${f[key].toLocaleString('en-US')} ÷ ${f.hours} = ${revealed?(f[key]/f.hours).toLocaleString('en-US'):'?'}`}/></View>)}</View>
   <Pressable testID="restaurant-detail-reveal" accessibilityRole="button" accessibilityLabel={translated?data.labels[revealed?'hide':'show'].translations[language as keyof typeof data.labels.show.translations]:data.labels[revealed?'hide':'show'].ja} aria-expanded={revealed} accessibilityState={{expanded:revealed}} onPress={()=>setRevealed(v=>!v)} style={[s.button,{borderColor:colors.border,backgroundColor:colors.translation}]}><LabelText name={revealed?'hide':'show'}/></Pressable>
  </>}
 </View>)}</View>;
}
const s=StyleSheet.create({group:{gap:16},box:{padding:12,borderWidth:1,borderRadius:10,gap:12},label:{minWidth:0,maxWidth:'100%'},flow:{gap:0},step:{minWidth:0},card:{padding:12,gap:6,borderWidth:1,borderRadius:8,minWidth:0,flexBasis:220,flexGrow:1,flexShrink:1},flowCard:{flexBasis:'auto',flexGrow:0},grid:{flexDirection:'row',flexWrap:'wrap',gap:12},arrow:{fontSize:24,lineHeight:32,textAlign:'center'},value:{fontSize:17,lineHeight:29,flexShrink:1,maxWidth:'100%'},button:{minHeight:48,padding:12,borderWidth:1,borderRadius:8}});
