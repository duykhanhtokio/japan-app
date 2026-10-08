import {Image as QAImage} from 'react-native-web';
(QAImage as any).resolveAssetSource=(source:any)=>({uri:source.uri,width:source.__qaWidth,height:source.__qaHeight});
import React,{useState,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import N1OfficialTrial from '../../../../../../src/components/jlpt/N1OfficialTrial';
import {N2_ORIGINAL_03_TRIAL,N2_ORIGINAL_03_VISUALS,N2_ORIGINAL_03_SESSION_KEY} from '../../../../../../src/data/jlpt-original/n2/03/formal-trial';
const exam={id:'jpapp-n2-original-03-v1',level:'N2',title:'Japan App N2・AI作成模擬試験',periodLabel:'新作・第3回',startLabel:'試験を始める',storageKey:N2_ORIGINAL_03_SESSION_KEY,questions:N2_ORIGINAL_03_TRIAL,visualOptions:N2_ORIGINAL_03_VISUALS,audioSource:require('../../../../../../assets/jlpt-original/n2/03/audio/n2-original-03-listening-draft.mp3')};
function App(){const[open,setOpen]=useState(true);const registerExit=useCallback(()=>{},[]);return <SafeAreaProvider initialMetrics={{frame:{x:0,y:0,width:430,height:932},insets:{top:0,right:0,bottom:0,left:0}}}>{open?<N1OfficialTrial exam={exam} onExit={()=>setOpen(false)} registerExit={registerExit}/>:<button onClick={()=>setOpen(true)}>REOPEN EXAM</button>}</SafeAreaProvider>}
createRoot(document.getElementById('root')!).render(<App/>);
