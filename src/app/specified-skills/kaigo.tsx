import {useIsFocused} from '@react-navigation/native';
import {View} from 'react-native';
import {backPrepared} from '@/components/ui/prepareSceneRoute';
import {createDeferredCourse} from '@/components/tokutei/createDeferredCourse';
const KaigoCourse=createDeferredCourse(()=>import('@/components/kaigo/KaigoCourse').then(module=>module.KaigoCourse));

export default function KaigoTestRoute(){
 const focused=useIsFocused();
 return <View style={{flex:1}}><KaigoCourse active={focused} onBack={()=>{void backPrepared();}}/></View>;
}
