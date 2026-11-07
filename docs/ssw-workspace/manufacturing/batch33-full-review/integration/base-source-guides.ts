import data from './source-guides.json';
import type {ManufacturingLesson,Specialty} from './index';
import type {LessonTranslation} from './translations';
export function manufacturingSourceGuides(specialty:Specialty):ManufacturingLesson[]{return (data.guides as ManufacturingLesson[]).filter(item=>item.specialty===specialty);}
export function manufacturingSourceGuidesLabel(locale:string):string{const labels:Record<string,string>=require('./source-guide-translations.json').uiLabels;return labels[locale]??data.uiLabelJa;}
export function manufacturingSourceGuideTranslation(lesson:ManufacturingLesson,locale:string):LessonTranslation|null{const entries:Record<string,Record<string,LessonTranslation>>=require('./source-guide-translations.json').locales,item=entries[locale]?.[lesson.id];return item?.sourceHash===lesson.sourceHash?item:null;}
