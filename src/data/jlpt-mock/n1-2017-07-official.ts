import type { ImageSourcePropType } from 'react-native';
export const N1_2017_07_EXAM_ID = 'n1-2017-07-exam-11';
export const N1_2017_07_SOURCE = { questionPdfSha256: '13c977afe3425007373cabe41001c61e512e0991ed79865118a98c4656324d84', answerScriptPdfSha256: '7536c824a5c89b2596a773b1e9bba4f04581227751561db0b1b060f1833b6c3c', audioSha256: 'e9221552fee6fe2dd051d5f30c966c49919291d9beeb2893360c3257b45566f5' } as const;
export const N1_2017_07_WRITTEN_KEY = [
  3,2,4,1,1,2, 1,4,2,4,3,2,3, 4,2,3,1,2,1, 4,3,4,1,3,3,
  2,1,2,3,4,1,4,2,1,3, 3,2,1,4,4, 3,4,2,1,1,
  4,3,4,2, 3,1,4,2,3,3,1,2,1, 3,2,1,4, 1,4, 4,3,2,1, 2,3,
] as const;
/** 問題5の(3)には、原本の正答表上で2つの採点対象（2、3）がある。 */
export const N1_2017_07_LISTENING_KEY = [
  1,1,2,2,1,3, 3,4,1,2,4,2, 1,4,1,3,4,2,
  2,1,1,2,2,2,2,1,3,2,3,3,1, 3,2,2,3,
] as const;
export const N1_2017_07_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2017-07/question/page-02.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-03.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-04.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-05.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-06.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-07.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-08.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-09.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-10.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-11.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-12.jpg'),
] as const;
export const N1_2017_07_LISTENING_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n1/2017-07/question/page-13.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-14.jpg'), require('../../../assets/jlpt/n1/2017-07/question/page-15.jpg')] as const;
export const N1_2017_07_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2017-07/answer-script/page-02.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-03.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-04.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-05.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-06.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-07.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-08.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-09.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-10.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-11.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-12.jpg'), require('../../../assets/jlpt/n1/2017-07/answer-script/page-13.jpg'),
] as const;
export const N1_2017_07_AUDIO = require('../../../assets/jlpt/n1/2017-07/audio/n1-2017-07.m4a');
export const N1_2017_07_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2017-07/answer-script/page-01.jpg');
if (N1_2017_07_WRITTEN_KEY.length !== 70) throw new Error('N1 2017-07: written key must contain 70 responses');
if (N1_2017_07_LISTENING_KEY.length !== 35) throw new Error('N1 2017-07: listening key must contain 35 responses');
