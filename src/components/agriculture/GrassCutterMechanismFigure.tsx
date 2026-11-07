import {AgricultureLateFourRuby} from './AgricultureLateFourRuby';
import {Text, View} from 'react-native';
import Svg, {Circle, Defs, Ellipse, G, Line, LinearGradient, Path, Rect, Stop} from 'react-native-svg';
import data from '@/data/agriculture/grass-cutter-mechanism-figure.json';
import content from '@/data/agriculture/lessons.ja.json';

type Colors = {text:string; translation:string; translationText:string; border:string};
type Props = {lessonId:string; lessonSourceHash:string; lessonRevision?:string; level?:string; language?:string; showTranslation?:boolean; colors:Colors};
/** Stale lesson revisions or incomplete locale labels cannot acquire this source-specific figure. */
export function grassCutterMechanismLabels(id:string, hash:string, revision:string|undefined, level:string|undefined, language:string) {
 const lesson=content.lessons.find(l=>l.id===id);
 if(data.schemaVersion!==1||id!==data.lessonId||hash!==data.sourceHash||revision!==data.revision||level!=='2'||!lesson||lesson.sourceHash!==hash||lesson.revision!==revision||!lesson.levels.includes(level)||data.paragraphIds.some((p,i)=>lesson.paragraphs.find(x=>x.id===p)?.textJa!==data.sourceParagraphs[i]))return null;
 const labels=(data.locales as Record<string,string[]>)[language];
 return labels?.length===7&&labels.every(t=>typeof t==='string'&&!!t.trim())?labels:null;
}
const steel='#b5c5d5', navy='#152e4e', gold='#b98d3c';
const polar=(radius:number,angle:number)=>`${120+radius*Math.cos(angle)},${108+radius*Math.sin(angle)}`;
// An illustrative tipped saw silhouette, not a tooth count or dimensional specification.
const sawOutline=Array.from({length:32},(_,i)=>{
 const a=i*Math.PI/16;
 return `${i?'L':'M'}${polar(75,a)} L${polar(88,a+0.025)} L${polar(86,a+0.095)} L${polar(75,a+0.12)}`;
}).join(' ')+' Z';
function Materials(){return <Defs>
 <LinearGradient id="agri-cutter-steel" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#f6fbff"/><Stop offset="0.34" stopColor="#b6c7d9"/><Stop offset="0.58" stopColor="#eff4f8"/><Stop offset="1" stopColor="#718ba8"/></LinearGradient>
 <LinearGradient id="agri-cutter-navy" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor="#466589"/><Stop offset="1" stopColor="#132d4d"/></LinearGradient>
 <LinearGradient id="agri-cutter-paper" x1="0" y1="0" x2="1" y2="1"><Stop offset="0" stopColor="#fffdf5"/><Stop offset="1" stopColor="#e9eff5"/></LinearGradient>
 </Defs>;}
function CutterAppearance({nylon=false}:{nylon?:boolean}){return <Svg width="100%" height={210} viewBox="0 0 240 220" accessible={false}>
 <Materials/><Rect x={2} y={2} width={236} height={216} rx={18} fill="url(#agri-cutter-paper)" stroke="#c8ac72"/>
 <Ellipse cx={120} cy={195} rx={72} ry={9} fill={navy} opacity={0.12}/>
 {nylon?<G>
  <Path d="M 75 116 Q 38 110 19 133 M 165 116 Q 202 110 221 133" fill="none" stroke="#c87c27" strokeWidth={6} strokeLinecap="round"/>
  <Path d="M 75 114 Q 38 108 19 131 M 165 114 Q 202 108 221 131" fill="none" stroke="#ffd081" strokeWidth={2} strokeLinecap="round"/>
  <Path d="M 69 94 L 69 135 C 69 161 171 161 171 135 L 171 94 Z" fill="url(#agri-cutter-navy)" stroke={navy} strokeWidth={2}/>
  <Ellipse cx={120} cy={94} rx={51} ry={23} fill="url(#agri-cutter-steel)" stroke={navy} strokeWidth={2}/>
  <Ellipse cx={120} cy={94} rx={38} ry={16} fill="#36557a" stroke="#94acc4"/>
  <Ellipse cx={120} cy={94} rx={15} ry={7} fill="#152b47" stroke="#c6d6e3"/>
  <Path d="M 83 119 Q 120 133 157 119 M 83 130 Q 120 144 157 130" fill="none" stroke="#7896b4" strokeWidth={2}/>
  {[90,105,120,135,150].map(x=><Line key={x} x1={x} x2={x} y1={139} y2={145} stroke="#708eae" strokeWidth={2}/>)}
 </G>:<G>
  <Path d={sawOutline} fill="url(#agri-cutter-steel)" stroke="#526b86" strokeWidth={1.4}/>
  {Array.from({length:32},(_,i)=><Path key={i} d={`M${polar(82,i*Math.PI/16+0.018)} L${polar(89,i*Math.PI/16+0.025)} L${polar(87,i*Math.PI/16+0.09)}`} fill="none" stroke="#d0af67" strokeWidth={3}/>)}
  <Circle cx={120} cy={108} r={60} fill="none" stroke="#819bb4" strokeWidth={0.8}/>
  <Circle cx={120} cy={108} r={21} fill="#e6edf4" stroke="#7d96ad"/>
  <Circle cx={120} cy={108} r={10} fill="#f5f3e9" stroke="#526b86" strokeWidth={2}/>
  {[0,1,2,3].map(i=><Circle key={i} cx={120+43*Math.cos(i*Math.PI/2+0.5)} cy={108+43*Math.sin(i*Math.PI/2+0.5)} r={5} fill="#f5f3e9" stroke="#8b9fb2"/>)}
 </G>}
 </Svg>;}
