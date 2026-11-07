import {useEffect,useRef} from 'react';
import {BackHandler,Platform} from 'react-native';

/** Keep Android hardware Back aligned with the visible page's Back control. */
export function useManufacturingBack(onBack:()=>void,enabled=true){
 const latest=useRef(onBack);
 latest.current=onBack;
 useEffect(()=>{
  if(!enabled||Platform.OS!=='android')return;
  const subscription=BackHandler.addEventListener('hardwareBackPress',()=>{latest.current();return true;});
  return()=>subscription.remove();
 },[enabled]);
}
