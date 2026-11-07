import {useState} from 'react';
import {Image,View} from 'react-native';
import data from '@/data/restaurant/royal-serving-object-artwork.json';
import cutlery from '@/data/restaurant/royal-cutlery-setting.json';
import tray from '@/data/restaurant/royal-tray-handling.json';
const assets={cutlery:require('../../../assets/restaurant/royal-weekly-20261107/week08/serving-cutlery-objects-royal-v2.webp'),tray:require('../../../assets/restaurant/royal-weekly-20261107/week08/serving-tray-glass-objects-royal-v2.webp')};
type Crop={x:number;y:number;width:number;height:number};
type ObjectRow={asset:keyof typeof assets;crop:Crop;glassBounds?:Crop};
export function restaurantServingArtworkCurrent(scope:'cutlery'|'tray',row:unknown=scope==='cutlery'?cutlery:tray){return JSON.stringify(row)===data.sourceSignatures[scope];}
/** Fit one whole physical object without distorting its shape. Locations are supplied by native teaching diagrams. */
export function restaurantServingObjectFrame(kind:string,width:number,height:number){
 const item=(data.objects as Record<string,ObjectRow>)[kind];if(!item||!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return null;
 const sheet=data.assets[item.asset],c=item.crop,scale=Math.min(width/c.width,height/c.height),left=(width-c.width*scale)/2-c.x*scale,top=(height-c.height*scale)/2-c.y*scale;
 const b=item.glassBounds;
 return {asset:item.asset,imageWidth:sheet.width*scale,imageHeight:sheet.height*scale,left,top,contact:b?{left:left+b.x*scale,top:top+(b.y+b.height/2)*scale,width:b.width*scale,height:b.height/2*scale}:null};
}
export function RestaurantServingObjectArtwork({kind,scope,contact=false}:{kind:string;scope:'cutlery'|'tray';contact?:boolean}){
 const [size,setSize]=useState({width:100,height:100}),frame=restaurantServingObjectFrame(kind,size.width,size.height);
 if(!frame||frame.asset!==scope||!restaurantServingArtworkCurrent(scope))return null;
 return <View testID={`restaurant-serving-object-${kind}`} accessible={false} onLayout={event=>{const {width,height}=event.nativeEvent.layout;if(Number.isFinite(width)&&Number.isFinite(height)&&width>0&&height>0)setSize(previous=>previous.width===width&&previous.height===height?previous:{width,height});}} style={{width:'100%',height:'100%',position:'relative',overflow:'hidden'}}>
  <Image source={assets[frame.asset]} accessible={false} resizeMode="contain" style={{position:'absolute',width:frame.imageWidth,height:frame.imageHeight,left:frame.left,top:frame.top}}/>
  {contact&&frame.contact&&<View testID="glass-lower-contact" style={{position:'absolute',...frame.contact,backgroundColor:'rgba(103,166,130,0.28)',borderTopWidth:2,borderStyle:'dashed',borderColor:'#52816a'}}/>}
 </View>;
}
