import type {ComponentType} from 'react';
import {createDeferredCourse} from '@/components/tokutei/createDeferredCourse';
import {backPrepared} from '@/components/ui/prepareSceneRoute';

/** Router discovery imports this shell; content is evaluated only on mounting. */
export function createDeferredRoute(load:()=>Promise<ComponentType<{onBack?:()=>void}>>) {
 const Screen=createDeferredCourse(load);
 return function DeferredRoute(){return <Screen onBack={()=>{void backPrepared();}}/>;};
}
