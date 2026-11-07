// Each bundled locale is parsed only when requested; no network translation dependency.
export type AgricultureTranslation = {sourceHash:string;title:string;objective:string;paragraphs:Record<string,string>;paragraphTitles:Record<string,string>;activity:string};
type LocaleEntries=Record<string,AgricultureTranslation>;
const loaders:Record<string,()=>LocaleEntries> = {
 'vi':()=>require('./translations/vi.json') as LocaleEntries,
 'en':()=>require('./translations/en.json') as LocaleEntries,
 'id':()=>require('./translations/id.json') as LocaleEntries,
 'zh-CN':()=>require('./translations/zh-CN.json') as LocaleEntries,
 'zh-TW':()=>require('./translations/zh-TW.json') as LocaleEntries,
 'hi':()=>require('./translations/hi.json') as LocaleEntries,
 'bn':()=>require('./translations/bn.json') as LocaleEntries,
 'ne':()=>require('./translations/ne.json') as LocaleEntries,
 'my':()=>require('./translations/my.json') as LocaleEntries,
 'th':()=>require('./translations/th.json') as LocaleEntries,
 'km':()=>require('./translations/km.json') as LocaleEntries,
 'tl':()=>require('./translations/tl.json') as LocaleEntries,
};
export function agricultureLocaleTranslations(locale:string):LocaleEntries|null {return loaders[locale]?.()??null;}
