import type {ImageSourcePropType} from 'react-native';
import {contentRevision} from './japanese-master';
import data from './royal-mock-figures.json';
import type {MockQuestion} from './types';
export type PublicMockFigureQuestion=Pick<MockQuestion,'id'|'promptJa'|'optionsJa'|'passageJa'|'figureKey'|'figureDescriptionJa'>;
const sources:Record<string,ImageSourcePropType>={
 's03-night':require('../../../assets/kaigo/royal-mock-20261107/s03-night.webp'),
 's03-privacy':require('../../../assets/kaigo/royal-mock-20261107/s03-privacy.webp'),
 'skills-practical-04':require('../../../assets/kaigo/royal-mock-20261107/skills-practical-04.webp'),
 's02-bath':require('../../../assets/kaigo/royal-mock-20261107/s02-bath.webp'),
 's02-call':require('../../../assets/kaigo/royal-mock-20261107/s02-call.webp'),
 's02-laundry':require('../../../assets/kaigo/royal-mock-20261107/s02-laundry.webp'),
};
/** Public question conditions only; no answer or rationale enters artwork selection. */
export function mockRoyalQuestionRevision(q:PublicMockFigureQuestion){
 return contentRevision([q.id,q.promptJa,q.optionsJa,q.passageJa,q.figureKey,q.figureDescriptionJa]);
}
export function mockRoyalFigureFor(q:PublicMockFigureQuestion){
 const binding=data.bindings.find(row=>row.questionId===q.id&&row.figureKey===q.figureKey);
 return binding&&binding.publicQuestionRevision===mockRoyalQuestionRevision(q)&&sources[binding.figureKey]
  ? {...binding,source:sources[binding.figureKey]}:undefined;
}

/** A known replaced key must fail closed if its current question conditions drift. */
export function isKnownRoyalMockFigureKey(key:string|null){
 return data.bindings.some(binding=>binding.figureKey===key);
}
