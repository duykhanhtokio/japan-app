import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Level, LearningSnapshot, Challenge, Match } from '@/daily-learning/types';

export type LearningIdentity = {userId:string;token:string};
let identityProvider: (()=>Promise<LearningIdentity|null>) | undefined;
/** Trusted login integration point. Never populate with email, local profile IDs or a shared secret. */
export function configureLearningIdentityProvider(provider:()=>Promise<LearningIdentity|null>) { identityProvider=provider; }
export const learningOperationId = () => `learning-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
let clock: {server:number;monotonic:number}|null=null;
export function learningServerNow() { return clock ? clock.server + performance.now()-clock.monotonic : null; }
export async function learningAction(action:string,data:Record<string,unknown>={}):Promise<LearningSnapshot> {
    const endpoint=process.env.EXPO_PUBLIC_ECONOMY_API_URL;
    if(!endpoint || !/^https:\/\//.test(endpoint)) throw Error('Máy chủ nhiệm vụ chưa được cấu hình.');
    const identity=await identityProvider?.();
    if(!identity?.userId || !identity.token) throw Error('Cần kết nối đăng nhập bảo mật để đồng bộ nhiệm vụ và quyền thi.');
    const raw=await AsyncStorage.getItem('@japan_app_user_profile');
    const profile=raw?JSON.parse(raw):{};
    const level=(['N5','N4','N3','N2','N1'].includes(profile.level)?profile.level:'N5') as Level;
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
    try {
        const response=await fetch(endpoint.replace(/\/$/,'')+'/v1/learning/'+action,{method:'POST',signal:controller.signal,
            headers:{'Content-Type':'application/json',Authorization:'Bearer '+identity.token},body:JSON.stringify({level,...data})});
        const value=await response.json();
        if(!response.ok) throw Error(value.error??`Learning API ${response.status}`);
        if(!Number.isFinite(value.serverNow)||!value.state?.freeExamId) throw Error('Phản hồi máy chủ không hợp lệ.');
        clock={server:value.serverNow,monotonic:performance.now()};
        await AsyncStorage.setItem('@learning-snapshot:'+identity.userId,JSON.stringify(value));
        return value as LearningSnapshot;
    } finally {clearTimeout(timeout);}
}
export async function savePendingMatch(challenge:Challenge,matches:Match[]) {
    const identity=await identityProvider?.();
    if(!identity) return;
    await AsyncStorage.setItem('@learning-pending:'+identity.userId,JSON.stringify({day:challenge.day,matches}));
}
export async function pendingMatches(challenge:Challenge):Promise<Match[]> {
    const identity=await identityProvider?.();if(!identity)return [];
    const raw=await AsyncStorage.getItem('@learning-pending:'+identity.userId);if(!raw)return [];
    try {const p=JSON.parse(raw);return p.day===challenge.day&&Array.isArray(p.matches)?p.matches:[];}catch{return [];}
}
