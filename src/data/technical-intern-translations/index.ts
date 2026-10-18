import type {
    AppLanguageCode,
} from '@/i18n/languages';

import {
    viTechnicalInternTranslations,
} from './vi';

export type TechnicalInternTranslationDictionary =
    Record<string, string>;

export const technicalInternJobTranslations:
    Partial<
        Record<
            AppLanguageCode,
            TechnicalInternTranslationDictionary
        >
    > = {
    vi:
        viTechnicalInternTranslations,
};
import pack_en from './generated/en.json';
import pack_id from './generated/id.json';
import pack_zh_CN from './generated/zh-CN.json';
import pack_zh_TW from './generated/zh-TW.json';
import pack_hi from './generated/hi.json';
import pack_bn from './generated/bn.json';
import pack_ne from './generated/ne.json';
import pack_my from './generated/my.json';
import pack_th from './generated/th.json';
import pack_km from './generated/km.json';
import pack_tl from './generated/tl.json';

type BoundEntry={sourceJa:string;translation:string};
const boundPacks:Partial<Record<AppLanguageCode,{entries:Record<string,BoundEntry>}>>={'en':pack_en,'id':pack_id,'zh-CN':pack_zh_CN,'zh-TW':pack_zh_TW,'hi':pack_hi,'bn':pack_bn,'ne':pack_ne,'my':pack_my,'th':pack_th,'km':pack_km,'tl':pack_tl};
for(const [language,pack] of Object.entries(boundPacks)) {
 technicalInternJobTranslations[language as AppLanguageCode] = Object.fromEntries(
  Object.entries(pack.entries).map(([id,entry])=>[id,entry.translation]));
}
/** The active Japanese name, ID and selected locale must all match. */
export function getTechnicalInternJobTranslation(key:string, language:AppLanguageCode, sourceJa:string) {
 if(language==='ja')return sourceJa;
 if(language==='vi')return viTechnicalInternTranslations[key];
 const entry=boundPacks[language]?.entries[key];
 return entry?.sourceJa===sourceJa && entry.translation.trim() ? entry.translation : undefined;
}
