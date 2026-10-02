import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, ImageSourcePropType, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoyalMapPill, ROYAL, ROYAL_CONTENT_GROUP, ROYAL_FONT, ROYAL_LAYOUT, useRoyalGroupHeight } from '@/components/ui/RoyalSurface';
import { WorldTitleHeader } from '@/components/world/WorldTitleHeader';

export type MapMode = 'phone' | 'tablet' | 'landscape';
type Point = { x: number; y: number };
export type MapPlacement = { label: Point; anchor: Point };
export type WorldMapItem = { id:string; ja:string; en:string; icon:string; color:string; border:string; progress?:string; positions:Record<MapMode,MapPlacement> };
export type ResponsiveMapAssets = Record<MapMode, ImageSourcePropType>;
export type MapLandZones = Record<MapMode,{width:number;height:number;rects:readonly (readonly [number,number,number,number])[]}>;

export default function ResponsiveWorldMap({assets,items,onItemPress,title,subtitle,regionLabel,landZones}:{assets:ResponsiveMapAssets;items:WorldMapItem[];onItemPress:(item:WorldMapItem)=>void;title?:string;subtitle?:string;regionLabel?:string;landZones?:MapLandZones}) {
 const insets=useSafeAreaInsets(); const [size,setSize]=useState({width:0,height:0}); const intro=useRef(new Animated.Value(0)).current;
 const markerSizing=useRoyalGroupHeight(ROYAL_CONTENT_GROUP.worldMapMarker,ROYAL_LAYOUT.mapMarkerHeight);
 const [headerHeight,setHeaderHeight]=useState(0);
 const [textWidths,setTextWidths]=useState<Record<string,{ja?:number;en?:number}>>({});
 const recordWidth=(id:string,language:'ja'|'en',width:number)=>setTextWidths(old=>
  Math.abs((old[id]?.[language]??0)-width)<1?old:{...old,[id]:{...old[id],[language]:width}});
 useEffect(()=>{Animated.spring(intro,{toValue:1,speed:8,bounciness:5,useNativeDriver:true}).start()},[intro]);
 const onLayout=(e:LayoutChangeEvent)=>{const {width,height}=e.nativeEvent.layout;setSize(o=>o.width===width&&o.height===height?o:{width,height})};
 const ratio=size.height?size.width/size.height:.46; const mode:MapMode=ratio>=1.1?'landscape':ratio>=.62?'tablet':'phone';
  const cardWidths=useMemo(()=>Object.fromEntries(items.map(item=>{
   const natural=Math.max(textWidths[item.id]?.ja??Array.from(item.ja).length*13,textWidths[item.id]?.en??item.en.length*4.5);
   return [item.id,Math.min(Math.max(70,Math.ceil(natural+32)),Math.max(70,size.width-ROYAL_LAYOUT.screenGutter*2))];
  })),[items,size.width,textWidths]);
 const placements=useMemo(()=>{
  if(!size.width||!size.height)return [];
  const cardHeight=markerSizing.height,margin=ROYAL_LAYOUT.screenGutter,topGuard=insets.top+(title?Math.max(headerHeight+12,150):70),bottomGuard=18;
  const source=landZones?.[mode];
  const cover=source?Math.max(size.width/source.width,size.height/source.height):1;
  const imageLeft=source?(size.width-source.width*cover)/2:0,imageTop=source?(size.height-source.height*cover)/2:0;
  const protectedRects=source?.rects.map(([l,t,r,b])=>({left:imageLeft+l*cover-3,top:imageTop+t*cover-3,right:imageLeft+r*cover+3,bottom:imageTop+b*cover+3}))??[];
  type Candidate={x:number;y:number;overlap:number;score:number};
  const options=new Map<string,Candidate[]>();
  for(const item of items){
   const p=item.positions[mode],ax=p.anchor.x*size.width,ay=p.anchor.y*size.height;
   const cardWidth=cardWidths[item.id],candidates:Candidate[]=[];
   // The authored label is a nearby starting point for this prefecture. Search
   // only its neighbourhood, so a vacant row at the bottom of the screen can
   // never pull several unrelated labels away from their own land.
   const preferredX=(mode==='landscape'&&landZones?p.label.x*.45+p.anchor.x*.55:p.label.x)*size.width;
   const preferredY=p.label.y*size.height;
   const reachX=Math.max(cardWidth*.8,size.width*(mode==='tablet'?.42:.18)),reachY=Math.max(cardHeight*1.4,size.height*.12);
   const left=Math.max(cardWidth/2+margin,preferredX-reachX),right=Math.min(size.width-cardWidth/2-margin,preferredX+reachX);
   const top=Math.max(topGuard,Math.min(preferredY,ay-cardHeight/2)-reachY);
   const bottom=Math.min(size.height-cardHeight-bottomGuard,Math.max(preferredY,ay-cardHeight/2)+reachY);
   for(let y=top;y<=bottom;y+=5)for(let x=left;x<=right;x+=5){
    const overlap=protectedRects.reduce((area,rect)=>area+
     Math.max(0,Math.min(x+cardWidth/2,rect.right)-Math.max(x-cardWidth/2,rect.left))*
     Math.max(0,Math.min(y+cardHeight,rect.bottom)-Math.max(y,rect.top)),0);
    if(mode!=='phone'&&overlap>0)continue;
    const preferredDistance=Math.hypot(x-preferredX,y-preferredY);
    const anchorDistance=Math.hypot(x-ax,y+cardHeight/2-ay);
    // A broad source-image envelope also contains water between prefectures.
    // It is a soft hint on phones, never a reason to send a label far away.
    candidates.push({x,y,overlap,score:preferredDistance+anchorDistance*.32+overlap/(cardWidth*cardHeight)*18});
   }
   candidates.sort((a,b)=>a.score-b.score);
   options.set(item.id,candidates.slice(0,mode==='phone'?500:900));
  }
  const vertical=[...items].sort((a,b)=>a.positions[mode].anchor.y-b.positions[mode].anchor.y);
  const constrained=[...items].sort((a,b)=>(options.get(a.id)?.length??0)-(options.get(b.id)?.length??0));
  const preferredIds=['tohoku','hokkaido','chugoku','kansai','shikoku','chubu','kanto','kyushu'];
  const imageOrder=[...items].sort((a,b)=>preferredIds.indexOf(a.id)-preferredIds.indexOf(b.id));
  const orderings=mode==='phone'?[vertical,constrained,imageOrder,[...vertical].reverse()]:[vertical,constrained,[...vertical].reverse()];
  let chosen:{item:WorldMapItem;label:Point;anchor:Point}[]=[],bestDistance=Infinity;
  for(const ordering of orderings){
   const placed:{item:WorldMapItem;label:Point;anchor:Point}[]=[];
   let totalDistance=0;
   for(const item of ordering){
    const width=cardWidths[item.id];
    const candidate=options.get(item.id)?.find(c=>!placed.some(other=>
     Math.abs(c.x-other.label.x)<(width+cardWidths[other.item.id])/2+5&&
     Math.abs(c.y-other.label.y)<cardHeight+5));
    if(!candidate)break;
    const p=item.positions[mode];
    placed.push({item,label:{x:candidate.x,y:candidate.y},anchor:{x:p.anchor.x*size.width,y:p.anchor.y*size.height}});
    totalDistance+=candidate.score;
   }
   if(placed.length===items.length&&totalDistance<bestDistance){
    chosen=placed;bestDistance=totalDistance;
   }
  }
  if(chosen.length!==items.length){
   // Preserve every destination on an unusually small viewport. Its geometry
   // still requires design review; silently removing destinations is worse.
   console.warn('World map: no collision-free placement at',size.width,size.height);
   return items.map(item=>{
    const p=item.positions[mode],width=cardWidths[item.id];
    return {item,label:{
     x:Math.max(width/2+margin,Math.min(size.width-width/2-margin,p.label.x*size.width)),
     y:Math.max(topGuard,Math.min(size.height-cardHeight-bottomGuard,p.label.y*size.height)),
    },anchor:{x:p.anchor.x*size.width,y:p.anchor.y*size.height}};
   });
  }
  return chosen;
 },[cardWidths,insets.top,items,landZones,markerSizing.height,mode,size.height,size.width,title,headerHeight]);
 return <View style={s.screen} onLayout={onLayout}>
  <Image source={assets[mode]} resizeMode="cover" style={s.background}/><View pointerEvents="none" style={s.skyWash}/>
  <View pointerEvents="none" style={s.measurements}>{items.map(item=><View key={item.id}>
   <Text onLayout={e=>recordWidth(item.id,'ja',e.nativeEvent.layout.width)} style={s.measurePrimary}>{item.ja}</Text>
   <Text onLayout={e=>recordWidth(item.id,'en',e.nativeEvent.layout.width)} style={s.measureSecondary}>{item.en}</Text>
  </View>)}</View>
  {!!title&&<Animated.View onLayout={event=>setHeaderHeight(Math.ceil(event.nativeEvent.layout.height))} style={[s.hero,{top:insets.top,left:insets.left,right:insets.right,opacity:intro,transform:[{translateY:intro.interpolate({inputRange:[0,1],outputRange:[-12,0]})}]}]}>
   <WorldTitleHeader title={title} subtitle={regionLabel} detail={subtitle} onBack={()=>router.back()}/>
  </Animated.View>}
  {placements.map(({item,label,anchor})=><MapMarker key={item.id} item={item} width={cardWidths[item.id]} height={markerSizing.height} onLayout={markerSizing.onLayout} label={label} anchor={anchor} onPress={()=>onItemPress(item)}/>)}

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
 hero:{position:'absolute',zIndex:20,alignItems:'center'},measurements:{position:'absolute',top:0,left:0,opacity:0,pointerEvents:'none'},measurePrimary:{alignSelf:'flex-start',fontFamily:ROYAL_FONT.heading,fontSize:13,lineHeight:17},measureSecondary:{alignSelf:'flex-start',fontFamily:ROYAL_FONT.body,fontSize:8,lineHeight:11},
 connector:{position:'absolute',height:2,borderRadius:1,transformOrigin:'left center',opacity:.92,zIndex:14,backgroundColor:ROYAL.gold,shadowColor:'#fff1b0',shadowOpacity:.8,shadowRadius:3},pin:{position:'absolute',width:10,height:10,borderRadius:5,backgroundColor:ROYAL.gold,zIndex:15,shadowColor:'#fff2a8',shadowOpacity:.9,shadowRadius:5},marker:{position:'absolute',zIndex:18,shadowColor:'#020713',shadowOffset:{width:0,height:6},shadowOpacity:.5,shadowRadius:8,elevation:12},markerButton:{flex:1,width:'100%'},markerCapsule:{width:'100%',minHeight:ROYAL_LAYOUT.mapMarkerHeight,minWidth:0},ja:{fontFamily:ROYAL_FONT.heading}
});
