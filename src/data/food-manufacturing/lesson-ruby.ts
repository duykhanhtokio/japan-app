import {supplementalLessonRuby} from './supplemental';
import pack1 from './ruby/lessons-01.json';
import pack2 from './ruby/lessons-02.json';
import pack3 from './ruby/lessons-03.json';
import pack4 from './ruby/lessons-04.json';
import pack5 from './ruby/lessons-05.json';
import pack6 from './ruby/lessons-06.json';
import {hasAlignedRuby} from '@/components/world/japanese-ruby-data';
import type {RubySegment} from '@/types/japanese-ruby';
import type {FoodManufacturingLesson} from './index';

type ReadingEntry={sourceHash:string;fields:Record<string,RubySegment[]>};
const readings:Record<string,ReadingEntry>=Object.assign({},pack1.lessons,pack2.lessons,pack3.lessons,pack4.lessons,pack5.lessons,pack6.lessons,supplementalLessonRuby);

/** Offline AI-authored readings. A changed source or partial reading falls back to plain Japanese. */
export function foodManufacturingLessonRuby(lesson:FoodManufacturingLesson,field:string,text:string):RubySegment[]|undefined {
 const entry=readings[lesson.id];
 if(!entry||entry.sourceHash!==lesson.sourceHash)return undefined;
 const segments=entry.fields[field];
 if(!hasAlignedRuby(text,segments)||segments.some(part=>/\p{Script=Han}/u.test(part.text)&&!part.reading))return undefined;
 return segments;
}
