import {useAppLanguage} from '@/context/LanguageContext';
import {profileText,type ProfileCopyKey} from '@/i18n/profile-release-copy';
import {RELEASE_FEATURES} from '@/config/release-features';
import { useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import SafeAreaView from '@/components/ui/StableSafeAreaView';
import { RoyalBackButton, ROYAL_LAYOUT } from '@/components/ui/RoyalSurface';
import { backPrepared, replacePrepared } from '@/components/ui/prepareSceneRoute';
import { type EconomyAccount } from '@/economy/client';
import { ECONOMY_POLICY } from '@/economy/policy';

export default function EconomyScreen() {
  const {language}=useAppLanguage(),t=(key:ProfileCopyKey)=>profileText(language,key);
  const [account,setAccount] = useState<EconomyAccount | null>(null);
  const [status,setStatus] = useState<ProfileCopyKey>('notConnected');
  const [loading,setLoading] = useState(false);
  const refresh = async () => {
    const endpoint = process.env.EXPO_PUBLIC_ECONOMY_API_URL;
    // No auth integration yet. Never expose a shared secret or hard-coded bearer token.
    if (!endpoint) { setStatus('notConfigured'); return; }
    setStatus('authUnavailable');
    setAccount(null);
  };
  return <SafeAreaView style={styles.screen} edges={['top','right','bottom','left']}>
    <View style={styles.header}>
      <RoyalBackButton onPress={() => { if (router.canGoBack()) void backPrepared(); else void replacePrepared('/home'); }} />
      <Text accessibilityRole="header" style={styles.heading}>{t('wallet')}</Text>
    </View>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.page}>
    <Text style={styles.description}>{RELEASE_FEATURES.freeLearning?t('freeInfo'):profileText(language,'monthly',{price:ECONOMY_POLICY.premiumMonthlyYen})}</Text>
    <View style={styles.panel}><Text style={styles.label}>{t('status')}</Text><Text style={styles.value}>{t(account?.premiumVerified?'verified':'unverified')}</Text><Text style={styles.label}>{t('available')}</Text><Text style={styles.value}>{account?.availablePoints ?? '—'}</Text><Text style={styles.label}>{t('held')}</Text><Text style={styles.value}>{account?.heldPoints ?? '—'}</Text></View>
    <Text style={styles.description}>{t(status)}</Text>
    <Pressable accessibilityRole="button" onPress={() => {setLoading(true);void refresh().finally(()=>setLoading(false));}} style={styles.button}><Text style={styles.buttonText}>{t('refresh')}</Text></Pressable>
    {loading && <ActivityIndicator />}
    <Text style={styles.note}>{t('notActive')}</Text>
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  screen:{flex:1,backgroundColor:'#101827'},
  // Match the shared Tokutei header: title wrapping must never move Back.
  header:{width:'100%',maxWidth:932,alignSelf:'center',paddingHorizontal:ROYAL_LAYOUT.screenGutter,paddingTop:ROYAL_LAYOUT.backSafeTop,paddingBottom:8,flexDirection:'row',alignItems:'flex-start',gap:8},
  scroll:{flex:1},
  page:{flexGrow:1,width:'100%',maxWidth:720,alignSelf:'center',paddingHorizontal:20,paddingTop:8,paddingBottom:24,gap:16},
  heading:{flex:1,minWidth:0,flexShrink:1,fontSize:24,color:'#f6d990',fontWeight:'700'},
  description:{color:'#d9e0ed',lineHeight:22,flexShrink:1},
  panel:{width:'100%',backgroundColor:'#243044',padding:20,borderRadius:16,gap:9},
  label:{color:'#b5c3d8'},value:{color:'#fff',fontSize:21,fontWeight:'600',flexShrink:1},
  button:{backgroundColor:'#c5a45a',padding:14,minHeight:48,borderRadius:12,alignItems:'center',justifyContent:'center'},
  buttonText:{fontWeight:'700',color:'#121212',textAlign:'center',flexShrink:1},
  note:{color:'#e9cba2',fontSize:12,lineHeight:18,flexShrink:1},
});
