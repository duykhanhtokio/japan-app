import type { ImageSourcePropType } from 'react-native';

export type OfficialExamPhase = 'written' | 'listening';

export const N1_2012_07_WRITTEN_KEY = [
  4,2,3,3,2,1, 4,1,4,1,3,4,2, 2,3,4,1,2,3, 3,1,4,3,1,2,
  3,4,2,1,1,2,1,3,4,2, 2,4,1,3,1, 3,2,3,4,1,
  1,3,2,2, 3,1,3,4,3,3,4,1,4, 1,3,4,2, 2,4, 2,1,2,4, 2,1,
] as const;

/**
 * The source answer sheet has 35 numbered listening items. 問題5の(3)
 * contains two separately scored responses, printed as 3 and 2.
 */
export const N1_2012_07_LISTENING_KEY = [
  4,3,3,4,2,1,
  2,2,2,1,4,3,3,
  1,4,4,3,3,4,
  1,1,2,2,3,3,2,3,2,1,3,2,3,
  1,3,3,2,
] as const;

export const N1_2012_07_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2012-07/question/page-02.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-03.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-04.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-05.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-06.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-07.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-08.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-09.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-10.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-11.jpg'),
] as const;

export const N1_2012_07_LISTENING_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2012-07/question/page-12.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-13.jpg'),
  require('../../../assets/jlpt/n1/2012-07/question/page-14.jpg'),
] as const;

export const N1_2012_07_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-02.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-03.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-04.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-05.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-06.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-07.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-08.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-09.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-10.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-11.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-12.jpg'),
  require('../../../assets/jlpt/n1/2012-07/answer-script/page-13.jpg'),
] as const;

export const N1_2012_07_AUDIO = require('../../../assets/jlpt/n1/2012-07/audio/n1-2012-07.mp3');
export const N1_2012_07_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2012-07/answer-script/page-01.jpg');

if (N1_2012_07_WRITTEN_KEY.length !== 70) throw new Error('N1 2012-07: written key must contain 70 responses');
if (N1_2012_07_LISTENING_KEY.length !== 36) throw new Error('N1 2012-07: listening key must contain 36 responses');
