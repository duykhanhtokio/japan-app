import pack from './ruby/weekly-first.json';
import rest from './ruby/weekly-rest.json';
import {hasAlignedRuby} from '@/components/world/japanese-ruby-data';
import type {RubySegment} from '@/types/japanese-ruby';
import type {FoodManufacturingQuestion} from './index';

type Entry={sourceHash:string;fields:Record<string,RubySegment[]>};
const readings:Record<string,Entry>=Object.assign({},pack.questions,rest.questions);
/** Explicit offline readings; stale or incomplete fields fall back to canonical Japanese. */
export function foodManufacturingQuestionRuby(question:FoodManufacturingQuestion,field:string,text:string):RubySegment[]|undefined {
 const entry=readings[question.id];
 if(!entry||entry.sourceHash!==question.sourceHash)return undefined;
 const segments=entry.fields[field];
 if(!hasAlignedRuby(text,segments)||segments.some(part=>/\p{Script=Han}/u.test(part.text)&&!part.reading))return undefined;
 return segments;
}
