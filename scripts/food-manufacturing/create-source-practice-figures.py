"""Independent exact learning figures; all data are illustrative, not operating standards."""
from pathlib import Path
from io import BytesIO
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from PIL import Image
root=Path(__file__).resolve().parents[2];out=root/'assets/food-manufacturing/source-practice';out.mkdir(parents=True,exist_ok=True)
(out/'.gitattributes').write_text('*.webp -filter -diff -merge -text\n')
def save(fig,name):
 buf=BytesIO();fig.savefig(buf,format='png',dpi=160,bbox_inches='tight',facecolor='white');plt.close(fig);buf.seek(0);Image.open(buf).convert('RGB').save(out/(name+'.webp'),'WEBP',quality=94)
fig,ax=plt.subplots(figsize=(10,7));ax.set(xlim=(0,10),ylim=(0,7));ax.axis('off')
nodes={'A1':(1,6),'A2':(3,6),'B1':(1,4.5),'B2':(3,4.5),'3':(5,5.3),'4':(7,5.3),'5':(9,5.3),'P2':(5,3.7),'6':(3,2.4),'W':(1,1),'7':(3,1),'8':(5,1)}
for key,(x,y) in nodes.items():
 ax.add_patch(FancyBboxPatch((x-.5,y-.35),1,.7,boxstyle='round,pad=0.04',facecolor='#e7f1fa' if key not in ('6','8') else '#fff0d8',edgecolor='#23556e',linewidth=2))
 ax.text(x,y,key,ha='center',va='center',fontsize=28,color='#183b4e')
for a,b,dash in [('A1','A2',False),('A2','3',False),('B1','B2',False),('B2','3',False),('3','4',False),('4','5',False),('P2','4',False),('W','7',False),('7','8',False)]:
 xa,ya=nodes[a];xb,yb=nodes[b];v=np.array([xb-xa,yb-ya]);v=v/np.linalg.norm(v);start=np.array([xa,ya])+v*.58;end=np.array([xb,yb])-v*.58
 ax.annotate('',xy=end,xytext=start,arrowprops=dict(arrowstyle='-|>',lw=2.4,color='#b26d16' if dash else '#23556e',linestyle='--' if dash else '-'))
ax.plot([.42,.08,.08,2.38],[6,6,2.4,2.4],color='#b26d16',linestyle='--',lw=2.4)
ax.annotate('',xy=(2.46,2.4),xytext=(2.12,2.4),arrowprops=dict(arrowstyle='-|>',lw=2.4,color='#b26d16'))
save(fig,'multi-input-flow')
fig,ax=plt.subplots(figsize=(8,5));values=[12,7,19,4,8];bars=ax.bar(list('ABCDE'),values,color='#176c9d',width=.65);ax.set(ylim=(0,22),yticks=[0,5,10,15,20]);ax.tick_params(labelsize=22);ax.grid(axis='y',alpha=.25);ax.set_axisbelow(True)
for bar,v in zip(bars,values):ax.text(bar.get_x()+bar.get_width()/2,v+.4,str(v),ha='center',fontsize=24)
for side in ['top','right']:ax.spines[side].set_visible(False)
save(fig,'cause-bars')
x=np.linspace(-4,4,1201);y=np.exp(-x*x/2)/np.sqrt(2*np.pi);fig,ax=plt.subplots(figsize=(9,5.6))
ax.plot(x,y,color='#244f72',lw=2.5);ax.fill_between(x,y,where=np.abs(x)<=3,color='#d6e5f0');ax.fill_between(x,y,where=np.abs(x)<=2,color='#98bddd');ax.fill_between(x,y,where=np.abs(x)<=1,color='#3b82b8')
for band,height,label in [(3,.63,'99.7%'),(2,.54,'95.4%'),(1,.45,'68.3%')]:
 ax.annotate('',xy=(band,height),xytext=(-band,height),arrowprops=dict(arrowstyle='<->',lw=1.8,color='#152f44'));ax.text(0,height+.01,label,ha='center',fontsize=22)
ax.set(xlim=(-4,4),ylim=(0,.72),xticks=[-3,-2,-1,0,1,2,3],xticklabels=['-3σ','-2σ','-1σ','μ','+1σ','+2σ','+3σ'],yticks=[]);ax.tick_params(labelsize=20)
for side in ['top','right','left']:ax.spines[side].set_visible(False)
save(fig,'normal-bands')
fig,ax=plt.subplots(figsize=(6,5));ax.axis('off')
rows=[['×','1','2','3','4']]+[[str(p)]+[str(p*s) for s in range(1,5)] for p in range(1,5)]
colors=[['#e5eaf0']*5]
for p in range(1,5):colors.append(['#e5eaf0']+['#f4b2a6' if p*s>=12 else '#ffe4a5' if p*s>=4 else '#d5e9f5' for s in range(1,5)])
table=ax.table(cellText=rows,cellColours=colors,loc='center',cellLoc='center',bbox=[.02,.02,.96,.96]);table.auto_set_font_size(False);table.set_fontsize(28)
for cell in table.get_celld().values():cell.set_edgecolor('#455769');cell.set_linewidth(1.2)
save(fig,'risk-matrix')
patterns=[[1,3,6,9,12,12,9,6,3,1],[1,0,5,0,11,0,8,0,3,0],[15,12,9,7,5,3,2,1,1,0],[0,0,0,12,15,14,11,8,4,1],[1,5,12,6,1,1,6,12,5,1],[1,5,12,15,10,5,1,0,0,4]]
fig,axes=plt.subplots(3,2,figsize=(10,12))
for letter,counts,ax in zip('ABCDEF',patterns,axes.flat):
 ax.bar(range(10),counts,color='#176c9d',width=1,edgecolor='white',linewidth=.8);ax.set_title(letter,fontsize=32,pad=10);ax.set(ylim=(0,17),xticks=[],yticks=[])
 for side in ['top','right']:ax.spines[side].set_visible(False)
fig.tight_layout(h_pad=2,w_pad=1.5);save(fig,'histogram-patterns')
rng=np.random.default_rng(231);x=np.linspace(1,8,18);cloud_x=rng.uniform(1,8,30);cloud_y=rng.uniform(1,8,30)
while abs(np.corrcoef(cloud_x,cloud_y)[0,1])>.08:cloud_y=rng.uniform(1,8,30)
clouds=[(x,x+.18*np.sin(x*2)),(x,9-x+.15*np.cos(x*3)),(x,.48*(x-4.5)**2+1),(cloud_x,cloud_y)]
fig,axes=plt.subplots(2,2,figsize=(10,9))
for letter,(xx,yy),ax in zip('ABCD',clouds,axes.flat):
 ax.scatter(xx,yy,s=40,color='#176c9d');ax.set_title(letter,fontsize=32,pad=10);ax.set(xlim=(0,9),ylim=(0,9),xticks=[],yticks=[])
 for side in ['top','right']:ax.spines[side].set_visible(False)
fig.tight_layout(h_pad=2,w_pad=1.5);save(fig,'scatter-patterns')
print('Created six independent source-practice figures')
