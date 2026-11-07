import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

/** Display only after a confirmed transaction; presentation cannot alter balances. */
export default function RewardNotice({reward,onClose}:{reward:'key'|'ticket'|null;onClose:()=>void}) {
    const value=useRef(new Animated.Value(0)).current;
    useEffect(()=>{
        if(!reward)return;let active=true;value.setValue(0);
        void AccessibilityInfo.isReduceMotionEnabled().then(reduced=>{if(!active)return;if(reduced)value.setValue(1);else Animated.spring(value,{toValue:1,useNativeDriver:true,damping:12,stiffness:120}).start();});
        return()=>{active=false;value.stopAnimation();};
    },[reward,value]);
    return <Modal visible={!!reward} transparent animationType="none" onRequestClose={onClose}><View style={s.backdrop}><Animated.View style={[s.panel,{opacity:value,transform:[{scale:value.interpolate({inputRange:[0,1],outputRange:[.75,1]})}]}]}>
        <Text style={s.heading}>{reward==='key'?'Đã nhận 1 chìa khóa':'Đã nhận 1 vé vàng'}</Text>
        {reward==='key'?<Image source={require('../../assets/app/ui/royal-af/mission-key-v1.png')} resizeMode="contain" style={s.key}/>:<View style={s.ticket}><Text style={s.ticketText}>JLPT · GOLDEN TICKET</Text><Text style={s.copy}>1 đề gốc · 7 ngày</Text></View>}
        <Text style={s.copy}>{reward==='key'?'Cảm ơn bạn đã hoàn thành 7 ngày học. Gom 4 chìa khóa để đổi 1 vé vàng.':'Vé chỉ bắt đầu tính hạn 7 ngày sau khi bạn dùng để mở một đề gốc.'}</Text>
        <Pressable accessibilityRole="button" style={s.button} onPress={onClose}><Text style={s.buttonText}>Tiếp tục</Text></Pressable>
    </Animated.View></View></Modal>;
}
const s=StyleSheet.create({backdrop:{flex:1,backgroundColor:'#07101fe8',alignItems:'center',justifyContent:'center',padding:24},panel:{maxWidth:420,width:'100%',backgroundColor:'#142847',borderWidth:2,borderColor:'#cba55a',borderRadius:18,padding:24,gap:18,alignItems:'center'},heading:{color:'#f2db9b',fontSize:23,fontWeight:'700',textAlign:'center'},key:{width:160,height:160},ticket:{padding:20,borderWidth:2,borderColor:'#f2db9b',borderRadius:10,gap:10},ticketText:{color:'#f2db9b',fontSize:18,fontWeight:'700',textAlign:'center'},copy:{color:'#fffdf7',fontSize:16,lineHeight:24,textAlign:'center'},button:{padding:14,backgroundColor:'#e5c77d',borderRadius:10,width:'100%',alignItems:'center'},buttonText:{fontSize:16,color:'#172b43',fontWeight:'700'}});
