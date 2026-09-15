import type { ImageSourcePropType } from 'react-native';
export const N1_2015_12_EXAM_ID = 'n1-2015-12-exam-08';
export const N1_2015_12_SOURCE = { questionPdfSha256: 'a08adf1d940e5f4147a35774edec017222cb98433604668d7ca0ec3e111d664c', answerScriptPdfSha256: '7fdaf57e98cf6afc7af639d845801d2c6069c279353159f216425a8de704f2b1', audioSha256: 'ae208c2d4d3000e5a7925ca56ea468e0933aec33470d65e29d248ac0a0b0a81e' } as const;
export const N1_2015_12_WRITTEN_KEY = [
  1,2,3,4,2,1, 1,3,1,2,2,4,3, 4,1,2,3,4,3, 4,2,3,2,1,4,
  1,4,1,3,2,4,3,2,1,4, 1,4,2,4,3, 2,1,3,1,4,
  4,2,3,1, 4,3,3,2,4,2,1,4,2, 4,2,3,3, 2,3, 1,3,4,4, 2,1,
] as const;
/** 問題5の(3)には、原本の正答表上で2つの採点対象（1、4）がある。 */
export const N1_2015_12_LISTENING_KEY = [
  2,3,4,2,1,2, 2,2,3,4,3,1,4, 4,1,4,3,2,1,
  3,1,3,2,2,1,1,3,3,1,2,3,1,1, 1,2,1,4,
] as const;
export const N1_2015_12_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2015-12/question/page-02.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-03.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-04.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-05.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-06.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-07.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-08.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-09.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-10.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-11.jpg'),
] as const;
export const N1_2015_12_LISTENING_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n1/2015-12/question/page-12.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-13.jpg'), require('../../../assets/jlpt/n1/2015-12/question/page-14.jpg')] as const;
export const N1_2015_12_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2015-12/answer-script/page-02.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-03.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-04.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-05.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-06.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-07.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-08.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-09.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-10.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-11.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-12.jpg'), require('../../../assets/jlpt/n1/2015-12/answer-script/page-13.jpg'),
] as const;
export const N1_2015_12_AUDIO = require('../../../assets/jlpt/n1/2015-12/audio/n1-2015-12.mp3');
export const N1_2015_12_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2015-12/answer-script/page-01.jpg');
if (N1_2015_12_WRITTEN_KEY.length !== 70) throw new Error('N1 2015-12: written key must contain 70 responses');
if (N1_2015_12_LISTENING_KEY.length !== 37) throw new Error('N1 2015-12: listening key must contain 37 responses');
