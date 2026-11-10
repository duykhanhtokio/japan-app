import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppLanguageCode } from '@/i18n/languages';
import type { Challenge, DailyWord, Match, Level } from './types';
import { dayAt, selectWords } from './core.mjs';
/** Practice only. Local time and local completion can never mint keys or exam rights. */
export async function loadPractice(locale:AppLanguageCode):Promise<{challenge:Challenge;attempts:Match[]}> {
    const raw=await AsyncStorage.getItem('@japan_app_user_profile');const profile=raw?JSON.parse(raw):{};
    const level=(['N5','N4','N3','N2','N1'].includes(profile.level)?profile.level:'N5') as Level;
    const key=`@daily-practice:${profile.createdAt??''}:${profile.email??''}:${dayAt(Date.now())}`;
    const saved=await AsyncStorage.getItem(key);if(saved)return JSON.parse(saved);
    const [source,localization]=await Promise.all([import('@/data/generated/vocabulary.json'),import('@/data/vocabulary-localization')]);
    const words=(source.default as any[]).map(item=>{
        const word=localization.localizeVocabulary(item);
        return {id:word.id,word:word.word,reading:word.reading,meaning:localization.getVocabularyMeaning(word,locale),level:word.jlpt,status:word.status} as DailyWord;
    });
    const challenge:Challenge={day:dayAt(Date.now()),locale,level,words:selectWords(words,{level,learned:[],mistakes:{}},dayAt(Date.now()),locale),matched:[],attempts:[]};
    const result={challenge,attempts:[]};await AsyncStorage.setItem(key,JSON.stringify(result));return result;
}
export async function savePractice(challenge:Challenge,attempts:Match[]) {
    const raw=await AsyncStorage.getItem('@japan_app_user_profile');const profile=raw?JSON.parse(raw):{};
    await AsyncStorage.setItem(`@daily-practice:${profile.createdAt??''}:${profile.email??''}:${challenge.day}`,JSON.stringify({challenge,attempts}));
}
