import {useEffect,useState} from 'react';
import {Pressable,StyleSheet,TextInput,View} from 'react-native';
import data from '@/data/restaurant/hygiene-records.json';
import {TranslationText,useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import {RestaurantReading} from './RestaurantReading';

type LabelKey=keyof typeof data.labels;
type Status='pending'|'pass'|'fail';
type Context={language:string;showTranslation:boolean};
type Label={ja:string;segments:{text:string;reading?:string}[];translations:Record<string,string>};
const labels:Record<LabelKey,Label>=data.labels;
function phrase(key:LabelKey,ctx:Context){
 const item=labels[key];
 return ctx.showTranslation&&ctx.language!=='ja'?(item.translations[ctx.language]||item.ja):item.ja;
}
function LabelText({name,ctx,heading=false}:{name:LabelKey;ctx:Context;heading?:boolean}){
 const item=labels[name],translation=ctx.showTranslation&&ctx.language!=='ja'?item.translations[ctx.language]:null;
 return <View style={s.label}><RestaurantReading heading={heading} text={item.ja} segments={item.segments}/>{translation&&<TranslationText>{translation}</TranslationText>}</View>;
}
function Field({name,id,ctx,value,onChange,sample,worked,multiline=false}:{name:LabelKey;id:string;ctx:Context;value:string;onChange:(value:string)=>void;sample?:LabelKey;worked:boolean;multiline?:boolean}){
 const {colors}=useStudyAppearance();
 return <View style={s.field}><LabelText name={name} ctx={ctx}/>{worked?(sample?<LabelText name={sample} ctx={ctx}/>:<RestaurantReading text="—" segments={[{text:'—'}]}/>):<TextInput testID={`hygiene-field-${id}`} accessibilityLabel={phrase(name,ctx)} value={value} onChangeText={onChange} multiline={multiline} style={[s.input,multiline&&s.multiline,{color:colors.text,borderColor:colors.border,backgroundColor:colors.background}]} />}</View>;
}
function StatusChoice({id,value,onChange,ctx,readOnly=false,allowPass=true}:{id:string;value:Status;onChange:(value:Status)=>void;ctx:Context;readOnly?:boolean;allowPass?:boolean}){
 const {colors}=useStudyAppearance();
 if(readOnly)return <View testID={`hygiene-result-${id}`}><LabelText name={value} ctx={ctx}/></View>;
 return <View style={s.choices}>{(['pending','pass','fail'] as const).map(status=><Pressable key={status} testID={`hygiene-status-${id}-${status}`} accessibilityRole="button" accessibilityLabel={phrase(status,ctx)} accessibilityState={{selected:value===status,disabled:status==='pass'&&!allowPass}} disabled={status==='pass'&&!allowPass} onPress={()=>onChange(status)} style={[s.choice,{borderColor:colors.border,backgroundColor:value===status?colors.translation:colors.background,opacity:status==='pass'&&!allowPass ? 0.45 : 1}]}><LabelText name={status} ctx={ctx}/></Pressable>)}</View>;
}

/** Local, unsaved learning worksheet. It never modifies exam answers or workplace records. */
export function RestaurantHygieneRecords({lessonId,language,showTranslation}:{lessonId:string;language:string;showTranslation:boolean}){
 const {colors}=useStudyAppearance(),[worked,setWorked]=useState(false),[fields,setFields]=useState<Record<string,string>>({}),[statuses,setStatuses]=useState<Record<string,Status>>({});
 useEffect(()=>{setWorked(false);setFields({});setStatuses({});},[lessonId]);
 if(!data.lessonIds.includes(lessonId))return null;
 const ctx={language,showTranslation};
 // Syntax only: this does not evaluate a safe range or replace site-plan judgement.
 const measuredNumber=(value:string|undefined)=>{
  const normalized=(value||'').normalize('NFKC').trim().replace(/−/g,'-');
  return /^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)\s*(?:°?\s*C)?$/i.test(normalized)&&
   Number.isFinite(Number(normalized.replace(/\s*(?:°?\s*C)$/i,'').trim().replace(',','.')));
 };
 const hasMeasurements=Boolean(fields.fridgeCriterion?.trim()&&fields.freezerCriterion?.trim()&&measuredNumber(fields.fridge)&&measuredNumber(fields.freezer));
 function setField(key:string,value:string){
  setFields(previous=>({...previous,[key]:value}));
  if(['fridgeCriterion','freezerCriterion','fridge','freezer'].includes(key))setStatuses(previous=>({...previous,temperature:'pending'}));
 }
 function field(name:LabelKey,id:string,sample?:LabelKey,multiline=false){return <Field key={id} name={name} id={id} ctx={ctx} value={fields[id]||''} onChange={value=>setField(id,value)} sample={sample} worked={worked} multiline={multiline}/>;}
 function result(id:string,sample:Status){const value=worked?sample:statuses[id]||'pending';return <StatusChoice id={id} ctx={ctx} value={id==='temperature'&&!hasMeasurements&&!worked?'pending':value} readOnly={worked} allowPass={id!=='temperature'||hasMeasurements} onChange={value=>setStatuses(previous=>({...previous,[id]:value}))}/>;}
 function incident(prefix:string,kind?:'package'|'heat'){
  return <View style={s.incident}>{field('issue',`${prefix}-issue`,kind?`${kind}Issue` as LabelKey:undefined,true)}{field('action',`${prefix}-action`,kind?`${kind}Action` as LabelKey:undefined,true)}{field('recheck',`${prefix}-recheck`,kind?`${kind}Recheck` as LabelKey:undefined,true)}</View>;
 }
 return <View testID="restaurant-hygiene-records" style={[s.box,{borderColor:colors.border}]}>
  <LabelText name="title" ctx={ctx} heading/><LabelText name="note" ctx={ctx}/>
  <View style={s.choices}>{(['blank','worked'] as const).map(mode=><Pressable key={mode} testID={`hygiene-mode-${mode}`} accessibilityRole="button" accessibilityLabel={phrase(mode,ctx)} accessibilityState={{selected:worked===(mode==='worked')}} onPress={()=>setWorked(mode==='worked')} style={[s.choice,{borderColor:colors.border,backgroundColor:worked===(mode==='worked')?colors.translation:colors.background}]}><LabelText name={mode} ctx={ctx}/></Pressable>)}</View>
  <LabelText name="daily" ctx={ctx} heading/>
  {field('date','date','exampleDate')}{field('time','time','exampleTime')}{field('checker','checker','exampleChecker')}
  <LabelText name="criterion" ctx={ctx}/>{field('fridgeCriterion','fridgeCriterion',undefined,true)}{field('fridge','fridge')}{field('freezerCriterion','freezerCriterion',undefined,true)}{field('freezer','freezer')}
  <LabelText name="measurementNote" ctx={ctx}/>
  {data.generalItems.map(raw=>{const key=raw as keyof typeof data.generalPlanMethods;return <View key={key} testID={`hygiene-general-${key}`} style={[s.card,{borderColor:colors.border}]}>
   <LabelText name={key} ctx={ctx} heading/>
   {field('when',`${key}-when`,key==='receiving'?'arrival':key==='hands'?'taskChange':'exampleTime')}
   {field('method',`${key}-method`,data.generalPlanMethods[key] as LabelKey,true)}
   {result(key,key==='receiving'?'fail':'pending')}
   {incident(key,key==='receiving'?'package':undefined)}
  </View>;})}
  <LabelText name="processTitle" ctx={ctx} heading/>
  {data.processes.map(process=><View key={process.id} testID={`hygiene-process-${process.id}`} style={[s.card,{borderColor:colors.border}]}>
   <LabelText name={process.label as LabelKey} ctx={ctx} heading/>
   {field('menu',`${process.id}-menu`,process.menu as LabelKey)}
   {field('method',`${process.id}-method`,process.method as LabelKey,true)}
   {result(`process-${process.id}`,process.id==='hot'?'fail':'pending')}
   {incident(`process-${process.id}`,process.id==='hot'?'heat':undefined)}
  </View>)}
  {!worked&&<Pressable testID="hygiene-clear" accessibilityRole="button" accessibilityLabel={phrase('reset',ctx)} onPress={()=>{setFields({});setStatuses({});}} style={[s.choice,{borderColor:colors.border}]}><LabelText name="reset" ctx={ctx}/></Pressable>}
  <LabelText name="localNote" ctx={ctx}/>
 </View>;
}
const s=StyleSheet.create({
 box:{padding:12,gap:14,borderWidth:1,borderRadius:10},
 card:{padding:12,gap:10,borderWidth:1,borderRadius:8,minWidth:0,maxWidth:'100%'},
 label:{minWidth:0,maxWidth:'100%'},field:{gap:6,minWidth:0,maxWidth:'100%'},
 choices:{flexDirection:'row',flexWrap:'wrap',gap:8},
 choice:{padding:10,minHeight:48,borderWidth:1,borderRadius:8,flexShrink:1,maxWidth:'100%'},
 input:{fontSize:17,lineHeight:28,minHeight:48,padding:10,borderWidth:1,borderRadius:6,minWidth:0,width:'100%'},
 multiline:{minHeight:84,textAlignVertical:'top'},incident:{gap:10},
});
