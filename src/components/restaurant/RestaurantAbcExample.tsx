import {View} from 'react-native';
import type {RestaurantLesson} from '@/data/restaurant';
import data from '@/data/restaurant/royal-abc-example.json';
import daily from '@/data/restaurant/daily-learning.json';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {RoyalContentPanel} from '@/components/ui/RoyalPanels';
import {RestaurantReading} from './RestaurantReading';

export function restaurantHasAbcExample(lesson:Pick<RestaurantLesson,'id'|'sourceHash'>){
 return lesson.id===data.lessonId&&lesson.sourceHash===data.lessonSourceHash&&daily.royalNativeCompanions.some(b=>b.lessonId===lesson.id&&b.sourceHash===lesson.sourceHash&&b.figureId==='rst-native-worked-abc');
}
/** All widths, totals and groups derive from the canonical original worked example. */
export function restaurantAbcRows(){
 const total=data.items.reduce((sum,item)=>sum+item.salesYen,0);let cumulative=0;
 return {total,rows:[...data.items].sort((a,b)=>b.salesYen-a.salesYen).map(item=>{const share=item.salesYen/total*100;cumulative+=share;return {...item,share,cumulative,group:cumulative<=data.exerciseThresholds.aMaxCumulativePercent?'A':cumulative<=data.exerciseThresholds.bMaxCumulativePercent?'B':'C'};})};
}
const headings=[
 [{text:'ABC',reading:'エービーシー'},{text:'分析',reading:'ぶんせき'},{text:'：'},{text:'売上額',reading:'うりあげがく'},{text:'の'},{text:'独自練習',reading:'どくじれんしゅう'}],
 [{text:'売上額',reading:'うりあげがく'}],
 [{text:'構成比',reading:'こうせいひ'}],
 [{text:'累積構成比',reading:'るいせきこうせいひ'}],
 [{text:'区分',reading:'くぶん'}],
 [{text:'合計',reading:'ごうけい'}],
];
const yen=(value:number)=>`${String(value).replace(/\B(?=(\d{3})+(?!\d))/g,',')}円`;
export function RestaurantAbcExample({lesson,language,showTranslation}:{lesson:RestaurantLesson;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance();if(!restaurantHasAbcExample(lesson))return null;
 const {total,rows}=restaurantAbcRows(),ja=data.labels.ja,target=(data.labels as Record<string,string[]>)[language],names=(data.itemNames as Record<string,string[]>)[language],caption=(data.caption.translations as Record<string,{sourceHash:string;text:string}>)[language],accessibleLabels=showTranslation&&language!=='ja'&&target?target:ja;
 const heading=(index:number)=><View style={{gap:4}}><RestaurantReading heading text={ja[index]} segments={headings[index]}/>{showTranslation&&language!=='ja'&&target?.[index]&&<TranslationText>{target[index]}</TranslationText>}</View>;
 return <View testID="restaurant-worked-abc" style={{width:'100%'}}><RoyalContentPanel style={{width:'100%',gap:16}}>
  {heading(0)}
  <View style={{gap:8}}>{heading(5)}<RestaurantReading text={yen(total)}/></View>
  {rows.map(row=>{const original=data.items.findIndex(item=>item.id===row.id),name=showTranslation&&language!=='ja'&&names?.[original]?names[original]:row.ja;
   return <View key={row.id} testID={`restaurant-abc-${row.id}`} style={{gap:10,paddingVertical:12,borderBottomWidth:1,borderColor:colors.border}}>
    <View style={{gap:8,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between'}}>
     <View style={{gap:4}}><RestaurantReading heading text={row.ja} segments={[{text:row.ja,...(row.reading?{reading:row.reading}:{})}]}/>{showTranslation&&language!=='ja'&&names?.[original]&&<TranslationText>{names[original]}</TranslationText>}</View>
     <View style={{gap:4}}>{heading(1)}<RestaurantReading text={yen(row.salesYen)}/></View>
    </View>
    <View style={{gap:8,flexDirection:'row',flexWrap:'wrap'}}>{[{index:2,value:`${row.share}％`},{index:3,value:`${row.cumulative}％`},{index:4,value:row.group}].map(metric=><View key={metric.index} style={{width:'30%',gap:6}}>{heading(metric.index)}<RestaurantReading text={metric.value}/></View>)}</View>
    <View accessible accessibilityRole="image" accessibilityLabel={`${name} / ${accessibleLabels[2]} ${row.share}％ / ${accessibleLabels[3]} ${row.cumulative}％ / ${accessibleLabels[4]} ${row.group}`} style={{height:16,width:'100%',backgroundColor:'#e4ded1',overflow:'hidden',borderRadius:4}}>
     <View testID={`restaurant-abc-bar-${row.id}`} style={{height:'100%',width:`${row.share}%` as `${number}%`,backgroundColor:row.group==='A'?'#b68a3e':row.group==='B'?'#506f87':'#8c9a90'}}/>
    </View>
   </View>;
  })}
  <RestaurantReading text={data.caption.textJa} segments={data.caption.furigana}/>{showTranslation&&language!=='ja'&&caption?.sourceHash===data.caption.sourceHash&&<TranslationText>{caption.text}</TranslationText>}
 </RoyalContentPanel></View>;
}
