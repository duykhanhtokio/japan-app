import type {RestaurantLesson,RestaurantExam,RestaurantQuestion,ReadingSegment} from './types';
import {source31AssetByFile} from './source31-assets';
export type SourceSection31={id:string;sourceHash:string;titleJa:string;textJa:string;factIds:string[];furigana?:{title?:ReadingSegment[];text?:ReadingSegment[]}};
export type SourceFigure31={id:string;assetFile:string;sha256:string;width:number;height:number;captionJa:string;altJa:string;sourceHash:string;quizSafe?:boolean};
export type SourceQuestion31=RestaurantQuestion&{level:'1'|'2';optionReasonsJa:string[];reasonRuby?:ReadingSegment[][];figureIds?:string[]};
export type SourceLesson31={lessonId:string;lessonSourceHash:string;lessonSignature:string;sourceHash:string;sections:SourceSection31[];figures:SourceFigure31[];terms?:{id:string;termJa:string;reading:string;explanationJa:string;sourceHash:string}[];exam:(RestaurantExam&{questions:SourceQuestion31[]})|null};
type Pack={lessons:Record<string,SourceLesson31>};
type Target={sourceHash:string;title?:string;text?:string;caption?:string;alt?:string;stem?:string;options?:string[];reasons?:string[];explanation?:string;objective?:string};
const own=(v:object,k:string)=>Object.prototype.hasOwnProperty.call(v,k);
const ordered=(v:unknown):unknown=>Array.isArray(v)?v.map(ordered):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,ordered((v as Record<string,unknown>)[k])])):v;
const stable=(v:unknown):string=>JSON.stringify(ordered(v))??'null';
export const sourceLessonSignature31=(l:RestaurantLesson)=>stable({id:l.id,level:l.level,sourceHash:l.sourceHash,titleJa:l.titleJa,objectiveJa:l.objectiveJa,summaryJa:l.summaryJa,paragraphs:l.paragraphs.map(p=>({id:p.id,titleJa:p.titleJa,textJa:p.textJa}))});
const pack=(level:string):Pack|null=>level==='1'?require('./source31/1.json'):level==='2'?require('./source31/2.json'):null;
export function sourceLesson31(lesson:RestaurantLesson):SourceLesson31|null{
 const data=pack(lesson.level),row=data&&own(data.lessons,lesson.id)?data.lessons[lesson.id]:null;
 return row&&row.lessonSourceHash===lesson.sourceHash&&row.lessonSignature===sourceLessonSignature31(lesson)?row:null;
}
function locale31(locale:string):Record<string,Target>|null{
 switch(locale){case 'vi':return require('./source31/vi.json').items;case 'en':return require('./source31/en.json').items;case 'id':return require('./source31/id.json').items;case 'zh-CN':return require('./source31/zh-CN.json').items;case 'zh-TW':return require('./source31/zh-TW.json').items;case 'hi':return require('./source31/hi.json').items;case 'bn':return require('./source31/bn.json').items;case 'ne':return require('./source31/ne.json').items;case 'my':return require('./source31/my.json').items;case 'th':return require('./source31/th.json').items;case 'km':return require('./source31/km.json').items;case 'tl':return require('./source31/tl.json').items;default:return null;}
}
export function sourceTarget31(item:{id:string;sourceHash:string},locale:string):Target|null{const rows=locale31(locale),target=rows&&own(rows,item.id)?rows[item.id]:null;return target&&target.sourceHash===item.sourceHash?target:null;}
export function sourceQuestionTarget31(q:SourceQuestion31,locale:string):Target|null{
 const data=pack(q.level);if(!data)return null;
 const original=Object.values(data.lessons).flatMap(l=>l.exam?.questions??[]).find(x=>x.id===q.id);
 if(!original||stable(original)!==stable(q))return null;
 const t=sourceTarget31(q,locale);
 return t&&t.stem?.trim()&&t.explanation?.trim()&&t.options?.length===4&&t.reasons?.length===4&&t.options.every(x=>x.trim())&&t.reasons.every(x=>x.trim())?t:null;
}
export const sourceFigureAsset31=(figure:SourceFigure31)=>source31AssetByFile(figure.assetFile);
