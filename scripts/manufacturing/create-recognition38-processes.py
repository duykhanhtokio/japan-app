from pathlib import Path
from html import escape
import cairosvg,json,hashlib
R=Path(__file__).resolve().parents[2];A=R/'assets/manufacturing/recognition38';assets=[]
def txt(x,y,s,size=24,color='#172e43',anchor='start'):
 return f'<text x="{x}" y="{y}" font-family="Noto Sans CJK JP" font-size="{size}" fill="{color}" text-anchor="{anchor}">{escape(s)}</text>'
def line(x,y,X,Y,color='#172e43',w=4,arrow=False,dash=''):
 return f'<path d="M{x} {y} L{X} {Y}" fill="none" stroke="{color}" stroke-width="{w}"'+(' marker-end="url(#arrow)"' if arrow else '')+(f' stroke-dasharray="{dash}"' if dash else '')+'/>'
def rect(x,y,w,h,fill='#fff',stroke='#b6c9d5',dash=''):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{fill}" stroke="{stroke}" stroke-width="2"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>'
def circle(x,y,r,fill='white',color='#172e43',w=4):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{color}" stroke-width="{w}"/>'
def base(title,h=800):return f'<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="{h}" viewBox="0 0 1300 {h}"><defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="#172e43"/></marker></defs><rect width="1300" height="{h}" fill="#f5f8fa"/>'+rect(24,24,1252,h-48,'#fff')+txt(60,75,title,30)+txt(60,h-35,'独自の学習用概念図 / 実配線・操作・工程設定の指示ではない',20,'#596e7d')
def save(id,body,h=800):
 svg=base({'electrical-symbols':'図E1：五つの回路記号を見分ける','electrical-directions':'図E2：電流・磁界・力を別々に考える','taxonomy-tree':'図T：処理の系列とできる皮膜','sequence-cards':'図S：二つの工程モデルを比較する'}[id],h)+body+'</svg>'
 (A/f'{id}.svg').write_text(svg);png=A/f'{id}.png';cairosvg.svg2png(bytestring=svg.encode(),write_to=str(png));assets.append({'id':'mfg38-'+id,'file':str(png.relative_to(R)),'width':1300,'height':h,'altJa':{'electrical-symbols':'A二本の等長平行板、B円内の波形、C三本の長さが減る接地線、D長方形、E長短板と正負を描く五枚の回路記号カード。','electrical-directions':'左側は紙面手前向き電流と周囲の回転候補1反時計回り・2時計回り。右側は左手の指対応、右向き磁界と手前向き電流から力を選ぶ模式図。','taxonomy-tree':'表面処理からめっき・陽極酸化・化成処理・塗装・その他へ枝分かれする独自分類図。めっきは溶融・湿式の電気と無電解・乾式PVD/CVDへ分ける。','sequence-cards':'A・B二つの工程を縦のカードで比較。水洗、乾燥、任意承認工程と溶融浴前の乾燥を明示。'}[id],'sha256':hashlib.sha256(png.read_bytes()).hexdigest()})
b=''
for label,x,y in [('A',60,125),('B',460,125),('C',860,125),('D',260,420),('E',660,420)]:b+=rect(x,y,360,245,'#eef5f8')+txt(x+25,y+42,label,34)
# A capacitor
b+=line(145,255,217,255)+line(217,212,217,298)+line(239,212,239,298)+line(239,255,320,255)
# B AC source
b+=line(540,255,596,255)+circle(640,255,44)+line(684,255,740,255)+'<path d="M612 255 C620 221 634 221 640 255 C646 289 660 289 668 255" fill="none" stroke="#172e43" stroke-width="4"/>'
# C earth
b+=line(1040,210,1040,250)+line(980,250,1100,250)+line(996,273,1084,273)+line(1014,296,1066,296)
# D resistor
b+=line(340,550,394,550)+'<rect x="394" y="527" width="105" height="46" fill="white" stroke="#172e43" stroke-width="4"/>'+line(499,550,560,550)
# E battery long on left
b+=line(740,550,811,550)+line(811,505,811,595)+line(837,525,837,575)+line(837,550,940,550)+txt(775,515,'+',32)+txt(854,515,'−',32)
b+=txt(650,716,'図形を読む：板の長さ、枠の形、内側の波形にも注目',25,anchor='middle');save('electrical-symbols',b)
b=rect(60,120,550,575,'#edf7f7')+rect(645,120,595,575,'#f4f0e8')+txt(85,160,'直線電流のまわり：右ねじの対応',25)+txt(675,160,'磁界中の力：フレミング左手',25)
b+=circle(335,290,35)+circle(335,290,9,'#172e43')+txt(335,350,'I：紙面から手前へ（・）',23,anchor='middle')+txt(335,393,'周囲の磁界の回り方は？',23,anchor='middle')
for x,label,ccw in [(205,'1',True),(465,'2',False)]:
 b+=circle(x,510,68,'none','#227e8b')+circle(x,510,7,'#172e43')+txt(x,620,label,32,anchor='middle')
 b+=line(x+12 if ccw else x-12,442,x-30 if ccw else x+30,442,arrow=True)
