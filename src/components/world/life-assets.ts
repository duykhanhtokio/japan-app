import type { ImageSourcePropType } from 'react-native';
const assets:Record<string,ImageSourcePropType>={
 laundry:require('../../../assets/app/life/location-backgrounds/laundry/01-clear-morning.png'),
 amusement:require('../../../assets/app/life/location-backgrounds/amusement-park/01-clear-morning.jpg'),
 shopping:require('../../../assets/app/life/location-backgrounds/shopping/01-clear-morning.jpg'),
 tax:require('../../../assets/app/life/location-backgrounds/tax-office/01-clear-morning.jpg'),
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
export function categoryAssetKey(category?:string|null){return (category??'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
const sceneCategories:Record<string,string>={
 laundry:'laundry','amusement-park':'amusement',station:'station',cafe:'cafe','ramen-shop':'ramen',izakaya:'izakaya',restaurant:'restaurant',hotel:'hotel',onsen:'onsen',
 'convenience-store':'convenience',pharmacy:'pharmacy',hospital:'hospital','police-station':'police','government-office':'government','tax-office':'tax',bank:'bank','post-office':'post',supermarket:'supermarket',shopping:'shopping','construction-site':'construction',museum:'museum','shrine-temple':'shrine',castle:'castle',park:'park',nature:'nature',landmark:'sightseeing',
};
export function sceneForCategory(category?:string|null):ImageSourcePropType{return assets[sceneCategories[categoryAssetKey(category)]??'sightseeing'];}

const list=Object.values(assets);export const cityScene=(seed:number)=>list[Math.abs(seed)%list.length];

const npcAssets: Record<string, ImageSourcePropType> = {
  laundry: require('../../../assets/app/life/npcs/laundry.png'),
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
  return npcAssets[Object.keys(npcAssets).find(key=>categoryAssetKey(key)===categoryAssetKey(category))??'landmark'] ?? npcAssets.landmark;
}

// Source-space waist landmarks, not one screen-height ratio for every NPC.
const npcWaistY:Record<string,number>={"laundry": 580, "amusement park": 614, "bank": 686, "cafe": 548, "castle": 702, "construction site": 603, "convenience store": 702, "government office": 576, "hospital": 680, "hotel": 691, "izakaya": 576, "landmark": 625, "museum": 625, "nature": 603, "onsen": 565, "park": 603, "pharmacy": 625, "police station": 631, "post office": 697, "ramen shop": 576, "restaurant": 576, "shopping": 603, "shrine / temple": 620, "station": 631, "supermarket": 614, "tax office": 614};
export function npcPresentationForCategory(category?:string|null){const key=Object.keys(npcWaistY).find(key=>categoryAssetKey(key)===categoryAssetKey(category))??'landmark';return {source:npcForCategory(category),width:1024,height:1536,waistY:npcWaistY[key]??npcWaistY.landmark};}
