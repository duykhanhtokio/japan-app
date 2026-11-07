import {Image,View} from 'react-native';
import gallery from '@/data/restaurant/tool-gallery.json';
import data from '@/data/restaurant/royal-tool-artwork.json';
const sheets=[require('../../../assets/restaurant/royal-weekly-20261107/week04/tool-artwork-pans.webp'),require('../../../assets/restaurant/royal-weekly-20261107/week04/tool-artwork-knives-containers.webp'),require('../../../assets/restaurant/royal-weekly-20261107/week04/tool-artwork-utensils.webp'),require('../../../assets/restaurant/royal-weekly-20261107/week04/tool-artwork-measurement.webp')];
/** Match the complete current item, including lesson scope and all translated labels, before selecting object art. */
export function restaurantRoyalToolBinding(id:string){
 const current=gallery.items.find(x=>x.id===id),binding=data.items.find(x=>x.id===id);
 return current&&binding&&JSON.stringify(current)===JSON.stringify(binding.originalItem)?binding:null;
}
export function RoyalRestaurantToolArtwork({id,label}:{id:string;label:string}){
 const binding=restaurantRoyalToolBinding(id);if(!binding)return null;
 return <View testID={`restaurant-tool-royal-${id}`} accessible accessibilityRole="image" accessibilityLabel={label} style={{width:'100%',aspectRatio:384/(1024/3),overflow:'hidden',position:'relative',backgroundColor:'#fffaf0',borderRadius:8}}><Image source={sheets[binding.sheet]} resizeMode="contain" style={{position:'absolute',width:'400%',height:'300%',left:`${-binding.column*100}%`,top:`${-binding.row*100}%`}}/></View>;
}
