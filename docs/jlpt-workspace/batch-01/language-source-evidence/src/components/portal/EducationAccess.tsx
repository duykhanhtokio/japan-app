import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

export function EducationAccess() {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [form, setForm] = useState({ school: '', address: '', phone: '', email: '', manager: '' });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const complete = Object.values(form).every((value) => value.trim().length > 0);
  const submit = () => mode === 'register' ? router.push('/portal/education/payment') : router.push('/portal/education/welcome?mode=login');

  return <View style={styles.screen}><SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <RoyalBackButton onPress={() => router.back()} />
    <Text style={styles.title}>日本語教育機関</Text><Text style={styles.subtitle}>教育管理サービスを利用する機関情報を入力してください</Text>
    <View style={styles.tabs}><Pressable onPress={() => setMode('register')} style={[styles.tab, mode === 'register' && styles.tabActive]}><Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>新規登録</Text></Pressable><Pressable onPress={() => setMode('login')} style={[styles.tab, mode === 'login' && styles.tabActive]}><Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>ログイン</Text></Pressable></View>
    <View style={styles.form}>{[
      ['school', '教育機関名', '例：さくら日本語学校'], ['address', '所在地', '例：東京都新宿区〇〇1-2-3'],
      ['phone', '電話番号', '例：03-1234-5678'], ['email', '連絡用メールアドレス', '例：school@example.jp'], ['manager', '担当者氏名', '例：山田 花子'],
    ].map(([key, label, placeholder]) => <View key={key} style={styles.field}><Text style={styles.label}>{label}<Text style={styles.required}> 必須</Text></Text><TextInput value={form[key as keyof typeof form]} onChangeText={(value) => update(key as keyof typeof form, value)} placeholder={placeholder} placeholderTextColor="#98a8ae" keyboardType={key === 'phone' ? 'phone-pad' : key === 'email' ? 'email-address' : 'default'} autoCapitalize={key === 'email' ? 'none' : 'sentences'} style={styles.input} /></View>)}
      {mode === 'login' ? <View style={styles.loginHint}><Text style={styles.loginHintText}>登録済みの教育機関情報と照合してログインします。</Text></View> : <Text style={styles.agreement}>登録を続けることで、法人利用規約と個人情報保護方針に同意したものとみなされます。</Text>}
      <Pressable disabled={!complete} onPress={submit} style={[styles.submit, !complete && styles.submitDisabled]}><Text style={styles.submitText}>{mode === 'register' ? '登録して料金確認へ' : 'ログイン'}</Text><Text style={styles.submitArrow}>›</Text></Pressable>
    </View>
  </ScrollView></KeyboardAvoidingView></SafeAreaView></View>;
}

const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#edf7fa'},safe:{flex:1},content:{flexGrow:1,width:'100%',maxWidth:620,alignSelf:'center',padding:14,paddingBottom:18},back:{alignSelf:'flex-start',minHeight:38,justifyContent:'center'},backText:{color:'#3e7184',fontSize:14,fontWeight:'900'},title:{marginTop:5,color:'#153f52',fontSize:27,lineHeight:33,fontWeight:'900',textAlign:'center'},subtitle:{marginTop:4,color:'#647d88',fontSize:13,lineHeight:18,fontWeight:'700',textAlign:'center'},tabs:{marginTop:11,padding:4,flexDirection:'row',borderRadius:15,backgroundColor:'#dcebef'},tab:{minHeight:40,flex:1,borderRadius:11,alignItems:'center',justifyContent:'center'},tabActive:{backgroundColor:'#e8e2d6'},tabText:{color:'#718791',fontSize:15,fontWeight:'900'},tabTextActive:{color:'#267b9d'},form:{marginTop:8,padding:14,borderRadius:22,borderBottomWidth:6,borderBottomColor:'#b8d4df',backgroundColor:'#e8e2d6'},field:{marginBottom:9},label:{marginBottom:4,color:'#274c5c',fontSize:15,fontWeight:'900'},required:{color:'#c65366',fontSize:12},input:{height:47,paddingHorizontal:13,borderRadius:12,borderWidth:1.5,borderColor:'#cbdce2',color:'#244958',backgroundColor:'#fbfdfe',fontSize:15,fontWeight:'700'},agreement:{color:'#657b84',fontSize:11,lineHeight:16,fontWeight:'700'},loginHint:{padding:10,borderRadius:10,backgroundColor:'#eef7fa'},loginHintText:{color:'#527381',fontSize:12,fontWeight:'700'},submit:{minHeight:52,marginTop:10,paddingHorizontal:17,flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:15,borderBottomWidth:5,borderBottomColor:'#1f7395',backgroundColor:'#42a6cc'},submitDisabled:{borderBottomColor:'#9badb4',backgroundColor:'#bdcbd0'},submitText:{color:'#fff',fontSize:17,fontWeight:'900'},submitArrow:{position:'absolute',right:18,color:'#fff',fontSize:27},
});
