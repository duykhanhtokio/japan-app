import {createDeferredRoute} from '@/components/app/createDeferredRoute';
export default createDeferredRoute(()=>import('@/screens/on-demand/[level]/vocabulary/[wordId]').then(module=>module.default));
