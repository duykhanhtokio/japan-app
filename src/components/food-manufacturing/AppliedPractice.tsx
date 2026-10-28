import {ScrollView,StyleSheet,Text,View,useWindowDimensions} from 'react-native';
import {Image} from 'expo-image';

type Data=Record<string,any>;
type Props={item:{exerciseData?:Data;answerJa?:string};textColor?:string;language?:string;showTranslation?:boolean};
const ink='#20394c',blue='#236b91',gold='#c18727',red='#b23d3d';
const esc=(v:unknown)=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const label=(x:number,y:number,v:unknown,size=17,anchor='middle',color=ink)=>`<text x="${x}" y="${y}" font-family="sans-serif" font-size="${size}" fill="${color}" text-anchor="${anchor}">${esc(v)}</text>`;
const line=(x1:number,y1:number,x2:number,y2:number,color=ink,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
function Graphic({height,body,description}:{height:number;body:string;description:string}){
 const width=Math.min(860,Math.max(220,useWindowDimensions().width-48));
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="760" height="${height}" viewBox="0 0 760 ${height}"><rect width="760" height="${height}" fill="#fffdf8"/>${body}</svg>`;
 return <View style={{maxWidth:'100%',gap:6}}>{width<760&&<Text style={s.note}>図は横に動かして、文字と目盛りを確認できます。</Text>}<ScrollView horizontal nestedScrollEnabled accessibilityLabel="横にスクロールできる学習図" style={{maxWidth:'100%'}}><Image accessibilityLabel={description} source={{uri:`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}} contentFit="contain" style={{width:760,height}}/></ScrollView></View>;
}
function Table({heads,rows}:{heads:string[];rows:unknown[][]}){
 const wide=heads.length>4;
 const table=<View style={[s.table,wide&&{width:Math.max(620,heads.length*105)}]}><View style={[s.tr,s.th]}>{heads.map((h,i)=><Text key={i} style={[s.cell,s.bold]}>{h}</Text>)}</View>{rows.map((row,i)=><View key={i} style={s.tr}>{row.map((v,j)=><Text key={j} style={s.cell}>{String(v??'—')}</Text>)}</View>)}</View>;
 return wide?<ScrollView horizontal nestedScrollEnabled accessibilityLabel="横にスクロールできる学習表" style={{maxWidth:'100%'}}>{table}</ScrollView>:table;
}
function bars(values:number[],names:string[],title:string,yUnit='度数'){
 const max=Math.max(...values,1),x0=70,y0=235,w=620,h=165,bw=w/values.length;
 let body=label(380,25,title,21)+label(20,65,yUnit,15,'start')+line(x0,55,x0,y0)+line(x0,y0,700,y0);
 [0,max/2,max].forEach(v=>body+=label(58,y0-v/max*h+5,Number(v.toFixed(1)),14,'end'));
 values.forEach((v,i)=>{const x=x0+i*bw,y=y0-v/max*h;body+=`<rect x="${x}" y="${y}" width="${bw}" height="${y0-y}" fill="${blue}" stroke="#fffdf8" stroke-width="1"/>`+label(x+bw/2,y-7,v,15)+label(x+bw/2,260,names[i]??String(i+1),14);});
 return body;
}
function control(values:number[],name:string,d:Data){
 const x0=125,y0=210,w=575,h=150,lo=Math.min(d.LCL-.5,...values),hi=Math.max(d.UCL+.5,...values),y=(v:number)=>y0-(v-lo)/(hi-lo)*h;
 let body=label(380,25,`系列${name}（観測順）`,21);
 [[d.LCL,'LCL'],[d.center,'中心線'],[d.UCL,'UCL']].forEach(([v,n])=>{body+=line(x0,y(Number(v)),700,y(Number(v)),n==='中心線'?gold:red,'6 4')+label(115,y(Number(v))+5,`${n} ${v}`,13,'end');});
 body+=`<polyline points="${values.map((v,i)=>`${x0+i*w/(values.length-1)},${y(v)}`).join(' ')}" fill="none" stroke="${blue}" stroke-width="3"/>`;
 values.forEach((v,i)=>{const x=x0+i*w/(values.length-1);body+=`<circle cx="${x}" cy="${y(v)}" r="5" fill="${blue}"/>`+label(x,y(v)-10,v,15)+label(x,237,i+1,15);});return body;
}
function normal(d:Data){
 const mu=d.meanG,sd=d.sigmaG,x=(v:number)=>80+(v-(mu-3.5*sd))/(7*sd)*600,y=(z:number)=>210-Math.exp(-z*z/2)*150;
 const pts=Array.from({length:141},(_,i)=>{const z=-3.5+i*.05;return`${x(mu+z*sd)},${y(z)}`;});
 let b=label(380,27,`正規分布の学習例：平均${mu}g、標準偏差${sd}g`,21)+`<polyline points="${pts.join(' ')}" fill="none" stroke="${blue}" stroke-width="3"/>`+line(65,210,710,210);
 for(let z=-3;z<=3;z++){const xx=x(mu+z*sd);b+=line(xx,210,xx,y(z),gold)+label(xx,235,z===0?'平均':`${z>0?'+':''}${z}σ`,16)+label(xx,257,`${mu+z*sd}g`,15);}
 d.bands.forEach((v:Data,i:number)=>{const yy=285+i*34;b+=line(x(v.lowerG),yy,x(v.upperG),yy,blue)+line(x(v.lowerG),yy-7,x(v.lowerG),yy+7,blue)+line(x(v.upperG),yy-7,x(v.upperG),yy+7,blue)+label(380,yy-7,`約${v.approximatelyPercent}%`,15);});return b;
}
function flow(d:Data){
 const pos:Record<string,[number,number]>={R:[80,140],P:[260,140],M:[440,140],H:[620,140],C:[620,320],F:[440,320],S:[260,320],W:[350,35],D:[525,35],B:[440,500],U:[80,500],L:[80,320]};
 let b='<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#236b91"/></marker><marker id="warn" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#b23d3d"/></marker></defs>';
 const edge=(a:string,c:string,warn=false)=>{const [x,y]=pos[a],[xx,yy]=pos[c];const dx=xx-x,dy=yy-y,scale=Math.min(Math.abs(dx)?65/Math.abs(dx):Infinity,Math.abs(dy)?26/Math.abs(dy):Infinity);const sx=x+dx*scale,sy=y+dy*scale,ex=xx-dx*scale,ey=yy-dy*scale;return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${warn?red:blue}" stroke-width="${warn?2:3}" ${warn?'stroke-dasharray="7 5"':''} marker-end="url(#${warn?'warn':'arrow'})"/>`;};
 d.edges.forEach(([a,c]:string[])=>b+=edge(a,c));(d.hypotheticalUnexpectedEdges??[]).forEach(([a,c]:string[])=>b+=edge(a,c,true));
 d.nodes.forEach((n:Data)=>{const [x,y]=pos[n.id];const chars=Array.from(`${n.id}：${n.labelJa}`),rows:string[]=[];for(let i=0;i<chars.length;i+=7)rows.push(chars.slice(i,i+7).join(''));if(n.id==='H')rows.push('本例のCCP');b+=`<rect x="${x-65}" y="${y-26}" width="130" height="52" rx="6" fill="${n.id==='H'?'#f7dfb4':'#eef5f7'}" stroke="${blue}"/>`;rows.forEach((text,i)=>b+=label(x,y+5+(i-(rows.length-1)/2)*15,text,14));});
 return b+label(380,565,'青実線：本例の流れ　赤破線：調べる仮の変更',18)+label(380,595,'加熱・冷却条件は提示していません',17);
}
function pareto(d:Data){
 const total=d.counts.reduce((a:number,b:number)=>a+b,0),max=Math.max(...d.counts),x0=90,y0=240,w=570,h=160,bw=w/d.counts.length;
 let b=label(380,25,'パレート図：件数と累積比',21)+label(75,58,d.leftAxisJa,15,'start')+label(690,58,d.rightAxisJa,15,'end')+line(x0,65,x0,y0)+line(660,65,660,y0)+line(x0,y0,660,y0);
 [0,max].forEach(v=>b+=label(75,y0-v/max*h+5,v,15,'end'));[0,50,100].forEach(v=>b+=label(670,y0-v/100*h+5,`${v}%`,15,'start'));
 d.counts.forEach((v:number,i:number)=>{const xx=x0+i*bw+20,yy=y0-v/max*h;b+=`<rect x="${xx}" y="${yy}" width="${bw-40}" height="${y0-yy}" fill="${blue}"/>`+label(xx+(bw-40)/2,yy-6,v,16)+label(xx+(bw-40)/2,267,d.categories[i],18);});
 b+=`<polyline points="${d.cumulativePercent.map((v:number,i:number)=>`${x0+(i+.5)*bw},${y0-v/100*h}`).join(' ')}" fill="none" stroke="${red}" stroke-width="3"/>`;d.cumulativePercent.forEach((v:number,i:number)=>b+=label(x0+(i+.5)*bw,y0-v/100*h-13,`${v}%`,16,'middle',red));return b+label(380,295,`総計${total}件　棒＝左軸、折れ線＝右軸`,17);
}
function band(d:Data){
 const colors=[blue,gold,'#648960'];let b=label(380,25,d.unitJa,21);
 ['A','B'].forEach((name,j)=>{let x=90;const y=65+j*85;b+=label(55,y+30,name,22);d[name].forEach((v:number,i:number)=>{const w=v*6;b+=`<rect x="${x}" y="${y}" width="${w}" height="46" fill="${colors[i]}"/>`+label(x+w/2,y+29,`${v}%`,18,'middle','#ffffff');x+=w;});});d.categories.forEach((v:string,i:number)=>{const x=130+i*210;b+=`<rect x="${x-25}" y="214" width="18" height="18" fill="${colors[i]}"/>`+label(x+2,230,v,18,'start');});return b;
}
function radar(d:Data){
 const cx=380,cy=190,r=125,n=d.axesJa.length,point=(i:number,v:number)=>[cx+Math.sin(i*2*Math.PI/n)*r*v/d.maximum,cy-Math.cos(i*2*Math.PI/n)*r*v/d.maximum];let b=label(380,25,'レーダー図（共通尺度）',21);
 for(let v=1;v<=d.maximum;v++)b+=`<polygon points="${d.axesJa.map((_:string,i:number)=>point(i,v).join(',')).join(' ')}" fill="none" stroke="#cad4d9"/>`;
 d.axesJa.forEach((a:string,i:number)=>{const [x,y]=point(i,d.maximum);b+=line(cx,cy,x,y,'#b5c3ca')+label(x,y+(i===0?-12:25),a,18);});['A','B'].forEach((a,j)=>{b+=`<polygon points="${d[a].map((v:number,i:number)=>point(i,v).join(',')).join(' ')}" fill="${j?'#c187271c':'#236b911c'}" stroke="${j?gold:blue}" stroke-width="3"/>`;});return b+label(380,350,`A＝青 ${d.A.join('・')}　B＝金 ${d.B.join('・')}（軸順）`,17)+label(380,378,`${d.minimum}～${d.maximum}：${d.rubricJa}`,15);
}
function fish(d:Data){
 let b=label(380,25,'特性要因図：候補は未確認の仮説',21)+line(65,170,600,170,blue)+`<path d="M590 164 L605 170 L590 176" fill="none" stroke="${blue}" stroke-width="2"/>`+label(674,175,d.effectJa,19);
 d.candidateCausesJa.forEach((v:string,i:number)=>{const x=150+(i%2)*260,y=i<2?65:280;b+=line(x,y,x+70,170,blue)+label(x,y+(i<2?-12:25),v,15);});return b;
}
export function FoodAppliedPractice({item,textColor=ink}:Props){
 const d=item.exerciseData;if(!d)return null;const note=(v:string)=><Text style={[s.note,{color:textColor}]}>{v}</Text>;
 let content;
 if(d.versions)content=<>{note(`練習用手順書 ${d.documentId}：版と承認を確認`)}<Table heads={['版','状態','見出しの項目']} rows={d.versions.map((v:Data)=>[`${v.version}版`,v.state==='unapproved_draft'?'未承認の案':v.state==='approved_for_changeover'?'承認済み・切替え対象':'現場に残る旧版',(v.headerFields??[]).join('・')||'—'])}/></>;
 else if(d.temperatureRangeC)content=<>{note(`架空の原料庫${d.equipmentIds.store}／温度計${d.equipmentIds.thermometer}　仮基準${d.temperatureRangeC.join('～')}℃`)}<Table heads={['予定','実施','実測','判定（記入）','記録者','出来事・報告・点検']} rows={d.rows.map((r:Data)=>[r.plannedTime,r.actualTime,`${r.measuredC}℃`,'自分で考える',r.recorder,r.event?`${r.eventTime} ${r.event}／${r.reportTime} 報告／${r.reviewTime} ${r.reviewer}が点検`:'—'])}/></>;
 else if(d.nodes)content=<><Graphic height={625} body={flow(d)} description="架空のスープ工程図。水と調味料の投入、容器の枝、器具の洗浄後の戻り、調べる仮の迂回を示す。"/><Table heads={['記号','工程・投入物']} rows={d.nodes.map((v:Data)=>[v.id,v.labelJa+(v.exerciseDesignation?`（${v.exerciseDesignation}）`:'')])}/><Table heads={['本例の矢印','調べる仮の変更']} rows={[[d.edges.map((v:string[])=>v.join(' → ')).join('／'),d.hypotheticalUnexpectedEdges.map((v:string[])=>v.join(' → ')).join('／')]]}/></>;
 else if(d.CL)content=<>{note('練習専用の仮条件。実製品へ適用しません。')}<Table heads={['条件','中心温度','保持時間']} rows={['CL','OL'].map(k=>[k,`${d[k].minimumCenterTemperatureC}℃以上`,`${d[k].minimumHoldingSeconds}秒以上`])}/><Table heads={['観測','中心温度','保持時間']} rows={d.observations.map((v:Data)=>[v.id,`${v.temperatureC}℃`,`${v.seconds}秒`])}/></>;
 else if(d.normalCurve)content=<>{note(`${d.normalCurve.assumptionJa}。製品規格・全品保証ではありません。`)}<Table heads={['区間','重量','含まれる割合（約）']} rows={d.normalCurve.bands.map((v:Data)=>[`平均±${v.sigmaMultiple}σ`,`${v.lowerG}～${v.upperG}g`,`${v.approximatelyPercent}%`])}/><Graphic height={390} body={normal(d.normalCurve)} description="正規分布曲線に平均と±1、2、3σの重量及び約68.3、95.4、99.7%の区間を表示。"/><Table heads={['母集団','標本','方法A','仮の無作為抽出B']} rows={[[`${d.sampling.populationSize}袋`,`${d.sampling.sampleSize}袋`,d.sampling.convenienceIndices.join('・'),d.sampling.assumedRandomIndices.join('・')]]}/></>;
 else if(d.bins)content=<>{note(`測定値（g）：${d.measurementsG.join('・')}`)}<Table heads={['階級（g）','度数']} rows={d.bins.map((v:Data)=>[`${v.lowerInclusive}以上 ${v.upperExclusive}未満`,v.frequency])}/><Graphic height={285} body={bars(d.bins.map((v:Data)=>v.frequency),d.bins.map((_:Data,i:number)=>`第${i+1}階級`),'測定値のヒストグラム')} description="三つの等幅階級に隣接する棒を描いたヒストグラム。"/>{d.shapeExamples.map((v:Data)=><View key={v.labelJa}>{note(`${v.labelJa}：階級順の度数 ${v.frequencies.join('・')}`)}<Graphic height={285} body={bars(v.frequencies,v.frequencies.map((_:number,i:number)=>String(i+1)),v.labelJa)} description={`${v.labelJa}の独自例。原因は未確定。`}/></View>)}</>;
 else if(d.series)content=<>{note('図を読むためだけの仮ルール。実作業の異常判定基準ではありません。製品の合否規格は未提示です。')}<Table heads={['動き','この練習のルール']} rows={d.exerciseRules.map((v:Data,i:number)=>[['限界外','同じ側','上昇・下降','交互変動','中心集中','中心回避'][i],v.ruleJa])}/>{Object.entries(d.series).map(([k,v])=><View key={k}>{note(`系列${k}（観測順）：${(v as number[]).join('・')} ／ 中心線${d.center}、LCL${d.LCL}、UCL${d.UCL}`)}<Graphic height={260} body={control(v as number[],k,d)} description={`系列${k}、中心線${d.center}、下限${d.LCL}、上限${d.UCL}と各測定点。`}/></View>)}</>;
 else if(d.tallySheet)content=<><Table heads={['不良の種類',...d.tallySheet.days,'合計']} rows={[...d.tallySheet.rows.map((v:Data)=>[v.category,...v.counts,v.total]),['日別合計',...d.tallySheet.dailyTotals,d.tallySheet.grandTotal]]}/><Graphic height={320} body={pareto(d.pareto)} description="左軸は不良件数、右軸は累積比のパレート図。"/><Table heads={['種類','累積比']} rows={d.pareto.categories.map((v:string,i:number)=>[v,`${d.pareto.cumulativePercent[i]}%`])}/><Table heads={['出荷構成比',...d.compositionBands.categories]} rows={['A','B'].map(v=>[v,...d.compositionBands[v].map((n:number)=>`${n}%`)])}/><Graphic height={260} body={band(d.compositionBands)} description="AとBの袋・瓶・箱の構成比を示す100%帯グラフ。"/><Table heads={['共通尺度0～5',...d.radar.axesJa]} rows={['A','B'].map(v=>[v,...d.radar[v]])}/>{note(d.radar.rubricJa)}<Graphic height={405} body={radar(d.radar)} description="清掃・記録・引継ぎの同じ0～5尺度でAとBを比較するレーダー図。"/>{note(`結果：${d.fishbone.effectJa} ／ 未確認の候補：${d.fishbone.candidateCausesJa.join('・')}`)}<Graphic height={330} body={fish(d.fishbone)} description="封止不良という結果に四つの未確認候補を結び付ける特性要因図。"/></>;
 else if(d.intervals)content=<>{note(`架空の計画稼働${d.plannedOperatingMinutes}分（計画休憩を除外）／標準毎分${d.standardUnitsPerMinute}個／不良なし`)}<Table heads={['区間','実稼働','速度','出来高']} rows={d.intervals.map((v:Data,i:number)=>[i===0?'前半':'後半',`${v.actualOperatingMinutes}分`,`${v.unitsPerMinute}個/分`,`${v.output}個`])}/>{note(`予定外停止${d.unplannedStopMinutes}分。${d.roundingJa}`)}</>;
 else if(d.VYen!==undefined)content=<>{note(`この練習の会社独自定義：${d.companySpecificValueDefinitionJa}`)}<Table heads={['項目','金額']} rows={[[ '売上高',`${d.salesYen}円`],['原材料費',`${d.rawMaterialCostYen}円`],['直接労務費',`${d.directLaborCostYen}円`],['動燃費',`${d.energyCostYen}円`]]}/><Table heads={['製造量','実稼働時間','人数×各人の時間','工数']} rows={[[`${d.outputKg}kg`,`${d.operatingHours}時間`,`${d.workers}人×${d.hoursPerWorker}時間`,`${d.personHours}人時`]]}/></>;
 else if(d.scores)content=<>{note('練習専用の架空の表。実作業の評価には使いません。行＝可能性、列＝重大性。')}<Table heads={['可能性＼重大性',...d.severityColumnsJa]} rows={d.scores.map((v:number[],i:number)=>[d.likelihoodRowsJa[i],...v])}/><Table heads={['得点','この練習の対応']} rows={d.exerciseActions.map((v:Data)=>[v.scores.join('・'),v.actionJa])}/><Table heads={['事例','可能性','重大性']} rows={d.cases.map((v:Data)=>[v.id,v.likelihood,v.severity])}/></>;
 else if(d.scopeMatching)content=<><Table heads={['事例','管理する対象']} rows={d.scopeMatching.map((v:Data)=>[v.case,v.primaryScopeJa])}/>{note(`${d.schemeDistinction.name}：${d.schemeDistinction.typeJa}。会社の認証書・適用範囲を確認します。`)}</>;
 else return null;
 return <View style={s.wrapper} accessibilityLabel="資料に基づく応用練習の図表"><Text style={[s.heading,{color:textColor}]}>練習用の図表</Text>{content}</View>;
}
const s=StyleSheet.create({wrapper:{width:'100%',gap:14,marginVertical:14},heading:{fontSize:18,fontWeight:'700'},note:{fontSize:15,lineHeight:24},table:{width:'100%',borderWidth:1,borderColor:'#b5c3ca',backgroundColor:'#fffdf8'},tr:{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#d4dce0',alignItems:'stretch'},th:{backgroundColor:'#e8eff1'},cell:{flex:1,padding:8,fontSize:14,lineHeight:21,color:ink,flexShrink:1},bold:{fontWeight:'700'}});
