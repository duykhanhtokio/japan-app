import type { ImageSourcePropType } from 'react-native';
const assets:Record<string,ImageSourcePropType>={
 amusement:require('../../../assets/app/life/location-backgrounds/amusement-park/01-clear-morning.jpg'),
 station:require('../../../assets/app/life/location-backgrounds/station/01-clear-morning.jpg'),
 cafe:require('../../../assets/app/life/location-backgrounds/cafe/01-clear-morning.jpg'),
 restaurant:require('../../../assets/app/life/location-backgrounds/restaurant/01-clear-morning.jpg'),
 convenience:require('../../../assets/app/life/location-backgrounds/convenience-store/01-clear-morning.jpg'),
 hospital:require('../../../assets/app/life/location-backgrounds/hospital/01-clear-morning.jpg'),
 government:require('../../../assets/app/life/location-backgrounds/government-office/01-clear-morning.jpg'),
 bank:require('../../../assets/app/life/location-backgrounds/bank/01-clear-morning.jpg'),
 post:require('../../../assets/app/life/location-backgrounds/post-office/01-clear-morning.jpg'),
 supermarket:require('../../../assets/app/life/location-backgrounds/supermarket/01-clear-morning.jpg'),
 construction:require('../../../assets/app/life/location-backgrounds/construction-site/01-clear-morning.jpg'),
 sightseeing:require('../../../assets/app/life/location-backgrounds/landmark/01-clear-morning.jpg'),
 hotel:require('../../../assets/app/life/location-backgrounds/hotel/01-clear-morning.jpg'),
 izakaya:require('../../../assets/app/life/location-backgrounds/izakaya/01-clear-morning.jpg'),
 museum:require('../../../assets/app/life/location-backgrounds/museum/01-clear-morning.jpg'),
 nature:require('../../../assets/app/life/location-backgrounds/nature/01-clear-morning.jpg'),
 onsen:require('../../../assets/app/life/location-backgrounds/onsen/01-clear-morning.jpg'),
 park:require('../../../assets/app/life/location-backgrounds/park/01-clear-morning.jpg'),
 pharmacy:require('../../../assets/app/life/location-backgrounds/pharmacy/01-clear-morning.jpg'),
 police:require('../../../assets/app/life/location-backgrounds/police-station/01-clear-morning.jpg'),
 ramen:require('../../../assets/app/life/location-backgrounds/ramen-shop/01-clear-morning.jpg'),
 shrine:require('../../../assets/app/life/location-backgrounds/shrine-temple/01-clear-morning.jpg'),
 castle:require('../../../assets/app/life/location-backgrounds/castle/01-clear-morning.jpg'),
};
export function sceneForCategory(category?:string|null):ImageSourcePropType{const c=(category??'').toLowerCase();if(c.includes('amusement'))return assets.amusement;if(c.includes('station'))return assets.station;if(c.includes('cafe'))return assets.cafe;if(c.includes('ramen'))return assets.ramen;if(c.includes('izakaya'))return assets.izakaya;if(c.includes('restaurant'))return assets.restaurant;if(c.includes('hotel'))return assets.hotel;if(c.includes('onsen'))return assets.onsen;if(c.includes('convenience'))return assets.convenience;if(c.includes('pharmacy'))return assets.pharmacy;if(c.includes('hospital'))return assets.hospital;if(c.includes('police'))return assets.police;if(c.includes('government')||c.includes('tax'))return assets.government;if(c.includes('bank'))return assets.bank;if(c.includes('post'))return assets.post;if(c.includes('supermarket')||c.includes('shopping'))return assets.supermarket;if(c.includes('construction'))return assets.construction;if(c.includes('museum'))return assets.museum;if(c.includes('shrine'))return assets.shrine;if(c.includes('castle'))return assets.castle;if(c.includes('park'))return assets.park;if(c.includes('nature'))return assets.nature;return assets.sightseeing}
const list=Object.values(assets);export const cityScene=(seed:number)=>list[Math.abs(seed)%list.length];

const npcAssets: Record<string, ImageSourcePropType> = {
  'amusement park': require('../../../assets/app/life/npcs/amusement-park.png'),
  bank: require('../../../assets/app/life/npcs/bank.png'),
  cafe: require('../../../assets/app/life/npcs/cafe.png'),
  castle: require('../../../assets/app/life/npcs/castle.png'),
  'construction site': require('../../../assets/app/life/npcs/construction-site.png'),
  'convenience store': require('../../../assets/app/life/npcs/convenience-store.png'),
  'government office': require('../../../assets/app/life/npcs/government-office.png'),
  hospital: require('../../../assets/app/life/npcs/hospital.png'),
  hotel: require('../../../assets/app/life/npcs/hotel.png'),
  izakaya: require('../../../assets/app/life/npcs/izakaya.png'),
  landmark: require('../../../assets/app/life/npcs/landmark.png'),
  museum: require('../../../assets/app/life/npcs/museum.png'),
  nature: require('../../../assets/app/life/npcs/nature.png'),
  onsen: require('../../../assets/app/life/npcs/onsen.png'),
  park: require('../../../assets/app/life/npcs/park.png'),
  pharmacy: require('../../../assets/app/life/npcs/pharmacy.png'),
  'police station': require('../../../assets/app/life/npcs/police-station.png'),
  'post office': require('../../../assets/app/life/npcs/post-office.png'),
  'ramen shop': require('../../../assets/app/life/npcs/ramen-shop.png'),
  restaurant: require('../../../assets/app/life/npcs/restaurant.png'),
  shopping: require('../../../assets/app/life/npcs/shopping.png'),
  'shrine / temple': require('../../../assets/app/life/npcs/shrine-temple.png'),
  station: require('../../../assets/app/life/npcs/station.png'),
  supermarket: require('../../../assets/app/life/npcs/supermarket.png'),
  'tax office': require('../../../assets/app/life/npcs/tax-office.png'),
};

export function npcForCategory(category?: string | null): ImageSourcePropType {
  return npcAssets[(category ?? '').trim().toLowerCase()] ?? npcAssets.landmark;
}
