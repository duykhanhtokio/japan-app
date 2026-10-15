import {useIsFocused} from '@react-navigation/native';
import {Text,View} from 'react-native';
import {backPrepared} from '@/components/ui/prepareSceneRoute';
import {KaigoCourse} from '@/components/kaigo/KaigoCourse';

export default function KaigoTestRoute(){
 const focused=useIsFocused();
 if(!__DEV__)return <View style={{padding:24}}><Text>介護の公開版は準備中です。</Text></View>;
 return <View style={{flex:1}}><KaigoCourse active={focused} onBack={()=>{void backPrepared();}}/></View>;
}
