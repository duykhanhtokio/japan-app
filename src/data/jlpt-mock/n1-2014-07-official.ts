import type { ImageSourcePropType } from 'react-native';

export const N1_2014_07_EXAM_ID = 'n1-2014-07-exam-05';
export const N1_2014_07_SOURCE = {
  questionPdfSha256: 'a9d1e7b72246fb7601c77c1a5e333ae1a7cad9649ee9860a10030239a51bb636',
  answerScriptPdfSha256: '7a02f9215659e30bcc47c1599418061baf98a698eaca2caf5d9975c9d7c0dfbe',
  audioSha256: 'f534896b9c9962ce3ff1eae69f49b7afb1a0e93438ab437d63d3a55032937309',
} as const;

export const N1_2014_07_WRITTEN_KEY = [
  1,2,4,3,2,1, 3,4,1,2,1,4,3, 1,4,2,2,3,3,
  4,3,2,2,1,4, 4,3,1,4,1,1,4,2,2,3,
  4,1,2,3,1, 2,2,3,1,2,
  2,3,1,3, 1,4,3,4,3,2,1,4,2,
  2,3,1,4, 4,1, 4,3,2,2, 3,4,
] as const;

/** 問題5の(3)には、原本の正答表上で2つの採点対象（4、1）がある。 */
export const N1_2014_07_LISTENING_KEY = [
  3,4,3,2,3,2,
  1,3,1,3,1,2,2,
  2,4,4,2,4,3,
  2,1,3,1,2,2,1,1,1,2,2,3,2,3,
  3,3,4,1,
] as const;

export const N1_2014_07_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2014-07/question/page-02.jpg'), require('../../../assets/jlpt/n1/2014-07/question/page-03.jpg'),
  require('../../../assets/jlpt/n1/2014-07/question/page-04.jpg'), require('../../../assets/jlpt/n1/2014-07/question/page-05.jpg'),
  require('../../../assets/jlpt/n1/2014-07/question/page-06.jpg'), require('../../../assets/jlpt/n1/2014-07/question/page-07.jpg'),
  require('../../../assets/jlpt/n1/2014-07/question/page-08.jpg'), require('../../../assets/jlpt/n1/2014-07/question/page-09.jpg'),
  require('../../../assets/jlpt/n1/2014-07/question/page-10.jpg'), require('../../../assets/jlpt/n1/2014-07/question/page-11.jpg'),
] as const;
export const N1_2014_07_LISTENING_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2014-07/question/page-12.jpg'), require('../../../assets/jlpt/n1/2014-07/question/page-13.jpg'), require('../../../assets/jlpt/n1/2014-07/question/page-14.jpg'),
] as const;
export const N1_2014_07_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2014-07/answer-script/page-02.jpg'), require('../../../assets/jlpt/n1/2014-07/answer-script/page-03.jpg'),
  require('../../../assets/jlpt/n1/2014-07/answer-script/page-04.jpg'), require('../../../assets/jlpt/n1/2014-07/answer-script/page-05.jpg'),
  require('../../../assets/jlpt/n1/2014-07/answer-script/page-06.jpg'), require('../../../assets/jlpt/n1/2014-07/answer-script/page-07.jpg'),
  require('../../../assets/jlpt/n1/2014-07/answer-script/page-08.jpg'), require('../../../assets/jlpt/n1/2014-07/answer-script/page-09.jpg'),
  require('../../../assets/jlpt/n1/2014-07/answer-script/page-10.jpg'), require('../../../assets/jlpt/n1/2014-07/answer-script/page-11.jpg'),
  require('../../../assets/jlpt/n1/2014-07/answer-script/page-12.jpg'), require('../../../assets/jlpt/n1/2014-07/answer-script/page-13.jpg'),
] as const;
export const N1_2014_07_AUDIO = require('../../../assets/jlpt/n1/2014-07/audio/n1-2014-07.mp3');
export const N1_2014_07_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2014-07/answer-script/page-01.jpg');

if (N1_2014_07_WRITTEN_KEY.length !== 70) throw new Error('N1 2014-07: written key must contain 70 responses');
if (N1_2014_07_LISTENING_KEY.length !== 37) throw new Error('N1 2014-07: listening key must contain 37 responses');
