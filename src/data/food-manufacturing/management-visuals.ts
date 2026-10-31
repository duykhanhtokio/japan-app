import type {FoodManufacturingLesson} from './index';
export type FoodManagementVisualKind='mean-range'|'pareto'|'histogram'|'scatter'|'control'|'productivity'|'progress';
export type FoodManagementVisual={id:string;lessonId:string;sourceHash:string;captionField:string;kind:FoodManagementVisualKind;status:'authored_ai_unreviewed'};
/** Independently drawn teaching figures. Numeric data are hypothetical, never workplace limits. */
export const foodManagementVisuals:FoodManagementVisual[]=[
 {id:'food-management-mean-range',lessonId:'food-2-020',sourceHash:'68eb7d1570463064138b908fccca94ad27a53825a394c270c154d7dccacbf599',captionField:'paragraphs.p2',kind:'mean-range',status:'authored_ai_unreviewed'},
 {id:'food-management-pareto',lessonId:'food-2-021',sourceHash:'ade1274e1f97c56590f312f3131d51e3452b917fb7e8d399d093b9c7fd82b74f',captionField:'activityJa',kind:'pareto',status:'authored_ai_unreviewed'},
 {id:'food-management-histogram',lessonId:'food-2-021',sourceHash:'ade1274e1f97c56590f312f3131d51e3452b917fb7e8d399d093b9c7fd82b74f',captionField:'paragraphs.p2',kind:'histogram',status:'authored_ai_unreviewed'},
 {id:'food-management-scatter',lessonId:'food-2-021',sourceHash:'ade1274e1f97c56590f312f3131d51e3452b917fb7e8d399d093b9c7fd82b74f',captionField:'paragraphs.p2',kind:'scatter',status:'authored_ai_unreviewed'},
 {id:'food-management-control',lessonId:'food-2-021',sourceHash:'ade1274e1f97c56590f312f3131d51e3452b917fb7e8d399d093b9c7fd82b74f',captionField:'paragraphs.p3',kind:'control',status:'authored_ai_unreviewed'},
 {id:'food-management-productivity',lessonId:'food-2-023',sourceHash:'83530fd2c373cd0b8af1d5bd9acdc0dde8197e5fba82869f10a6534c8b20483e',captionField:'activityJa',kind:'productivity',status:'authored_ai_unreviewed'},
 {id:'food-management-progress',lessonId:'food-2-024',sourceHash:'032776413fb9cc8dd9f743f2ee231de44aec547a93f36bd4b47c8fa1b46936a8',captionField:'activityJa',kind:'progress',status:'authored_ai_unreviewed'},
];
export const foodManagementTeachingData={
 meanRange:{A:[20,21,22],B:[18,21,24],unit:'g'},
 pareto:{labels:['包装','重量','汚れ'],counts:[12,8,5]},
 histogram:{values:[18.2,18.7,19.4,20.1,20.4,20.8,21.3,21.6,22.1,22.4,22.8,23.2],boundaries:[18,20,22,24],unit:'g'},
 scatter:{points:[[1,2],[2,1],[3,4],[4,3],[5,6],[6,5]]},
 control:{values:[10,10.4,9.8,10.1,10.3,10.2,10.4,11.8],center:10,lower:9,upper:11},
 productivity:{standard:{people:3,hours:2,outputKg:180},actual:{people:4,hours:2,outputKg:200}},
 progress:{actualKg:[80,85,75,50],planKg:[70,70,70,70]},
};
export function foodManagementVisualsFor(lesson:FoodManufacturingLesson){return foodManagementVisuals.filter(v=>v.lessonId===lesson.id&&v.sourceHash===lesson.sourceHash);}
