import {createTokuteiEntry} from '@/components/tokutei/createTokuteiEntry';
export default createTokuteiEntry({titleKey:'industrialManufacturing',kind:'specialty',choices:[{"id":"mechanical","title":"機械金属加工"},{"id":"electrical","title":"電気電子機器組立て"},{"id":"surface","title":"金属表面処理"}]},()=>import('@/components/manufacturing/ManufacturingCourse').then(module=>module.ManufacturingCourse));
