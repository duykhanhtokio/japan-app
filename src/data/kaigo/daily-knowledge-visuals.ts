import type { ImageSourcePropType } from 'react-native';
import data from './daily-knowledge-visuals.json';
import allocation from './weekly-art-allocation.json';
import { japaneseMasterRevision, japaneseMasterSections, japaneseLessonMetadata,
  japaneseLessonRevision } from './japanese-master';

// Literal assets allow Metro to serve each requested diagram; they are not
// base64 strings imported into the application's initial JavaScript bundle.
const sources: Record<string, ImageSourcePropType> = {
  muscles: require('../../../assets/kaigo/daily-fix-20261031/muscles.png'),
  endocrine: require('../../../assets/kaigo/daily-fix-20261031/endocrine.png'),
  nervous: require('../../../assets/kaigo/daily-fix-20261031/nervous.png'),
  'brain-royal-week02': require('../../../assets/kaigo/royal-weekly-20261107/week02/day08-brain-base.webp'),
  'respiratory-royal-week02': require('../../../assets/kaigo/royal-weekly-20261107/week02/day09-respiratory-base.webp'),
  brain: require('../../../assets/kaigo/daily-fix-20261031/brain.png'),
  respiratory: require('../../../assets/kaigo/daily-fix-20261031/respiratory.png'),
  skeleton: require('../../../assets/kaigo/daily-fix-20261031/skeleton.png'),
  eye: require('../../../assets/kaigo/daily-fix-20261031/eye.png'),
  'hand-regions-royal-week01': require('../../../assets/kaigo/royal-weekly-20261107/week01/day06-hand-regions-base.webp'),
  'hand-regions': require('../../../assets/kaigo/daily-fix-20261031/hand-regions.png'),
  skin: require('../../../assets/kaigo/daily-fix-20261031/skin.png'),
  heart: require('../../../assets/kaigo/daily-fix-20261031/heart.png'),
  digestive: require('../../../assets/kaigo/daily-fix-20261031/digestive.png'),
  urinary: require('../../../assets/kaigo/daily-fix-20261031/urinary.png'),
  'brain-lobes': require('../../../assets/kaigo/daily-fix-20261031/brain-lobes.png'),
  'male-terms': require('../../../assets/kaigo/daily-fix-20261031/male-terms.png'),
  'oral-ownership': require('../../../assets/kaigo/daily-fix-20261031/oral-ownership.png'),
  pupils: require('../../../assets/kaigo/daily-fix-20261031/pupils.png'),
  grooming: require('../../../assets/kaigo/daily-fix-20261031/grooming.png'),
};

type DayFigureOverride={assetPath:string;assetSha256:string;width:number;height:number;rights:string;aiVisualReview:string;altJa?:string};
const dayOverrides:Record<string,Record<string,DayFigureOverride>>=data.dayFigureOverrides;
const daySources:Record<string,ImageSourcePropType>={
 '171:hand-regions':require('../../../assets/kaigo/royal-weekly-20261107/week01/day06-hand-regions-base.webp'),
 '161:hand-regions':require('../../../assets/kaigo/royal-weekly-20261107/week01/day06-hand-regions-base.webp'),
 '134:oral-ownership':require('../../../assets/kaigo/royal-weekly-20261107/week06/day37-oral-ownership-controlled.webp'),

 '112:skin':require('../../../assets/kaigo/royal-weekly-20261107/week06/day38-skin-structure-controlled.webp'),

 '99:grooming':require('../../../assets/kaigo/royal-weekly-20261107/week06/day39-grooming-identification-controlled.webp'),
 '92:brain-lobes':require('../../../assets/kaigo/royal-weekly-20261107/week14/day92-lobes-controlled.webp'),
 '96:urinary':require('../../../assets/kaigo/royal-weekly-20261107/week05/day29-urinary-route-controlled.webp'),
 '71:skeleton':require('../../../assets/kaigo/royal-weekly-20261107/week11/skeleton-regions-controlled.webp'),
 '72:skeleton':require('../../../assets/kaigo/royal-weekly-20261107/week11/skeleton-regions-controlled.webp'),
 '74:eye':require('../../../assets/kaigo/royal-weekly-20261107/week11/eye-structures-controlled.webp'),
 '75:heart':require('../../../assets/kaigo/royal-weekly-20261107/week11/circulation-flow-controlled.webp'),
 '76:digestive':require('../../../assets/kaigo/royal-weekly-20261107/week11/digestive-route-controlled.webp'),
 '73:muscles':require('../../../assets/kaigo/royal-weekly-20261107/week03/day15-muscle-regions-controlled.webp'),
 '77:endocrine':require('../../../assets/kaigo/royal-weekly-20261107/week04/day27-endocrine-regions-controlled.webp'),

 '67:nervous':require('../../../assets/kaigo/royal-weekly-20261107/week10/day67-nervous-distribution-controlled.webp'),
 '70:pupils':require('../../../assets/kaigo/royal-weekly-20261107/week10/day70-pupil-comparison-controlled.webp'),
 '37:oral-ownership':require('../../../assets/kaigo/royal-weekly-20261107/week06/day37-oral-ownership-controlled.webp'),
 '38:skin':require('../../../assets/kaigo/royal-weekly-20261107/week06/day38-skin-structure-controlled.webp'),
 '39:grooming':require('../../../assets/kaigo/royal-weekly-20261107/week06/day39-grooming-identification-controlled.webp'),
 '29:urinary':require('../../../assets/kaigo/royal-weekly-20261107/week05/day29-urinary-route-controlled.webp'),
 '27:endocrine':require('../../../assets/kaigo/royal-weekly-20261107/week04/day27-endocrine-regions-controlled.webp'),
 '15:muscles':require('../../../assets/kaigo/royal-weekly-20261107/week03/day15-muscle-regions-controlled.webp'),
};

export function knowledgeFiguresForDay(day: number) {
  const binding = data.days.find(d => d.day === day);
  const lesson = binding && japaneseLessonMetadata[binding.lessonKey];
  if (!binding || !lesson || japaneseLessonRevision(lesson) !== binding.sourceLessonRevision) return [];
  return binding.figureIds.flatMap(id => {
    const figure = data.figures.find(f => f.id === id);
    const section = figure && japaneseMasterSections[figure.sourceSectionId];
    const assetOverride=dayOverrides[String(day)]?.[id];
    const sourceOverride=daySources[`${day}:${id}`];
    return figure && section && sources[id]
      && japaneseMasterRevision(section) === figure.sourceRevision
      && (!assetOverride || sourceOverride)
      ? [{ ...figure,...assetOverride,source:sourceOverride??sources[id],
          aspectRatio:(assetOverride?.width??figure.width)/(assetOverride?.height??figure.height) }] : [];
  });
}

/** Each retained context asset has its own explicit learning objective. A
 * changed caption/lesson or reassigned asset requires a new matching record. */
export function contextVisualBindingForDay(day: number) {
  const binding = data.days.find(d => d.day === day);
  const lesson = binding && japaneseLessonMetadata[binding.lessonKey];
  const artwork = allocation.assignments.find(a => a.day === day);
  return binding && lesson && artwork?.artId === binding.contextArtId
    && japaneseLessonRevision(lesson) === binding.sourceLessonRevision ? binding : undefined;
}
