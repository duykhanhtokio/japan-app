import {Text} from 'react-native';
import {backPrepared} from '@/components/ui/prepareSceneRoute';
import {ManufacturingCourse} from '@/components/manufacturing/ManufacturingCourse';
import {useAppLanguage} from '@/context/LanguageContext';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import SafeAreaView from '@/components/ui/StableSafeAreaView';
import {useUserProfile} from '@/hooks/useUserProfile';
export default function ManufacturingRoute(){
 const {profile,loading}=useUserProfile(),{language}=useAppLanguage();
 if(!__DEV__||loading)return <RoyalPageBackground><SafeAreaView style={{flex:1,padding:24}}><Text>{loading?'読み込み中…':'製造分野の公開版は準備中です。'}</Text></SafeAreaView></RoyalPageBackground>;
 return <ManufacturingCourse learner={profile.createdAt||profile.email||'local-learner'} language={language} onBack={()=>{void backPrepared();}}/>;
}
