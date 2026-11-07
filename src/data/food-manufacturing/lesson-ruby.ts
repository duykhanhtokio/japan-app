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

/** Reuse only a unique literal excerpt with intact reading-token boundaries; never infer a cut word's pronunciation. */
export function foodManufacturingLabelRuby(lesson:FoodManufacturingLesson,field:string,text:string):RubySegment[]|undefined {
 const source=lesson.paragraphs.find(p=>field===`paragraphs.${p.id}.textJa`)?.textJa;
 if(!text||!source)return undefined;
 const start=source.indexOf(text),end=start+text.length;
 if(start<0||start!==source.lastIndexOf(text))return undefined;
 const full=foodManufacturingLessonRuby(lesson,field,source);if(!full)return undefined;
 const result:RubySegment[]=[];let offset=0;
 for(const part of full){
  const next=offset+part.text.length,from=Math.max(start,offset),to=Math.min(end,next);
  if(from<to){
   if(part.reading&&(from!==offset||to!==next))return undefined;
   result.push({text:part.text.slice(from-offset,to-offset),...(part.reading?{reading:part.reading}:{})});
  }
  offset=next;
 }
 return hasAlignedRuby(text,result)?result:undefined;
}
