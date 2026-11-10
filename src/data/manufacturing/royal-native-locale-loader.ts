// Literal require branches keep inactive native locales out of the evaluated lesson route.
export type ManufacturingRoyalNativeLocale={labels:Record<string,string>;lessons:Record<string,{sourceHash:string;title:string;exampleTitle:string;exampleText:string;structureTitle?:string;structureText?:string}>};
export function manufacturingRoyalNativeLocale(language:string):{language:string;data:ManufacturingRoyalNativeLocale}{switch(language){
 case 'ja':return {language:'ja',data:require('./royal-native-locales/ja.json')};
 case 'en':return {language:'en',data:require('./royal-native-locales/en.json')};
 case 'vi':return {language:'vi',data:require('./royal-native-locales/vi.json')};
 case 'id':return {language:'id',data:require('./royal-native-locales/id.json')};
 case 'zh-CN':return {language:'zh-CN',data:require('./royal-native-locales/zh-CN.json')};
 case 'zh-TW':return {language:'zh-TW',data:require('./royal-native-locales/zh-TW.json')};
 case 'hi':return {language:'hi',data:require('./royal-native-locales/hi.json')};
 case 'bn':return {language:'bn',data:require('./royal-native-locales/bn.json')};
 case 'ne':return {language:'ne',data:require('./royal-native-locales/ne.json')};
 case 'my':return {language:'my',data:require('./royal-native-locales/my.json')};
 case 'th':return {language:'th',data:require('./royal-native-locales/th.json')};
 case 'km':return {language:'km',data:require('./royal-native-locales/km.json')};
 case 'tl':return {language:'tl',data:require('./royal-native-locales/tl.json')};
 default:return {language:'ja',data:require('./royal-native-locales/ja.json')};
}}
