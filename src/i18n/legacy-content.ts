import type { AppLanguageCode } from './languages';
import pack_en from './legacy-content-translations/en.json';
import profile_en from './legacy-content-translations/profile.en.json';
import pack_id from './legacy-content-translations/id.json';
import profile_id from './legacy-content-translations/profile.id.json';
import pack_zh_CN from './legacy-content-translations/zh-CN.json';
import profile_zh_CN from './legacy-content-translations/profile.zh-CN.json';
import pack_zh_TW from './legacy-content-translations/zh-TW.json';
import profile_zh_TW from './legacy-content-translations/profile.zh-TW.json';
import pack_hi from './legacy-content-translations/hi.json';
import profile_hi from './legacy-content-translations/profile.hi.json';
import pack_bn from './legacy-content-translations/bn.json';
import profile_bn from './legacy-content-translations/profile.bn.json';
import pack_ne from './legacy-content-translations/ne.json';
import profile_ne from './legacy-content-translations/profile.ne.json';
import pack_my from './legacy-content-translations/my.json';
import profile_my from './legacy-content-translations/profile.my.json';
import pack_th from './legacy-content-translations/th.json';
import profile_th from './legacy-content-translations/profile.th.json';
import pack_km from './legacy-content-translations/km.json';
import profile_km from './legacy-content-translations/profile.km.json';
import pack_tl from './legacy-content-translations/tl.json';
import profile_tl from './legacy-content-translations/profile.tl.json';

type Entry = {sourceJa:string;sourceVi:string;recordId:string;field:string;translation:string};
type Pack = {language:string;entries:Record<string,Entry>};
const packs:Pack[] = [pack_en,profile_en,pack_id,profile_id,pack_zh_CN,profile_zh_CN,pack_zh_TW,profile_zh_TW,pack_hi,profile_hi,pack_bn,profile_bn,pack_ne,profile_ne,pack_my,profile_my,pack_th,profile_th,pack_km,profile_km,pack_tl,profile_tl];
const exact = new Map<string, string | null>();
const byId = new Map<string, Entry>();
for (const pack of packs) for (const entry of Object.values(pack.entries)) {
 byId.set(JSON.stringify([pack.language,entry.recordId,entry.field]),entry);
 const key = JSON.stringify([pack.language, entry.field, entry.sourceJa, entry.sourceVi]);
 const previous = exact.get(key);
 // Conflicting copies of the same authored source never choose arbitrarily.
 exact.set(key, previous === undefined || previous === entry.translation ? entry.translation : null);
}
export function authoredLegacyTranslation(language:AppLanguageCode, record:Record<string,unknown>, field:string) {
 const ja = record[field+'Ja'] ?? (field==='meaning' ? record.expression : undefined);
 const vi = record[field+'Vi'];
 if (typeof ja !== 'string' || typeof vi !== 'string') return undefined;
 const bound=byId.get(JSON.stringify([language,record.id,field]));
 if(bound?.sourceJa===ja && bound.sourceVi===vi)return bound.translation;
 return exact.get(JSON.stringify([language,field,ja,vi])) ?? undefined;
}
