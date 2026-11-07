import type {FoodManufacturingLesson} from './index';
import diagrams from './diagrams.json';
import bindings from './concept-source-bindings.json';
/** Concepts must use the actual Reader lesson's pinned revision and complete teaching context. */
export function foodConceptDiagramsFor(lesson:FoodManufacturingLesson){
 return diagrams.diagrams.filter(diagram=>diagram.lessonIds.includes(lesson.id as never)&&bindings.bindings.some(binding=>binding.diagramId===diagram.id&&binding.lessonId===lesson.id&&binding.sourceHash===lesson.sourceHash&&binding.requiredParagraphIds.every(id=>lesson.paragraphs.some(p=>p.id===id&&p.titleJa.trim().length>0&&p.textJa.trim().length>0))));
}
