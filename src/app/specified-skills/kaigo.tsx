import {useIsFocused} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text,View} from 'react-native';
import {backPrepared} from '@/components/ui/prepareSceneRoute';
import {KaigoCourse} from '@/components/kaigo/KaigoCourse';

export default function KaigoTestRoute(){
 const focused=useIsFocused(),insets=useSafeAreaInsets();
 if(!__DEV__)return <View style={{padding:24}}><Text>介護の公開版は準備中です。</Text></View>;
 return <View style={{flex:1,paddingTop:insets.top,paddingBottom:insets.bottom,paddingLeft:insets.left,paddingRight:insets.right}}><KaigoCourse active={focused} onBack={()=>{void backPrepared();}}/></View>;
}
