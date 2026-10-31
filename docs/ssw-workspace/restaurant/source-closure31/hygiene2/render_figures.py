"""Original technical diagrams and charts; no source page or artwork copied."""
from pathlib import Path
import json,hashlib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
import cairosvg
R=Path(__file__).resolve().parents[5];O=R/'assets/restaurant/source31/hygiene2';O.mkdir(parents=True,exist_ok=True)
fp=FontProperties(fname='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc');plt.rcParams['font.family']=fp.get_name();plt.rcParams['font.size']=23;plt.rcParams['svg.fonttype']='none';plt.rcParams['svg.hashsalt']='restaurant-hygiene2-source31'
# Official MHLW2022 statistics table, physical PDF p2, totals only (not single-person subrows).
years=list(range(2003,2023));events=[1585,1666,1545,1491,1289,1369,1048,1254,1062,1100,931,976,1202,1139,1014,1330,1061,887,717,962];patients=[29355,28175,27019,39026,33477,24303,20249,25972,21616,26699,20802,19355,22718,20252,16464,17282,13018,14613,11080,6856]
fig,ax=plt.subplots(figsize=(20,12),dpi=100);fig.subplots_adjust(left=.09,right=.89,bottom=.2,top=.83);ax2=ax.twinx();ax.bar(years,events,color='#477b93',width=.6,label='事件数（件・左軸）');ax2.plot(years,patients,color='#b65336',marker='o',lw=4,label='患者数（人・右軸）');ax.set_ylim(0,1800);ax2.set_ylim(0,45000);ax.set_ylabel('事件数（件）',fontproperties=fp,fontsize=25);ax2.set_ylabel('患者数（人）',fontproperties=fp,fontsize=25);ax.set_xticks(years[::2]+[2022]);ax.tick_params(axis='x',rotation=45);ax.grid(axis='y',alpha=.25);ax.set_axisbelow(True);ax.set_xlim(2002.4,2022.6);fig.suptitle('全国の食中毒：過去の二つの指標を読む',fontproperties=fp,fontsize=34,y=.96);fig.text(.5,.89,'2003～2022年の確定集計 ／ 最新年の状況ではない',ha='center',fontproperties=fp,fontsize=25);fig.legend([ax.patches[0],ax2.lines[0]],['事件数（左軸）','患者数（右軸）'],loc='lower center',ncol=2,prop=FontProperties(fname='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',size=24),bbox_to_anchor=(.5,.035));fig.text(.5,.015,'厚生労働省「令和4年食中毒発生状況」の数値から独立作図',ha='center',fontproperties=fp,fontsize=20)
for ext in ['svg','png']:fig.savefig(O/f'historical-series.{ext}',metadata={'Date':None} if ext=='svg' else {})
plt.close(fig)
(O/'historical-series-data.json').write_text(json.dumps(dict(years=years,events=events,patients=patients,sourceUrl='https://www.mhlw.go.jp/content/12401000/001075566.pdf',physicalPdfPage=2,rows='H15–R4: all-event totals; single-person subrows excluded'),indent=2)+'\n')
def label(x,y,s,size=32):return f'<text x="{x}" y="{y}" font-size="{size}" font-family="Noto Sans CJK JP" fill="#183b49">{s}</text>'
def save(name,body):
 s=f'<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900"><rect width="1400" height="900" fill="#fffaf0"/>{body}</svg>';(O/f'{name}.svg').write_text(s);cairosvg.svg2png(bytestring=s.encode(),write_to=str(O/f'{name}.png'))
b=label(70,75,'配管の貫通部：小さな隙間も点検する',40)
b+='<rect x="550" y="160" width="300" height="530" fill="#bdc8cc" stroke="#183b49" stroke-width="8"/><circle cx="700" cy="415" r="146" fill="#fffaf0" stroke="#183b49" stroke-width="5"/><circle cx="700" cy="415" r="105" fill="#6c9eaf" stroke="#183b49" stroke-width="8"/><circle cx="700" cy="415" r="75" fill="#dceaf0"/>'
b+='<path d="M554 395 L554 435 M595 395 L595 435 M554 415 L595 415" stroke="#b65336" stroke-width="5"/>'+label(100,640,'隙間の目安：約2cm',34)+label(870,350,'壁を貫く配管',34)+label(870,410,'周囲の開口を確認',32)+label(90,745,'寸法は資料の例。図の縮尺・安全な上限を示すものではない。',30)+label(90,800,'小さければ安全とは断定せず、専門担当と補修方法を相談する。',30)
b+='<path d="M485 620 L574 430 M1020 440 L840 415" stroke="#b65336" stroke-width="5"/>'
save('pipe-entry-gap',b)
b=label(70,75,'清掃計画例：床だけでなく飛散する内壁まで',39)
b+='<rect x="250" y="160" width="950" height="500" fill="#dce4e6"/><rect x="250" y="410" width="950" height="250" fill="#f5d49d"/><path d="M250 660 H1200 L1300 780 H100Z" fill="#a6b2b5" stroke="#183b49" stroke-width="5"/><rect x="640" y="390" width="440" height="45" fill="#7391a1" stroke="#183b49" stroke-width="5"/><path d="M675 435 V665 M1040 435 V665" stroke="#183b49" stroke-width="15"/>'
for x,y in [(720,350),(835,370),(950,320),(1050,380)]:b+=f'<ellipse cx="{x}" cy="{y}" rx="12" ry="8" fill="#b65336"/>'
b+='<path d="M200 410 V660 M180 410 H220 M180 660 H220" stroke="#b65336" stroke-width="5"/>'+label(65,535,'1m',40)+label(300,580,'毎日の対象例',38)+label(300,260,'台の周辺・隅・設備下も点検',30)+label(70,850,'資料の清掃範囲の例。すべての施設に共通する法定寸法ではない。',29)
save('wall-cleaning-range',b)
# An original reference-form exercise. Invented exercise points are fully stated, not official scoring.
b=label(65,70,'参考様式の練習：対象外を分母から外す',40)+label(65,125,'下の配点は練習用。公式監視票の採点そのものではない。',28)
xs=[65,620,850,1110,1330];ys=[190,270,390,510,630]
for x in xs:b+=f'<path d="M{x} 190V630" stroke="#183b49" stroke-width="3"/>'
for y in ys:b+=f'<path d="M65 {y}H1330" stroke="#183b49" stroke-width="3"/>'
for x,t in [(90,'確認項目'),(650,'練習の配点'),(890,'得点'),(1140,'対象')]:b+=label(x,245,t,28)
for y,t,point,score,target in [(345,'衛生計画と現場が対応',6,6,'対象'),(465,'教育後の実演を確認',4,0,'対象'),(585,'この例では使わない設備',2,'—','対象外')]:
 for x,v in [(90,t),(710,str(point)),(930,str(score)),(1140,target)]:b+=label(x,y,v,30)
