import labelTranslations from '@/data/food-manufacturing/management-label-translations.json';
import {useState} from 'react';
import {StyleSheet,Text,View} from 'react-native';
import {foodManagementVisualsFor,foodManagementTeachingData as data,type FoodManagementVisualKind} from '@/data/food-manufacturing/management-visuals';
import {foodManufacturingTranslation,type FoodManufacturingLesson} from '@/data/food-manufacturing';
import {TranslationText} from '@/components/tokutei/StudyAppearance';
import {FoodLessonRuby} from './FoodLessonRuby';
import {hasAlignedRuby} from '@/components/world/japanese-ruby-data';
import type {RubySegment} from '@/types/japanese-ruby';
const BLUE='#14699b',ORANGE='#a84314',INK='#26323d',BG='#fffdf7',GRID='#b3bcc4';
const labelReadings:Record<string,string>={学習用:'がくしゅうよう',仮想:'かそう',平均:'へいきん',件数:'けんすう',累積比:'るいせきひ',管理図:'かんりず',散布図:'さんぷず',測定値:'そくていち',出来高:'できだか',人時生産性:'にんじせいさんせい',標準:'ひょうじゅん',実績:'じっせき',累積:'るいせき',計画:'けいかく',包装:'ほうそう',重量:'じゅうりょう',汚れ:'よごれ',製品:'せいひん',規格値:'きかくち',仮定:'かてい',人時:'にんじ',件:'けん',人:'にん',図:'ず'};
const compactLabelParts:Record<string,RubySegment[]>={人時:[{text:'人',reading:'にん'},{text:'時',reading:'じ'}],標準:[{text:'標',reading:'ひょう'},{text:'準',reading:'じゅん'}],実績:[{text:'実',reading:'じっ'},{text:'績',reading:'せき'}],計画:[{text:'計',reading:'けい'},{text:'画',reading:'かく'}],累積:[{text:'累',reading:'るい'},{text:'積',reading:'せき'}],平均:[{text:'平',reading:'へい'},{text:'均',reading:'きん'}],重量:[{text:'重',reading:'じゅう'},{text:'量',reading:'りょう'}],包装:[{text:'包',reading:'ほう'},{text:'装',reading:'そう'}]};
const labelTokens=Object.keys(labelReadings).sort((a,b)=>b.length-a.length);
/** Explicit sector-local chart-label readings; unknown Han text falls back unchanged. */
export function foodManagementLabelRuby(text:string):RubySegment[]|undefined{
 if(!/\p{Script=Han}/u.test(text))return undefined;
 const parts:RubySegment[]=[];let index=0;
 while(index<text.length){const token=labelTokens.find(t=>text.startsWith(t,index));if(token){parts.push(...(compactLabelParts[token]??[{text:token,reading:labelReadings[token]}]));index+=token.length;}else{const character=Array.from(text.slice(index))[0];parts.push({text:character});index+=character.length;}}
 return hasAlignedRuby(text,parts)&&!parts.some(p=>/\p{Script=Han}/u.test(p.text)&&!p.reading)?parts:undefined;
}
function Label({text,size=16,strong=false,center=false}:{text:string;size?:number;strong?:boolean;center?:boolean}){
 const parts=foodManagementLabelRuby(text),base={fontSize:size,lineHeight:Math.ceil(size*1.6),color:INK,fontWeight:strong?'700' as const:'400' as const};
 if(!parts)return <Text style={[base,center?{textAlign:'center'}:{}]}>{text}</Text>;
 return <View testID="food-chart-label-ruby" accessible accessibilityLabel={text} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',justifyContent:center?'center':'flex-start'}}>{parts.map((part,i)=><View key={i} style={{alignItems:'center'}}><Text style={{fontSize:Math.max(9,size*.56),lineHeight:14,color:INK}}>{part.reading??' '}</Text><Text style={base}>{part.text}</Text></View>)}</View>;
}
type Series={values:number[];color:string;connect?:boolean};
function Segment({x1,y1,x2,y2,color}:{x1:number;y1:number;x2:number;y2:number;color:string}){const length=Math.hypot(x2-x1,y2-y1);return <View style={{position:'absolute',left:(x1+x2)/2-length/2,top:(y1+y2)/2-1,width:length,height:2,backgroundColor:color,transform:[{rotate:`${Math.atan2(y2-y1,x2-x1)}rad`}]}}/>;}
function Plot({labels,max,min=0,series=[],bars,lines=[],histogram=false,rightPercent=false}:{labels:string[];max:number;min?:number;series?:Series[];bars?:number[];lines?:{value:number;color:string}[];histogram?:boolean;rightPercent?:boolean}){
 const [width,setWidth]=useState(240),height=170,range=max-min,x=(i:number)=>(i+.5)*width/labels.length,y=(value:number)=>height-(value-min)/range*height;
 return <View style={s.chart}><View style={s.plotRow}><View style={s.axis}>{[max,(max+min)/2,min].map(value=><Text key={value} style={[s.tick,{top:y(value)-9}]}>{Number(value.toFixed(2))}</Text>)}</View><View testID="food-management-plot" onLayout={e=>setWidth(e.nativeEvent.layout.width)} style={s.plot}>
 {[min,(max+min)/2,max].map(value=><View key={value} style={{position:'absolute',left:0,right:0,top:y(value),height:1,backgroundColor:GRID}}/>)}
 {bars?.map((value,i)=><View key={i} style={{position:'absolute',left:x(i)-width/labels.length*(histogram?.5:.32),width:width/labels.length*(histogram?1:.64),top:y(value),height:(value-min)/range*height,backgroundColor:BLUE,borderWidth:histogram?1:0,borderColor:BG}}/>)}
 {lines.map((line,i)=><View key={i} style={{position:'absolute',left:0,right:0,top:y(line.value),height:2,backgroundColor:line.color}}/>)}
 {series.map((line,k)=><View key={k} style={StyleSheet.absoluteFill}>{line.connect!==false&&line.values.slice(1).map((value,i)=><Segment key={`line-${i}`} x1={x(i)} y1={y(line.values[i])} x2={x(i+1)} y2={y(value)} color={line.color}/>)}{line.values.map((value,i)=><View key={`point-${i}`} style={{position:'absolute',left:x(i)-4,top:y(value)-4,width:8,height:8,borderRadius:4,backgroundColor:line.color,borderColor:BG,borderWidth:1}}/>)}</View>)}
 </View>{rightPercent&&<View style={s.rightAxis}>{['100%','50%','0%'].map((value,i)=><Text key={value} style={[s.rightTick,{top:i*height/2-9}]}>{value}</Text>)}</View>}</View>
 <View style={[s.xLabels,{marginRight:rightPercent?38:0}]}>{labels.map((label,i)=><View key={i} style={s.xLabel}><Label text={label} size={12} center/></View>)}</View></View>;
}
function Legend({items}:{items:{label:string;color:string}[]}){return <View style={s.legend}>{items.map(item=><View key={item.label} style={s.legendItem}><View style={{width:14,height:4,backgroundColor:item.color}}/><Label text={item.label} size={13}/></View>)}</View>;}
function Table({rows}:{rows:string[][]}){return <View style={s.table}>{rows.map((row,i)=><View key={i} style={s.tableRow}>{row.map((cell,k)=><View key={k} style={[s.cell,k===0?{flex:2}:null]}><Label text={cell} size={12}/></View>)}</View>)}</View>;}
function Figure({kind}:{kind:FoodManagementVisualKind}){
 if(kind==='mean-range'){const groups=data.meanRange;return <><Label text="A / B · g" strong/><Plot labels={['1','2','3']} min={17} max={25} series={[{values:groups.A,color:BLUE,connect:false},{values:groups.B,color:ORANGE,connect:false}]}/><Legend items={[{label:'A',color:BLUE},{label:'B',color:ORANGE}]}/><Table rows={[["",'1','2','3','平均','R'],['A',...groups.A.map(String),'21','2'],['B',...groups.B.map(String),'21','6']]}/></>;}
 if(kind==='pareto'){const {labels,counts}=data.pareto,total=counts.reduce((a,b)=>a+b,0);let sum=0;const cumulative=counts.map(value=>{sum+=value;return sum;});return <><Label text="パレート図 · 件 / %" strong/><Plot labels={labels} max={total} bars={counts} series={[{values:cumulative,color:ORANGE}]} rightPercent/><Legend items={[{label:'件数',color:BLUE},{label:'累積比',color:ORANGE}]}/><Table rows={[['','件','%'],...labels.map((label,i)=>[label,String(counts[i]),`${cumulative[i]/total*100}%`])]}/></>;}
 if(kind==='histogram'){const {values,boundaries}=data.histogram,counts=boundaries.slice(1).map((high,i)=>values.filter(v=>v>=boundaries[i]&&(i===boundaries.length-2?v<=high:v<high)).length),labels=boundaries.slice(1).map((v,i)=>`[${boundaries[i]},${v}${i===boundaries.length-2?']':')'}`);return <><Label text="ヒストグラム · g / 件" strong/><Plot labels={labels} max={6} bars={counts} histogram/><Text style={s.small}>{values.join(', ')} g</Text><Table rows={labels.map((label,i)=>[label,String(counts[i])])}/></>;}
 if(kind==='scatter'){const points=data.scatter.points;return <><Label text="散布図 · X / Y" strong/><Plot labels={points.map(point=>String(point[0]))} max={7} series={[{values:points.map(point=>point[1]),color:BLUE,connect:false}]}/><Text style={s.small}>X,Y: {points.map(p=>`(${p.join(',')})`).join(' ')}</Text></>;}
 if(kind==='control'){const {values,center,lower,upper}=data.control;return <><Label text="管理図 · 1 → 8" strong/><Label text={`この図だけの仮定：CL=${center}, UCL=${upper}, LCL=${lower}。製品の規格値ではありません。`} size={13}/><Plot labels={values.map((_,i)=>String(i+1))} min={8} max={12} series={[{values,color:BLUE}]} lines={[{value:center,color:INK},{value:lower,color:ORANGE},{value:upper,color:ORANGE}]}/><Legend items={[{label:'CL',color:INK},{label:'UCL / LCL',color:ORANGE},{label:'測定値',color:BLUE}]}/><Text style={s.small}>{values.join(' → ')}</Text></>;}
 if(kind==='productivity'){const {standard:A,actual:B}=data.productivity,productivity=[A.outputKg/(A.people*A.hours),B.outputKg/(B.people*B.hours)];return <><Label text="出来高 · kg" strong/><Plot labels={['標準','実績']} max={220} bars={[A.outputKg,B.outputKg]}/><Label text="人時生産性 · kg / 人時" strong/><Plot labels={['標準','実績']} max={40} bars={productivity}/><Table rows={[["",'人','h','kg','kg/人時'],['標準',String(A.people),String(A.hours),String(A.outputKg),String(productivity[0])],['実績',String(B.people),String(B.hours),String(B.outputKg),String(productivity[1])]]}/></>;}
 const {actualKg,planKg}=data.progress;let a=0,p=0;const actualCumulative=actualKg.map(v=>a+=v),planCumulative=planKg.map(v=>p+=v);return <><Label text="1h · kg" strong/><Plot labels={['1','2','3','4']} max={100} series={[{values:planKg,color:ORANGE},{values:actualKg,color:BLUE}]}/><Label text="累積 · kg" strong/><Plot labels={['1','2','3','4']} max={320} series={[{values:planCumulative,color:ORANGE},{values:actualCumulative,color:BLUE}]}/><Legend items={[{label:'計画',color:ORANGE},{label:'実績',color:BLUE}]}/><Table rows={[["",'1','2','3','4'],['計画',...planKg.map(String)],['実績',...actualKg.map(String)],['累積計画',...planCumulative.map(String)],['累積実績',...actualCumulative.map(String)]]}/></>;
}

