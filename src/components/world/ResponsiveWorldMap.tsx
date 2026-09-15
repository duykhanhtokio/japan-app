import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, ImageSourcePropType, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoyalBackButton, RoyalMapPill, RoyalTitlePanel, ROYAL, ROYAL_CONTENT_GROUP, ROYAL_FONT, ROYAL_LAYOUT, ROYAL_PLACEMENT, ROYAL_TEXT_FIT, useRoyalGroupHeight } from '@/components/ui/RoyalSurface';

export type MapMode = 'phone' | 'tablet' | 'landscape';
type Point = { x: number; y: number };
export type MapPlacement = { label: Point; anchor: Point };
export type WorldMapItem = { id:string; ja:string; en:string; icon:string; color:string; border:string; progress?:string; positions:Record<MapMode,MapPlacement> };
export type ResponsiveMapAssets = Record<MapMode, ImageSourcePropType>;

export default function ResponsiveWorldMap({assets,items,onItemPress,title,subtitle,regionLabel}:{assets:ResponsiveMapAssets;items:WorldMapItem[];onItemPress:(item:WorldMapItem)=>void;title?:string;subtitle?:string;regionLabel?:string}) {
 const insets=useSafeAreaInsets(); const [size,setSize]=useState({width:0,height:0}); const intro=useRef(new Animated.Value(0)).current;
 const markerSizing=useRoyalGroupHeight(ROYAL_CONTENT_GROUP.worldMapMarker,ROYAL_LAYOUT.mapMarkerHeight);
 useEffect(()=>{Animated.spring(intro,{toValue:1,speed:8,bounciness:5,useNativeDriver:true}).start()},[intro]);
 const onLayout=(e:LayoutChangeEvent)=>{const {width,height}=e.nativeEvent.layout;setSize(o=>o.width===width&&o.height===height?o:{width,height})};
 const ratio=size.height?size.width/size.height:.46; const mode:MapMode=ratio>=1.1?'landscape':ratio>=.62?'tablet':'phone';
  const desiredWidth=mode==='phone'?ROYAL_LAYOUT.mapMarkerWidthPhone:ROYAL_LAYOUT.mapMarkerWidthWide;
  const cardWidth=Math.min(desiredWidth,Math.max(148,size.width-ROYAL_LAYOUT.screenGutter*2));
 const placements=useMemo(()=>{
  if(!size.width||!size.height)return [];
  const cardHeight=markerSizing.height,margin=ROYAL_LAYOUT.screenGutter,topGuard=insets.top+(title?(mode==='landscape'?82:140):70),bottomGuard=18;
  const placed=items.map(item=>{const p=item.positions[mode];let x=Math.max(cardWidth/2+margin,Math.min(size.width-cardWidth/2-margin,p.label.x*size.width));let y=Math.max(topGuard,Math.min(size.height-cardHeight-bottomGuard,p.label.y*size.height));const ax=p.anchor.x*size.width,ay=p.anchor.y*size.height;const dx=x-ax,dy=y+cardHeight/2-ay,d=Math.hypot(dx,dy),max=mode==='phone'?size.width*.30:size.width*.22;if(d>max){const k=max/d;x=ax+dx*k;y=ay+dy*k-cardHeight/2}return{item,label:{x,y},anchor:{x:ax,y:ay}}});
  for(let pass=0;pass<5;pass++)for(let i=0;i<placed.length;i++)for(let j=i+1;j<placed.length;j++){const a=placed[i],b=placed[j],overlapX=Math.abs(a.label.x-b.label.x)<cardWidth+9,overlapY=Math.abs(a.label.y-b.label.y)<cardHeight+9;if(overlapX&&overlapY){const push=(cardHeight+10-Math.abs(a.label.y-b.label.y))/2+1;if(a.label.y<=b.label.y){a.label.y-=push;b.label.y+=push}else{a.label.y+=push;b.label.y-=push}a.label.y=Math.max(topGuard,Math.min(size.height-cardHeight-bottomGuard,a.label.y));b.label.y=Math.max(topGuard,Math.min(size.height-cardHeight-bottomGuard,b.label.y))}}
  return placed;
 },[cardWidth,insets.top,items,markerSizing.height,mode,size.height,size.width,title]);
 return <View style={s.screen} onLayout={onLayout}>
  <Image source={assets[mode]} resizeMode="cover" style={s.background}/><View pointerEvents="none" style={s.skyWash}/>
  {!!title&&<Animated.View pointerEvents="none" style={[s.hero,{top:insets.top+(mode==='landscape'?8:16),opacity:intro,transform:[{translateY:intro.interpolate({inputRange:[0,1],outputRange:[-12,0]})}]}]}>
   <RoyalTitlePanel style={[s.heroPanel,{width:mode==='landscape'?'44%':'72%'}]}><Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={[s.heroTitle,mode==='landscape'&&s.heroTitleWide]}>{title}</Text></RoyalTitlePanel>
   {!!regionLabel&&<Text {...ROYAL_TEXT_FIT} numberOfLines={1} style={s.regionLabel}>{regionLabel}</Text>}{!!subtitle&&<Text {...ROYAL_TEXT_FIT} numberOfLines={2} style={s.heroSubtitle}>{subtitle}</Text>}
  </Animated.View>}
  {placements.map(({item,label,anchor})=><MapMarker key={item.id} item={item} width={cardWidth} height={markerSizing.height} onLayout={markerSizing.onLayout} label={label} anchor={anchor} onPress={()=>onItemPress(item)}/>)}
  <RoyalBackButton onPress={()=>router.back()} style={[s.royalBack,{top:insets.top+ROYAL_PLACEMENT.headerTop}]}/>
 </View>
}

