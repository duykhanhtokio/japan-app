import type { JlptLevel } from '@/data/jlpt-learning';

type Answer=1|2|3|4;
type KeyReport={counts:[number,number,number,number];adjacentPairs:number;longestRun:number;groups:Array<[number,number,number,number]>};

function randomSource(seed:number){let state=seed>>>0;return()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};}
function localValid(key:readonly Answer[]){const n=key.length;if(n>=3&&key[n-1]===key[n-2]&&key[n-2]===key[n-3])return false;if(n>=5){let pairs=0;for(let i=n-5;i<n-1;i++)if(key[i]===key[i+1])pairs++;if(pairs>1)return false;}if(n>=10){const window=key.slice(-10);for(let answer=1;answer<=4;answer++){const count=window.filter(value=>value===answer).length;if(count<1||count>4)return false;}}if(n>=4){const four=key.slice(-4);const increasing=four.every((value,index)=>index===0||value===four[index-1]+1),decreasing=four.every((value,index)=>index===0||value===four[index-1]-1);if(increasing||decreasing)return false;}for(let size=2;size<=10;size++){if(n<2*size)continue;let repeated=true;for(let offset=0;offset<size;offset++)if(key[n-2*size+offset]!==key[n-size+offset]){repeated=false;break;}if(repeated)return false;}return true;}
function groupQuotas(total:number,seed:number){const groups:Array<[number,number,number,number]>=[];for(let start=0,group=0;start<total;start+=20,group++){const size=Math.min(20,total-start),base=Math.floor(size/4),quota:[number,number,number,number]=[base,base,base,base];for(let extra=0;extra<size%4;extra++)quota[(seed+group+extra*3)%4]++;groups.push(quota);}return groups;}

export function createConstrainedAnswerKey(total:number,seed:number):Answer[]{
 const random=randomSource(seed),quotas=groupQuotas(total,seed),key:Answer[]=[];
 for(let group=0;group<quotas.length;group++){const remaining=[...quotas[group]],end=Math.min(total,(group+1)*20);const search=():boolean=>{if(key.length===end)return true;const candidates=([1,2,3,4] as Answer[]).filter(answer=>remaining[answer-1]>0).map(answer=>({answer,order:random()})).sort((a,b)=>a.order-b.order).map(item=>item.answer);for(const answer of candidates){key.push(answer);remaining[answer-1]--;if(localValid(key)&&search())return true;remaining[answer-1]++;key.pop();}return false;};if(!search())throw new Error(`Unable to create answer key: ${total}/${seed}`);}
 validateAnswerKey(key,total===120);
 return key;
}

export function validateAnswerKey(key:readonly Answer[],requireExact120=false):KeyReport{
 const counts=[1,2,3,4].map(answer=>key.filter(value=>value===answer).length) as [number,number,number,number];
 const errors:string[]=[];
 if(requireExact120&&(key.length!==120||counts.some(count=>count!==30)))errors.push('120-question balance');
 if(Math.max(...counts)-Math.min(...counts)>1)errors.push('global balance');
 for(let index=0;index<key.length;index++)if(!localValid(key.slice(0,index+1)))errors.push(`local constraint at ${index+1}`);
 const groups=Array.from({length:Math.ceil(key.length/20)},(_,group)=>[1,2,3,4].map(answer=>key.slice(group*20,(group+1)*20).filter(value=>value===answer).length) as [number,number,number,number]);
 groups.forEach((countsInGroup,index)=>{if((index+1)*20<=key.length&&countsInGroup.some(count=>count<4||count>6))errors.push(`group ${index+1}`);});
 let adjacentPairs=0,longestRun=1,currentRun=1;for(let index=1;index<key.length;index++){if(key[index]===key[index-1]){adjacentPairs++;currentRun++;longestRun=Math.max(longestRun,currentRun);}else currentRun=1;}
 if(errors.length)throw new Error(`Invalid answer key: ${errors.join(', ')}`);
 return{counts,adjacentPairs,longestRun,groups};
}

const levelSeeds:Record<JlptLevel,number>={N1:101,N2:202,N3:303,N4:404,N5:505};
export const MASTER_120_ANSWER_KEY=createConstrainedAnswerKey(120,20260828);
export const MASTER_120_REPORT=validateAnswerKey(MASTER_120_ANSWER_KEY,true);
export const answerKeyFor=(level:JlptLevel,total:number)=>createConstrainedAnswerKey(total,levelSeeds[level]);
