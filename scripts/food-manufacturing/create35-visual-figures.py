"""Exact original chart examples matching the new food34-chart-axes teaching section."""
from pathlib import Path
import hashlib,io,json,os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import Arc
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/food-manufacturing/source-practice35';OUT.mkdir(parents=True,exist_ok=True);AUDIT=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
font=Path(os.environ.get('FOOD_QA_JAPANESE_FONT','/workspace/scratch/439bff9a1c34/qa-font/NotoSansCJK-JP.otf'));assert font.exists();font_manager.fontManager.addfont(str(font));plt.rcParams.update({'font.family':font_manager.FontProperties(fname=font).get_name(),'font.size':15,'svg.fonttype':'path','svg.hashsalt':'food-source35'})
lesson=next(l for l in json.loads((ROOT/'src/data/food-manufacturing/lessons.2.ja.json').read_text())['lessons'] if l['id']=='food-2-021');section=next(s for s in json.loads((AUDIT/'source-teaching34.json').read_text())['sections'] if s['id']=='food34-chart-axes');assert lesson['sourceHash']==section['lessonSourceHash'];BLUE='#247ca7';ORANGE='#b5622e';INK='#243f52';manifest=[]
def save(fig,name,pages,objective,data,limits):
 fig.savefig(OUT/(name+'.svg'),metadata={'Date':None});b=io.BytesIO();fig.savefig(b,format='png',dpi=160,facecolor='white');plt.close(fig);b.seek(0);im=Image.open(b).convert('RGB');asset=OUT/(name+'.webp');im.save(asset,'WEBP',quality=95);p=lesson['paragraphs'][0]
 manifest.append({'id':'food-source35-'+name,'lessonId':lesson['id'],'lessonSourceHash':lesson['sourceHash'],'paragraphId':'p1','supplementSectionId':section['id'],'supplementTextSha256':hashlib.sha256(section['textJa'].encode()).hexdigest(),'assetFile':str(asset.relative_to(ROOT)),'svgFile':str((OUT/(name+'.svg')).relative_to(ROOT)),'sha256':hashlib.sha256(asset.read_bytes()).hexdigest(),'width':im.width,'height':im.height,'captionJa':p['titleJa'],'altJa':p['textJa'],'objectiveJa':objective,'sourceRefs':[{'document':'ssw2','pdfPage':p,'printedPage':p-9} for p in pages],'teachingData':data,'scopeLimits':limits,'rights':'project_original_controlled_geometry','humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False})
# Four independent time measurements, not categories incorrectly connected by lines.
fig,axes=plt.subplots(1,2,figsize=(12,6.5),gridspec_kw={'width_ratios':[1,1.2]});fig.suptitle('学習用の仮想例：順序・割合・角度',fontsize=23,color=INK,y=.96)
weeks=[1,2,3,4];values=[6,9,4,7];ax=axes[0];ax.plot(weeks,values,'o-',color=BLUE,lw=2.8,ms=8);ax.set(xlabel='週（時間の順序）',ylabel='不良件数（件）',xticks=weeks,yticks=range(0,11,2),ylim=(0,10),title='折れ線：横軸と縦軸を区別')
for x,y in zip(weeks,values):ax.annotate(str(y),(x,y),xytext=(0,10),textcoords='offset points',ha='center',fontsize=16,color=INK)
ax.grid(alpha=.2);ax.spines[['top','right']].set_visible(False)
ax=axes[1];counts=[15,9,6];percents=[50,30,20];angles=[180,108,72];labels=['A 15件\n50％・180°','B 9件\n30％・108°','C 6件\n20％・72°'];wedges,ts=ax.pie(counts,labels=labels,startangle=90,counterclock=False,colors=[BLUE,'#75a6bb','#e4aa55'],wedgeprops={'edgecolor':'white','linewidth':2},labeldistance=1.12,textprops={'fontsize':14,'color':INK});ax.set_title('円：合計30件を一周360°へ',fontsize=18,pad=15)
# Sector C occupies the original last 20 percent; draw its actual central angle.
start,end=90-360,90-360+72;ax.add_patch(Arc((0,0),.7,.7,theta1=start,theta2=end,color=ORANGE,lw=2));ax.plot([0,0],[0,1],color='white',lw=1);ax.text(0,-1.65,'6÷30＝20％\n360°×0.20＝72°',ha='center',fontsize=18,color=INK)
fig.subplots_adjust(left=.08,right=.9,top=.79,bottom=.24,wspace=.43)
save(fig,'time-pie-angle',[84],'時間の横軸・値の縦軸と円の割合・角度を対応させる',{'line':{'weeks':weeks,'counts':values,'xMeaning':'time_order','yUnit':'count'},'pie':{'categories':['A','B','C'],'counts':counts,'total':30,'percentages':percents,'anglesDegrees':angles,'highlightCategory':'C'}},'Independent illustrative counts. Line counts are a separate weekly dataset. Pie counts match the new supplement30-case example, not current factory data or the separate older lesson25-case exercise.')

fig,ax=plt.subplots(figsize=(11,7));counts=[15,9,6];total=sum(counts);cum=np.cumsum(counts)/total*100;x=np.arange(3);bars=ax.bar(x,counts,color=BLUE,width=.62,label='件数');ax.set(xticks=x,xticklabels=['A','B','C'],ylabel='不良件数（件）',xlabel='件数の多い順の項目',ylim=(0,18),yticks=range(0,19,3));ax.grid(axis='y',alpha=.18);ax.set_axisbelow(True);ax.spines[['top','right']].set_visible(False)
for bar,n in zip(bars,counts):ax.text(bar.get_x()+bar.get_width()/2,n+.35,f'{n}件',ha='center',fontsize=18,color=INK)
right=ax.twinx();right.plot(x,cum,'o-',color=ORANGE,lw=3,ms=8,label='累積比');right.set(ylabel='累積比（％）',ylim=(0,112),yticks=range(0,101,20));right.spines['top'].set_visible(False)
for xx,y in zip(x,cum):right.annotate(f'{y:g}％',(xx,y),xytext=(0,12),textcoords='offset points',ha='center',color=ORANGE,fontsize=18,bbox={'facecolor':'white','edgecolor':'none','alpha':.95,'pad':2})
fig.suptitle('パレート図：仮想の30件',fontsize=24,color=INK,y=.95);fig.text(.5,.84,'15件、9件、6件 → 累積15件、24件、30件',ha='center',fontsize=17,color=INK)
fig.text(.5,.1,'棒は件数・左軸。線は累積比・右軸。\n件数が少なくても重大な安全問題を放置しない。',ha='center',fontsize=16,color=INK)
fig.subplots_adjust(left=.1,right=.88,bottom=.27,top=.76)
save(fig,'pareto-cumulative',[86],'降順の件数と累積比を別々の軸で読む',{'categories':['A','B','C'],'counts':counts,'total':total,'cumulativeCounts':[15,24,30],'cumulativePercentages':cum.tolist(),'leftAxisUnit':'count','rightAxisUnit':'percent'},'Matches food34-chart-axes15/9/6 example. Does not replace the older12/8/5 exercise; neither gives a universal safety-priority threshold.')
(OUT/'.gitattributes').write_text('*.webp -filter -diff -merge -text\n*.svg -filter -diff -merge -text\n');(AUDIT/'figures35.json').write_text(json.dumps({'figures':manifest},ensure_ascii=False,indent=2)+'\n')
rows=['import type {ImageSourcePropType} from "react-native";','export const foodSourcePractice35: {id:string;lessonId:string;lessonSourceHash:string;paragraphId:string;source:ImageSourcePropType;width:number;height:number;aspectRatio:number}[] = [']
for f in manifest:
 row={k:f[k] for k in ['id','lessonId','lessonSourceHash','paragraphId','width','height']};rows.append(' '+json.dumps(row)[:-1]+',source:require("../../../'+f['assetFile']+'"),aspectRatio:'+str(f['width']/f['height'])+'},')
rows.append('];');(ROOT/'src/data/food-manufacturing/source-practice35.ts').write_text('\n'.join(rows)+'\n');print(json.dumps({'figures':len(manifest),'webpBytes':sum((ROOT/f['assetFile']).stat().st_size for f in manifest)}))
