import type { ImageSourcePropType } from 'react-native';

export const N3_2012_07_EXAM_ID = 'n3-2012-07-exam-01';
export const N3_2012_07_SOURCE = {
  questionPdfSha256: '5a0f5c2aa138bccfb399dacfbfb2ec7eb871ea8cb74738e5ad2885c77c0f7002',
  answerScriptPdfSha256: '4ef87dc0c9ddc0c835f7a57f4e04057e74f05f9b4c554ecea5e70d5a153d6f84',
  audioSha256: 'cebbc344923dc575bd12556f6cbbee5e60d01a27263e28e5c9cc099087b5c600',
} as const;

export const N3_2012_07_WRITTEN_KEY = [1,4,1,3,2,4,2,4,3,4,3,2,1,3,1,4,3,2,1,4,2,3,2,4,2,4,2,3,1,3,4,2,1,1,3,4,1,2,2,1,3,4,2,1,4,2,3,3,4,1,4,2,3,4,3,1,2,4,3,3,3,4,3,2,2,4,2,2,4,1,1,1,1,2] as const;
export const N3_2012_07_LISTENING_KEY = [4,3,4,1,3,1,4,4,3,4,1,4,3,3,1,1,2,3,1,3,2,1,1,2,2,1,1,3] as const;

export const N3_2012_07_WRITTEN_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n3/2012-07/question/page-02.jpg'),require('../../../assets/jlpt/n3/2012-07/question/page-03.jpg'),require('../../../assets/jlpt/n3/2012-07/question/page-04.jpg'),require('../../../assets/jlpt/n3/2012-07/question/page-05.jpg'),require('../../../assets/jlpt/n3/2012-07/question/page-06.jpg'),require('../../../assets/jlpt/n3/2012-07/question/page-07.jpg'),require('../../../assets/jlpt/n3/2012-07/question/page-08.jpg'),require('../../../assets/jlpt/n3/2012-07/question/page-09.jpg')] as const;
export const N3_2012_07_LISTENING_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n3/2012-07/question/page-09.jpg'),require('../../../assets/jlpt/n3/2012-07/question/page-10.jpg')] as const;
export const N3_2012_07_SCRIPT_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n3/2012-07/answer-script/page-09.jpg'),require('../../../assets/jlpt/n3/2012-07/answer-script/page-10.jpg'),require('../../../assets/jlpt/n3/2012-07/answer-script/page-11.jpg'),require('../../../assets/jlpt/n3/2012-07/answer-script/page-12.jpg'),require('../../../assets/jlpt/n3/2012-07/answer-script/page-13.jpg'),require('../../../assets/jlpt/n3/2012-07/answer-script/page-14.jpg')] as const;
export const N3_2012_07_AUDIO = require('../../../assets/jlpt/n3/2012-07/audio/n3-2012-07.mp3');
export const N3_2012_07_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n3/2012-07/answer-script/page-15.jpg');

if (N3_2012_07_WRITTEN_KEY.length !== 74) throw new Error('N3 2012-07: written key must contain 74 responses');
if (N3_2012_07_LISTENING_KEY.length !== 28) throw new Error('N3 2012-07: listening key must contain 28 responses');
