"""Exact original practice diagrams. Numeric limits/data are teaching examples."""
from pathlib import Path
import json,hashlib,io
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
from PIL import Image

ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/food-manufacturing/source-practice32';OUT.mkdir(parents=True,exist_ok=True)
(OUT/'.gitattributes').write_text('*.webp -filter -diff -merge -text\n*.svg -filter -diff -merge -text\n')
font=Path('/workspace/scratch/439bff9a1c34/qa-font/NotoSansCJK-JP.otf')
if font.exists():font_manager.fontManager.addfont(str(font));plt.rcParams['font.family']=font_manager.FontProperties(fname=font).get_name()
plt.rcParams.update({'font.size':15,'axes.spines.top':False,'axes.spines.right':False,'svg.fonttype':'path','svg.hashsalt':'food-source32'})
BLUE='#23678d';ORANGE='#ba672c';manifest=[]
lessons={l['id']:l for p in sorted((ROOT/'src/data/food-manufacturing/authoring-20261029').glob('part*.json')) for l in json.loads(p.read_text())['lessons']}
def save(fig,name,lid,pid,pages,goal,limits,data):
 fig.suptitle('学習用の架空データ',fontsize=16)
 fig.tight_layout(rect=(0,0,1,.95));fig.savefig(OUT/(name+'.svg'),metadata={'Date':None})
 b=io.BytesIO();fig.savefig(b,format='png',dpi=160,facecolor='white');plt.close(fig);b.seek(0);im=Image.open(b).convert('RGB');im.save(OUT/(name+'.webp'),'WEBP',quality=95)
 raw=(OUT/(name+'.webp')).read_bytes();manifest.append({'id':'food-source32-'+name,'lessonId':lid,'lessonSourceHash':lessons[lid]['sourceHash'],'paragraphId':pid,'assetFile':str((OUT/(name+'.webp')).relative_to(ROOT)),'svgFile':str((OUT/(name+'.svg')).relative_to(ROOT)),'width':im.width,'height':im.height,'sha256':hashlib.sha256(raw).hexdigest(),'objectiveJa':goal,'sourceRefs':[{'document':'ssw2','pdfPage':p,'printedPage':p-9 if p>9 else None}for p in pages],'scopeLimits':limits,'teachingData':data,'rights':'project_original_controlled_geometry','humanReviewed':False,'domainReviewed':False})

# Same 0–100 denominator; the segments total exactly 100 in each row.
fig,ax=plt.subplots(figsize=(10,4.4));vals=[[30,50,20],[40,20,40]];colors=[BLUE,ORANGE,'#699253']
for y,row in enumerate(vals):
 left=0
 for label,v,c in zip('XYZ',row,colors):ax.barh(y,v,left=left,color=c,edgecolor='white',height=.5);ax.text(left+v/2,y,f'{label} {v}%',ha='center',va='center',color='white',fontsize=19);left+=v
ax.set(xlim=(0,100),xticks=range(0,101,20),yticks=[0,1],yticklabels=['A','B'],xlabel='構成比（％）');ax.grid(axis='x',alpha=.2);ax.set_axisbelow(True)
save(fig,'stacked','food-2-043','p2',[85],'同じ分母で構成比を比較する','Counts and total group sizes are not supplied; proportions do not prove absolute counts.',{'categories':list('XYZ'),'A':vals[0],'B':vals[1],'rowTotals':[100,100]})

fig=plt.figure(figsize=(7.2,6.4));ax=fig.add_subplot(111,projection='polar');angles=np.linspace(0,2*np.pi,5,endpoint=False);a=[4,2,3,5,1];b=[2,4,3,2,4]
for label,values,color in [('A',a,BLUE),('B',b,ORANGE)]:ax.plot(np.r_[angles,angles[0]],values+[values[0]],label=label,color=color,lw=2.5);ax.fill(np.r_[angles,angles[0]],values+[values[0]],color=color,alpha=.09)
ax.set_theta_offset(np.pi/2);ax.set_theta_direction(-1);ax.set(xticks=angles,xticklabels=list('I II III IV V'.split()),ylim=(0,5),yticks=[1,2,3,4,5]);ax.legend(loc='upper right',bbox_to_anchor=(1.15,1.1));
save(fig,'radar','food-2-043','p2',[85],'共通の尺度で複数特性を比較する','The five axes share the same illustrative 0–5 scale; area alone is not an overall performance score.',{'axes':['I','II','III','IV','V'],'A':a,'B':b,'scale':[0,5]})