b+=label(90,720,'分母：6＋4＝10点　　分子：6＋0＝6点',34)+label(90,785,'この練習の得点率：6÷10×100＝60％',36)+label(90,850,'実際の適用・対象外の判断は監視担当の基準で確認する。',28)
save('reference-form-exercise',b)
names=['アニサキス','カンピロバクター','ノロウイルス','植物性自然毒','サルモネラ属菌','ウェルシュ菌','動物性自然毒','ぶどう球菌','クドア','不明','腸管出血性大腸菌','セレウス菌','その他','その他の病原大腸菌','化学物質','その他の細菌'];values=[58.8,19.2,6.5,3.5,2.3,2.3,1.7,1.6,1.1,.9,.8,.3,.3,.2,.2,.1]
fig,ax=plt.subplots(figsize=(19,15),dpi=100);fig.subplots_adjust(left=.34,right=.96,top=.85,bottom=.13)
ax.barh(range(16),values,color='#477b93');ax.set_yticks(range(16),names,fontproperties=fp,fontsize=24);ax.invert_yaxis();ax.set_xlim(0,70);ax.grid(axis='x',alpha=.25);ax.set_axisbelow(True);ax.set_xlabel('事件数に対する割合（％）',fontproperties=fp,fontsize=25)
for y,v in enumerate(values):ax.text(v+1,y,f'{v:.1f}%',va='center',fontsize=24)
fig.suptitle('2022年：原因別の事件数の割合',fontproperties=fp,fontsize=34,y=.96);fig.text(.5,.90,'分母は全国962事件 ／ 患者数の割合ではない',ha='center',fontproperties=fp,fontsize=26);fig.text(.5,.04,'値は元資料の丸め表示。現在の発生割合ではない。',ha='center',fontproperties=fp,fontsize=24)
for ext in ['svg','png']:fig.savefig(O/f'cause-shares.{ext}',metadata={'Date':None} if ext=='svg' else {})
plt.close(fig)

meta=[]
for name,lesson,unit,caption in [('cause-shares','18',3,'2022年の原因別事件割合を共通の目盛で読み取る。患者割合ではない。'),('historical-series','18',3,'2003～2022年の事件数と患者数を、別の単位の軸で読む独立作図。'),('pipe-entry-gap','07',109,'配管の周囲の開口を点検する模式図。約2cmは資料の目安で安全境界ではない。'),('wall-cleaning-range','02',52,'資料の清掃計画例として、床から1mの内壁と飛散しやすい台周辺を示す。'),('reference-form-exercise','17',None,'独自の3項目の練習で、対象外を除いた分母と実施得点を区別する。')]:
 from PIL import Image
 raw=(O/f'{name}.png').read_bytes();w,h=Image.open(O/f'{name}.png').size
 meta.append(dict(id='rst31-hygiene2-figure-'+name,lessonId='rst-2-hyg-'+lesson,unitNumbers=[unit] if unit else [],assetFile=str((O/f'{name}.png').relative_to(R)),svgFile=str((O/f'{name}.svg').relative_to(R)),width=w,height=h,sha256=hashlib.sha256(raw).hexdigest(),captionJa=caption,altJa=caption,scopeLimits=['teaching_only','原資料の画像・レイアウトは転載していない','nativeReviewed=false','domainReviewed=false']))
(Path(__file__).parent/'figure-metadata.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
print(len(meta))

for svg in O.glob('*.svg'):
 svg.write_text('\n'.join(line.rstrip() for line in svg.read_text().splitlines())+'\n')
