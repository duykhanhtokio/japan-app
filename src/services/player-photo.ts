import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';

const KEY='@japan_app_player_photo_v1';
let uri:string|null=null,loaded:Promise<void>|undefined,version=0;
const listeners=new Set<()=>void>();
export const playerPhotoSnapshot=()=>uri;
export const subscribePlayerPhoto=(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};};
function publish(next:string|null){uri=next;version++;for(const listener of listeners)listener();}
export function loadPlayerPhoto(){
 if(!loaded){const before=version;loaded=AsyncStorage.getItem(KEY).then(value=>{if(before===version)publish(value);}).catch(()=>{loaded=undefined;});}
 return loaded;
}
/** Commit storage before replacing the visible photo. A cancelled/failed picker preserves it. */
export async function choosePlayerPhoto(source:'camera'|'album'):Promise<'saved'|'cancelled'|'denied'|'unavailable'>{
 await loadPlayerPhoto();
 if(source==='camera'&&Platform.OS==='ios'&&!(await import('expo-device')).isDevice)return 'unavailable';
 const picker=await import('expo-image-picker');
 if(source==='camera'&&!(await picker.requestCameraPermissionsAsync()).granted)return 'denied';
 const options={mediaTypes:['images'] as ['images'],allowsEditing:true,aspect:[1,1] as [number,number],quality:0.75,base64:Platform.OS==='web',exif:false};
 // System photo picker grants access to the chosen image; no broad album permission is needed.
 const result=source==='camera'?await picker.launchCameraAsync(options):await picker.launchImageLibraryAsync(options);
 if(result.canceled||!result.assets?.[0])return 'cancelled';
 const asset=result.assets[0];
 if((asset.fileSize??0)>8*1024*1024)throw Error('Profile image exceeds local storage limit');
 const previous=uri;
 let next:string,created:string|undefined;
 let files:typeof import('expo-file-system/legacy')|undefined;
 try{
  if(Platform.OS==='web'){
   if(!asset.base64||asset.base64.length>3*1024*1024)throw Error('Profile image cannot be persisted');
   next=`data:${asset.mimeType??'image/jpeg'};base64,${asset.base64}`;
  }else{
   files=await import('expo-file-system/legacy');
   if(!files.documentDirectory)throw Error('Photo storage unavailable');
   const directory=files.documentDirectory+'player-photo/';
   await files.makeDirectoryAsync(directory,{intermediates:true});
   const extension=/\.(png|jpe?g|webp|heic|avif)$/i.exec(asset.uri)?.[1]?.toLowerCase()??'jpg';
   next=directory+Date.now()+'-'+Math.random().toString(36).slice(2)+'.'+extension;
   created=next;
   await files.copyAsync({from:asset.uri,to:next});
  }
  await AsyncStorage.setItem(KEY,next);
  publish(next);
 }catch(error){if(created&&files)await files.deleteAsync(created,{idempotent:true}).catch(()=>{});throw error;}
 // Delete only the old app-owned photo after the new photo is durably selected.
 if(files&&previous?.startsWith(files.documentDirectory+'player-photo/'))await files.deleteAsync(previous,{idempotent:true}).catch(()=>{});
 return 'saved';
}
