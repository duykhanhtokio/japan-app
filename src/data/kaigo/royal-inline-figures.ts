import { japaneseMasterRevision, japaneseMasterSections } from './japanese-master';
import { contextVisualBindingForDay } from './daily-knowledge-visuals';

/** A day-specific source-bound replacement; later uses retain their original artwork. */
export function royalInlineFigure(day:number, sectionId:string, figureKey:string) {
  if (day!==15 || sectionId!=='kaigo-depth-04' || figureKey!=='posture-support-map'
    || !contextVisualBindingForDay(day)) return undefined;
  const section=japaneseMasterSections[sectionId];
  if (!section || japaneseMasterRevision(section)!=='ja-master-v1-d90f4372') return undefined;
  return {
    kind:'posture' as const,
    source:require('../../../assets/kaigo/royal-weekly-20261107/week03/day15-posture-support-controlled.webp'),
    sourceRevision:'ja-master-v1-d90f4372',
  };
}
