import AsyncStorage from '@react-native-async-storage/async-storage';
import { NPC_CATEGORIES, type NpcCategoryId } from '@/data/npc-progression';

const KEY='@japan_app/npc_collection_v1';
export type NpcCollectionState={
  starterCategoryId:NpcCategoryId|null;
  unlockedCategoryIds:NpcCategoryId[];
  completedScenarioIds:string[];
  categoryProgress:Partial<Record<NpcCategoryId,number>>;
  rewardedCategoryIds:NpcCategoryId[];
};
export type NpcProgressResult={state:NpcCollectionState;added:boolean;progress:number;unlockedCategoryId:NpcCategoryId|null};
const EMPTY:NpcCollectionState={starterCategoryId:null,unlockedCategoryIds:[],completedScenarioIds:[],categoryProgress:{},rewardedCategoryIds:[]};

export async function loadNpcCollection():Promise<NpcCollectionState>{
  try{const raw=await AsyncStorage.getItem(KEY);return raw?{...EMPTY,...JSON.parse(raw)}:EMPTY}catch{return EMPTY}
}
async function save(state:NpcCollectionState){await AsyncStorage.setItem(KEY,JSON.stringify(state));return state}
export async function chooseStarterNpc(_id?:NpcCategoryId){
  const current=await loadNpcCollection();
  const unlocked=Array.from(new Set<NpcCategoryId>(['station',...current.unlockedCategoryIds]));
  return save({...current,starterCategoryId:'station',unlockedCategoryIds:unlocked});
}
export async function isNpcCategoryUnlocked(id:NpcCategoryId){return (await loadNpcCollection()).unlockedCategoryIds.includes(id)}
export async function recordNpcScenario(scenarioId:string,categoryId:NpcCategoryId):Promise<NpcProgressResult>{
  const current=await loadNpcCollection();
  if(current.completedScenarioIds.includes(scenarioId))return{state:current,added:false,progress:current.categoryProgress[categoryId]??0,unlockedCategoryId:null};
  const progress=Math.min(5,(current.categoryProgress[categoryId]??0)+1);
  let unlockedCategoryId:NpcCategoryId|null=null;
  const unlocked=[...current.unlockedCategoryIds]; const rewarded=[...current.rewardedCategoryIds];
  if(progress===5&&!rewarded.includes(categoryId)){
    rewarded.push(categoryId);
    const start=NPC_CATEGORIES.findIndex(x=>x.id===categoryId);
    for(let offset=1;offset<=NPC_CATEGORIES.length;offset++){
      const candidate=NPC_CATEGORIES[(start+offset)%NPC_CATEGORIES.length].id;
      if(!unlocked.includes(candidate)){unlocked.push(candidate);unlockedCategoryId=candidate;break}
    }
  }
  const state=await save({...current,completedScenarioIds:[...current.completedScenarioIds,scenarioId],categoryProgress:{...current.categoryProgress,[categoryId]:progress},unlockedCategoryIds:unlocked,rewardedCategoryIds:rewarded});
  return{state,added:true,progress,unlockedCategoryId};
}
