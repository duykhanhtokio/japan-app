import type { ImageSourcePropType } from 'react-native';
import type { OfficialExamPhase } from './n1-2012-07-official';

export type { OfficialExamPhase };

export const N1_2013_07_EXAM_ID = 'n1-2013-07-exam-03';

export const N1_2013_07_SOURCE = {
  questionPdfSha256: 'bc2b6844f328f0ef8dd081abe038310bd5a809970eb60a9464f576415de20477',
  answerScriptPdfSha256: '4b54b175d93c7c14a3b7d51b2a42907d7d90b61afaf04f390b5d707bd05c6aee',
  audioSha256: '515a0365abeedd70fdf4641adc17520b227af9dcdd0ceb217e7a86487c9da08b',
} as const;

export const N1_2013_07_WRITTEN_KEY = [
  4,2,4,3,3,1, 3,2,2,1,3,1,3, 2,4,4,2,1,4,
  2,1,4,1,3,3, 4,2,4,1,2,3,4,1,2,3,
  2,4,1,3,1, 3,1,2,4,3,
  4,3,4,3, 1,2,1,4,2,3,4,1,3,
  2,4,2,3, 2,1, 1,3,4,2, 1,2,
] as const;

/** 問題5の(3)には、原本の正答表上で2つの採点対象（1、4）がある。 */
export const N1_2013_07_LISTENING_KEY = [
  3,2,1,2,3,4,
  3,2,2,3,2,2,
  4,2,3,3,1,3,
  1,2,2,2,2,3,3,2,3,1,2,1,3,1,
  2,2,1,4,
] as const;

export const N1_2013_07_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2013-07/question/page-02.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-03.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-04.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-05.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-06.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-07.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-08.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-09.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-10.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-11.jpg'),
] as const;

export const N1_2013_07_LISTENING_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2013-07/question/page-12.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-13.jpg'),
  require('../../../assets/jlpt/n1/2013-07/question/page-14.jpg'),
] as const;

export const N1_2013_07_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-02.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-03.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-04.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-05.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-06.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-07.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-08.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-09.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-10.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-11.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-12.jpg'),
  require('../../../assets/jlpt/n1/2013-07/answer-script/page-13.jpg'),
] as const;

export const N1_2013_07_AUDIO = require('../../../assets/jlpt/n1/2013-07/audio/n1-2013-07.mp3');
export const N1_2013_07_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2013-07/answer-script/page-01.jpg');

if (N1_2013_07_WRITTEN_KEY.length !== 70) throw new Error('N1 2013-07: written key must contain 70 responses');
if (N1_2013_07_LISTENING_KEY.length !== 36) throw new Error('N1 2013-07: listening key must contain 36 responses');
