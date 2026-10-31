"""Original source-bound flow/lookup/conditional-survey diagrams; no copied artwork."""
from pathlib import Path
import json,hashlib,io,os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import Rectangle,FancyBboxPatch,Circle
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];A=ROOT/'docs/ssw-workspace/food-manufacturing/source-closure-20261031';D=ROOT/'src/data/food-manufacturing';OUT=ROOT/'assets/food-manufacturing/source-practice37';OUT.mkdir(parents=True,exist_ok=True);font=Path(os.environ.get('FOOD_QA_JAPANESE_FONT','/workspace/scratch/439bff9a1c34/qa-font/NotoSansCJK-JP.otf'));assert font.exists();font_manager.fontManager.addfont(str(font));plt.rcParams.update({'font.family':font_manager.FontProperties(fname=font).get_name(),'font.size':15,'svg.fonttype':'path','svg.hashsalt':'food-source37'})
lessons={l['id']:l for p in [D/'lessons.1.ja.json',D/'lessons.2.ja.json',*sorted((D/'authoring-20261029').glob('part*.json'))] for l in json.loads(p.read_text())['lessons']};checks={c['id']:c for c in json.loads((A/'assessment35-source-gaps.json').read_text())['newOpenResponseChecks']};BLUE='#247ca7';INK='#243f52';RED='#b24d3f';GREEN='#337b64';manifest=[]
def save(fig,name,lid,pid,pages,objective,data,checkid,scope):
 fig.savefig(OUT/(name+'.svg'),metadata={'Date':None});b=io.BytesIO();fig.savefig(b,format='png',dpi=160,facecolor='white');plt.close(fig);b.seek(0);im=Image.open(b).convert('RGB');asset=OUT/(name+'.webp');im.save(asset,'WEBP',quality=95);l=lessons[lid];p=next(p for p in l['paragraphs'] if p['id']==pid);c=checks[checkid];assert c['lessonId']==lid and c['lessonSourceHash']==l['sourceHash']
 manifest.append({'id':'food-source37-'+name,'lessonId':lid,'lessonSourceHash':l['sourceHash'],'paragraphId':pid,'assetFile':str(asset.relative_to(ROOT)),'svgFile':str((OUT/(name+'.svg')).relative_to(ROOT)),'sha256':hashlib.sha256(asset.read_bytes()).hexdigest(),'width':im.width,'height':im.height,'captionJa':p['titleJa'],'altJa':p['textJa'],'objectiveJa':objective,'sourceRefs':[{'document':'ssw2','pdfPage':n,'printedPage':n-9} for n in pages],'teachingData':data,'assessmentCheckIds':[checkid],'scopeLimits':scope,'rights':'project_original_controlled_geometry','humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False})

def box(ax,x,y,w,h,label,color='#e8f3f8',ec=INK,fs=15):
 ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle='round,pad=.06',facecolor=color,edgecolor=ec,lw=1.5));ax.text(x+w/2,y+h/2,label,ha='center',va='center',fontsize=fs,color=INK,linespacing=1.4)
