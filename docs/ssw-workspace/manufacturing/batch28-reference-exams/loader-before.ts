import type {Specialty,ManufacturingQuestion} from './index';
import type {ManufacturingMock} from '@/services/manufacturing-mock-state';
import type {QuestionTranslation} from './translations';

export function loadManufacturingMocks(specialty:Specialty):ManufacturingMock[]{
 switch(specialty){case 'mechanical':return require('./mocks/mechanical.json').exams;case 'electrical':return require('./mocks/electrical.json').exams;case 'surface':return require('./mocks/surface.json').exams;}
}
export function manufacturingMockTranslation(question:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 const entries=require('./mock-translations.json').locales[locale] as Record<string,QuestionTranslation>|undefined;
 const entry=entries?.[question.id];return entry?.sourceHash===question.sourceHash?entry:null;
}
export type MockRuby={text:string;reading?:string};
export function manufacturingMockRuby(question:ManufacturingQuestion,field:'stem'|number):MockRuby[]|null{
 const entry=require('./mock-furigana.json').questions[question.id];if(entry?.sourceHash!==question.sourceHash)return null;
 const text=field==='stem'?question.stemJa:question.optionsJa[field],parts=field==='stem'?entry.stem:entry.options[field];
 return Array.isArray(parts)&&parts.every((p:MockRuby)=>typeof p.text==='string'&&(!p.reading||typeof p.reading==='string'))&&parts.map((p:MockRuby)=>p.text).join('')===text?parts:null;
}
