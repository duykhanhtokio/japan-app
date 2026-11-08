import {createTokuteiEntry} from '@/components/tokutei/createTokuteiEntry';
export default createTokuteiEntry({titleKey:'foodManufacturing',kind:'level'},()=>import('@/components/food-manufacturing/FoodManufacturingCourse').then(module=>module.FoodManufacturingCourse));