def arrow(ax,p,q,c=BLUE,dashed=False):ax.annotate('',xy=q,xytext=p,arrowprops={'arrowstyle':'-|>','color':c,'lw':2,'linestyle':'--' if dashed else '-'})
# Original multi-input process; the CCP is specific to this imagined product only.
fig,ax=plt.subplots(figsize=(12,10));ax.set(xlim=(0,12),ylim=(0,10));ax.axis('off');ax.text(.3,9.7,'仮想工程図：区域・投入経路・管理点を追う',fontsize=24,color=INK,va='top');ax.text(.3,9.15,'この仮想製品では加熱をCCPとした例。別の製品へ一律に転用しない。',fontsize=14,color=INK)
ax.add_patch(Rectangle((.2,1.1),5.75,7.55,facecolor='#fbf0e6',edgecolor='none'));ax.add_patch(Rectangle((6.0,1.1),5.8,7.55,facecolor='#e9f6f0',edgecolor='none'));ax.plot([5.98,5.98],[1.1,8.7],color=GREEN,lw=2,ls='--');ax.text(2.4,8.33,'汚染側・加熱前',ha='center',fontsize=18,color=INK);ax.text(8.9,8.33,'清潔側・加熱後',ha='center',fontsize=18,color=INK)
box(ax,.5,7.0,1.7,.8,'原料A');box(ax,.5,5.65,1.7,.8,'原料B');box(ax,2.8,6.4,1.6,1.05,'下処理\n合流');arrow(ax,(2.25,7.4),(2.8,7.0));arrow(ax,(2.25,6.05),(2.8,6.65));box(ax,4.75,6.35,1.0,1.15,'加熱\nCCP',color='#ffe1cf',ec=RED);arrow(ax,(4.45,6.95),(4.7,6.95));box(ax,6.7,6.4,2.0,1.05,'冷却・保管');arrow(ax,(5.8,6.95),(6.65,6.95));box(ax,6.7,4.5,2.0,1.0,'加熱後の調製');arrow(ax,(7.7,6.35),(7.7,5.55));box(ax,6.7,2.7,2.0,1.0,'充填・包装');arrow(ax,(7.7,4.45),(7.7,3.75));box(ax,6.7,1.35,2.0,.8,'製品');arrow(ax,(7.7,2.65),(7.7,2.2))
box(ax,9.5,2.7,1.8,1.0,'清潔な包材');arrow(ax,(9.45,3.2),(8.75,3.2));box(ax,9.3,6.2,2.15,1.35,'未加熱の具C\nを加える案',color='#fff4eb',ec=RED,fs=14);arrow(ax,(9.3,6.2),(8.7,5.05),RED,True);ax.text(9.35,5.55,'別途、危害を再評価',fontsize=13,color=RED)
# Original human/tool symbols to make the zone-crossing route tangible.
ax.add_patch(Circle((1.0,3.75),.2,facecolor=INK));ax.plot([1,1],[3.5,2.9],color=INK,lw=5);ax.plot([.65,1.35],[3.25,3.25],color=INK,lw=4);ax.plot([.65,1,1.35],[2.5,2.9,2.5],color=INK,lw=4);ax.add_patch(Rectangle((2.1,3.0),.9,.15,facecolor=INK));ax.plot([2.25,2.25],[3.1,3.5],color=INK,lw=2);ax.text(.5,2.0,'作業者・器具',fontsize=15,color=INK);arrow(ax,(3.1,3.7),(6.65,4.8),RED,True);ax.text(2.7,4.45,'接触・飛沫等の\n持込み経路を確認',fontsize=14,color=RED)
box(ax,2.8,5.05,2.95,.75,'温度・時間・測定方法は\n製品別の承認条件で確認',color='white',ec=RED,fs=12);ax.text(.3,.5,'実線：主工程・投入物　破線：追加案や汚染経路の検討。図だけで出荷可とは判断しない。',fontsize=13,color=INK)
fig.tight_layout(pad=.6)
save(fig,'flow-zones','food-2-041','p5',[50,51,52,53,54,55],'原料・包材・人と器具の経路を区域境界・CCP条件と関連付ける',{'fictional':True,'inputs':['原料A','原料B','清潔な包材'],'proposedPostHeatInput':'未加熱の具Cを加える案','zones':['汚染側・加熱前','清潔側・加熱後'],'ccpExample':'加熱','ccpConditions':'製品別に承認した温度・時間・測定方法','numericUniversalLimitSupplied':False,'hazardRoutes':['作業者','器具','飛沫','加熱後の具の追加']},'food-assessment35-flow-paths','Original fictional process, not a factory plan. Additional raw topping is a change requiring hazard re-analysis, not approval to bypass lethality. No universal critical limit or product release decision is given.')

# Intentionally a non-multiplicative original lookup, matching the open check exactly.
fig,ax=plt.subplots(figsize=(10,8));ax.axis('off');ax.set(xlim=(0,10),ylim=(0,8));ax.text(.4,7.7,'独自の照合表：交点を読み、優先度へつなぐ',fontsize=22,color=INK,va='top');ax.text(.4,7.05,'元資料の数値表でも会社の正式基準でもない練習例。掛算ではない。',fontsize=13,color=INK)
values=[['H','H','M'],['H','M','L'],['H','M','L']];colors={'H':'#f5c9bc','M':'#f3dfac','L':'#d8eadd'};x0,y0,w,h=2.4,5.45,2.0,1.05
for j,title in enumerate(['致命的','休業','軽度']):ax.text(x0+(j+.5)*w,6.25,title,ha='center',fontsize=18,color=INK)
for i,title in enumerate(['高','中','低']):
 ax.text(1.85,y0-i*h+.5*h,title,ha='center',fontsize=19,color=INK)
 for j,v in enumerate(values[i]):
  ax.add_patch(Rectangle((x0+j*w,y0-i*h),w,h,facecolor=colors[v],edgecolor='white',lw=2));ax.text(x0+(j+.5)*w,y0-i*h+.5*h,v,ha='center',va='center',fontsize=25,weight='bold',color=INK)
