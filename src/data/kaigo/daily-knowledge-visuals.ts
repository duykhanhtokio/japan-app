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
  brain: require('../../../assets/kaigo/daily-fix-20261031/brain.png'),
  respiratory: require('../../../assets/kaigo/daily-fix-20261031/respiratory.png'),
  skeleton: require('../../../assets/kaigo/daily-fix-20261031/skeleton.png'),
  eye: require('../../../assets/kaigo/daily-fix-20261031/eye.png'),
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

export function knowledgeFiguresForDay(day: number) {
  const binding = data.days.find(d => d.day === day);
  const lesson = binding && japaneseLessonMetadata[binding.lessonKey];
  if (!binding || !lesson || japaneseLessonRevision(lesson) !== binding.sourceLessonRevision) return [];
  return binding.figureIds.flatMap(id => {
    const figure = data.figures.find(f => f.id === id);
    const section = figure && japaneseMasterSections[figure.sourceSectionId];
    return figure && section && sources[id]
      && japaneseMasterRevision(section) === figure.sourceRevision
      ? [{ ...figure, source: sources[id], aspectRatio: figure.width / figure.height }] : [];
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
