import {Image as QAImage} from '/workspace/scratch/6726c3944d46/japan-app/node_modules/react-native-web';
(QAImage as any).resolveAssetSource=(source:any)=>({uri:source.uri,width:source.__qaWidth,height:source.__qaHeight});
import React,{useState,useCallback} from '/workspace/scratch/6726c3944d46/japan-app/node_modules/react';
import {createRoot} from '/workspace/scratch/6726c3944d46/japan-app/node_modules/react-dom/client';
import {SafeAreaProvider} from '/workspace/scratch/6726c3944d46/japan-app/node_modules/react-native-safe-area-context';
import N1OfficialTrial from '/workspace/scratch/6726c3944d46/japan-app/src/components/jlpt/N1OfficialTrial';
import {N3_ORIGINAL_01_TRIAL,N3_ORIGINAL_01_VISUALS,N3_ORIGINAL_01_SESSION_KEY} from '/workspace/scratch/6726c3944d46/japan-app/src/data/jlpt-original/n3/01/formal-trial';
const exam={id:'jpapp-n3-original-01-v1',level:'N3',title:'Japan App N3・AI作成模擬試験',periodLabel:'新作・第1回',startLabel:'試験を始める',storageKey:N3_ORIGINAL_01_SESSION_KEY,questions:N3_ORIGINAL_01_TRIAL,visualOptions:N3_ORIGINAL_01_VISUALS,audioSource:require('/workspace/scratch/6726c3944d46/japan-app/assets/jlpt-original/n3/01/audio/n3-original-01-listening-draft.mp3')};
function App(){const[open,setOpen]=useState(true);const registerExit=useCallback(()=>{},[]);return <SafeAreaProvider initialMetrics={{frame:{x:0,y:0,width:430,height:932},insets:{top:0,right:0,bottom:0,left:0}}}>{open?<N1OfficialTrial exam={exam} onExit={()=>setOpen(false)} registerExit={registerExit}/>:<button onClick={()=>setOpen(true)}>REOPEN EXAM</button>}</SafeAreaProvider>}
createRoot(document.getElementById('root')!).render(<App/>);
