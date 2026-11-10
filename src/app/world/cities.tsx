import {createDeferredRoute} from '@/components/app/createDeferredRoute';
export default createDeferredRoute(()=>import('@/screens/on-demand/world/cities').then(module=>module.default));
