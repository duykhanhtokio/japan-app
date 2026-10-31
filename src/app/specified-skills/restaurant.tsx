import {Text} from 'react-native';
import {RestaurantCourse} from '@/components/restaurant/RestaurantCourse';
import {backPrepared} from '@/components/ui/prepareSceneRoute';
import {useAppLanguage} from '@/context/LanguageContext';
import {useUserProfile} from '@/hooks/useUserProfile';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import SafeAreaView from '@/components/ui/StableSafeAreaView';
export default function RestaurantRoute(){
 const {profile,loading}=useUserProfile(),{language}=useAppLanguage();
 if(loading)return <RoyalPageBackground><SafeAreaView style={{flex:1,padding:24}}><Text>読み込み中…</Text></SafeAreaView></RoyalPageBackground>;
 return <RestaurantCourse learner={profile.createdAt||profile.email||'local-learner'} language={language} onBack={()=>{void backPrepared();}}/>;
}
