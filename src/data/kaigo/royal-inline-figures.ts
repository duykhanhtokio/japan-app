import { japaneseMasterRevision, japaneseMasterSections } from './japanese-master';
import { contextVisualBindingForDay } from './daily-knowledge-visuals';

/** Day-specific source-bound replacements; later uses retain their original artwork. */
const replacements={
 '24:kaigo-depth-14:posture-support-map':{
  kind:'eating' as const,sourceRevision:'ja-master-v1-86d491d9',
  source:require('../../../assets/kaigo/royal-weekly-20261107/week04/day24-eating-seat-support-controlled.webp'),
 },
 '18:kaigo-depth-05:pressure-contact-map':{
  kind:'pressure' as const,sourceRevision:'ja-master-v1-9ff43982',
  source:require('../../../assets/kaigo/royal-weekly-20261107/week03/day18-pressure-contact-controlled.webp'),
 },
 '15:kaigo-depth-04:posture-support-map':{
  kind:'posture' as const,sourceRevision:'ja-master-v1-d90f4372',
  source:require('../../../assets/kaigo/royal-weekly-20261107/week03/day15-posture-support-controlled.webp'),
 },
 '16:kaigo-depth-11:wheelchair-function-map':{
  kind:'wheelchair' as const,sourceRevision:'ja-master-v1-15e48b5c',
  source:require('../../../assets/kaigo/royal-weekly-20261107/week03/day16-wheelchair-parts-controlled.webp'),
 },
};
export function royalInlineFigure(day:number, sectionId:string, figureKey:string) {
  const replacement=replacements[`${day}:${sectionId}:${figureKey}` as keyof typeof replacements];
  const section=japaneseMasterSections[sectionId];
  return replacement && section && contextVisualBindingForDay(day)
    && japaneseMasterRevision(section)===replacement.sourceRevision ? replacement : undefined;
}
