export const NPC_CATEGORIES = [
  { id:'station', category:'Station', ja:'駅員', icon:'🚉' },
  { id:'convenience-store', category:'Convenience Store', ja:'コンビニ店員', icon:'🏪' },
  { id:'cafe', category:'Cafe', ja:'カフェ店員', icon:'☕' },
  { id:'restaurant', category:'Restaurant', ja:'レストラン店員', icon:'🍽️' },
  { id:'ramen-shop', category:'Ramen Shop', ja:'ラーメン店員', icon:'🍜' },
  { id:'supermarket', category:'Supermarket', ja:'スーパー店員', icon:'🛒' },
  { id:'shopping', category:'Shopping', ja:'販売スタッフ', icon:'🛍️' },
  { id:'bank', category:'Bank', ja:'銀行員', icon:'🏦' },
  { id:'post-office', category:'Post Office', ja:'郵便局員', icon:'📮' },
  { id:'government-office', category:'Government Office', ja:'市役所職員', icon:'🏢' },
  { id:'tax-office', category:'Tax Office', ja:'税務署職員', icon:'📑' },
  { id:'hospital', category:'Hospital', ja:'医療スタッフ', icon:'🏥' },
  { id:'pharmacy', category:'Pharmacy', ja:'薬局スタッフ', icon:'💊' },
  { id:'police-station', category:'Police Station', ja:'警察官', icon:'👮' },
  { id:'hotel', category:'Hotel', ja:'ホテルスタッフ', icon:'🏨' },
  { id:'izakaya', category:'Izakaya', ja:'居酒屋店員', icon:'🏮' },
  { id:'onsen', category:'Onsen', ja:'温泉スタッフ', icon:'♨️' },
  { id:'amusement-park', category:'Amusement Park', ja:'遊園地スタッフ', icon:'🎡' },
  { id:'museum', category:'Museum', ja:'博物館スタッフ', icon:'🏛️' },
  { id:'landmark', category:'Landmark', ja:'観光案内員', icon:'🗼' },
  { id:'shrine-temple', category:'Shrine / Temple', ja:'寺社案内員', icon:'⛩️' },
  { id:'castle', category:'Castle', ja:'城郭案内員', icon:'🏯' },
  { id:'park', category:'Park', ja:'公園スタッフ', icon:'🌳' },
  { id:'nature', category:'Nature', ja:'自然ガイド', icon:'🏔️' },
  { id:'construction-site', category:'Construction Site', ja:'建設スタッフ', icon:'👷' },
] as const;

export type NpcCategoryId = typeof NPC_CATEGORIES[number]['id'];
export type NpcCategory = typeof NPC_CATEGORIES[number];

export const normalizeNpcCategory = (category?:string|null) =>
  NPC_CATEGORIES.find(x=>x.category.toLowerCase()===(category??'').trim().toLowerCase());

export const npcCategoryById = (id?:string|null) => NPC_CATEGORIES.find(x=>x.id===id);

