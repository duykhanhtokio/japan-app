import {agricultureIntrinsicFigureSourceMarks} from './FigureSourceMarks';
import {useState} from 'react';
import {Image,Pressable,ScrollView,Modal,Text,View,useWindowDimensions,type ImageSourcePropType,type LayoutChangeEvent} from 'react-native';
export type FigureMark={kind:'cross';x:number;y:number;width:number;height:number;color:string;label:string};
export type FigureMask={x:number;y:number;width:number;height:number;label?:string;backgroundColor?:string};
type Colors={text:string;translation:string;translationText:string;border:string};
const percent=(n:number)=>`${n*100}%` as `${number}%`;
function figureGeometry(width:number,height:number,containerWidth:number|null,sourceWidth:number,sourceHeight:number,presentation:'recognition'|'diagram'='diagram'){
 const available=Math.max(1,Math.min(containerWidth??Math.max(1,width-64),688)),maxHeight=Math.max(1,Math.min(presentation==='recognition'?260:420,Math.max(1,height-160)));
 const normalWidth=Math.min(available,maxHeight*(sourceWidth/sourceHeight));
 return {available,maxHeight,normalWidth};
}
export function ZoomableFigure({source,width:sourceWidth,height:sourceHeight,altJa,testID,colors,allowExpandedView=true,masks=[],marks,presentation='diagram'}:{source:ImageSourcePropType;width:number;height:number;altJa:string;testID:string;colors:Colors;allowExpandedView?:boolean;masks?:FigureMask[];marks?:FigureMark[];presentation?:'recognition'|'diagram'}) {
 const {width,height}=useWindowDimensions(),[expanded,setExpanded]=useState(false),[containerWidth,setContainerWidth]=useState<number|null>(null);
 const {available,maxHeight,normalWidth}=figureGeometry(width,height,containerWidth,sourceWidth,sourceHeight,presentation);
 const onLayout=(event:LayoutChangeEvent)=>{const next=event.nativeEvent.layout.width;if(Number.isFinite(next)&&next>0)setContainerWidth(current=>current===next?current:next);};
 const canExpand=allowExpandedView&&(sourceWidth>normalWidth*1.2||sourceHeight>maxHeight*1.2);
 const previewHeight=normalWidth*sourceHeight/sourceWidth;
 const expandedWidth=Math.max(Math.max(1,width-48),Math.min(sourceWidth,1600));
 const sourceMarks=marks??agricultureIntrinsicFigureSourceMarks(source,sourceWidth,sourceHeight);
 const picture=(renderedWidth:number,enlarged=false)=><View testID={`${testID}-picture${enlarged?'-expanded':''}`} style={{width:renderedWidth,height:renderedWidth*sourceHeight/sourceWidth,position:'relative',overflow:'hidden',flexShrink:0}}>
  <Image testID={`${testID}-image${enlarged?'-expanded':''}`} source={source} accessibilityLabel={altJa} resizeMode="contain" style={{position:'absolute',left:0,top:0,width:renderedWidth,height:renderedWidth*sourceHeight/sourceWidth}}/>
  {masks.map((m,i)=><View key={i} pointerEvents="none" style={{position:'absolute',left:percent(m.x),top:percent(m.y),width:percent(m.width),height:percent(m.height),backgroundColor:m.backgroundColor||'#fffaf0',alignItems:'center',justifyContent:'center'}}>{!!m.label&&<Text style={{color:'#182e27',fontWeight:'700',fontSize:enlarged?28:16,lineHeight:enlarged?34:19}}>{m.label}</Text>}</View>)}
  {sourceMarks.map((m,i)=><View key={i} testID={`${testID}-source-mark-${m.kind}-${i}`} pointerEvents="none" accessible accessibilityRole="image" accessibilityLabel={m.label} style={{position:'absolute',left:percent(m.x),top:percent(m.y),width:percent(m.width),height:percent(m.height)}}>{[-45,45].map(angle=><View key={angle} style={{position:'absolute',left:0,top:'43%',width:'100%',height:'14%',backgroundColor:m.color,transform:[{rotate:`${angle}deg`}]}}/>)}</View>)}
 </View>;
 return <View onLayout={onLayout} style={{width:'100%',maxWidth:'100%',minWidth:0,alignSelf:'center',gap:8}}>
  <Pressable testID={`${testID}-preview`} disabled={!canExpand} accessibilityRole={canExpand?'button':'image'} accessibilityLabel={canExpand?`${altJa}。図を拡大`:altJa} accessibilityHint={canExpand?'タップして大きい図を表示します。':undefined} onPress={()=>setExpanded(true)} style={{width:normalWidth,height:previewHeight,alignSelf:'center',maxWidth:'100%',overflow:'hidden'}}>{picture(normalWidth)}{canExpand&&<Text testID={`${testID}-expand`} pointerEvents="none" style={{position:'absolute',right:8,bottom:8,paddingHorizontal:12,paddingVertical:8,borderRadius:8,backgroundColor:'#fffaf0ee',color:'#182e27',fontSize:15,lineHeight:24}}>図を拡大</Text>}</Pressable>

  <Modal visible={expanded} transparent animationType="fade" onRequestClose={()=>setExpanded(false)}>
   <View testID={`${testID}-modal`} accessibilityViewIsModal style={{flex:1,backgroundColor:'#101720f5',paddingHorizontal:16,paddingTop:52,paddingBottom:28,gap:10}}>
    <Pressable accessibilityRole="button" testID={`${testID}-close`} accessibilityLabel="図を閉じる" onPress={()=>setExpanded(false)} style={{minHeight:44,paddingHorizontal:16,paddingVertical:8,alignSelf:'flex-end',borderRadius:8,backgroundColor:'#fffaf0',justifyContent:'center'}}><Text style={{fontSize:18,color:'#182e27'}}>閉じる</Text></Pressable>
    <Text style={{fontSize:14,lineHeight:23,color:'#fffaf0'}}>上下・左右にスクロールして図全体を確認できます。</Text>
    <ScrollView style={{flex:1,minHeight:0}} contentContainerStyle={{alignItems:'center'}}><ScrollView horizontal nestedScrollEnabled style={{width:'100%'}} contentContainerStyle={{flexGrow:1,alignItems:'flex-start',justifyContent:'center'}}>{picture(expandedWidth,true)}</ScrollView></ScrollView>
   </View>
  </Modal>
 </View>;
}
