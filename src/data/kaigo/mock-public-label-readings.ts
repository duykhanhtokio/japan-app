import type {ImageSourcePropType} from 'react-native';
import data from './mock-public-label-readings.json';
import {mockRoyalQuestionRevision,type PublicMockFigureQuestion} from './royal-mock-figures';
const exactSources:Record<string,ImageSourcePropType>={
 's04-judgement-03':require('../../../assets/kaigo/practical/s04-judgement-03.webp'),
 's04-judgement-04':require('../../../assets/kaigo/practical/s04-judgement-04.webp'),
 's04-judgement-05':require('../../../assets/kaigo/practical/s04-judgement-05.webp'),
 's05-judgement-01':require('../../../assets/kaigo/practical/s05-judgement-01.webp'),
 's05-judgement-02':require('../../../assets/kaigo/practical/s05-judgement-02.webp'),
 's05-judgement-03':require('../../../assets/kaigo/practical/s05-judgement-03.webp'),
 's05-judgement-04':require('../../../assets/kaigo/practical/s05-judgement-04.webp'),
 's05-judgement-05':require('../../../assets/kaigo/practical/s05-judgement-05.webp'),
 's06-judgement-01':require('../../../assets/kaigo/practical/s06-judgement-01.webp'),
 's06-judgement-02':require('../../../assets/kaigo/practical/s06-judgement-02.webp'),
 's06-judgement-03':require('../../../assets/kaigo/practical/s06-judgement-03.webp'),
 's06-judgement-04':require('../../../assets/kaigo/practical/s06-judgement-04.webp'),
 's06-judgement-05':require('../../../assets/kaigo/practical/s06-judgement-05.webp'),
};
const exactAssetMetadata:Record<string,{path:string;sha256:string}>={
 's04-judgement-03':{path:'assets/kaigo/practical/s04-judgement-03.webp',sha256:'4c9f7bee69312f722f1533d22bb504cad14e00f3f68e266cdabdc80a5de11a29'},
 's04-judgement-04':{path:'assets/kaigo/practical/s04-judgement-04.webp',sha256:'6b5ed7ed167e68dd442041add6320314b0eb4e91be5e4c94c95215e613745705'},
 's04-judgement-05':{path:'assets/kaigo/practical/s04-judgement-05.webp',sha256:'c29c1a3d423c3b5378c77b286b34c2992ed497b2a1b49bf3cc3ef0b145415d94'},
 's05-judgement-01':{path:'assets/kaigo/practical/s05-judgement-01.webp',sha256:'d56420a2d04d351b5585c3e68aca747f67d054cec217376bdc7a628bed667f9c'},
 's05-judgement-02':{path:'assets/kaigo/practical/s05-judgement-02.webp',sha256:'73febaf884c3d8e85ebfec4816c85be361aed5352e068c34e8ca635e239de852'},
 's05-judgement-03':{path:'assets/kaigo/practical/s05-judgement-03.webp',sha256:'408adef8d101e99d1f790b7a2d7eb630570cdc247f746a71ecf409ad9a20d184'},
 's05-judgement-04':{path:'assets/kaigo/practical/s05-judgement-04.webp',sha256:'54bc934f72e86c8ca31f7270e072d9753a6b0594276887abe2ea3c8f8171e51d'},
 's05-judgement-05':{path:'assets/kaigo/practical/s05-judgement-05.webp',sha256:'1c214fb6c48db21af12a7c3c53a375bc9478e9b22285af47625c7dbaf3e28b07'},
 's06-judgement-01':{path:'assets/kaigo/practical/s06-judgement-01.webp',sha256:'43ff32b4a0e8e13dd982a7cc06becbd6ef2d0a2cc932384f86a822120e4a961b'},
 's06-judgement-02':{path:'assets/kaigo/practical/s06-judgement-02.webp',sha256:'42db5031016ef9f444c8ca72cc19e6e9e7e0c5e17dd1179b325dab144fa118a9'},
 's06-judgement-03':{path:'assets/kaigo/practical/s06-judgement-03.webp',sha256:'8551e14d3a41e4513be59a21b4c7308c6cab1ec9faa661f48a3cbb644ec21a93'},
 's06-judgement-04':{path:'assets/kaigo/practical/s06-judgement-04.webp',sha256:'2759d9156b93ad4449d965a1b43917afecf6e8e28fa049ef81393f95e7c839ae'},
 's06-judgement-05':{path:'assets/kaigo/practical/s06-judgement-05.webp',sha256:'725a4c8dc1be1193029ceba2c0e67bd531de902fc9b2edd688b2dd3243281920'},
};
export function isKnownMockPublicLabelKey(key:string|null){return key!==null&&Object.prototype.hasOwnProperty.call(exactSources,key);}
/** Public conditions and exact bundled source only. Answers/rationales never enter this selector. */
export function mockPublicLabelsFor(q:PublicMockFigureQuestion,actualSource:ImageSourcePropType){
 const b=data.bindings.find(b=>b.questionId===q.id&&b.figureKey===q.figureKey);
 if(!b||b.publicQuestionRevision!==mockRoyalQuestionRevision(q)||exactSources[b.figureKey]!==actualSource
  ||b.assetPath!==exactAssetMetadata[b.figureKey]?.path||b.assetSha256!==exactAssetMetadata[b.figureKey]?.sha256
  ||!Array.isArray(b.labels)||!b.labels.length||b.labels.some(l=>!l||typeof l.text!=='string'||!l.text||!Array.isArray(l.tokens)||!l.tokens.length
   ||l.tokens.some(t=>!t||typeof t.text!=='string'||(/[一-龯々]/.test(t.text)&&(!('readingKana' in t)||!/^[ぁ-ゖー]+$/.test(t.readingKana as string))))
   ||l.tokens.map(t=>t.text).join('')!==l.text))return undefined;
 return b;
}
