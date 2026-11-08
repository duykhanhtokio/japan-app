import {useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {Alert,Image,Modal,Pressable,Text,View} from 'react-native';
import {useAppLanguage} from '@/context/LanguageContext';
import {profileText} from '@/i18n/profile-release-copy';
import {choosePlayerPhoto,loadPlayerPhoto,playerPhotoSnapshot,subscribePlayerPhoto} from '@/services/player-photo';
import {RoyalButton} from '@/components/ui/RoyalSurface';
import RoyalPaperPanel from '@/components/ui/RoyalPaperPanel';
const DEFAULT=require('../../../assets/app/ui/royal-af/hud-player-medallion-v1.png');

/** Avatar actions are separate from the name's existing profile navigation. */
export default function PlayerAvatar({size}:{size:number}){
 const {language}=useAppLanguage(),t=(key:Parameters<typeof profileText>[1])=>profileText(language,key);
 const photo=useSyncExternalStore(subscribePlayerPhoto,playerPhotoSnapshot,()=>null);
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[failed,setFailed]=useState<string|null>(null);
 const active=useRef(true),locked=useRef(false);
 useEffect(()=>{active.current=true;void loadPlayerPhoto();return()=>{active.current=false;};},[]);
 const pick=async(source:'camera'|'album')=>{
  if(locked.current)return;locked.current=true;setBusy(true);
  try{const result=await choosePlayerPhoto(source);if(!active.current)return;
   if(result==='saved'){setFailed(null);setOpen(false);}
   else if(result==='denied')Alert.alert(t('avatar'),t('cameraPermission'));
   else if(result==='unavailable')Alert.alert(t('avatar'),t('noCamera'));
  }catch{if(active.current)Alert.alert(t('avatar'),t('photoFailed'));}
  finally{locked.current=false;if(active.current)setBusy(false);}
 };
 return <>
  <Pressable accessibilityRole="button" accessibilityLabel={t('avatar')} onPress={()=>setOpen(true)} style={{width:size,height:size}}>
   <Image fadeDuration={0} source={DEFAULT} resizeMode="contain" style={{width:'100%',height:'100%'}}/>
   {photo&&photo!==failed&&<Image testID="player-photo" source={{uri:photo}} onError={()=>setFailed(photo)} resizeMode="cover" style={{position:'absolute',left:'17%',top:'17%',width:'66%',height:'66%',borderRadius:size/2,borderWidth:1,borderColor:'#e3c575'}}/>}
  </Pressable>
  <Modal visible={open} transparent animationType="fade" onRequestClose={()=>{if(!busy)setOpen(false);}}>
   <View style={{flex:1,backgroundColor:'rgba(0,0,0,.65)',justifyContent:'center',alignItems:'center',padding:24}}>
    <RoyalPaperPanel tone="hud" style={{padding:24,width:'100%',maxWidth:420,gap:16}}>
     <Text accessibilityRole="header" style={{color:'#fff3cf',fontSize:20,textAlign:'center'}}>{t('avatar')}</Text>
     <RoyalButton label={t('camera')} disabled={busy} onPress={()=>{void pick('camera');}}/>
     <RoyalButton label={t('album')} disabled={busy} onPress={()=>{void pick('album');}}/>
     <RoyalButton label={t('cancel')} disabled={busy} onPress={()=>setOpen(false)}/>
    </RoyalPaperPanel>
   </View>
  </Modal>
 </>;
}
