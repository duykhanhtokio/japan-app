import {createTokuteiEntry} from '@/components/tokutei/createTokuteiEntry';
export default createTokuteiEntry({titleKey:'construction',kind:'construction',choices:[{id:'utilities',title:'ライフライン・設備'},{id:'building',title:'建築'},{id:'civil',title:'土木'}]},()=>import('@/components/kensetsu/KensetsuCourse').then(module=>module.KensetsuCourse));
