import {createDeferredRoute} from '@/components/app/createDeferredRoute';
export default createDeferredRoute(()=>import('@/screens/on-demand/world/dialogue-history/[scenarioId]').then(module=>module.default));
