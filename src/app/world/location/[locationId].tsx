import {createDeferredRoute} from '@/components/app/createDeferredRoute';
export default createDeferredRoute(()=>import('@/screens/on-demand/world/location/[locationId]').then(module=>module.default));
