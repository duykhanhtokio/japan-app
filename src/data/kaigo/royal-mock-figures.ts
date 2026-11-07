import type {ImageSourcePropType} from 'react-native';
import {contentRevision} from './japanese-master';
import data from './royal-mock-figures.json';
import type {MockQuestion} from './types';
export type PublicMockFigureQuestion=Pick<MockQuestion,'id'|'promptJa'|'optionsJa'|'passageJa'|'figureKey'|'figureDescriptionJa'> & {furigana?:MockQuestion['furigana']};
const sources:Record<string,ImageSourcePropType>={
 'skills-practical-01':require('../../../assets/kaigo/practical/skills-practical-01.png'),
 'skills-practical-02':require('../../../assets/kaigo/practical/skills-practical-02.png'),
 'skills-practical-03':require('../../../assets/kaigo/practical/skills-practical-03.png'),
 'skills-practical-04':require('../../../assets/kaigo/royal-mock-20261107/skills-practical-04.webp'),
 'skills-practical-05':require('../../../assets/kaigo/practical/skills-practical-05.png'),
 's02-bath':require('../../../assets/kaigo/royal-mock-20261107/s02-bath.webp'),
 's02-call':require('../../../assets/kaigo/royal-mock-20261107/s02-call.webp'),
 's02-laundry':require('../../../assets/kaigo/royal-mock-20261107/s02-laundry.webp'),
 's02-meal':require('../../../assets/kaigo/practical/s02-meal.png'),
 's02-storage':require('../../../assets/kaigo/practical/s02-storage.png'),
 's03-night':require('../../../assets/kaigo/royal-mock-20261107/s03-night.webp'),
 's03-contact':require('../../../assets/kaigo/practical/s03-contact.png'),
 's03-privacy':require('../../../assets/kaigo/royal-mock-20261107/s03-privacy.webp'),
 's03-stages':require('../../../assets/kaigo/practical/s03-stages.png'),
 's04-judgement-01':require('../../../assets/kaigo/practical/s04-judgement-01.png'),
 's04-judgement-02':require('../../../assets/kaigo/practical/s04-judgement-02.png'),
 's04-judgement-03':require('../../../assets/kaigo/practical/s04-judgement-03.webp'),
 's04-judgement-04':require('../../../assets/kaigo/practical/s04-judgement-04.webp'),
 's04-judgement-05':require('../../../assets/kaigo/practical/s04-judgement-05.webp'),
 's05-judgement-01':require('../../../assets/kaigo/practical/s05-judgement-01.webp'),
 's05-judgement-02':require('../../../assets/kaigo/practical/s05-judgement-02.webp'),
 's05-judgement-03':require('../../../assets/kaigo/practical/s05-judgement-03.webp'),
 's05-judgement-04':require('../../../assets/kaigo/practical/s05-judgement-04.webp'),
 's05-judgement-05':require('../../../assets/kaigo/practical/s05-judgement-05.webp'),
 's06-judgement-01':require('../../../assets/kaigo/practical/s06-judgement-01.webp'),
 's06-judgement-02':require('../../../assets/kaigo/practical/s06-judgement-02.webp'),
 's06-judgement-03':require('../../../assets/kaigo/practical/s06-judgement-03.webp'),
 's06-judgement-04':require('../../../assets/kaigo/practical/s06-judgement-04.webp'),
 's06-judgement-05':require('../../../assets/kaigo/practical/s06-judgement-05.webp'),
};
/** Public question conditions only; no answer or rationale enters artwork selection. */
export function mockRoyalQuestionRevision(q:PublicMockFigureQuestion){
 return contentRevision([q.id,q.promptJa,q.optionsJa,q.passageJa,q.figureKey,q.figureDescriptionJa]);
}
export function mockRoyalFigureFor(q:PublicMockFigureQuestion){
 const binding=data.bindings.find(row=>row.questionId===q.id&&row.figureKey===q.figureKey);
 if(!binding || binding.publicQuestionRevision!==mockRoyalQuestionRevision(q))return undefined;
 if(binding.renderMode==='native_table')return binding.rowsSourceJa?.join('')===q.figureDescriptionJa ? {...binding,source:undefined} : undefined;
 return sources[binding.figureKey] ? {...binding,source:sources[binding.figureKey]} : undefined;
}

/** A known replaced key must fail closed if its current question conditions drift. */
export function isKnownRoyalMockFigureKey(key:string|null){
 return data.bindings.some(binding=>binding.figureKey===key);
}
