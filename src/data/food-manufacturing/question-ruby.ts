import {supplementalQuestionRuby} from './supplemental';
import pack from './ruby/weekly-first.json';
import rest from './ruby/weekly-rest.json';
import mock1a from './ruby/mock-1-a.json';
import mock1b from './ruby/mock-1-b.json';
import mock2a from './ruby/mock-2-a.json';
import mock2b from './ruby/mock-2-b.json';
import {hasAlignedRuby} from '@/components/world/japanese-ruby-data';
import type {RubySegment} from '@/types/japanese-ruby';
import type {FoodManufacturingQuestion} from './index';

type Entry={sourceHash:string;fields:Record<string,RubySegment[]>};
const readings:Record<string,Entry>=Object.assign({},pack.questions,rest.questions,mock1a.questions,mock1b.questions,mock2a.questions,mock2b.questions,supplementalQuestionRuby);
// Source-ruby repairs, limited to the exact existing question and field.
// Keep the large historical packs and canonical question hashes unchanged.
const sourceReadingRepairs:Record<string,Record<string,string>>={
 'food-1-q201/stemJa':{'切傷':'せっしょう'},
 'food-1-q201/optionReasonsJa.2':{'切傷':'せっしょう'},
 'food-2-q075/optionsJa.0':{'日':'び'},
 'food-2-q064/optionsJa.0':{'率を':'りつを'},
};
/** Explicit offline readings; stale or incomplete fields fall back to canonical Japanese. */
export function foodManufacturingQuestionRuby(question:FoodManufacturingQuestion,field:string,text:string):RubySegment[]|undefined {
 const entry=readings[question.id];
 if(!entry||entry.sourceHash!==question.sourceHash)return undefined;
 const segments=entry.fields[field];
 if(!hasAlignedRuby(text,segments)||segments.some(part=>/\p{Script=Han}/u.test(part.text)&&!part.reading))return undefined;
 const repairs=sourceReadingRepairs[`${question.id}/${field}`];
 return repairs?segments.map(part=>repairs[part.text]?{...part,reading:repairs[part.text]}:part):segments;
}
