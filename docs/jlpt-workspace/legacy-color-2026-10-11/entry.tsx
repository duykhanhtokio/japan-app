import React from 'react';import {createRoot} from 'react-dom/client';import {Image} from 'react-native-web';
(Image as any).resolveAssetSource=(s:any)=>({uri:s.uri,width:s.__qaWidth,height:s.__qaHeight});
import {QuestionBlock} from '../../../src/components/jlpt/N1OfficialTrial';
import {APPROVED_N1_EXAMS} from '../../../src/data/jlpt-official/approved-n1-exams';
const exams=APPROVED_N1_EXAMS.filter(e=>!e.id.startsWith('jpapp-')&&e.questions.some(q=>q.visualOptionPage));
const p=new URLSearchParams(location.search),exam=exams.find(e=>e.id===p.get('exam'))||exams[0];const images=exam.questions.filter(q=>q.visualOptionPage&&(!p.get('question')||q.id===p.get('question')));
(window as any).qa={exams:exams.map(e=>({id:e.id,images:e.questions.filter(q=>q.visualOptionPage).length})),images:images.map(q=>q.id)};
function App(){return <div style={{maxWidth:744,margin:'0 auto',padding:18}}>{images.map(q=><QuestionBlock key={q.id} question={q} scale={1} submitted={false} visualOptions={exam.visualOptions} onChoose={()=>{}} onLayout={()=>{}} onFocus={()=>{}}/>)}</div>}createRoot(document.getElementById('root')!).render(<App/>);
