from pathlib import Path
import cairosvg,json,hashlib
R=Path(__file__).resolve().parents[5];D=R/'assets/restaurant/source31/operations2';D.mkdir(parents=True,exist_ok=True);O=Path(__file__).parent
head='<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="680" viewBox="0 0 1000 680"><rect width="1000" height="680" fill="#f4f7fa"/><g font-family="Noto Sans CJK JP, sans-serif" fill="#17324d">'
def text(x,y,s,size=23):return f'<text x="{x}" y="{y}" font-size="{size}">{s}</text>'
svgs={}
s=head+text(40,50,'同じ売上で標準と実際を比べる',30)+text(40,88,'独自練習：売上 1,000,000円。面積は金額の構成を表す。',20)
for y,cost,label in [(160,300000,'標準'),(350,320000,'実際')]:
 x=200;w=740;cw=w*cost/1000000;s+=text(40,y+52,label,28)+f'<rect x="{x}" y="{y}" width="{cw}" height="100" fill="#dc783c"/><rect x="{x+cw}" y="{y}" width="{w-cw}" height="100" fill="#3b9c91"/>'+text(x+10,y+42,f'原価 {cost:,}円',20)+text(x+10,y+75,f'{cost/10000:.0f}％',22)+text(x+cw+15,y+42,f'粗利益 {1000000-cost:,}円',24)+text(x+cw+15,y+75,f'{100-cost/10000:.0f}％',22)
s+='<path d="M422 275 V320 H437 V340" fill="none" stroke="#b23a48" stroke-width="4"/>'+text(470,306,'原価の増加 20,000円 → 粗利益の減少 20,000円',21)+text(60,540,'実際原価：100,000 ＋ 330,000 − 110,000 ＝ 320,000円',25)+text(60,590,'差の向き：実際 − 標準 ＝ ＋2パーセントポイント',25)+text(60,635,'率の相対増加や、全店共通の管理基準を表す図ではありません。',20)+'</g></svg>';svgs['cost-comparison']=s
s=head+text(40,50,'フード・ダクト・ダンパーの位置関係',30)+text(40,88,'独自の模式断面。実機の構造・寸法・点検手順を示す図ではない。',20)
# Large hood section and duct with movable damper, not a copied PDF dirty photograph.
s+='<path d="M190 410 L280 230 H620 L710 410 Z" fill="#b7c7d4" stroke="#334b5f" stroke-width="6"/><rect x="330" y="120" width="240" height="110" fill="#d9e4ec" stroke="#334b5f" stroke-width="6"/><rect x="350" y="145" width="200" height="15" rx="6" fill="#586e80"/><circle cx="450" cy="152" r="12" fill="#1c516d"/><path d="M200 430 H700" stroke="#334b5f" stroke-width="12"/><path d="M250 500 H650 V580 H250 Z" fill="#d7e2e6" stroke="#334b5f" stroke-width="5"/><ellipse cx="450" cy="495" rx="110" ry="20" fill="#f4ca73"/><path d="M365 460 C335 410 375 380 360 340 M450 460 C425 410 465 390 450 340 M535 460 C510 410 550 390 535 340" stroke="#318a9a" stroke-width="8" fill="none"/>'
s+=text(680,156,'ダンパー',26)+'<path d="M660 150 H560" stroke="#17324d" stroke-width="3"/>'+text(60,195,'ダクト',25)+'<path d="M145 190 H320" stroke="#17324d" stroke-width="3"/>'+text(740,350,'フード',26)+'<path d="M725 340 H660" stroke="#17324d" stroke-width="3"/>'+text(750,470,'排気の方向',23)+text(65,625,'油汚れを放置せず、所定の点検・清掃を適切な担当へつなぐ。',24)+'</g></svg>';svgs['hood-damper']=s
s=head+text(40,50,'煙のある出口へ近づかず、別の安全な経路を考える',28)+text(40,88,'独自の避難経路模式図。実店舗では消防計画・誘導・現場の安全を確認する。',19)
s+='<path d="M100 200 V140 H880 V540 H100 V410 M100 200 V320 M100 410 V370" fill="none" stroke="#355065" stroke-width="14"/><path d="M600 145 V340 H880 M450 540 V400" fill="none" stroke="#355065" stroke-width="10"/>'
for x,y in [(100,180),(150,205),(200,160),(230,240),(115,270)]:s+=f'<circle cx="{x}" cy="{y}" r="40" fill="#818996" opacity=".65"/>'
for x,y in [(300,270),(420,270),(700,440)]:s+=f'<rect x="{x}" y="{y}" width="90" height="60" rx="12" fill="#d5e1e7" stroke="#7291a4" stroke-width="3"/>'
s+='<path d="M620 420 H530 V375 H280 V345 H70" fill="none" stroke="#168a69" stroke-width="14" stroke-linejoin="round"/><path d="M70 345 l35 -22 v44 Z" fill="#168a69"/><circle cx="620" cy="420" r="17" fill="#168a69"/>'+text(635,415,'現在地',22)+text(260,200,'煙',27)+text(150,370,'使える経路を確認',22)+text(40,590,'口・鼻を覆い、必要時は低い姿勢。袋探しで避難を遅らせない。',24)+text(40,635,'避難後：人数・取り残しを消防へ報告。書類や私物を取りに戻らない。',21)+'</g></svg>';svgs['escape-route']=s
for name,svg in svgs.items():
 (D/f'{name}.svg').write_text(svg);cairosvg.svg2png(bytestring=svg.encode(),write_to=str(D/f'{name}.png'))
print('Rendered',len(svgs),'independent diagrams')
