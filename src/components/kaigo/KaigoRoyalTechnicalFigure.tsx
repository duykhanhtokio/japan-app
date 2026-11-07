import React,{useState} from 'react';
import {Image,Text,View,type ImageSourcePropType} from 'react-native';
import translations from '@/data/kaigo/royal-technical-labels.json';

type Kind='brain'|'respiratory'|'muscles'|'posture'|'wheelchair'|'pressure';
type Point={anchor:[number,number];target:[number,number]};
/** Percent coordinates on each independently authored 1536x1024 base. Endpoints are manually source-checked. */
export const royalTechnicalLeaders:Record<Kind,Point[]>={
 pressure:[
  {anchor:[8,24],target:[21.75,40.63]}, // posterior head at pillow contact
  {anchor:[8,37],target:[30.27,43.26]}, // scapular posterior region
  {anchor:[40,16],target:[37.83,43.55]}, // elbow at support surface
  {anchor:[67,17],target:[49.28,43.65]}, // posterior sacral/pelvic region
  {anchor:[92,32],target:[74.87,43.26]}, // posterior heel, not ankle
  {anchor:[92,75],target:[45.96,83.5]}, // buttock against seat
 ],
 wheelchair:[
  {anchor:[12,9],target:[24,14]}, // push handle grip
  {anchor:[91,19],target:[42,32]}, // back support fabric
  {anchor:[91,32],target:[52,40]}, // near arm support
  {anchor:[91,46],target:[52,54]}, // seat fabric
  {anchor:[12,45],target:[45.2,58.2]}, // parking brake at tire
  {anchor:[12,60],target:[20,66]}, // separate handrim
  {anchor:[12,73],target:[19.3,73]}, // drive wheel tire
  {anchor:[91,94],target:[68.2,86]}, // front caster
  {anchor:[91,81],target:[79,83]}, // footplate
  {anchor:[91,64],target:[74,69]}, // calf/leg support panel
  {anchor:[12,25],target:[24,18.8]}, // attendant brake below handle
  {anchor:[12,92],target:[18.3,83]}, // rear tipping lever
 ],
 posture:[
  {anchor:[8,18],target:[33,38]}, // chest-front cushion
  {anchor:[91,45],target:[61,41]}, // cushion under lower right leg
  {anchor:[91,20],target:[53,35]}, // separate cushion between legs
  {anchor:[91,71],target:[57,84]}, // cushion directly below flexed knees
 ],
 brain:[
  {anchor:[5,15],target:[35,20]}, // cerebrum
  {anchor:[5,40],target:[48,46]}, // diencephalon
  {anchor:[95,78],target:[68,72]}, // cerebellum
  {anchor:[5,60],target:[50,56]}, // midbrain above pons
  {anchor:[5,76],target:[47,68]}, // pons ventral bulge
  {anchor:[5,92],target:[52,82]}, // medulla below pons
 ],
 muscles:[
  {anchor:[6,22],target:[21.42,23.83]}, // deltoid front shoulder
  {anchor:[6,34],target:[25,26.85]}, // pectoralis major front chest
  {anchor:[6,46],target:[20.44,32.32]}, // biceps brachii front upper arm
  {anchor:[6,68],target:[25.39,58.59]}, // quadriceps front thigh
  {anchor:[94,28],target:[78.52,32.22]}, // triceps back upper arm
  {anchor:[94,53],target:[73.31,47.27]}, // gluteus maximus back buttock region
  {anchor:[94,73],target:[74.54,58.98]}, // biceps femoris outer back thigh
 ],
 respiratory:[
  {anchor:[5,6],target:[18,34]}, // nasal cavity in side view
  {anchor:[48,12],target:[28.5,47]}, // pharynx posterior to oral cavity
  {anchor:[48,88],target:[27.5,73]}, // larynx above trachea
  {anchor:[95,7],target:[74.7,25]}, // trachea in front view
  {anchor:[95,45],target:[68,49]}, // main bronchus entering lung
  {anchor:[95,92],target:[92,68]}, // lung tissue
 ],
};
export const royalTechnicalLabels=translations;
export function KaigoRoyalTechnicalFigure({kind,source,language='ja',expanded=false}:{kind:Kind;source:ImageSourcePropType;language?:string;expanded?:boolean}){
 const [width,setWidth]=useState(360);
 const ja=translations.ja;
 const tr=(translations as Record<string,typeof ja>)[language]??ja;
 const bilingual=(original:string,translated:string)=>tr===ja?original:original+' / '+translated;
 const labels=ja[kind].map((label,i)=>bilingual(label,tr[kind][i]));
 const view=kind==='pressure'?bilingual(ja.pressureView,tr.pressureView):kind==='wheelchair'?bilingual(ja.wheelchairView,tr.wheelchairView):kind==='posture'?bilingual(ja.postureView,tr.postureView):kind==='brain'?bilingual(ja.brainView,tr.brainView):kind==='muscles'?bilingual(ja.musclesView,tr.musclesView):bilingual(ja.respiratoryView,tr.respiratoryView);
 return <View testID={`kaigo-royal-${kind}`} style={{width:expanded?1000:'100%'}}>
  <Text style={{fontSize:16,color:'#243d4d',padding:8}}>{view}</Text>
  <View onLayout={event=>setWidth(event.nativeEvent.layout.width)} style={{width:'100%',aspectRatio:1.5}}>
   <Image source={source} accessibilityLabel={view} resizeMode="contain" style={{width:'100%',height:'100%'}} />
   {royalTechnicalLeaders[kind].map((point,i)=>{
    const ax=point.anchor[0]*width/100,ay=point.anchor[1]*width/150;
    const tx=point.target[0]*width/100,ty=point.target[1]*width/150;
    const length=Math.hypot(tx-ax,ty-ay),angle=Math.atan2(ty-ay,tx-ax)*180/Math.PI;
    return <React.Fragment key={i}>
     <View pointerEvents="none" style={{position:'absolute',left:(ax+tx-length)/2,top:(ay+ty)/2-0.75,width:length,height:1.5,backgroundColor:'#243d4d',transform:[{rotate:`${angle}deg`}]}} />
     <View pointerEvents="none" style={{position:'absolute',left:`${point.target[0]}%`,top:`${point.target[1]}%`,width:7,height:7,marginLeft:-3.5,marginTop:-3.5,borderRadius:4,backgroundColor:'#243d4d'}} />
     <View accessible accessibilityLabel={`${i+1}: ${labels[i]}`} style={{position:'absolute',left:`${point.anchor[0]}%`,top:`${point.anchor[1]}%`,width:24,height:24,marginLeft:-12,marginTop:-12,borderRadius:12,backgroundColor:'#243d4d',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:13,fontWeight:'700',color:'#fff8e9'}}>{i+1}</Text></View>
    </React.Fragment>;
   })}
  </View>
  <View style={{padding:8,gap:6}}>
   {labels.map((label,i)=><Text key={i} style={{fontSize:16,color:'#243d4d'}}>{i+1} · {label}</Text>)}
   {kind==='brain'&&<Text style={{fontSize:15,color:'#243d4d'}}>{bilingual(ja.brainstem,tr.brainstem)}</Text>}
   <Text style={{fontSize:14,lineHeight:21,color:'#526674'}}>{kind==='pressure'?bilingual(ja.pressureScope,tr.pressureScope):kind==='wheelchair'?bilingual(ja.wheelchairScope,tr.wheelchairScope):kind==='posture'?bilingual(ja.postureScope,tr.postureScope):kind==='muscles'?bilingual(ja.musclesScope,tr.musclesScope):bilingual(ja.scope,tr.scope)}</Text>
  </View>
 </View>;
}