ax.text(.6,4.7,'発生\n可能性',fontsize=17,color=INK,ha='center');ax.text(5.4,6.7,'重大性',fontsize=17,color=INK,ha='center');ax.annotate('低・致命的 → H',xy=(3.4,3.9),xytext=(.5,2.35),fontsize=17,color=RED,arrowprops={'arrowstyle':'->','color':RED,'lw':2});ax.annotate('中・軽度 → L',xy=(7.4,4.92),xytext=(6.05,2.35),fontsize=17,color=BLUE,arrowprops={'arrowstyle':'->','color':BLUE,'lw':2})
ax.text(.5,1.5,'H：直ちに対策し、対策完了まで停止\nM：速やかに対策し、停止が望ましい\nL：必要に応じて対策',fontsize=16,color=INK,va='top',linespacing=1.6);ax.text(.5,.2,'実務では採用された表と停止条件に従う。低頻度でも重大な結果を軽く扱わない。',fontsize=12,color=INK);fig.tight_layout(pad=.6)
save(fig,'lookup-matrix','food-2-047','p1',[133,134,135],'独自の行列照合とH・M・Lの対応を掛算とは区別して読む',{'fictional':True,'rowsLikelihood':['高','中','低'],'columnsSeverity':['致命的','休業','軽度'],'lookup':values,'priorityActions':{'H':'直ちに対策し対策完了まで停止','M':'速やかに対策し停止が望ましい','L':'必要に応じて対策'},'examples':[{'row':2,'column':0,'result':'H'},{'row':1,'column':2,'result':'L'}]},'food-assessment35-lookup-matrix','Independent3x3learning lookup, not the textbook4x4numeric example or an approved operational standard. Letters are looked up, never multiplied.')

# Facts from the stated historical source; an original paired-dot layout avoids reproducing artwork.
fig,ax=plt.subplots(figsize=(12,8.3));labels=['パワハラ','セクハラ','妊娠・出産・育児休業等','介護休業等','顧客等からの著しい迷惑行為','就活等セクハラ'];ns=[4985,3075,794,301,2167,54];yes=[73.0,80.9,50.1,55.5,86.8,37.0];no=[27.0,19.1,49.9,44.5,13.2,63.0];y=np.arange(6)
for i,(a,b) in enumerate(zip(yes,no)):
 ax.plot([min(a,b),max(a,b)],[i,i],color='#becbd1',lw=1);ax.scatter([a],[i-.06],s=90,color=BLUE,marker='o',label='該当判断あり' if i==0 else None,zorder=3);ax.scatter([b],[i+.06],s=100,color=RED,marker='^',label='該当判断なし' if i==0 else None,zorder=3);ax.annotate(f'{a:.1f}％',(a,i-.06),xytext=(0,12),textcoords='offset points',ha='center',color=BLUE,fontsize=14);ax.annotate(f'{b:.1f}％',(b,i+.06),xytext=(0,-20),textcoords='offset points',ha='center',color=RED,fontsize=14)
