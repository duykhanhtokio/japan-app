import {View,Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {backPrepared} from '@/components/ui/prepareSceneRoute';
import {KensetsuCourse} from '@/components/kensetsu/KensetsuCourse';
import {useAppLanguage} from '@/context/LanguageContext';
import {STUDY_IVORY} from '@/theme/study-surface';
import {useUserProfile} from '@/hooks/useUserProfile';
export default function KensetsuTestRoute(){
 const insets=useSafeAreaInsets(),{profile,loading}=useUserProfile(),{language}=useAppLanguage();
 if(!__DEV__)return <View style={{flex:1,backgroundColor:STUDY_IVORY,padding:24}}><Text>建設の公開版は準備中です。</Text></View>;
 if(loading)return <View style={{flex:1,backgroundColor:STUDY_IVORY,padding:24}}><Text>読み込み中…</Text></View>;
 const learner=profile.createdAt||profile.email||'local-learner';
 return <View style={{flex:1,backgroundColor:STUDY_IVORY,paddingTop:insets.top,paddingBottom:insets.bottom,paddingLeft:insets.left,paddingRight:insets.right}}><KensetsuCourse learner={learner} language={language} onBack={()=>{void backPrepared();}}/></View>;
}
