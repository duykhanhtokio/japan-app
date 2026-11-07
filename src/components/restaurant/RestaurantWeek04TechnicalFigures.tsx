import {sameRestaurantFigureIdentity} from './RestaurantFigureIdentity';
import {Image,ScrollView,Text,View} from 'react-native';
import type {SourceFigure31} from '@/data/restaurant/source31';
import data from '@/data/restaurant/royal-week04-technical.json';
const artwork=require('../../../assets/restaurant/royal-weekly-20261107/week04/animals-body-objects.webp');
const knives=require('../../../assets/restaurant/royal-weekly-20261107/week04/knives-object-atlas.webp');
const hazards=require('../../../assets/restaurant/royal-weekly-20261107/week04/hazards-object-atlas.webp');
const machines=require('../../../assets/restaurant/royal-weekly-20261107/week04/machines-object-atlas.webp');
const ink='#173c4b',paper='#fffaf0';
export function restaurantWeek04TechnicalKind(figure:SourceFigure31):string|null{
 const b=data.bindings.find(x=>x.figureId===figure.id);if(!b||figure.quizSafe!==false||figure.cropBox)return null;
 const f=b.figure;if(['sourceHash','assetFile','sha256','width','height','captionJa','altJa'].some(k=>(figure as any)[k]!==(f as any)[k]))return null;
 const pack=b.level==='1'?require('../../data/restaurant/source31/1.json'):require('../../data/restaurant/source31/2.json');const row=pack.lessons[b.lessonId];
 return row?.sourceHash===b.rowSourceHash&&row.figures.some((f:SourceFigure31)=>sameRestaurantFigureIdentity(f,figure))?b.kind:null;
}
type Props={kind:string;language?:string;showTranslation?:boolean;width?:number};
export function RestaurantWeek04TechnicalFigure({kind,language='ja',showTranslation=false,width=320}:Props){
 const labels=data.labels as Record<string,{ja:string;translations:Record<string,string>}>;
 const label=(key:string)=>{const d=labels[key];return d?<View style={{gap:3}}><Text selectable style={{fontSize:17,lineHeight:27,color:ink}}>{d.ja}</Text>{showTranslation&&language!=='ja'&&d.translations[language]&&<Text selectable style={{fontSize:17,lineHeight:27,color:'#344b61'}}>{d.translations[language]}</Text>}</View>:<Text selectable style={{fontSize:17,lineHeight:27,color:ink}}>{key}</Text>};
 const cell=(key:string,value:string,i:number)=><View key={i} style={{width:145,padding:8,borderWidth:.5,borderColor:'#b6c4c8'}}>{label(value)}</View>;
 const table=(headers:string[],rows:string[][])=><ScrollView horizontal testID={`restaurant-week04-table-${kind}`}><View>{[headers,...rows].map((row,i)=><View key={i} testID={`restaurant-week04-record-row-${i}`} style={{flexDirection:'row',backgroundColor:i===0?'#f0dfbc':i%2?'#fffaf0':'#f1f3ef'}}>{row.map((v,j)=>cell(String(j),v,j))}</View>)}</View></ScrollView>;
 if(kind.startsWith('meat-')){
  const animal=kind.slice(5) as keyof typeof data.meat,crop=animal==='beef'?{x:430,y:0,w:690,h:341}:animal==='pork'?{x:430,y:341,w:690,h:342}:{x:530,y:683,w:450,h:341},w=Math.min(620,Math.max(230,width-24)),scale=w/crop.w,h=crop.h*scale,parts=data.meat[animal] as [string,number,number][];
  return <View testID={`restaurant-week04-native-${kind}`} style={{padding:12,gap:12,backgroundColor:paper}}><View style={{width:w,height:h,overflow:'hidden',position:'relative'}}><Image source={artwork} resizeMode="contain" style={{position:'absolute',width:1536*scale,height:1024*scale,left:-crop.x*scale,top:-crop.y*scale}}/>{parts.map((p,i)=><View key={p[0]} testID={`restaurant-meat-marker-${i+1}`} style={{position:'absolute',left:p[1]*w/100-12,top:p[2]*h/100-12,width:24,height:24,borderRadius:12,backgroundColor:'#fffaf0',borderWidth:1,borderColor:ink,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:16,color:ink,fontWeight:'700'}}>{i+1}</Text></View>)}</View>{parts.map((p,i)=><View key={p[0]} style={{flexDirection:'row',gap:10}}><Text style={{fontSize:17,color:ink}}>{i+1}.</Text>{label(p[0])}</View>)}{label('approximate')}</View>;
 }
 const art=(source:number,index:number,cols:number,rows:number,knife=false)=>{const w=Math.min(520,Math.max(220,width-24)),cw=1536/cols,ch=knife?220:1024/rows,x=index%cols*cw,y=knife?(index<4?200:650):Math.floor(index/cols)*ch,scale=w/cw;return <View testID={`restaurant-week04-object-${kind}-${index}`} style={{width:w,height:ch*scale,position:'relative',overflow:'hidden'}}><Image source={source} resizeMode="contain" style={{position:'absolute',width:1536*scale,height:1024*scale,left:-x*scale,top:-y*scale}}/></View>};
 if(kind==='eight-knives'||kind==='kitchen-hazards'||kind==='machine-guards'){
  const prefix=kind==='eight-knives'?'knife':kind==='kitchen-hazards'?'hazard':'machine',count=prefix==='knife'?8:prefix==='hazard'?12:4,source=prefix==='knife'?knives:prefix==='hazard'?hazards:machines;
  return <View testID={`restaurant-week04-native-${kind}`} style={{padding:12,gap:20,backgroundColor:paper}}>{Array.from({length:count},(_,i)=><View key={i} style={{gap:8}}>{label(prefix+i)}{art(source,i,prefix==='machine'?2:4,prefix==='hazard'?3:2,prefix==='knife')}</View>)}{prefix!=='hazard'&&label(prefix==='knife'?'knifeNote':'machineNote')}</View>;
 }
 if(kind==='accident-reference-2022')return <View testID="restaurant-week04-native-accident-reference-2022" style={{padding:12,gap:16,backgroundColor:paper}}><Text style={{fontSize:22,color:ink}}>2022 / 令和4年</Text>{[30,20,15,10,6,5,4,4,6].map((value,i)=><View key={i} style={{gap:6}}>{label('accident'+i)}<View style={{flexDirection:'row',alignItems:'center',gap:10}}><View testID={`restaurant-accident-bar-${i}`} style={{height:22,width:`${value/30*75}%`,backgroundColor:'#087d84'}}/><Text style={{fontSize:20,color:ink}}>{value}%</Text></View></View>)}{label('chartNote')}</View>;
 if(kind==='distribution-paths')return <View testID="restaurant-week04-native-distribution-paths" style={{padding:12,gap:22,backgroundColor:paper}}>{[[0,1,2,4,5],[0,1,3,4,5],[0,3,4,5]].map((route,i)=><View key={i} testID={`restaurant-distribution-route-${i}`} style={{gap:6}}>{route.map((node,j)=><View key={j} style={{gap:6}}>{j>0&&<Text style={{fontSize:22,color:'#087d84',paddingLeft:16}}>↓</Text>}<View testID={`restaurant-distribution-node-${node}`} style={{padding:12,borderWidth:1,borderColor:'#b6c4c8',borderRadius:8,backgroundColor:'#f0e4c9'}}>{label('route'+node)}</View></View>)}</View>)}{label('routeNote')}</View>;
 const menus=['menuCold','menuHot','menuHeld','curry','potatoSalad'],processes=['cold','hot','held','reheated','cooled'];
 if(kind==='five-process-plan')return <View testID="restaurant-week04-native-five-process-plan" style={{padding:12,gap:12,backgroundColor:paper}}>{table(['processTitle','menu','method'],processes.map((p,i)=>[p,menus[i],['methodCold','methodHot','methodHeld','methodReheated','methodCooled'][i]]))}{label('note')}</View>;
 const general=kind.startsWith('general-'),monthly=kind.endsWith('monthly');
 const headers=general?(monthly?['date','receiving','fridge','freezer','cross','utensils','toilet','health','hands','dailyCheck','checker']:['date','temperature','receiving','hands','dailyCheck','checker']):['date',...processes,...(monthly?['dailyCheck']:[]),'checker'];
 const rows:string[][]=[];
 if(!general)rows.push(['menu',...menus,...(monthly?['—']:[]),'—']);
 for(let day=1;day<=(monthly?31:3);day++){
  const date=monthly?String(day):`5/${day}`;
  if(general&&monthly)rows.push(day<=2?[date,'pass',day===1?'4°C':'12°C','−18°C','pass','pass','pass','pass',day===1?'fail':'pass','done',day===1?'田中':'佐藤']:[date,...Array(10).fill('')]);
  else if(general)rows.push(day<=2?[date,day===1?'4°C / −18°C':'12°C / −18°C','pass',day===1?'fail':'pass','done',day===1?'田中':'佐藤']:[date,...Array(5).fill('—')]);
  else rows.push(day===1?[date,'pass','fail','pass','pass','pass',...(monthly?['done']:[]),'山田']:day===2&&monthly?[date,...Array(5).fill('pass'),'done','山田']:[date,...Array(monthly?7:6).fill(monthly?'':'—')]);
 }
 return <View testID={`restaurant-week04-native-${kind}`} style={{padding:12,gap:12,backgroundColor:paper}}>{table(headers,rows)}{label(general?'generalNote':'criticalNote')}</View>;
}
