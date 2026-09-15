import type { ImageSourcePropType } from 'react-native';
export const N1_2017_12_EXAM_ID = 'n1-2017-12-exam-12';
export const N1_2017_12_SOURCE = { questionPdfSha256: '2d1643584e2f0bbd3bd7645e4bf036492ec08e16ae659f3a1eb63d3d3596a066', answerScriptPdfSha256: '972a00f989e38e83377e78f7d1298ea55d4864c47aaec0da764aef1e5ee7f7de', audioSha256: '2ac5cc6a65ce4461d6b67e168b5c95f498dfa4134f156f2ce6c7ccdc13e78325' } as const;
export const N1_2017_12_WRITTEN_KEY = [
  1,1,4,3,2,3, 4,2,3,1,2,4,2, 4,3,2,1,3,2, 2,4,1,4,1,3,
  1,2,4,3,3,3,4,1,1,2, 1,4,3,2,2, 4,1,1,2,3,
  2,4,3,2, 3,1,3,2,1,4,4,1,2, 3,4,1,4, 4,2, 1,3,2,3, 1,3,
] as const;
/** 問題5の(3)には、原本の正答表上で2つの採点対象（2、3）がある。 */
export const N1_2017_12_LISTENING_KEY = [
  2,1,4,3,3,4, 3,4,3,1,1,2, 3,4,2,4,1,2,
  3,2,1,3,1,3,1,2,2,3,1,1,2, 2,2,2,3,
] as const;
export const N1_2017_12_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2017-12/question/page-02.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-03.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-04.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-05.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-06.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-07.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-08.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-09.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-10.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-11.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-12.jpg'),
] as const;
export const N1_2017_12_LISTENING_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n1/2017-12/question/page-13.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-14.jpg'), require('../../../assets/jlpt/n1/2017-12/question/page-15.jpg')] as const;
export const N1_2017_12_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2017-12/answer-script/page-02.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-03.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-04.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-05.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-06.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-07.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-08.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-09.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-10.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-11.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-12.jpg'), require('../../../assets/jlpt/n1/2017-12/answer-script/page-13.jpg'),
] as const;
export const N1_2017_12_AUDIO = require('../../../assets/jlpt/n1/2017-12/audio/n1-2017-12.m4a');
export const N1_2017_12_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2017-12/answer-script/page-01.jpg');
if (N1_2017_12_WRITTEN_KEY.length !== 70) throw new Error('N1 2017-12: written key must contain 70 responses');
if (N1_2017_12_LISTENING_KEY.length !== 35) throw new Error('N1 2017-12: listening key must contain 35 responses');
