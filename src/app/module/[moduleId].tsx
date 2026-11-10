import {createDeferredRoute} from '@/components/app/createDeferredRoute';
export default createDeferredRoute(()=>import('@/screens/on-demand/module/[moduleId]').then(module=>module.default));
