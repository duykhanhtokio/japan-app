import {StudyFigureViewer} from '@/components/tokutei/StudyFigure';
import controls from '@/data/agriculture/figure-controls-locales.json';
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
export function ZoomableFigure({source,width:sourceWidth,height:sourceHeight,altJa,testID,colors,allowExpandedView=true,masks=[],marks,presentation='diagram',uiLanguage='ja'}:{source:ImageSourcePropType;width:number;height:number;altJa:string;testID:string;colors:Colors;allowExpandedView?:boolean;masks?:FigureMask[];marks?:FigureMark[];presentation?:'recognition'|'diagram';uiLanguage?:string}) {
 const ui=controls[uiLanguage as keyof typeof controls]||controls.ja;
 const {width,height}=useWindowDimensions(),[expanded,setExpanded]=useState(false),[containerWidth,setContainerWidth]=useState<number|null>(null);
 const {available,maxHeight,normalWidth}=figureGeometry(width,height,containerWidth,sourceWidth,sourceHeight,presentation);
 const onLayout=(event:LayoutChangeEvent)=>{const next=event.nativeEvent.layout.width;if(Number.isFinite(next)&&next>0)setContainerWidth(current=>current===next?current:next);};
 const canExpand=allowExpandedView&&(sourceWidth>normalWidth*1.2||sourceHeight>maxHeight*1.2);
 const previewHeight=normalWidth*sourceHeight/sourceWidth;
 const expandedWidth=Math.max(Math.max(1,width-48),Math.min(sourceWidth,1600));
 const sourceMarks=marks??agricultureIntrinsicFigureSourceMarks(source,sourceWidth,sourceHeight);
 const picture=(renderedWidth:number,enlarged=false)=><View testID={`${testID}-picture${enlarged?'-expanded':''}`} style={{width:renderedWidth,height:renderedWidth*sourceHeight/sourceWidth,position:'relative',overflow:'hidden',flexShrink:0}}>
  <Image testID={`${testID}-image${enlarged?'-expanded':''}`} source={source} accessibilityLabel={altJa} resizeMode="contain" style={{position:'absolute',left:0,top:0,width:renderedWidth,height:renderedWidth*sourceHeight/sourceWidth}}/>
  {masks.map((m,i)=><View key={i} pointerEvents="none" style={{position:'absolute',left:percent(m.x),top:percent(m.y),width:percent(m.width),height:percent(m.height),backgroundColor:m.backgroundColor||'#fffaf0',alignItems:'center',justifyContent:'center'}}>{!!m.label&&<Text style={{color:'#182e27',fontWeight:'700',fontSize:16*renderedWidth/Math.max(1,normalWidth),lineHeight:19*renderedWidth/Math.max(1,normalWidth)}}>{m.label}</Text>}</View>)}
  {sourceMarks.map((m,i)=><View key={i} testID={`${testID}-source-mark-${m.kind}-${i}`} pointerEvents="none" accessible accessibilityRole="image" accessibilityLabel={m.label} style={{position:'absolute',left:percent(m.x),top:percent(m.y),width:percent(m.width),height:percent(m.height)}}>{[-45,45].map(angle=><View key={angle} style={{position:'absolute',left:0,top:'43%',width:'100%',height:'14%',backgroundColor:m.color,transform:[{rotate:`${angle}deg`}]}}/>)}</View>)}
 </View>;
 return <View onLayout={onLayout} style={{width:'100%',maxWidth:'100%',minWidth:0,alignSelf:'center',gap:8}}>
  <Pressable testID={`${testID}-preview`} disabled={!canExpand} accessibilityRole={canExpand?'button':'image'} accessibilityLabel={canExpand?`${altJa}。${ui[0]}`:altJa} accessibilityHint={canExpand?ui[1]:undefined} onPress={()=>setExpanded(true)} style={{width:normalWidth,height:previewHeight,alignSelf:'center',maxWidth:'100%',overflow:'hidden'}}>{picture(normalWidth)}{canExpand&&<Text testID={`${testID}-expand`} pointerEvents="none" style={{position:'absolute',right:8,bottom:8,paddingHorizontal:12,paddingVertical:8,borderRadius:8,backgroundColor:'#fffaf0ee',color:'#182e27',fontSize:15,lineHeight:24}}>{ui[0]}</Text>}</Pressable>

  <StudyFigureViewer visible={expanded} onClose={()=>setExpanded(false)} source={source} width={sourceWidth} height={sourceHeight} alt={altJa} testID={testID} renderPicture={(w)=>picture(w,true)}/>
 </View>;
}
