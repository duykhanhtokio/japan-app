import {useState} from 'react';
import {Image,Modal,Pressable,ScrollView,Text,View,useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {manufacturingUi} from '@/data/manufacturing/ui';
import {manufacturingSupplementalCaption,manufacturingSupplementalDiagrams,type SupplementalDiagram} from '@/data/manufacturing/supplemental-diagrams';

const sources:Record<string,ReturnType<typeof require>>={
 'batch36-lcr.png':require('../../../assets/manufacturing/diagrams/batch36-lcr.png'),
 'batch36-thermocouple.png':require('../../../assets/manufacturing/diagrams/batch36-thermocouple.png'),
 'batch36-hall.png':require('../../../assets/manufacturing/diagrams/batch36-hall.png'),
 'batch36-caliper-parts.png':require('../../../assets/manufacturing/diagrams/batch36-caliper-parts.png'),
 'batch36-indentation.png':require('../../../assets/manufacturing/diagrams/batch36-indentation.png'),
};

export function SupplementalFigure({item,language,showTranslation,imageSource,translatedCaption,imageAlt,hideCaption=false}:{item:SupplementalDiagram;language:string;showTranslation:boolean;imageSource?:ReturnType<typeof require>;translatedCaption?:string|null;imageAlt?:string;hideCaption?:boolean}){
 const [expanded,setExpanded]=useState(false),{width}=useWindowDimensions(),insets=useSafeAreaInsets(),{colors}=useStudyAppearance();
 const source=imageSource??(Object.prototype.hasOwnProperty.call(sources,item.assetFile)?sources[item.assetFile]:undefined);
 if(!source)return null;
 const target=showTranslation?(translatedCaption??manufacturingSupplementalCaption(item,language)):null;
 const label=hideCaption?'設問の図':imageAlt??target??item.captionJa,ratio=item.width/item.height,zoomWidth=Math.max(960,width,item.width);
 const close=()=>setExpanded(false);
 const button=(key:'imageZoom'|'imageClose',action:()=>void)=><Pressable accessibilityRole="button" accessibilityLabel={hideCaption?manufacturingUi(language,key):`${manufacturingUi(language,key)} · ${item.captionJa.split('。')[0]}`} onPress={action} style={{minHeight:48,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:8}}><Text style={{color:colors.text,fontSize:16,textAlign:'center'}}>{manufacturingUi(language,key)}</Text></Pressable>;
 return <View style={{gap:8,marginVertical:12}}>
  <Image testID={`manufacturing-supplemental-${item.id}`} source={source} accessibilityLabel={label} resizeMode="contain" style={{width:'100%',aspectRatio:ratio}}/>
  {!hideCaption&&<Text selectable style={{color:colors.muted,fontSize:15,lineHeight:25}}>{item.captionJa}</Text>}
  {!hideCaption&&target&&<Text selectable style={{color:colors.translationText,backgroundColor:colors.translation,padding:12,borderRadius:8,fontSize:15,lineHeight:25}}>{target}</Text>}
  {button('imageZoom',()=>setExpanded(true))}
  <Modal visible={expanded} animationType="none" onRequestClose={close}><View style={{flex:1,paddingTop:insets.top,paddingBottom:insets.bottom,paddingLeft:insets.left,paddingRight:insets.right,backgroundColor:colors.background}}>
   <View style={{padding:12}}>{button('imageClose',close)}</View>
   <ScrollView style={{flex:1}}><ScrollView horizontal nestedScrollEnabled style={{width:'100%'}}><Image testID={`manufacturing-supplemental-expanded-${item.id}`} accessibilityLabel={label} source={source} resizeMode="contain" style={{width:zoomWidth,height:zoomWidth/ratio}}/></ScrollView></ScrollView>
  </View></Modal>
 </View>;
}

export function SupplementalManufacturingDiagrams({lesson,language,showTranslation}:{lesson:ManufacturingLesson;language:string;showTranslation:boolean}){
 return <>{manufacturingSupplementalDiagrams(lesson).map(item=><SupplementalFigure key={item.id} item={item} language={language} showTranslation={showTranslation}/>)}</>;
}