ax.set(yticks=y,yticklabels=[f'{s}\n(n={n:,})' for s,n in zip(labels,ns)],xticks=range(0,101,20),xlim=(0,100),ylim=(5.7,-.7),xlabel='各種類の相談企業の中の割合（％）');ax.tick_params(axis='y',labelsize=13,pad=12);ax.grid(axis='x',alpha=.18);ax.spines[['top','right','left']].set_visible(False);ax.tick_params(axis='y',length=0);ax.legend(loc='lower center',bbox_to_anchor=(.5,1.07),ncol=2,fontsize=14,frameon=False)
fig.suptitle('相談があった企業に限った、六種類の割合',fontsize=23,color=INK,y=.96);fig.text(.5,.87,'教材掲載の2023年度（令和5年度）調査：過去3年間の該当事例の有無',ha='center',fontsize=14,color=INK);fig.text(.5,.09,'種類ごとにnが異なる。全企業・全労働者の発生率ではない。\n六群の割合を足して全体の発生率にしない。現在の値とも断定しない。',ha='center',fontsize=15,color=INK);fig.subplots_adjust(left=.33,right=.95,top=.75,bottom=.25)
save(fig,'conditional-groups','food-2-038','p2',[29],'六種類の条件付き企業割合を標本数・年度とともに読む',{'fictional':False,'surveyFiscalYear':2023,'japaneseFiscalYear':'令和5年度','referenceWindow':'過去3年間','populationCondition':'各種類についてハラスメント相談があった企業','categories':labels,'sampleSizesCompanies':ns,'judgedApplicablePercent':yes,'notJudgedApplicablePercent':no,'unit':'percentage_of_consulted_companies_per_category','groupsMustNotBeSummedIntoPopulationRate':True},'food-assessment35-conditional-chart','Historical textbook-published source values, redrawn as an original paired-dot chart. Different conditional sample sizes; do not infer respondent counts from rounded percentages, add group rates, assume groups are disjoint, or call these current national prevalence.')

# Figure-specific descriptions; canonical paragraph p5 describes a different numbered diagram.
flow_caption=next(s for s in json.loads((D/'source-closure31.json').read_text())['sections'] if s['id']=='food31-flow')
for f in manifest:
 if f['id']=='food-source37-flow-zones':
  f['captionSupplementId']=flow_caption['id'];f['captionSupplementSourceHash']=flow_caption['sourceHash'];f['captionJa']=flow_caption['titleJa'];f['altJa']='仮想工程図。原料AとBが下処理で合流し、加熱CCPを経て清潔側の冷却、加熱後調製、充填包装、製品へ進む。包材は充填へ入る。未加熱の具の追加案と、汚染側の人・器具の接触経路は破線で再評価を促す。温度と時間は製品別の承認条件を確認する。'
 elif f['id']=='food-source37-lookup-matrix':
  f['altJa']='独自の3行3列の練習照合表。行は可能性の高中低、列は致命的、休業、軽度。各行はH-H-M、H-M-L、H-M-L。低い可能性でも致命的ならH、中の可能性で軽度ならL。Hは直ちに対策し完了まで停止、Mは速やかに対策し停止が望ましい、Lは必要に応じ対策。掛算や会社の正式基準ではない。'
 else:
  f['altJa']='2023年度調査における、過去3年間に相談があった企業の条件付き割合。種類ごとのnと該当判断あり割合は、パワハラ4985社73.0%、セクハラ3075社80.9%、妊娠出産育児休業等794社50.1%、介護休業等301社55.5%、顧客等2167社86.8%、就活等54社37.0%。なし割合も別の記号で示す。全企業や全労働者の率ではなく、群を足さない。'

(OUT/'.gitattributes').write_text('*.webp -filter -diff -merge -text\n*.svg -filter -diff -merge -text\n');(A/'figures37.json').write_text(json.dumps({'figures':manifest},ensure_ascii=False,indent=2)+'\n');reg=['import type {ImageSourcePropType} from "react-native";','export const foodSourcePractice37: {id:string;lessonId:string;lessonSourceHash:string;paragraphId:string;source:ImageSourcePropType;width:number;height:number;aspectRatio:number;altJa:string;captionSupplementId?:string;captionSupplementSourceHash?:string}[] = [']
for f in manifest:
 row={k:f[k] for k in ['id','lessonId','lessonSourceHash','paragraphId','width','height','altJa']};row.update({k:f[k] for k in ['captionSupplementId','captionSupplementSourceHash'] if k in f});reg.append(' '+json.dumps(row)[:-1]+',source:require("../../../'+f['assetFile']+'"),aspectRatio:'+str(f['width']/f['height'])+'},')
reg.append('];');(D/'source-practice37.ts').write_text('\n'.join(reg)+'\n');print(json.dumps({'figures':len(manifest),'webpBytes':sum((ROOT/f['assetFile']).stat().st_size for f in manifest)}))
