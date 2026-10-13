import {View,Text} from 'react-native';
import {backPrepared} from '@/components/ui/prepareSceneRoute';
import {KensetsuCourse} from '@/components/kensetsu/KensetsuCourse';
import {useAppLanguage} from '@/context/LanguageContext';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import SafeAreaView from '@/components/ui/StableSafeAreaView';
import {useUserProfile} from '@/hooks/useUserProfile';
export default function KensetsuTestRoute(){
 const {profile,loading}=useUserProfile(),{language}=useAppLanguage();
 if(!__DEV__)return <RoyalPageBackground><SafeAreaView style={{flex:1,padding:24}}><Text>建設の公開版は準備中です。</Text></SafeAreaView></RoyalPageBackground>;
 if(loading)return <RoyalPageBackground><SafeAreaView style={{flex:1,padding:24}}><Text>読み込み中…</Text></SafeAreaView></RoyalPageBackground>;
 const learner=profile.createdAt||profile.email||'local-learner';
 return <View style={{flex:1}}><KensetsuCourse learner={learner} language={language} onBack={()=>{void backPrepared();}}/></View>;
}
