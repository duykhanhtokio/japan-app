import type { ImageSourcePropType } from 'react-native';
export const N1_2015_07_EXAM_ID = 'n1-2015-07-exam-07';
export const N1_2015_07_SOURCE = { questionPdfSha256: 'e4f2567e7163c1645e96bf582aaa16cfe58e38503c7fcd96b7b2310c322ce2dc', answerScriptPdfSha256: '1a90673c58b3037738482cd09b5566bf051c194cd119c6979b1dd5c2955f0758', audioSha256: '37bb9bc85dba19522939e546b8d964bbd3f840160ec99f129a8154ebc11fb6a2' } as const;
export const N1_2015_07_WRITTEN_KEY = [
  4,1,2,4,3,2, 2,4,2,1,3,1,4, 4,4,3,1,2,1, 4,3,2,1,3,1,
  2,3,4,3,1,4,2,3,2,1, 3,2,4,1,4, 4,3,1,1,2,
  4,2,4,3, 2,2,4,3,1,3,2,2,1, 4,3,1,3, 1,2, 3,4,2,4, 3,1,
] as const;
/** 問題5の(3)には、原本の正答表上で2つの採点対象（1、4）がある。 */
export const N1_2015_07_LISTENING_KEY = [
  3,1,4,3,2,2, 2,2,2,1,3,4,2, 3,1,3,4,4,1,
  2,1,1,3,2,1,2,3,2,3,1,2,2,3, 3,1,1,4,
] as const;
export const N1_2015_07_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2015-07/question/page-02.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-03.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-04.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-05.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-06.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-07.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-08.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-09.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-10.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-11.jpg'),
] as const;
export const N1_2015_07_LISTENING_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n1/2015-07/question/page-12.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-13.jpg'), require('../../../assets/jlpt/n1/2015-07/question/page-14.jpg')] as const;
export const N1_2015_07_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2015-07/answer-script/page-02.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-03.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-04.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-05.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-06.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-07.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-08.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-09.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-10.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-11.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-12.jpg'), require('../../../assets/jlpt/n1/2015-07/answer-script/page-13.jpg'),
] as const;
export const N1_2015_07_AUDIO = require('../../../assets/jlpt/n1/2015-07/audio/n1-2015-07.mp3');
export const N1_2015_07_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2015-07/answer-script/page-01.jpg');
if (N1_2015_07_WRITTEN_KEY.length !== 70) throw new Error('N1 2015-07: written key must contain 70 responses');
if (N1_2015_07_LISTENING_KEY.length !== 37) throw new Error('N1 2015-07: listening key must contain 37 responses');