# Orthogonal left-hand mapping, thumb and index as visible finger silhouettes, middle toward viewer circle.
b+=txt(675,205,'人差指 B / 中指 I / 親指 F',25)+txt(675,246,'左手の三指を互いに直角にする',23)
b+=rect(800,396,90,98,'#ead9c2','#a18e74')+rect(867,420,195,38,'#ead9c2','#a18e74')+rect(812,305,38,108,'#ead9c2','#a18e74')
b+=line(902,439,1110,439,arrow=True)+txt(1110,410,'B →',26,anchor='end')
b+=circle(842,451,24)+circle(842,451,6,'#172e43')+txt(860,540,'I：手前へ（・）',24)+txt(840,296,'F ?',30,anchor='middle')
b+=txt(675,610,'F の候補： ↑   ↓   ←   →',29)+txt(675,651,'電流は慣用の向き。発電の規則と混同しない。',20)
save('electrical-directions',b)
b=txt(65,130,'表面処理',29)+line(150,153,150,945)
rows=[(190,'めっき','金属皮膜','金属・樹脂など（適切な下地等を確認）'),(395,'陽極酸化','酸化皮膜','Al・Ti・Mg など'),(560,'化成処理','化合物皮膜','リン酸塩等：防食・潤滑・塗装下地'),(725,'塗装','樹脂皮膜','金属・樹脂・木材など'),(890,'その他','目的・材料に応じて選定','溶射・エッチング・研磨・焼入れ・窒化など')]
for y,title,film,sub in rows:
 b+=line(150,y+35,255,y+35)+rect(255,y,950,130,'#eef5f8')+txt(280,y+40,title,28)+txt(545,y+40,film,26)+txt(280,y+90,sub,23)
b+=txt(280,345,'めっきの枝：溶融 / 湿式 → 電気・無電解 / 乾式 → PVD・CVD',23)+txt(260,1060,'基材 → 皮膜の種類 → 目的を対応させる。厚さの例は設定値ではない。',24)
save('taxonomy-tree',b,1140)
b=txt(80,128,'A：工程モデル',27)+txt(700,128,'B：工程モデル',27)
left=[('前準備・適切な前処理',False),('脱脂・洗浄 → 水洗',False),('活性化 → 水洗',False),('下地めっき → 水洗',True),('主めっき → 水洗',False),('必要な後処理 → 水洗',True),('乾燥',False)]
right=[('脱脂・洗浄 → 水洗',False),('活性化 → 水洗',False),('承認されたフラックス処理',False),('乾燥を確認',False),('溶融浴でのめっき',False),('冷却',False),('仕上げ',False)]
for x,rows in [(80,left),(700,right)]:
 for n,(s,opt) in enumerate(rows):
  y=165+n*100;b+=rect(x,y,510,70,'#fff5d6' if opt else '#e9f4f7','#9db5c2','9 7' if opt else '')+txt(x+255,y+43,s,25,anchor='middle')
  if n<6:b+=line(x+255,y+73,x+255,y+95,arrow=True)
b+=txt(80,912,'破線：製品仕様で必要かを確認する承認工程。省略を自己判断しない。',23)+txt(80,957,'順序の比較用。濃度・温度・時間・配線・作業許可は指定しない。',23)+txt(80,1002,'B：湿った品物を溶融浴へ入れるという意味ではない。',23)
save('sequence-cards',b,1070)
(R/'docs/ssw-workspace/manufacturing/batch38-recognition/processes/assets.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')
print([(a['id'],a['sha256']) for a in assets])
