import {useState} from 'react';
import {Image,Pressable,ScrollView,StyleSheet,Text,View,useWindowDimensions,type ImageSourcePropType} from 'react-native';
export type FigureMask={x:number;y:number;width:number;height:number;label?:string;backgroundColor?:string};
type Colors={text:string;translation:string;translationText:string;border:string};
const percent=(n:number)=>`${n*100}%` as `${number}%`;
export function ZoomableFigure({source,width:sourceWidth,height:sourceHeight,altJa,testID,colors,allowExpandedView=false,masks=[]}:{source:ImageSourcePropType;width:number;height:number;altJa:string;testID:string;colors:Colors;allowExpandedView?:boolean;masks?:FigureMask[]}) {
 const {width,height}=useWindowDimensions(),[expanded,setExpanded]=useState(false);
 const available=Math.max(180,Math.min(width-66,688)),maxHeight=Math.max(160,Math.min(420,height-160));
 const normalWidth=Math.min(available,maxHeight*(sourceWidth/sourceHeight));
 const canExpand=allowExpandedView&&(sourceWidth>normalWidth*1.2||sourceHeight>maxHeight*1.2);
 const renderedWidth=expanded?Math.max(available,Math.min(sourceWidth,1600)):normalWidth;
 const picture=<View style={{width:renderedWidth,height:renderedWidth*sourceHeight/sourceWidth,position:'relative'}}>
  <Image testID={`${testID}-image`} source={source} accessibilityLabel={altJa} resizeMode="contain" style={StyleSheet.absoluteFill}/>
  {masks.map((m,i)=><View key={i} pointerEvents="none" style={{position:'absolute',left:percent(m.x),top:percent(m.y),width:percent(m.width),height:percent(m.height),backgroundColor:m.backgroundColor||'#fffaf0',alignItems:'center',justifyContent:'center'}}>{!!m.label&&<Text style={{color:'#182e27',fontWeight:'700',fontSize:expanded?28:16,lineHeight:expanded?34:19}}>{m.label}</Text>}</View>)}
 </View>;
 return <View style={{width:'100%',gap:8}}>
  {canExpand&&<Pressable accessibilityRole="button" testID={`${testID}-expand`} accessibilityLabel={expanded?'図を縮小':'図を拡大'} onPress={()=>setExpanded(v=>!v)} style={{minHeight:44,paddingHorizontal:12,paddingVertical:8,borderWidth:1,borderRadius:8,alignSelf:'flex-start',justifyContent:'center',borderColor:colors.border}}><Text style={{fontSize:17,lineHeight:29,color:colors.translationText}}>{expanded?'図を縮小':'図を拡大'}</Text></Pressable>}
  {expanded?<><Text style={{fontSize:14,lineHeight:23,color:colors.translationText}}>左右にスクロールして図全体を確認できます。</Text><ScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator style={{width:'100%',maxWidth:'100%'}}>{picture}</ScrollView></>:<View style={{alignItems:'center',width:'100%'}}>{picture}</View>}
 </View>;
}
