// Direct Japanese translations, organized by selected locale. Data completeness is checked separately.
import locale0 from './translations/vi.json';
import locale1 from './translations/en.json';
import locale2 from './translations/id.json';
import locale3 from './translations/zh-CN.json';
import locale4 from './translations/zh-TW.json';
import locale5 from './translations/hi.json';
import locale6 from './translations/bn.json';
import locale7 from './translations/ne.json';
import locale8 from './translations/my.json';
import locale9 from './translations/th.json';
import locale10 from './translations/km.json';
import locale11 from './translations/tl.json';
export type AgricultureTranslation = {sourceHash:string;title:string;objective:string;paragraphs:Record<string,string>;paragraphTitles:Record<string,string>;activity:string};
const locales:Record<string,Record<string,AgricultureTranslation>> = {'vi':locale0,'en':locale1,'id':locale2,'zh-CN':locale3,'zh-TW':locale4,'hi':locale5,'bn':locale6,'ne':locale7,'my':locale8,'th':locale9,'km':locale10,'tl':locale11};
export default {locales};
