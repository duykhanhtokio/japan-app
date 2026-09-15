import type { ImageSourcePropType } from 'react-native';

export const N1_2013_12_EXAM_ID = 'n1-2013-12-exam-04';

export const N1_2013_12_SOURCE = {
  questionPdfSha256: '52e57d22c08a1894b7b48a291cae95fc5515b3884c44590cfb4cac70bc46be52',
  answerScriptPdfSha256: '16ee46004e74b79ac6cdab6d056f66bd531abde4f0002261bac48cd554771342',
  audioSha256: 'ff577435f993cbf20c85d83b8851e4059a423412b91c027d4801103508a0835b',
} as const;

export const N1_2013_12_WRITTEN_KEY = [
  4,3,1,3,1,2, 3,4,1,2,1,3,2, 1,1,4,2,3,2,
  4,1,4,1,3,4, 4,1,1,3,2,3,3,1,4,2,
  1,4,2,3,1, 2,3,1,2,4,
  1,1,4,2, 4,3,4,1,3,1,3,2,3,
  4,4,2,2, 2,3, 4,1,1,2, 2,3,
] as const;

/** 問題5の(3)には、原本の正答表上で2つの採点対象（1、3）がある。 */
export const N1_2013_12_LISTENING_KEY = [
  3,3,4,2,3,2,
  2,1,3,4,1,1,4,
  3,3,2,4,1,
  3,1,2,3,3,1,1,3,2,1,2,3,1,2,
  1,3,1,3,
] as const;

export const N1_2013_12_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2013-12/question/page-02.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-03.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-04.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-05.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-06.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-07.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-08.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-09.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-10.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-11.jpg'),
] as const;

export const N1_2013_12_LISTENING_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2013-12/question/page-12.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-13.jpg'),
  require('../../../assets/jlpt/n1/2013-12/question/page-14.jpg'),
] as const;

export const N1_2013_12_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-02.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-03.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-04.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-05.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-06.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-07.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-08.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-09.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-10.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-11.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-12.jpg'),
  require('../../../assets/jlpt/n1/2013-12/answer-script/page-13.jpg'),
] as const;

export const N1_2013_12_AUDIO = require('../../../assets/jlpt/n1/2013-12/audio/n1-2013-12.mp3');
export const N1_2013_12_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2013-12/answer-script/page-01.jpg');

if (N1_2013_12_WRITTEN_KEY.length !== 70) throw new Error('N1 2013-12: written key must contain 70 responses');
if (N1_2013_12_LISTENING_KEY.length !== 36) throw new Error('N1 2013-12: listening key must contain 36 responses');