function RotationConcept(){return <Svg width="100%" height={230} viewBox="0 0 360 230" accessible={false}>
 <Materials/><Rect x={2} y={2} width={356} height={226} rx={18} fill="url(#agri-cutter-paper)" stroke="#c8ac72"/>
 {/* Side-view conceptual vertical plane only: no hidden assembly or number of knives is specified. */}
 <Path d="M 185 30 C 92 6 67 146 146 164" fill="none" stroke={gold} strokeWidth={5}/>
 <Path d="M 185 30 l -14 -2 l 7 13 M 146 164 l -7 -12 l -6 12" fill="none" stroke={gold} strokeWidth={3} strokeLinejoin="round"/>
 <Circle cx={138} cy={99} r={50} fill="#dbe7ef" fillOpacity={0.65} stroke="#66849e" strokeWidth={2} strokeDasharray="5 5"/>
 <Line x1={138} y1={49} x2={138} y2={149} stroke="#8ba2b7" strokeDasharray="4 5"/>
 <Circle cx={138} cy={99} r={8} fill="url(#agri-cutter-navy)" stroke="#a5b8ca" strokeWidth={2}/>
 <Path d="M 138 107 L 138 136 Q 138 146 153 147 L 165 147 L 165 157 L 143 157 Q 127 156 127 142 L 127 110 Z" fill="url(#agri-cutter-steel)" stroke="#526b86" strokeWidth={2}/>
 <Path d="M 34 193 Q 31 167 20 158 M 36 193 Q 40 163 53 156 M 48 193 Q 51 176 65 168 M 25 193 Q 22 181 13 177 M 57 193 Q 65 169 76 165" fill="none" stroke="#3e7c48" strokeWidth={4} strokeLinecap="round"/>
 <Line x1={95} y1={190} x2={220} y2={190} stroke="#688972" strokeWidth={3}/>
 <Path d="M 208 184 l 12 6 l -12 6" fill="none" stroke="#688972" strokeWidth={3}/>
 {[[249,187],[271,197],[291,181],[309,198],[331,184],[253,206],[291,211]].map(([x,y],i)=><Path key={i} d={`M ${x} ${y} l ${i%2?7:-6} -7`} stroke="#498552" strokeWidth={4} strokeLinecap="round"/>)}
 <Line x1={12} y1={216} x2={348} y2={216} stroke="#baa379" strokeWidth={2}/>
 </Svg>;}
export function GrassCutterMechanismFigure({lessonId,lessonSourceHash,lessonRevision,level,language='ja',showTranslation=false,colors}:Props){
 const ja=grassCutterMechanismLabels(lessonId,lessonSourceHash,lessonRevision,level,'ja');if(!ja)return null;
 const ruby=(field:string,value:string,style:{color:string;fontSize:number;lineHeight:number;fontWeight?:'700'})=><AgricultureLateFourRuby provider="grass-mechanism" lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} language="ja" field={field} text={value} style={style} color={colors.translationText}/>;
 const t=showTranslation&&language!=='ja'?grassCutterMechanismLabels(lessonId,lessonSourceHash,lessonRevision,level,language):null;
 const text={color:colors.translationText,fontSize:16,lineHeight:27};
 const label=(i:number,reading?:string)=><View style={{gap:3}}>{!!reading&&<Text style={{...text,fontSize:11,lineHeight:16}}>{reading}</Text>}<Text style={{...text,fontWeight:'700'}}>{ja[i]}</Text>{!!t&&<Text style={text}>{t[i]}</Text>}</View>;
 return <View testID="agri-grass-cutter-mechanisms" style={{marginVertical:12,gap:14,padding:12,borderWidth:1,borderColor:colors.border,borderRadius:12}}>
  {label(0,'かりばのしゅるいと かいてんするめん')}
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>
   <View testID="agri-tipped-saw-example" accessible accessibilityRole="image" accessibilityLabel={(t||ja)[1]} style={{flexGrow:1,flexBasis:220,minWidth:0,gap:6}}><CutterAppearance/>{label(1)}</View>
   <View testID="agri-nylon-line-example" accessible accessibilityRole="image" accessibilityLabel={(t||ja)[2]} style={{flexGrow:1,flexBasis:220,minWidth:0,gap:6}}><CutterAppearance nylon/>{label(2)}</View>
  </View>
  {label(3)}
  <View testID="agri-hammer-vertical-plane" accessible accessibilityRole="image" accessibilityLabel={`${(t||ja)[4]}。${(t||ja)[5]}`} style={{gap:6}}><RotationConcept/>{label(4,'たてに かいてんするめん')}{label(5,'くさを こまかく くだく')}</View>
  {ruby('label:6',ja[6],text)}{!!t&&<Text testID="agri-grass-mechanism-localized-limit" style={text}>{t[6]}</Text>}
  <Text style={{...text,fontSize:13}}>AGR-S2 · PDF p.50 / p.48</Text>
 </View>;
}
