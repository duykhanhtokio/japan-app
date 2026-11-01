import {useIsFocused} from '@react-navigation/native';
import {View} from 'react-native';
import {backPrepared} from '@/components/ui/prepareSceneRoute';
import {KaigoCourse} from '@/components/kaigo/KaigoCourse';

export default function KaigoTestRoute(){
 const focused=useIsFocused();
 return <View style={{flex:1}}><KaigoCourse active={focused} onBack={()=>{void backPrepared();}}/></View>;
}
