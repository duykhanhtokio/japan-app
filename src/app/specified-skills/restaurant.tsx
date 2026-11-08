import {createTokuteiEntry} from '@/components/tokutei/createTokuteiEntry';
export default createTokuteiEntry({titleKey:'restaurant',kind:'level'},()=>import('@/components/restaurant/RestaurantCourse').then(module=>module.RestaurantCourse));
