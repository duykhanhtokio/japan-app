import {useState} from 'react';
import {Image,View} from 'react-native';
import data from '@/data/restaurant/royal-processing-artwork.json';
import guideData from '@/data/restaurant/additional-guides.json';
import lessons from '@/data/restaurant/lessons.1.ja.json';
const existing=require('../../../assets/restaurant/royal-weekly-20261107/week03/fish-body-objects.webp');
const processed=require('../../../assets/restaurant/royal-weekly-20261107/week05/processed-fish-state-objects.webp');
export function restaurantHasProcessingArtwork(){return lessons.lessons.some(l=>l.id===data.lessonId&&l.sourceHash===data.lessonSourceHash)&&JSON.stringify(guideData.guides.find(g=>g.id==='processing'))===JSON.stringify(data.guideSnapshot);}
/** Native pixel windows preserve the named states; two flesh cards and one frame remain separate. */
export function RoyalRestaurantProcessingArtwork({state,label}:{state:string;label:string}){
 const [width,setWidth]=useState(240),crop=data.crops[state as keyof typeof data.crops];if(!crop||!restaurantHasProcessingArtwork())return null;
 const sheet=data.artwork[crop.sheet as keyof typeof data.artwork],scale=width/crop.width;
 return <View testID={`restaurant-royal-processing-${state}`} accessible accessibilityRole="image" accessibilityLabel={label} onLayout={event=>{const next=event.nativeEvent.layout.width;if(Number.isFinite(next)&&next>0)setWidth(next);}} style={{width:'100%',height:crop.height*scale,position:'relative',overflow:'hidden'}}><Image source={crop.sheet==='processed'?processed:existing} resizeMode="contain" style={{position:'absolute',width:sheet.width*scale,height:sheet.height*scale,left:-crop.x*scale,top:-crop.y*scale,transform:state==='side-b'?[{scaleX:-1}]:undefined}}/></View>;
}
