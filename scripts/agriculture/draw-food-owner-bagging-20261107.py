"""Independent source-bound bagging topology; no dimensions or operating force."""
from pathlib import Path
import subprocess,html
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/agriculture/royal-actual-food-owner-20261107';A=R/'assets/agriculture/royal-food-owner-20261107';D.mkdir(parents=True,exist_ok=True);A.mkdir(parents=True,exist_ok=True)
N='#173750';G='#B38432';T='#427C58'
def text(x,y,s,size=27,color=N):return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-family="Noto Sans CJK JP">{html.escape(s)}</text>'
def path(d,fill='none',stroke=N,w=3):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round"/>'
def fruit(x,y,grape):
 if not grape:return f'<ellipse cx="{x}" cy="{y+110}" rx="79" ry="83" fill="url(#peach)" stroke="{T}" stroke-width="3"/>'+path(f'M{x} {y+30} Q{x-15} {y+108} {x} {y+187}','none','#AA7951',2)
 b=path(f'M{x} {y-15} V{y+208}','none',T,5)
 for j,(dx,dy) in enumerate([(-38,25),(7,24),(43,47),(-56,64),(-13,66),(24,88),(-42,107),(2,119),(33,136),(-20,152),(5,182)]):
  b+=path(f'M{x} {y+dy-8} L{x+dx} {y+dy}','none',T,2)+f'<ellipse cx="{x+dx}" cy="{y+dy}" rx="24" ry="28" fill="url(#grape)" stroke="{T}" stroke-width="2"/>'
 return b
for k,grape in [('grape',True),('peach',False)]:
 title='ブドウ：房の中央・果軸・止金' if grape else 'モモ：切り込み・枝・止金'
 b=f'<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="900" viewBox="0 0 1500 900"><defs><radialGradient id="grape"><stop stop-color="#E4EAB6"/><stop offset="1" stop-color="#8BB36C"/></radialGradient><radialGradient id="peach"><stop stop-color="#F8E9B5"/><stop offset="1" stop-color="#D9A286"/></radialGradient></defs><rect width="1500" height="900" fill="#FFFAEF"/>'
 b+=text(40,60,title,40)+text(40,108,'掲載例の位置関係を読む模式図。角度・寸法・締める力は指定しません。',27)
 heads=['1　袋を広げ、中央へ','2　口を寄せる','3　止金を倒して巻く']
 for stage in range(3):
  xx=30+stage*495;b+=f'<g transform="translate({xx},145)"><rect width="480" height="625" rx="20" fill="#F4F2E8" stroke="{G}" stroke-width="2"/>'+text(20,48,heads[stage],29)
  # Branch is distinct from the grape fruit axis; no leaf is attached to the fruit axis.
  b+=path('M70 144 H414','none','#8C6A43',13)+path('M250 144 L286 115','none',T,5)+path('M286 115 Q312 74 344 100 Q318 132 286 115','#8BB36C',T,2)
  if grape:
   b+=path('M250 144 V250','none',T,7);mouth=235
   bag='M130 235 H370 L391 527 H109 Z' if stage==0 else 'M211 235 H289 L381 527 H119 Z'
  else:
   b+=path('M250 144 V245','none',T,6);mouth=145
   bag='M128 145 L177 97 H220 L250 145 L280 97 H327 L372 145 V527 H128 Z' if stage==0 else 'M211 145 H289 L381 527 H119 Z'
  b+=path(bag,'#FFFDF7','#7B94A2',3)
  if not grape:b+=path('M70 144 H414','none','#8C6A43',13)
  b+=path('M250 144 V265' if grape else 'M250 144 V265','none',T,6)+fruit(250,265 if grape else 235,grape)
  if stage==0:b+=text(35,577,'果実・房を袋の中央に',27)
  if stage==1:
   b+=path(f'M165 {mouth+14} L205 {mouth} M195 {mouth-8} L205 {mouth} L195 {mouth+8}','none',G,5)
   b+=text(25,577,'止金のない側を寄せる' if grape else '枝の反対側で口を寄せる',25)
  if stage==2:
   target=224 if grape else 144
   b+=path(f'M204 {target+5} Q250 {target-26} 296 {target+5} Q250 {target+27} 204 {target+5} M288 {target+5} L331 {target-20}','none',G,7)
   b+=text(310,target+44,'果軸' if grape else '枝',26)+text(25,577,'果軸へ留める' if grape else '枝の付け根側へ留める',27)
  b+='</g>'
 b+=text(40,820,'果実は袋の中央に。果梗や枝を押しつぶさないようにします。',29)+text(40,866,'この図の大きさ・比率は実物の寸法ではありません。作物・袋に合う条件を確認します。',25)+ '</svg>'
 svg=D/f'F06-{k}-bagging.svg';svg.write_text(b);out=A/f'{k}-bagging-source-stages-v1.png';subprocess.run(['inkscape',str(svg),'--export-type=png','--export-filename='+str(out)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);print(out.relative_to(R))
