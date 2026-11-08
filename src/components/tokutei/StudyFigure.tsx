import {useState, type ReactNode} from 'react';
import {Image,Modal,Pressable,ScrollView,Text,View,useWindowDimensions,StyleSheet,type ImageSourcePropType,type ImageProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStudyAppearance} from './StudyAppearance';
import {fitFigure,FIGURE_PREVIEW_HEIGHT} from './figure-layout';

type Picture = (width:number,height:number)=>ReactNode;
type FigureProps = Omit<ImageProps,'source'|'width'|'height'> & {source:ImageSourcePropType;width?:number;height?:number;alt?:string;diagram?:boolean;renderPicture?:Picture};
function dimensions(p:FigureProps){
 const asset=Image.resolveAssetSource?.(p.source),style=StyleSheet.flatten(p.style),ratio=Number(style?.aspectRatio)||((asset?.width??1)/(asset?.height??1));
 return {width:p.width??ratio,height:p.height??1};
}
export function StudyFigureViewer({visible,onClose,children,...props}:FigureProps & {visible:boolean;onClose:()=>void;children?:ReactNode}){
 const window=useWindowDimensions(),insets=useSafeAreaInsets(),{colors}=useStudyAppearance();
 const [magnified,setMagnified]=useState(false),[area,setArea]=useState({width:0,height:0});
 const source=dimensions(props),availableWidth=Math.max(1,area.width||window.width-insets.left-insets.right-24),availableHeight=Math.max(1,area.height||window.height-insets.top-insets.bottom-180);
 const fitted=fitFigure(source.width,source.height,availableWidth,availableHeight);
 const size=magnified?{width:fitted.width*2,height:fitted.height*2}:fitted;
 const picture=props.renderPicture??((width:number,height:number)=><Image source={props.source} accessibilityLabel={props.alt??props.accessibilityLabel} onError={props.onError} resizeMode="contain" style={{width,height}}/>);
 const close=()=>{setMagnified(false);onClose();};
 return <Modal visible={visible} onShow={()=>setMagnified(false)} onRequestClose={close} animationType="fade" supportedOrientations={['portrait','landscape-left','landscape-right']}>
  <View accessibilityViewIsModal style={{flex:1,backgroundColor:colors.background,paddingTop:insets.top,paddingBottom:insets.bottom,paddingLeft:insets.left+12,paddingRight:insets.right+12}}>
   <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:8,paddingVertical:8}}>
    <Pressable accessibilityRole="button" onPress={close} style={{minHeight:48,padding:12}}><Text style={{color:colors.text,fontSize:17}}>閉じる ×</Text></Pressable>
    <Pressable accessibilityRole="button" onPress={()=>setMagnified(v=>!v)} style={{minHeight:48,padding:12}}><Text style={{color:colors.text,fontSize:17}}>{magnified?'全体を見る':'拡大 ＋'}</Text></Pressable>
   </View>
   <View testID={`${props.testID??'study-figure'}-viewport`} onLayout={e=>setArea(e.nativeEvent.layout)} style={{flex:1,minHeight:1,overflow:'hidden'}}>
    {magnified?<ScrollView style={{flex:1}} contentContainerStyle={{minHeight:availableHeight}}><ScrollView horizontal contentContainerStyle={{minWidth:availableWidth,justifyContent:'center',alignItems:'center'}}>{picture(size.width,size.height)}</ScrollView></ScrollView>:<ScrollView contentContainerStyle={{flexGrow:1,alignItems:'center',justifyContent:'center'}}>{picture(size.width,size.height)}</ScrollView>}
   </View>
   <ScrollView style={{maxHeight:Math.min(160,window.height*.2)}} contentContainerStyle={{paddingVertical:10}}><Text selectable style={{color:colors.text,fontSize:16,lineHeight:25}}>{props.alt??props.accessibilityLabel}</Text>{children}</ScrollView>
  </View>
 </Modal>;
}
export function StudyFigure(props:FigureProps){
 const window=useWindowDimensions(),[width,setWidth]=useState(0),[open,setOpen]=useState(false),{colors}=useStudyAppearance();
 const source=dimensions(props),size=fitFigure(source.width,source.height,width||Math.max(1,window.width-64),Math.min(props.diagram?380:FIGURE_PREVIEW_HEIGHT,Math.max(100,window.height*.55)));
 const picture=props.renderPicture??((w:number,h:number)=><Image testID={props.testID} source={props.source} onError={props.onError} accessibilityLabel={props.alt??props.accessibilityLabel} resizeMode="contain" style={{width:w,height:h}}/>);
 return <View style={{width:'100%',minWidth:0,gap:8,alignSelf:'center',marginVertical:8}} onLayout={e=>setWidth(e.nativeEvent.layout.width)}>
  <Pressable accessibilityRole="button" accessibilityLabel={`${props.alt??props.accessibilityLabel??'図'} · タップして拡大`} onPress={()=>setOpen(true)} style={{alignSelf:'center',maxWidth:'100%'}}>{picture(size.width,size.height)}</Pressable>
  <Text style={{fontSize:13,lineHeight:20,textAlign:'center',color:colors.muted}}>タップして拡大</Text>
  <StudyFigureViewer {...props} visible={open} onClose={()=>setOpen(false)}/>
 </View>;
}
