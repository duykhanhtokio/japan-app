import {useState,type ComponentType} from 'react';
import {ScrollView,Text,View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppLanguage} from '@/context/LanguageContext';
import {useUserProfile} from '@/hooks/useUserProfile';
import {backPrepared} from '@/components/ui/prepareSceneRoute';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import {RoyalContentPanel} from '@/components/ui/RoyalPanels';
import {uiText,type UiTextKey} from '@/i18n/ui-text';
import {TokuteiHeader} from './TokuteiChrome';
import {StudyAction} from './StudyAction';
import {StudyTabs} from './StudyTabs';
import {createDeferredCourse} from './createDeferredCourse';

type Choice={id:string;title:string};
type Entry={titleKey:UiTextKey;kind:'level'|'hotel'|'specialty'|'construction';choices?:readonly Choice[]};
/** This selector imports no reader, curriculum, translation pack or exam bank.
 * The route's dynamic reader import starts only after the existing level/specialty choice. */
export function createTokuteiEntry<P extends {onBack?:()=>void}>(entry:Entry,load:()=>Promise<ComponentType<P>>){
 const Reader=createDeferredCourse(load);
 return function TokuteiEntry(){
  const {language}=useAppLanguage(),{profile,loading}=useUserProfile(),insets=useSafeAreaInsets();
  const [choice,setChoice]=useState<Choice|null>(null),[level,setLevel]=useState('1');
  const onBack=()=>{if(choice)setChoice(null);else void backPrepared();};
  if(choice&&!loading){const selection=entry.kind==='specialty'?{initialSpecialty:choice.id}:entry.kind==='construction'?{initialLevel:level,initialField:choice.id}:{initialLevel:entry.kind==='hotel'?Number(choice.id):choice.id};
   return <Reader {...({learner:profile.createdAt||profile.email||'local-learner',language,onBack,...selection} as unknown as P)}/>;
  }
  const choices=entry.choices??[{id:'1',title:'特定技能1号'},{id:'2',title:'特定技能2号'}];
  return <RoyalPageBackground><View testID="tokutei-light-entry" style={{flex:1,paddingTop:insets.top,paddingBottom:insets.bottom,paddingLeft:insets.left,paddingRight:insets.right}}><TokuteiHeader title={uiText(entry.titleKey,language)} onBack={onBack}/><ScrollView contentContainerStyle={{padding:16,paddingBottom:36,gap:12,width:'100%',maxWidth:900,alignSelf:'center'}}>
   {entry.kind==='construction'&&<StudyTabs value={level} onChange={setLevel} items={[{value:'1',label:'特定技能1号'},{value:'2',label:'特定技能2号'}]}/>}
   {entry.kind==='specialty'||entry.kind==='construction'?choices.map(item=><RoyalContentPanel key={item.id} style={{padding:24,gap:8}}><Text style={{fontSize:19,lineHeight:30,color:'#173a60'}}>{item.title}</Text><StudyAction title={item.title} disabled={!!choice} onPress={()=>setChoice(item)}/></RoyalContentPanel>):<RoyalContentPanel style={{padding:24,gap:8}}><Text style={{fontSize:19,lineHeight:30,color:'#173a60'}}>学習する区分を選ぶ</Text>{choices.map(item=><StudyAction key={item.id} title={item.title} disabled={!!choice} onPress={()=>setChoice(item)}/>)}</RoyalContentPanel>}
   {choice&&loading&&<Text style={{color:'#fff3cf'}}>読み込み中…</Text>}
  </ScrollView></View></RoyalPageBackground>;
 };
}
