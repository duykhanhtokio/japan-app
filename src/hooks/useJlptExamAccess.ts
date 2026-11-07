import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';
import { learningAction, learningOperationId, learningServerNow } from '@/services/daily-learning-client';
import type { N1TrialSession } from '@/services/jlpt-trial-session-storage';
import type { Access } from '@/daily-learning/types';

export function useJlptExamAccess(examId:string,initialSession:N1TrialSession|null|undefined,reviewOnly:boolean) {
    const authorizing=useRef(false);
    const runId=useRef(initialSession?.accessRunId??'');
    const [denied,setDenied]=useState(false),[reason,setReason]=useState(''),[expiresAt,setExpiresAt]=useState<number|null>(null);
    const mounted=useRef(true);useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
    const apply=useCallback((access:Partial<Access>)=>{if(mounted.current){setDenied(!access.allowed);setExpiresAt(access.source==='premium' && runId.current ? null : access.expiresAt??null);if(!access.allowed)setReason('Quyền làm bài đã hết hạn hoặc cần mở đề. Bài dở vẫn được giữ.');}},[]);
    const refresh=useCallback(async()=>{
        if(reviewOnly)return;
        try{const result=await learningAction('access',{examId,runId:runId.current||undefined});apply(result.result);}
        catch(error){if(mounted.current){setDenied(true);setReason((error as Error).message);}}
    },[apply,examId,reviewOnly]);
    useEffect(()=>{
        if(reviewOnly)return;
        void refresh();const interval=setInterval(()=>{void refresh();},30000);
        const sub=AppState.addEventListener('change',state=>{if(state==='active'){setDenied(true);void refresh();}});
        return()=>{clearInterval(interval);sub.remove();};
    },[refresh,reviewOnly]);
    useEffect(()=>{
        if(expiresAt===null)return;
        const now=learningServerNow();if(now===null)return;
        // An active premium run is checked separately and may finish after expiry.
        const timeout=setTimeout(()=>{setDenied(true);void refresh();},Math.min(2147483647,Math.max(0,expiresAt-now)));
        return()=>clearTimeout(timeout);
    },[expiresAt,refresh]);
    async function authorize(kind:'start'|'continue'|'submit',session?:N1TrialSession) {
        if(reviewOnly || authorizing.current)return false;
        authorizing.current=true;
        try{
            if(kind==='start') {const id=learningOperationId();const next=await learningAction('start',{examId,runId:id});runId.current=id;apply(next.result);return !!next.result.allowed;}
            if(kind==='continue') {const id=session?.accessRunId||learningOperationId();const next=await learningAction('start',{examId,runId:id});runId.current=id;apply(next.result);return !!next.result.allowed;}
            const result=await learningAction('submit',{examId,runId:runId.current,session});
            return result.result.submitted===true;
        }catch(error){if(mounted.current){setReason((error as Error).message);setDenied(true);}Alert.alert('JLPT',(error as Error).message);return false;}finally{authorizing.current=false;}
    }
    return {runId,denied,reason,authorize,refresh};
}