fig,ax=plt.subplots(figsize=(10.5,5.8));ax.set(xlim=(0,10),ylim=(0,6));ax.axis('off');ax.annotate('',xy=(9.7,3),xytext=(.4,3),arrowprops={'arrowstyle':'-|>','lw':3,'color':BLUE});ax.text(8.8,3.3,'包装の不良',ha='center',fontsize=20)
for x,y,title,examples in [(2,5,'材料',['包材の状態','原料の付着']),(5.3,5,'設備',['シール部','温度の変動']),(2,1,'方法',['手順','確認の時機']),(5.3,1,'測定',['計器の精度','記録の条件'])]:
 ax.plot([x,x+1.4],[y,3],color=BLUE,lw=2);ax.text(x,y+.15 if y>3 else y-.3,title,ha='center',fontsize=19)
 for j,t in enumerate(examples):ax.text(x-.6,y+(-.55-j*.55 if y>3 else .55+j*.55),t,fontsize=14)
ax.text(5,.1,'枝は原因候補。現物・記録で確認する。',ha='center',fontsize=16)
save(fig,'fishbone','food-2-043','p3',[91],'結果と原因候補を別々に整理する','Branches are hypotheses, not established causes. This is an original packaging example.',{'effect':'包装の不良','families':['材料','設備','方法','測定']})

sequences=[[-.2,.3,-.4,.5,.1,3.4],[.3,.6,.4,.8,.5,.7,.4,.6,.9],[-1,-.5,0,.5,1,1.5],[.7,-.7]*7,[2.4,.2,2.6],[1.4,1.6,.2,1.8,1.7],[.1,-.2,.2,-.1,.3,-.3,.1,.2,-.2,.2,.1,-.1,.2,-.2,.1],[1.4,-1.5,1.8,-1.3,1.6,-1.4,1.5,-1.7]]
fig,axes=plt.subplots(4,2,figsize=(11,13.6))
for letter,y,ax in zip('ABCDEFGH',sequences,axes.flat):
 ax.plot(range(1,len(y)+1),y,'o-',color=BLUE,ms=5);ax.axhline(0,color='#555',lw=1);ax.axhline(3,color=ORANGE,ls='--');ax.axhline(-3,color=ORANGE,ls='--')
 for band in [-2,-1,1,2]:ax.axhline(band,color='#aaa',ls=':',lw=.7)
 ax.set(title=letter,ylim=(-3.7,3.7),yticks=[-3,0,3],xticks=range(1,len(y)+1));ax.tick_params(axis='x',labelsize=9)
save(fig,'control-patterns','food-2-043','p4',[92,93],'八つの時系列の型を見分ける','Reference illustrations only. Adoption, numeric rules and actions must be specified by the workplace; figures do not establish root causes.',{'center':0,'illustrativeLimits':[-3,3],'sequences':dict(zip('ABCDEFGH',sequences))})

fig,ax=plt.subplots(figsize=(10,5.4));hours=np.array([0,1,2,3,4]);plan=hours*60;actual=[0,55,110,160,230];ax.fill_between(hours[1:],plan[1:]-15,plan[1:]+15,color='#dcebd7',label='仮の幅 ±15kg');ax.plot(hours,plan,'--',color='#555',label='標準 60kg/時');ax.plot(hours,actual,'o-',color=BLUE,label='実績');ax.scatter([3],[160],color='red',zorder=4);ax.annotate('160 < 165',(3,160),xytext=(2.4,115),arrowprops={'arrowstyle':'->'},fontsize=17);ax.set(xlabel='時間',ylabel='累積出来高（kg）',xticks=hours);ax.legend(fontsize=12);ax.grid(alpha=.2)
save(fig,'progress-band','food-2-045','p1',[98,99],'累積実績を標準線と仮の許容幅へ照合する','Separate exercise from the clock example in this paragraph. ±15kg is an invented learning band, not a factory control limit.',{'hours':hours.tolist(),'planKg':plan.tolist(),'actualKg':actual,'illustrativeBandKg':15,'at3h':{'lowerKg':165,'actualKg':160}})

