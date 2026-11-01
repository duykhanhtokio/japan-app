import {useEffect,useState,type ComponentType} from 'react';
import {ActivityIndicator,Pressable,Text,View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

/** Paint navigation feedback before evaluating a course. Cache successes only. */
export function createDeferredCourse<P extends {onBack?:()=>void}>(load:()=>Promise<ComponentType<P>>):ComponentType<P> {
 let cached:ComponentType<P>|null=null;
 let pending:Promise<ComponentType<P>>|null=null;
 const loadOnce=()=>pending??(pending=load().then(screen=>{cached=screen;return screen;}).catch(error=>{pending=null;throw error;}));
 return function DeferredCourse(props:P){
  const [Screen,setScreen]=useState<ComponentType<P>|null>(()=>cached);
  const [failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
  const insets=useSafeAreaInsets();
  useEffect(()=>{
   if(Screen)return;
   let active=true,secondFrame:number|undefined,timer:ReturnType<typeof setTimeout>|undefined;
   const firstFrame=requestAnimationFrame(()=>{secondFrame=requestAnimationFrame(()=>{
    timer=setTimeout(()=>{if(!active)return;void Promise.resolve().then(loadOnce).then(screen=>{
     if(active)setScreen(()=>screen);
    }).catch(error=>{console.warn('Course loading failed',error);if(active)setFailed(true);});},0);
   });});
   return()=>{active=false;cancelAnimationFrame(firstFrame);if(secondFrame!==undefined)cancelAnimationFrame(secondFrame);if(timer!==undefined)clearTimeout(timer);};
  },[Screen,attempt]);
  if(Screen)return <Screen {...props}/>;
  return <View testID="course-loading" accessibilityLiveRegion="polite" style={{flex:1,backgroundColor:'#f5f0e5',paddingTop:insets.top+24,paddingBottom:insets.bottom+24,paddingHorizontal:24,justifyContent:'center',alignItems:'center',gap:20}}>
   {!failed&&<ActivityIndicator color="#70582d" size="large"/>}
   <Text style={{fontSize:18,color:'#302c26'}}>{failed?'読み込めませんでした。もう一度お試しください。':'教材を読み込んでいます…'}</Text>
   {failed&&<Pressable accessibilityRole="button" onPress={()=>{setFailed(false);setAttempt(value=>value+1);}} style={{padding:16}}><Text style={{fontSize:18,color:'#302c26'}}>再試行</Text></Pressable>}
   {props.onBack&&<Pressable accessibilityRole="button" onPress={props.onBack} style={{padding:16}}><Text style={{fontSize:18,color:'#302c26'}}>戻る</Text></Pressable>}
  </View>;
 };
}
