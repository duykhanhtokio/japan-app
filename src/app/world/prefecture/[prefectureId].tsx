import {createDeferredRoute} from '@/components/app/createDeferredRoute';
export default createDeferredRoute(()=>import('@/screens/on-demand/world/prefecture/[prefectureId]').then(module=>module.default));
