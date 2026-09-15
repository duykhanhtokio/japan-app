import type { ImageSourcePropType } from 'react-native';
export const N1_2016_12_EXAM_ID = 'n1-2016-12-exam-10';
export const N1_2016_12_SOURCE = { questionPdfSha256: 'e0103e757f9a578ea6be89f753e61c1768c605cae6a075433b591ffed4bcaef5', answerScriptPdfSha256: '5891bae5a457340e682124790c019497a7e799744d7b21ad0cb91f6bc5c68ccb', audioSha256: '73a62db2cd4695babb39a60c402225e90186190eca70e3acbdc5f2fae68a0f00' } as const;
export const N1_2016_12_WRITTEN_KEY = [
  1,2,3,1,4,2, 2,1,3,1,2,4,4, 4,1,4,3,2,3, 1,4,3,2,1,3,
  4,2,3,1,3,3,4,2,1,4, 2,1,4,3,2, 2,1,1,3,4,
  3,2,3,1, 3,4,2,2,1,4,2,3,3, 4,2,1,2, 3,3, 2,1,4,4, 1,4,
] as const;
/** 問題5の(3)には、原本の正答表上で2つの採点対象（1、2）がある。 */
export const N1_2016_12_LISTENING_KEY = [
  1,4,2,1,2,2, 2,4,4,3,4,1,2, 2,4,3,3,1,2,
  2,3,2,3,1,3,3,2,1,2,3,1,2,3, 2,2,1,2,
] as const;
export const N1_2016_12_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2016-12/question/page-02.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-03.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-04.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-05.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-06.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-07.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-08.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-09.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-10.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-11.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-12.jpg'),
] as const;
export const N1_2016_12_LISTENING_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n1/2016-12/question/page-13.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-14.jpg'), require('../../../assets/jlpt/n1/2016-12/question/page-15.jpg')] as const;
export const N1_2016_12_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2016-12/answer-script/page-02.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-03.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-04.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-05.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-06.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-07.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-08.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-09.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-10.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-11.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-12.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-13.jpg'), require('../../../assets/jlpt/n1/2016-12/answer-script/page-14.jpg'),
] as const;
export const N1_2016_12_AUDIO = require('../../../assets/jlpt/n1/2016-12/audio/n1-2016-12.m4a');
export const N1_2016_12_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2016-12/answer-script/page-01.jpg');
if (N1_2016_12_WRITTEN_KEY.length !== 70) throw new Error('N1 2016-12: written key must contain 70 responses');
if (N1_2016_12_LISTENING_KEY.length !== 37) throw new Error('N1 2016-12: listening key must contain 37 responses');
