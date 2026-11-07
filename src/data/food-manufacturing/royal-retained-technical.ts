import type {FoodManufacturingLesson} from './index';
import diagrams from './diagrams.json';
import {foodManagementVisualsFor} from './management-visuals';
type RetainedTechnical={lessonId:string;sourceHash:string;captionParagraphId:string;managementIds:string[];conceptIds:string[]};
/** Exact technical figures already rendered in the same scheduled Reader; never replace their data with decorative art. */
export const foodRoyalRetainedTechnical:RetainedTechnical[]=[
 {lessonId:'food-2-019',sourceHash:'700a08ae7d111ef125c231f79d2a6eb970ec8af2f37c69038a7629881de92eac',captionParagraphId:'p1',managementIds:[],conceptIds:['food-traceability']},
 {lessonId:'food-2-020',sourceHash:'68eb7d1570463064138b908fccca94ad27a53825a394c270c154d7dccacbf599',captionParagraphId:'p1',managementIds:['food-management-mean-range'],conceptIds:[]},
 {lessonId:'food-2-021',sourceHash:'ade1274e1f97c56590f312f3131d51e3452b917fb7e8d399d093b9c7fd82b74f',captionParagraphId:'p1',managementIds:['food-management-pareto','food-management-histogram','food-management-scatter','food-management-control'],conceptIds:[]},
 {lessonId:'food-2-023',sourceHash:'83530fd2c373cd0b8af1d5bd9acdc0dde8197e5fba82869f10a6534c8b20483e',captionParagraphId:'p1',managementIds:['food-management-productivity'],conceptIds:['food-productivity']},
 {lessonId:'food-2-024',sourceHash:'032776413fb9cc8dd9f743f2ee231de44aec547a93f36bd4b47c8fa1b46936a8',captionParagraphId:'p2',managementIds:['food-management-progress'],conceptIds:[]},
];
export function foodRoyalRetainedTechnicalFor(lesson:FoodManufacturingLesson){
 const binding=foodRoyalRetainedTechnical.find(b=>b.lessonId===lesson.id&&b.sourceHash===lesson.sourceHash&&lesson.paragraphs.some(p=>p.id===b.captionParagraphId));
 if(!binding)return undefined;
 const management=foodManagementVisualsFor(lesson);
 if(!binding.managementIds.every(id=>management.some(figure=>figure.id===id)))return undefined;
 if(!binding.conceptIds.every(id=>diagrams.diagrams.some(figure=>figure.id===id&&figure.lessonIds.includes(lesson.id as never))))return undefined;
 return binding;
}
