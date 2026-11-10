"""Original precise jig/indicator/metal-order recognition assets.

No PDF bytes or source artwork included. Inkscape renders authored SVG.
Regenerating assets preserves all existing runtime translations and questions.
"""
from pathlib import Path
from xml.sax.saxutils import escape
import json,hashlib,subprocess
R=Path(__file__).resolve().parents[2];O=R/'assets/manufacturing/recognition38';W,H=1600,1200
INK,BLUE,GREEN,ORANGE='#26364c','#426b91','#287b72','#b45828'
class D:
 def __init__(self,title,sub):
  self.p=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto-start-reverse"><path d="M0 0L8 4L0 8Z" fill="context-stroke"/></marker></defs><rect width="{W}" height="{H}" fill="#fff8e8"/><g font-family="Noto Sans JP,Noto Sans CJK JP,sans-serif" fill="{INK}">'];self.text(45,65,title,39,True);self.text(45,118,sub,24)
 def text(self,x,y,t,size=25,bold=False,c=INK):self.p.append(f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{700 if bold else 400}" fill="{c}">'+escape(t)+'</text>')
 def rect(self,x,y,w,h,fill='#edf1f1',stroke='#c9c5b6',radius=10):self.p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>')
 def line(self,x,y,xx,yy,c=INK,w=3,arrow=False,dash=None):self.p.append(f'<line x1="{x}" y1="{y}" x2="{xx}" y2="{yy}" stroke="{c}" stroke-width="{w}"'+(' marker-end="url(#arr)"' if arrow else '')+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
 def path(self,s,fill='none',stroke=INK,w=4):self.p.append(f'<path d="{s}" fill="{fill}" stroke="{stroke}" stroke-width="{w}"/>')
 def circle(self,x,y,r,fill,stroke=INK):self.p.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>')
 def save(self,name):
  f=O/(name+'.svg');f.write_text(''.join(self.p)+'</g></svg>');subprocess.run(['inkscape',str(f),'--export-type=png','--export-filename='+str(f.with_suffix('.png')),'--export-width='+str(W),'--export-height='+str(H)],check=True,capture_output=True)

def jig():
 d=D('治具：保持・必要な接点・被覆を区別する','通電が必要な処理の独立した概念図。AとBは、同じ保持部の異なる役割に着目します。')
 # Central rack with protective coat; conductive substrate remains continuous.
 d.rect(100,200,1400,680,'#f4f1e8');d.rect(580,260,100,510,'#a8c7b8',GREEN,0);d.rect(610,240,40,65,'#9faeb8',INK,0)
 # Draw common retaining arm to a product, with only tip uncoated.
 d.path('M650 430 L880 430 L930 480 L940 540',stroke=INK,w=16);d.path('M650 430 L880 430 L930 480',stroke=GREEN,w=22)
 d.rect(900,520,300,235,'#c5d1d8',BLUE,35);d.text(1000,660,'D：品物',32,True,BLUE)
 d.circle(940,540,15,'#e7ad68',ORANGE);d.circle(900,480,74,'none',BLUE)
 d.text(150,345,'C：接点以外の治具被覆',30,True,GREEN);d.line(410,365,575,410,GREEN,4,True)
 d.text(1050,340,'A：保持部',31,True,BLUE);d.line(1100,365,960,455,BLUE,4,True)
 d.text(1100,805,'B：必要な導電接点',29,True,ORANGE);d.line(1130,765,955,555,ORANGE,4,True)
 d.line(630,320,630,660,ORANGE,5,arrow=True,dash='9 7');d.text(160,620,'金属内部の導電経路',27,True,ORANGE);d.text(160,665,'（模式的な表示）',24);d.line(450,625,595,625,ORANGE,3)
 d.text(100,955,'A：品物を保持　／　B：指定された接点の導通を保つ　／　C：不要な付着を抑える',28,True)
 d.text(100,1015,'必要な裸接点まで一律に被覆しません。被覆・保持・接点の条件は実物の指定で確認します。',25)
 d.text(100,1075,'材質名だけで全ての処理液への適合を保証しません。極性・寸法・電源配線は示しません。',25)
 d.text(100,1140,'図の位置や形は独自例です。実設備を触る、被覆を剥がす、薬液を扱うための指示ではありません。',23)
 d.save('jig-contact')
 # Neutral quiz view: retain shapes and pointers, remove role names/explanations.
 quiz=D('治具：位置A・B・Cを図から読み分ける','独立した模式図。色や形は識別用で、実機の寸法・極性・操作を指定しません。')
 quiz.p=d.p[:]
 changes={
 '治具：保持・必要な接点・被覆を区別する':'治具：位置A・B・Cを図から読み分ける',
 '通電が必要な処理の独立した概念図。AとBは、同じ保持部の異なる役割に着目します。':'独立した模式図。色や形は識別用で、実機の寸法・極性・操作を指定しません。',
 'C：接点以外の治具被覆':'C','A：保持部':'A','B：必要な導電接点':'B',
 '金属内部の導電経路':'金属内部の経路',
 'A：品物を保持　／　B：指定された接点の導通を保つ　／　C：不要な付着を抑える':'図中の位置A・B・Cを、部位の形と関係から読みます。',
 '必要な裸接点まで一律に被覆しません。被覆・保持・接点の条件は実物の指定で確認します。':'実物の配置や仕様を再現した図ではありません。',
 '材質名だけで全ての処理液への適合を保証しません。極性・寸法・電源配線は示しません。':'電源端子、数値目盛り、極性の指定はありません。',
 '図の位置や形は独自例です。実設備を触る、被覆を剥がす、薬液を扱うための指示ではありません。':'学習用の図です。実設備に手を触れたり、薬液作業を始めたりする指示ではありません。'}
 quiz.p=[__import__('functools').reduce(lambda text,pair:text.replace(escape(pair[0]),escape(pair[1])),changes.items(),part) for part in quiz.p]
 quiz.save('jig-contact-quiz')

def indicators():
 d=D('指示薬：名前を確認してから色の組合せを読む','代表的な呈色の比較。数値pH目盛り・全試験紙の校正表ではありません。')
 d.text(560,185,'低いpH側の代表例',28,True);d.text(1070,185,'高いpH側の代表例',28,True)
 rows=[(235,'フェノールフタレイン',[('#fffdf6','無色'),('#e38ab4','赤色系（ピンク）')]),(465,'メチルオレンジ',[('#da7772','赤色系'),('#f2d879','黄色系')])]
 for y,title,colors in rows:
  d.rect(50,y,1500,190,'#f7f3e8');d.text(75,y+65,title,29,True)
  for xx,(color,label) in zip([560,1100],colors):d.rect(xx,y+35,330,75,color,INK,14);d.text(xx,y+155,label,27,True)
  d.line(920,y+75,1055,y+75,BLUE,5,True)
 y=695;d.rect(50,y,1500,210,'#f7f3e8');d.text(75,y+70,'BTB',37,True)
 for xx,color,label in [(500,'#f2d879','黄色'),(850,'#81b69b','緑色'),(1200,'#8ab4d6','青色')]:d.rect(xx,y+35,230,80,color,INK,12);d.text(xx+65,y+165,label,28,True)
 d.line(755,y+75,825,y+75,BLUE,4,True);d.line(1105,y+75,1175,y+75,BLUE,4,True)
 d.text(70,980,'同じ色でも指示薬が違えば意味が異なります。無色だけで中性とは決めません。',28,True)
 d.text(70,1040,'変色する範囲と条件は指示薬ごとに異なり、中間色もあります。色名と試薬名を一緒に記録します。',25)
 d.text(70,1100,'pH試験紙はその製品の色見本・使用条件で読みます。この学習図から数値pHを確定しません。',25)
 d.text(70,1160,'色覚差に備え全ての色見本に色名を併記。薬液混合や滴定の実施手順は含めていません。',24)
 d.save('indicators-reference')

def metals():
 d=D('相対順序：水素を含む15項目を読む','01から15へ矢印順に読む独自配置。資料の実表にない項目は追加していません。')
 names=[('Li','リチウム'),('Na','ナトリウム'),('Mg','マグネシウム'),('Al','アルミニウム'),('Zn','亜鉛'),('Fe','鉄'),('Ni','ニッケル'),('Sn','スズ'),('Pb','鉛'),('H','水素'),('Cu','銅'),('Hg','水銀'),('Ag','銀'),('Pt','白金'),('Au','金')]
 for i,(symbol,name) in enumerate(names):
  col,row=i%5,i//5;x,y=65+col*305,220+row*235;highlight=symbol=='H';d.rect(x,y,250,175,'#f2e3a8' if highlight else '#e9f0f5',ORANGE if highlight else BLUE,12);d.text(x+15,y+30,f'{i+1:02}',23,True);d.text(x+75,y+90,symbol,46,True,ORANGE if highlight else BLUE);d.text(x+20,y+145,name,25,True)
  if col<4:d.line(x+260,y+85,x+292,y+85,BLUE,4,True)
  if i in[4,9]:
   yy=y+190;d.path(f'M{x+125} {y+180} L{x+125} {yy+22} L{190} {yy+22} L{190} {yy+40}',stroke=BLUE,w=3);d.line(190,yy+40,190,yy+52,BLUE,3,True)
 d.text(70,185,'大きい側：01 →',26,True,BLUE);d.text(1200,935,'→ 15：小さい側',26,True,BLUE)
 d.text(70,1000,'HはPbとCuの間。水素は比較の基準として含まれ、金属ではありません。',28,True)
 d.text(70,1060,'保護皮膜・液・温度などで実際の反応は変わります。順序だけで腐食速度を決めません。',25)
 d.text(70,1120,'Alの酸化皮膜などの条件も確認します。全ての酸への一律の溶解や薬液作業を指示しません。',25)
 d.save('metal-order-reference')

def bind():
 p=R/'src/data/manufacturing/recognition38/materials.json';d=json.loads(p.read_text())
 for pack in d['packs']:
  for a in pack['assets']:
   f=O/Path(a['file']).name;a['file']=str(f.relative_to(R));a['sha256']=hashlib.sha256(f.read_bytes()).hexdigest()
  for q in pack['questions']:
   selected=[a for a in pack['assets'] if a.get('role')=='quiz'] or pack['assets'];q['imageAssetIds']=[a['id'] for a in selected];q['imageAssetHashes']={a['id']:a['sha256'] for a in selected};q['sourceHash']=hashlib.sha256(json.dumps({k:v for k,v in q.items() if k!='sourceHash'},ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
  for target in pack['locales'].values():target['captionSourceHash']=hashlib.sha256(pack['captionJa'].encode()).hexdigest()
 p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':
 O.mkdir(parents=True,exist_ok=True)
 for f in [jig,indicators,metals]:f()
 bind();print('3originalmaterialrecognitionboards generated;exactimageguardsbound')
