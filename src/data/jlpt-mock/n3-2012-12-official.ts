import type { ImageSourcePropType } from 'react-native';

export const N3_2012_12_EXAM_ID = 'n3-2012-12-exam-02';
export const N3_2012_12_SOURCE = { questionPdfSha256: 'bacbc5bb97e3500a95f280252e6a19b784221b364e2eb2a1cbbe1d9e7e7cbed5', answerScriptPdfSha256: '812cb567515f881894eb723326ad41853e8f0e04aae158f6c6524a9e57f970b2', audioSha256: '9b965508753529a60d85a9ff7f376763183c7a7657f8570654f9fedb20ec249c' } as const;
export const N3_2012_12_WRITTEN_KEY = [2,3,4,2,1,3,1,4,4,2,1,3,4,1,1,3,3,4,4,2,1,3,1,2,2,2,3,4,3,1,3,4,1,2,2,4,4,1,2,2,1,2,3,3,1,3,2,1,2,3,3,1,4,4,2,4,3,1,2,1,2,3,1,2,4,3,3,4,1,1,3,3,2,3] as const;
export const N3_2012_12_LISTENING_KEY = [4,4,3,3,1,2,1,1,3,1,2,4,3,3,1,3,3,1,2,1,2,2,3,1,2,3,3,2] as const;
export const N3_2012_12_WRITTEN_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n3/2012-12/question/page-02.jpg'),require('../../../assets/jlpt/n3/2012-12/question/page-03.jpg'),require('../../../assets/jlpt/n3/2012-12/question/page-04.jpg'),require('../../../assets/jlpt/n3/2012-12/question/page-05.jpg'),require('../../../assets/jlpt/n3/2012-12/question/page-06.jpg'),require('../../../assets/jlpt/n3/2012-12/question/page-07.jpg'),require('../../../assets/jlpt/n3/2012-12/question/page-08.jpg'),require('../../../assets/jlpt/n3/2012-12/question/page-09.jpg')] as const;
export const N3_2012_12_LISTENING_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n3/2012-12/question/page-10.jpg'),require('../../../assets/jlpt/n3/2012-12/question/page-11.jpg')] as const;
export const N3_2012_12_SCRIPT_PAGES: readonly ImageSourcePropType[] = [require('../../../assets/jlpt/n3/2012-12/answer-script/page-09.jpg'),require('../../../assets/jlpt/n3/2012-12/answer-script/page-10.jpg'),require('../../../assets/jlpt/n3/2012-12/answer-script/page-11.jpg'),require('../../../assets/jlpt/n3/2012-12/answer-script/page-12.jpg'),require('../../../assets/jlpt/n3/2012-12/answer-script/page-13.jpg'),require('../../../assets/jlpt/n3/2012-12/answer-script/page-14.jpg')] as const;
export const N3_2012_12_AUDIO = require('../../../assets/jlpt/n3/2012-12/audio/n3-2012-12.mp3');
export const N3_2012_12_ANSWER_KEY_PAGE: ImageSourcePropType = require('../../../assets/jlpt/n3/2012-12/answer-script/page-14.jpg');
if (N3_2012_12_WRITTEN_KEY.length !== 74) throw new Error('N3 2012-12: written key must contain 74 responses');
if (N3_2012_12_LISTENING_KEY.length !== 28) throw new Error('N3 2012-12: listening key must contain 28 responses');
