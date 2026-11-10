import {Text} from 'react-native';
import {backPrepared} from '@/components/ui/prepareSceneRoute';
import {createDeferredCourse} from '@/components/tokutei/createDeferredCourse';
const ManufacturingCourse=createDeferredCourse(()=>import('@/components/manufacturing/ManufacturingCourse').then(module=>module.ManufacturingCourse));
import {useAppLanguage} from '@/context/LanguageContext';
import RoyalPageBackground from '@/components/ui/RoyalPageBackground';
import SafeAreaView from '@/components/ui/StableSafeAreaView';
import {useUserProfile} from '@/hooks/useUserProfile';
export default function ManufacturingRoute(){
 const {profile,loading}=useUserProfile(),{language}=useAppLanguage();
 if(loading)return <RoyalPageBackground><SafeAreaView style={{flex:1,padding:24}}><Text>読み込み中…</Text></SafeAreaView></RoyalPageBackground>;
 return <ManufacturingCourse learner={profile.createdAt||profile.email||'local-learner'} language={language} onBack={()=>{void backPrepared();}}/>;
}