type ChartLabels={labels:Record<string,string>;example:string;controlNotice:string};
const figureTerms:Record<FoodManagementVisualKind,string[]>={
 'mean-range':['平均','R'],pareto:['パレート図','件数','累積比','包装','重量','汚れ'],histogram:['ヒストグラム','件'],scatter:['散布図'],control:['管理図','測定値'],productivity:['出来高','人時生産性','標準','実績','人','kg/人時'],progress:['計画','実績','累積','累積計画','累積実績']
};
function TranslatedChartLabels({kind,language}:{kind:FoodManagementVisualKind;language:string}){
 const t=(labelTranslations.locales as Record<string,ChartLabels>)[language];if(!t)return null;
 return <View testID={`food-chart-translation-${kind}-${language}`} style={{gap:8}}><Text style={s.small}>{t.example}</Text>{kind==='control'&&<Text style={s.small}>{t.controlNotice}</Text>}{figureTerms[kind].map(term=><View key={term} style={{flexDirection:'row',flexWrap:'wrap',gap:8}}><Label text={term} size={13}/><Text style={[s.small,{flex:1,minWidth:90}]}>{t.labels[term]}</Text></View>)}</View>;
}

export function FoodManagementVisuals({lesson,textColor,readingColor,language,showTranslation}:{lesson:FoodManufacturingLesson;textColor:string;readingColor:string;language:string;showTranslation:boolean}){
 const figures=foodManagementVisualsFor(lesson),translation=showTranslation&&language!=='ja'?foodManufacturingTranslation(lesson,language):null;
 return <>{figures.map((figure,i)=>{const paragraphId=figure.captionField.split('.')[1],paragraph=lesson.paragraphs.find(p=>p.id===paragraphId),showCaption=i===0||figures[i-1].captionField!==figure.captionField;
 return <View key={figure.id} testID={figure.id} style={s.figure}>
 {showCaption&&(paragraph?<><FoodLessonRuby lesson={lesson} field={`${figure.captionField}.titleJa`} text={paragraph.titleJa} color={textColor} readingColor={readingColor} heading/><FoodLessonRuby lesson={lesson} field={`${figure.captionField}.textJa`} text={paragraph.textJa} color={textColor} readingColor={readingColor}/>{translation&&<TranslationText>{translation.paragraphTitles[paragraph.id]}{'\n'}{translation.paragraphs[paragraph.id]}</TranslationText>}</>:<><FoodLessonRuby lesson={lesson} field="activityJa" text={lesson.activityJa} color={textColor} readingColor={readingColor}/>{translation&&<TranslationText>{translation.activity}</TranslationText>}</>)}
 <View style={s.board}><Label text="学習用の仮想データ" size={14} strong/><Figure kind={figure.kind}/>{showTranslation&&language!=='ja'&&<TranslatedChartLabels kind={figure.kind} language={language}/>}</View>
 </View>;
 })}</>;
}
const s=StyleSheet.create({figure:{paddingVertical:14,gap:12},board:{backgroundColor:BG,padding:10,borderWidth:1,borderColor:GRID,borderRadius:8,gap:12},example:{fontSize:14,lineHeight:23,color:INK,fontWeight:'700'},figureTitle:{fontSize:16,lineHeight:26,color:INK,fontWeight:'700'},chart:{paddingTop:12},plotRow:{flexDirection:'row',height:170},axis:{width:34,position:'relative'},tick:{position:'absolute',right:5,fontSize:12,lineHeight:18,color:INK},rightAxis:{position:'relative',width:38},rightTick:{position:'absolute',left:3,fontSize:11,lineHeight:18,color:INK},plot:{flex:1,minWidth:0,height:170,position:'relative',borderLeftWidth:1,borderBottomWidth:1,borderColor:INK},xLabels:{flexDirection:'row',marginLeft:34,paddingTop:8},xLabel:{flex:1,minWidth:0},legend:{flexDirection:'row',flexWrap:'wrap',gap:12},legendItem:{flexDirection:'row',alignItems:'center',gap:6},small:{fontSize:13,lineHeight:22,color:INK},table:{borderTopWidth:1,borderLeftWidth:1,borderColor:GRID},tableRow:{flexDirection:'row'},cell:{flex:1,minWidth:0,padding:4,borderBottomWidth:1,borderRightWidth:1,borderColor:GRID}});
