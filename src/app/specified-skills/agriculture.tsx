import {createTokuteiEntry} from '@/components/tokutei/createTokuteiEntry';
export default createTokuteiEntry({titleKey:'agriculture',kind:'level'},()=>import('@/components/agriculture/AgricultureCourse').then(module=>module.AgricultureCourse));
