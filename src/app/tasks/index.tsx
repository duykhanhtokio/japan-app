import { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import SafeAreaView from '@/components/ui/StableSafeAreaView';
import DailyWordMatch from '@/daily-learning/DailyWordMatch';
import type { LearningSnapshot, Match, Challenge } from '@/daily-learning/types';
import { learningAction, learningOperationId, savePendingMatch, pendingMatches } from '@/services/daily-learning-client';
import { useAppLanguage } from '@/context/LanguageContext';

export default function TasksScreen() {
    const {language}=useAppLanguage();
    const [snapshot,setSnapshot]=useState<LearningSnapshot|null>(null),[attempts,setAttempts]=useState<Match[]>([]);
    const [practice,setPractice]=useState<Challenge|null>(null);
    const [loading,setLoading]=useState(false),[status,setStatus]=useState(''),[playing,setPlaying]=useState(false);
    const [exchangeId,setExchangeId]=useState<string|null>(null);
    const refresh=useCallback(async()=>{
        setLoading(true);
        try {const value=await learningAction('daily',{locale:language});const pending=await pendingMatches(value.state.challenge!);setAttempts(pending);setSnapshot(value);setPractice(null);setStatus('');
            if(pending.length){const synced=await learningAction('complete',{day:value.state.challenge!.day,matches:pending});setSnapshot(synced);}
        }catch(error){setStatus(String((error as Error).message));
            try{const local=await import('@/daily-learning/practice');const value=await local.loadPractice(language);setPractice(value.challenge);setAttempts(value.attempts);}catch(practiceError){setStatus((practiceError as Error).message);}
        }finally{setLoading(false);}
    },[language]);
    useFocusEffect(useCallback(()=>{void refresh();},[refresh]));
    const challenge=practice??snapshot?.state.challenge;
    async function onMatches(matches:Match[],complete:boolean){
        if(!challenge)return;setAttempts(matches);
        if(practice){const local=await import('@/daily-learning/practice');await local.savePractice(challenge,matches);if(complete)setStatus('Đã hoàn thành lượt luyện tập. Chỉ nhiệm vụ được máy chủ cấp và xác minh mới nhận thưởng.');return;}
        await savePendingMatch(challenge,matches);
        if(!complete)return;
        try {const next=await learningAction('complete',{day:challenge.day,matches});setSnapshot(next);setStatus('Đã hoàn thành nhiệm vụ hôm nay.');if(next.result.keyAwarded)Alert.alert('Nhận chìa khóa','Bạn đã hoàn thành đủ 7 ngày cộng dồn và nhận 1 chìa khóa.');}
        catch(error){setStatus('Đã lưu bài ghép, đang chờ xác minh trực tuyến. '+(error as Error).message);}
    }
    async function exchange(){
        const operationId=exchangeId??learningOperationId();setExchangeId(operationId);setLoading(true);
        try{const next=await learningAction('exchange',{operationId});setSnapshot(next);setExchangeId(null);if(next.result.ticketAwarded&&!next.result.replayed)Alert.alert('Đã nhận 1 vé vàng','Dùng vé mở một đề gốc JLPT trong 7 ngày.');}
        catch(error){setStatus((error as Error).message);}finally{setLoading(false);}
    }
    return <SafeAreaView style={s.page}>
        <View style={s.header}><Pressable accessibilityRole="button" onPress={()=>playing?setPlaying(false):router.replace('/home')}><Text style={s.back}>‹</Text></Pressable><View style={{flex:1}}><Text style={s.title}>{language==='ja'?'毎日の単語ミッション':'Nhiệm vụ 10 từ mỗi ngày'}</Text><Text style={s.note}>{practice?'Luyện tập · ':''}{challenge?.level??'JLPT'} · {challenge?.day??'7 ngày → 1 chìa · 4 chìa → 1 vé'}</Text></View></View>
        {loading&&<ActivityIndicator />}
        {playing&&challenge?<DailyWordMatch key={challenge.day} challenge={challenge} initialAttempts={attempts} onChange={(m,c)=>{void onMatches(m,c);}}/>:<View style={s.overview}>
            <Text style={s.copy}>Ghép từ tiếng Nhật, cách đọc kana và nghĩa. Hoàn thành đúng cả 10 nhóm để ghi nhận nhiệm vụ ngày.</Text>
            <View style={s.wallet}><Text style={s.count}>Chìa khóa: {snapshot?.state.keys??'—'}</Text><Text style={s.count}>Vé vàng: {snapshot?.state.tickets??'—'}</Text></View>
            <Text style={s.copy}>{snapshot?`${snapshot.state.completedDays.length%7}/7 ngày đến chìa khóa tiếp theo · Đã hoàn thành ${snapshot.state.completedDays.length} ngày`:'Kết nối tài khoản để đồng bộ tiến độ và phần thưởng.'}</Text>
            <Pressable disabled={!challenge||loading} onPress={()=>setPlaying(true)} style={[s.button,(!challenge||loading)&&s.disabled]}><Text style={s.buttonText}>{challenge&&snapshot?.state.completedDays.includes(challenge.day)?'Ôn lại 10 từ hôm nay':'Ghép 10 từ hôm nay'}</Text></Pressable>
            <Pressable disabled={!snapshot||snapshot.state.keys<4||loading} onPress={()=>{void exchange();}} style={[s.button,(!snapshot||snapshot.state.keys<4||loading)&&s.disabled]}><Text style={s.buttonText}>Đổi 4 chìa khóa → 1 vé vàng</Text></Pressable>
            <Text style={s.copy}>Một vé mở một đề gốc trong 7 ngày, được làm lại trong thời hạn. Đề app tự soạn thuộc Premium 3.000¥/tháng.</Text>
            <Pressable onPress={()=>{void refresh();}} style={s.button}><Text style={s.buttonText}>Đồng bộ lại</Text></Pressable>
        </View>}
        {!!status&&<Text accessibilityLiveRegion="polite" style={s.status}>{playing?(practice?'Luyện tập · chưa cấp thưởng':'Tiến độ đã lưu; đồng bộ khi trực tuyến'):status}</Text>}
    </SafeAreaView>;
}
const s=StyleSheet.create({page:{flex:1,paddingHorizontal:12,paddingBottom:6,backgroundColor:'#f5eedf',gap:6},header:{flexDirection:'row',alignItems:'center',gap:12,height:57},back:{fontSize:32,color:'#172b43',paddingHorizontal:8},title:{fontSize:19,fontWeight:'700',color:'#172b43'},note:{fontSize:12,color:'#66552e'},overview:{flex:1,gap:18,justifyContent:'center',padding:12},copy:{fontSize:16,lineHeight:23,color:'#273e51'},wallet:{flexDirection:'row',justifyContent:'space-between'},count:{fontSize:19,fontWeight:'700',color:'#72501f'},button:{padding:14,borderRadius:12,backgroundColor:'#e5c77d',alignItems:'center'},buttonText:{color:'#172b43',fontSize:16,fontWeight:'700'},disabled:{opacity:.45},status:{fontSize:12,lineHeight:16,color:'#744326',paddingVertical:4}});
