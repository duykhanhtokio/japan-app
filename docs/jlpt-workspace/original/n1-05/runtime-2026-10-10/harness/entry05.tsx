import {Image as QAImage} from 'react-native-web';
(QAImage as any).resolveAssetSource=(source:any)=>({uri:source.uri,width:source.__qaWidth,height:source.__qaHeight});
import React,{useState,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import N1OfficialTrial from '../../../../../../src/components/jlpt/N1OfficialTrial';
import {N1_ORIGINAL_05_TRIAL,N1_ORIGINAL_05_VISUALS,N1_ORIGINAL_05_SESSION_KEY} from '../../../../../../src/data/jlpt-original/n1/05/formal-trial';
const exam={id:'jpapp-n1-original-05-v1',level:'N1',title:'Japan App N1・AI作成模擬試験',periodLabel:'新作・第5回',startLabel:'試験を始める',storageKey:N1_ORIGINAL_05_SESSION_KEY,questions:N1_ORIGINAL_05_TRIAL,visualOptions:N1_ORIGINAL_05_VISUALS,audioSource:require('../../../../../../assets/jlpt-original/n1/05/audio/n1-original-05-listening-draft.mp3')};
function App(){const[open,setOpen]=useState(true);const registerExit=useCallback(()=>{},[]);return <SafeAreaProvider initialMetrics={{frame:{x:0,y:0,width:430,height:932},insets:{top:0,right:0,bottom:0,left:0}}}>{open?<N1OfficialTrial exam={exam} onExit={()=>setOpen(false)} registerExit={registerExit}/>:<button onClick={()=>setOpen(true)}>REOPEN EXAM</button>}</SafeAreaProvider>}
createRoot(document.getElementById('root')!).render(<App/>);
