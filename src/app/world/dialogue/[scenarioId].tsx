import {createDeferredRoute} from '@/components/app/createDeferredRoute';
export default createDeferredRoute(()=>import('@/screens/on-demand/world/dialogue/[scenarioId]').then(module=>module.default));