function MapMarker({item,width,height,onLayout,label,anchor,onPress}:{item:WorldMapItem;width:number;height:number;onLayout?:((event:LayoutChangeEvent)=>void);label:Point;anchor:Point;onPress:()=>void}){
 const press=useRef(new Animated.Value(0)).current; const cx=label.x,cy=label.y+height/2,dx=anchor.x-cx,dy=anchor.y-cy;
 const length=Math.sqrt(dx*dx+dy*dy),angle=`${Math.atan2(dy,dx)}rad`; const release=()=>Animated.spring(press,{toValue:0,speed:20,bounciness:9,useNativeDriver:true}).start();
 return <><View pointerEvents="none" style={[s.connector,{left:cx,top:cy,width:length,transform:[{rotate:angle}]}]}/><View pointerEvents="none" style={[s.pin,{left:anchor.x-5,top:anchor.y-5}]}/>
  <Animated.View onLayout={onLayout} style={[s.marker,{left:label.x-width/2,top:label.y,width,minHeight:height,transform:[{translateY:press.interpolate({inputRange:[0,1],outputRange:[0,5]})},{scale:press.interpolate({inputRange:[0,1],outputRange:[1,.965]})}]}]}>
   <Pressable style={s.markerButton} onPressIn={()=>Animated.timing(press,{toValue:1,duration:70,useNativeDriver:true}).start()} onPressOut={release} onPress={onPress} accessibilityRole="button" accessibilityLabel={item.ja}>
    <RoyalMapPill primary={item.ja} secondary={item.en} color={item.color} style={s.markerCapsule}/>
   </Pressable>
  </Animated.View></>
}

const s=StyleSheet.create({
 screen:{flex:1,overflow:'hidden',backgroundColor:'#1598e1'},background:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},skyWash:{position:'absolute',left:0,right:0,top:0,height:'24%',backgroundColor:'rgba(7,94,177,.08)'},
 hero:{position:'absolute',zIndex:12,left:0,right:0,width:'100%',alignItems:'center'},heroPanel:{height:72},regionLabel:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.body,fontSize:14,letterSpacing:2,textAlign:'center',marginTop:-5,textShadowColor:'rgba(0,20,45,.9)',textShadowOffset:{width:0,height:2},textShadowRadius:3},heroTitle:{color:ROYAL.paleGold,fontFamily:ROYAL_FONT.heading,fontSize:27,lineHeight:38,letterSpacing:1,textAlign:'center',textShadowColor:'#2a1905',textShadowOffset:{width:0,height:2},textShadowRadius:3},heroTitleWide:{fontSize:24,lineHeight:33},heroSubtitle:{color:'#fff8e6',fontFamily:ROYAL_FONT.body,fontSize:13,lineHeight:18,textAlign:'center',marginTop:1,textShadowColor:'rgba(5,24,44,.95)',textShadowOffset:{width:0,height:2},textShadowRadius:3},
 royalBack:{position:'absolute',left:ROYAL_PLACEMENT.headerHorizontal,zIndex:100},
 connector:{position:'absolute',height:2,borderRadius:1,transformOrigin:'left center',opacity:.92,zIndex:14,backgroundColor:ROYAL.gold,shadowColor:'#fff1b0',shadowOpacity:.8,shadowRadius:3},pin:{position:'absolute',width:10,height:10,borderRadius:5,backgroundColor:ROYAL.gold,zIndex:15,shadowColor:'#fff2a8',shadowOpacity:.9,shadowRadius:5},marker:{position:'absolute',zIndex:18,shadowColor:'#020713',shadowOffset:{width:0,height:6},shadowOpacity:.5,shadowRadius:8,elevation:12},markerButton:{flex:1,width:'100%'},markerCapsule:{width:'100%',minHeight:ROYAL_LAYOUT.mapMarkerHeight,minWidth:0},ja:{fontFamily:ROYAL_FONT.heading}
});
