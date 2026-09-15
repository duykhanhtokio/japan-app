import type { ImageSourcePropType } from 'react-native';
export const N1_2016_07_EXAM_ID = 'n1-2016-07-exam-09';
export const N1_2016_07_SOURCE = { questionPdfSha256: '17d194a177d93b6f5ab1d95b22761892afdb44f0c88bcdbbddb40a852c26ea4b', answerScriptPdfSha256: '4bc0b4a1a614821a1153c6b0444c036fd90d9700d0f4afa3cc404fab5b7818bd', audioSha256: '9a8736a5dabfd80d502caf42450614b394aac19e769b6931b5e4f09a7f32515e' } as const;
export const N1_2016_07_WRITTEN_KEY = [
  3,4,1,3,2,4, 4,1,3,2,1,3,2, 1,2,2,4,3,1, 3,4,1,2,2,4,
  4,3,4,1,3,2,4,1,2,1, 2,3,3,4,1, 4,2,3,2,1,
  2,3,3,4, 2,1,4,3,1,2,2,4,1, 4,3,1,2, 3,4, 1,2,4,4, 3,1,
] as const;
/** 問題5の(3)には、原本の正答表上で2つの採点対象（2、3）がある。 */
export const N1_2016_07_LISTENING_KEY = [
  4,2,2,1,3,3, 3,1,2,4,4,3,2, 2,3,1,3,2,4,
  3,1,1,3,1,2,3,3,2,2,1,2,3,1, 1,4,2,3,
] as const;
export const N1_2016_07_WRITTEN_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2016-07/question/page-02.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-03.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-04.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-05.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-06.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-07.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-08.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-09.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-10.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-11.jpg'),
] as const;
export const N1_2016_07_LISTENING_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n1/2016-07/question/page-12.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-13.jpg'), require('../../../assets/jlpt/n1/2016-07/question/page-14.jpg')] as const;
export const N1_2016_07_SCRIPT_PAGES: readonly ImageSourcePropType[] = [
  require('../../../assets/jlpt/n1/2016-07/answer-script/page-02.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-03.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-04.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-05.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-06.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-07.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-08.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-09.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-10.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-11.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-12.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-13.jpg'), require('../../../assets/jlpt/n1/2016-07/answer-script/page-14.jpg'),
] as const;
export const N1_2016_07_AUDIO = require('../../../assets/jlpt/n1/2016-07/audio/n1-2016-07.mp3');
export const N1_2016_07_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n1/2016-07/answer-script/page-01.jpg');
if (N1_2016_07_WRITTEN_KEY.length !== 70) throw new Error('N1 2016-07: written key must contain 70 responses');
if (N1_2016_07_LISTENING_KEY.length !== 37) throw new Error('N1 2016-07: listening key must contain 37 responses');
