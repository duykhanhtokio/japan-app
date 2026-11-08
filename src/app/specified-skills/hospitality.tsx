import {createTokuteiEntry} from '@/components/tokutei/createTokuteiEntry';
export default createTokuteiEntry({titleKey:'hospitality',kind:'hotel'},()=>import('@/components/hospitality/HospitalityCourse').then(module=>module.HospitalityCourse));
