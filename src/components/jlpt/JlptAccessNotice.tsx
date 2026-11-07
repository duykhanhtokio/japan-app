import { Pressable, StyleSheet, Text, View } from 'react-native';
export default function JlptAccessNotice({text,onRetry}:{text:string;onRetry:()=>void}) {
    return <View style={s.row}><Text style={s.copy}>{text}</Text><Pressable accessibilityRole="button" onPress={onRetry} style={s.button}><Text style={s.label}>Đồng bộ quyền thi</Text></Pressable></View>;
}
const s=StyleSheet.create({row:{gap:8,marginBottom:14},copy:{color:'#6b512f',fontSize:14,lineHeight:20},button:{borderWidth:1,borderColor:'#b9a26d',padding:10,borderRadius:8,alignSelf:'flex-start'},label:{color:'#23384d',fontSize:14}});