fig,ax=plt.subplots(figsize=(11,4.1));# Minutes from 08:30; 12:00–13:00 is outside the planned denominator.
ax.broken_barh([(0,210),(270,180)],(15,8),facecolors='#afc1cd');ax.broken_barh([(20,80),(115,95),(270,180)],(2,8),facecolors=BLUE);ax.broken_barh([(0,20),(100,15)],(2,8),facecolors=ORANGE);ax.axvspan(210,270,color='#eee');ax.text(240,25,'計画休止',ha='center',fontsize=14)
ax.set(xlim=(0,450),ylim=(0,32),yticks=[6,19],yticklabels=['実績','計画'],xticks=[0,20,100,115,210,270,450],xticklabels=['08:30','08:50','10:10','10:25','12:00','13:00','16:00']);ax.tick_params(axis='x',rotation=30,labelsize=12);ax.set_title('390分 − 20分 − 15分 ＝ 355分',fontsize=21)
save(fig,'stop-timeline','food-2-045','p1',[109],'計画休止と計画内の停止を分けて稼働時間を求める','Matches the independent current lesson example, not the source textbook clock values. Blue=running; orange=delay/unplanned stop; grey=planned time/background.',{'plannedIntervalsMinutes':[[0,210],[270,450]],'plannedMinutes':390,'delayMinutes':20,'stopMinutes':15,'runningMinutes':355})

groups=[[10,11,12],[9,11,13],[10,11,12],[8,11,14]];means=[sum(v)/len(v)for v in groups];ranges=[max(v)-min(v)for v in groups]
fig,axes=plt.subplots(2,1,figsize=(9,6.3),sharex=True)
for ax,values,title in zip(axes,[means,ranges],['平均 x̄（g）','範囲 R（g）']):ax.plot(range(1,5),values,'o-',color=BLUE);ax.set(ylabel=title,xticks=range(1,5));ax.grid(alpha=.2)
axes[0].set_ylim(10,12);axes[1].set_ylim(0,7);axes[1].set_xlabel('測定群');axes[0].set_title('A:10,11,12  B:9,11,13  C:10,11,12  D:8,11,14',fontsize=14)
save(fig,'mean-range-series','food-2-045','p3',[113],'平均が同じでも範囲が変わることを群別に読む','A/B match the lesson numbers; C/D are additional original groups. No control limits or universal inspection frequency are claimed.',{'groups':groups,'meansG':means,'rangesG':ranges})

fig,axes=plt.subplots(1,2,figsize=(10,5.6))
for ax,levels,title in [(axes[0],[['職長'],['作業者A','作業者B']],'直接の指示・報告'),(axes[1],[['職長'],['班長'],['作業者A','作業者B']],'班長を通す例')]:
 ax.set(xlim=(0,6),ylim=(-.5,4.2));ax.axis('off');ax.set_title(title,fontsize=18);last=[]
 for j,row in enumerate(levels):
  curr=[]
  for k,name in enumerate(row):
   x=3 if len(row)==1 else 1.5+3*k;y=3.5-j*1.5;ax.text(x,y,name,ha='center',va='center',bbox={'boxstyle':'round','fc':'#e6eff5','ec':BLUE},fontsize=18);curr.append((x,y))
   for a,b in last:ax.annotate('',xy=(x,y+.3),xytext=(a,b-.3),arrowprops={'arrowstyle':'<->','color':BLUE,'lw':2})
  last=curr
save(fig,'organisation','food-2-037','p1',[4],'職場により異なる指示・報告経路を比較する','Illustrative roles only; not mandatory staffing, authority, size classification or a universal organisation chart.',{'left':['職長','作業者'],'right':['職長','班長','作業者']})

path=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031/figures32.json';path.write_text(json.dumps({'figures':manifest,'scope':'original_instructional_examples_not_copied_source_figures'},ensure_ascii=False,indent=2)+'\n')
ts=['import type {ImageSourcePropType} from "react-native";','export const foodSourcePractice32: {id:string;lessonId:string;lessonSourceHash:string;paragraphId:string;source:ImageSourcePropType;width:number;height:number;aspectRatio:number}[] = [']
for f in manifest:
 ts.append(' '+json.dumps({k:f[k]for k in ['id','lessonId','lessonSourceHash','paragraphId','width','height']},ensure_ascii=False).replace('}',',source:require("../../../'+f['assetFile']+'"),aspectRatio:'+str(f['width']/f['height'])+'} ,'))
ts+= ['];',''];(ROOT/'src/data/food-manufacturing/source-practice32.ts').write_text('\n'.join(ts))
print('Created',len(manifest),'original diagrams')
