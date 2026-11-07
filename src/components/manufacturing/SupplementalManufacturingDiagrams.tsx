import {useState} from 'react';
import {Image,Modal,Pressable,ScrollView,Text,View,useWindowDimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {manufacturingUi} from '@/data/manufacturing/ui';
import {manufacturingSupplementalCaption,manufacturingSupplementalDiagrams,type SupplementalDiagram} from '@/data/manufacturing/supplemental-diagrams';

const sources:Record<string,ReturnType<typeof require>>={
 get 'batch36-lcr.png'(){return require('../../../assets/manufacturing/diagrams/batch36-lcr.png');},
 get 'batch36-thermocouple.png'(){return require('../../../assets/manufacturing/diagrams/batch36-thermocouple.png');},
 get 'batch36-hall.png'(){return require('../../../assets/manufacturing/diagrams/batch36-hall.png');},
 get 'batch36-caliper-parts.png'(){return require('../../../assets/manufacturing/diagrams/batch36-caliper-parts.png');},
 get 'batch36-indentation.png'(){return require('../../../assets/manufacturing/diagrams/batch36-indentation.png');},
};

export type ManufacturingCaptionRuby=readonly {text:string;reading?:string}[];

export function SupplementalFigure({item,language,showTranslation,imageSource,translatedCaption,imageAlt,japaneseCaptionRuby,hideCaption=false}:{item:SupplementalDiagram;language:string;showTranslation:boolean;imageSource?:ReturnType<typeof require>;translatedCaption?:string|null;imageAlt?:string;japaneseCaptionRuby?:ManufacturingCaptionRuby;hideCaption?:boolean}){
 const [expanded,setExpanded]=useState(false),{width}=useWindowDimensions(),insets=useSafeAreaInsets(),{colors}=useStudyAppearance();
 const source=imageSource??(Object.prototype.hasOwnProperty.call(sources,item.assetFile)?sources[item.assetFile]:undefined);
 if(!source)return null;
 const target=showTranslation?(translatedCaption??manufacturingSupplementalCaption(item,language)):null;
 const label=hideCaption?manufacturingUi(language,'questionFigure'):imageAlt??target??item.captionJa,ratio=item.width/item.height,zoomWidth=Math.max(960,width,item.width);
 const ruby=japaneseCaptionRuby?.length&&japaneseCaptionRuby.every(p=>!!p&&typeof p.text==='string'&&(!p.reading||(typeof p.reading==='string'&&/^[ぁ-ゖー]+$/.test(p.reading)))&&(!/[一-龯々]/.test(p.text)||!!p.reading))&&japaneseCaptionRuby.map(p=>p.text).join('')===item.captionJa?japaneseCaptionRuby:null;
 const close=()=>setExpanded(false);
 const button=(key:'imageZoom'|'imageClose',action:()=>void)=><Pressable accessibilityRole="button" accessibilityLabel={hideCaption?manufacturingUi(language,key):`${manufacturingUi(language,key)} · ${label}`} onPress={action} style={{minHeight:48,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:8}}><Text style={{color:colors.text,fontSize:16,textAlign:'center'}}>{manufacturingUi(language,key)}</Text></Pressable>;
 return <View style={{gap:8,marginVertical:12}}>
  <Image testID={`manufacturing-supplemental-${item.id}`} source={source} accessibilityLabel={label} resizeMode="contain" style={{width:'100%',aspectRatio:ratio}}/>
  {!hideCaption&&(ruby?<View testID={`manufacturing-caption-ruby-${item.id}`} accessible accessibilityLabel={item.captionJa} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}>
   {ruby.map((p,i)=>p.text==='\n'?<View key={i} accessible={false} style={{width:'100%',height:0}}/>:<View key={i} accessible={false} style={{alignItems:'center',maxWidth:'100%'}}><Text style={{fontSize:10,lineHeight:14,color:colors.muted}}>{p.reading??' '}</Text><Text selectable style={{color:colors.muted,fontSize:15,lineHeight:25}}>{p.text}</Text></View>)}
  </View>:<Text selectable style={{color:colors.muted,fontSize:15,lineHeight:25}}>{item.captionJa}</Text>)}
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
