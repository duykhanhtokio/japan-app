import type {Specialty,ManufacturingQuestion} from './index';
import type {ManufacturingMock} from '@/services/manufacturing-mock-state';
import type {QuestionTranslation} from './translations';
import {referenceManufacturingMocks} from './reference-practice';

export function loadManufacturingMocks(specialty:Specialty):ManufacturingMock[]{
 let original:ManufacturingMock[];
 switch(specialty){case 'mechanical':original=require('./mocks/mechanical.json').exams;break;case 'electrical':original=require('./mocks/electrical.json').exams;break;case 'surface':original=require('./mocks/surface.json').exams;break;}
 return [...original,...referenceManufacturingMocks(specialty,original)];
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
