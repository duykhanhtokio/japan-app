import type { ImageSourcePropType } from 'react-native';

export const N1_2014_12_EXAM_ID = 'n1-2014-12-exam-06';
export const N1_2014_12_SOURCE = {
  questionPdfSha256: '2c3629a05eedc5afa94c83f65e0aa8e362177140eca077569c2cb815cb01af53',
  answerScriptPdfSha256: 'a7ab7cfdf121882f67eddad7c81e178c77fc66271c4384fe7ef636f53421f581',
  audioSha256: '67b7c3ec66872fea9eee3dce0d5addc3edd1d18c3cb281dbee125f8cebec4671',
} as const;
export const N1_2014_12_WRITTEN_KEY = [
  3,4,2,3,1,4, 4,2,4,2,1,1,3, 3,2,4,1,4,2, 2,3,1,2,1,4,
  4,3,2,1,3,3,2,1,4,3, 4,1,2,3,2, 3,1,2,4,1,
  3,4,1,4, 2,1,2,2,3,1,2,4,2, 3,2,4,2, 4,3, 4,1,4,3, 1,1,
] as const;
/** 問題5の(3)には、原本の正答表上で2つの採点対象（4、1）がある。 */
export const N1_2014_12_LISTENING_KEY = [
  2,1,2,3,1,4, 3,1,4,2,2,4,2, 1,3,2,1,2,4,
  1,2,3,1,3,1,1,2,3,2,2,3,1,3, 2,4,4,1,
] as const;
export const N1_2014_12_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2014-12/question/page-02.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-03.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-04.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-05.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-06.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-07.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-08.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-09.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-10.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-11.jpg'),
] as const;
export const N1_2014_12_LISTENING_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n1/2014-12/question/page-12.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-13.jpg'), require('../../../assets/jlpt/n1/2014-12/question/page-14.jpg')] as const;
export const N1_2014_12_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2014-12/answer-script/page-02.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-03.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-04.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-05.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-06.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-07.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-08.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-09.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-10.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-11.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-12.jpg'), require('../../../assets/jlpt/n1/2014-12/answer-script/page-13.jpg'),
] as const;
export const N1_2014_12_AUDIO = require('../../../assets/jlpt/n1/2014-12/audio/n1-2014-12.mp3');
export const N1_2014_12_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2014-12/answer-script/page-01.jpg');
if (N1_2014_12_WRITTEN_KEY.length !== 70) throw new Error('N1 2014-12: written key must contain 70 responses');
if (N1_2014_12_LISTENING_KEY.length !== 37) throw new Error('N1 2014-12: listening key must contain 37 responses');
