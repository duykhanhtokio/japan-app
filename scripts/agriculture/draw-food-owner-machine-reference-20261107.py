"""Native exact Japanese source-example labels combined with independent generated recognition art."""
from pathlib import Path
from PIL import Image
import base64,subprocess,html,io
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/agriculture/royal-actual-food-owner-20261107';A=R/'assets/agriculture/royal-food-owner-20261107'
rows=[('brushcutter','exec-d4833dcd-0778-43d0-8524-e82f2a0cdcf3.png','草刈り機：掲載部品と資料の条件',[
'資料の始動例：スロットルは3分の1〜半分。',
'プライマポンプで混合燃料を送る、対象エンジンの例。',
'チョークを閉じる → キャブレターへ入る空気が少なくなる。',
'リコイルを引き、始動後はチョークを開く。',
'最低速で暖機する例。2号資料では数分と記す。',
'停止は最低速にして停止スイッチ。保持式・停止位置式を区別。',
'始動しない場合の反復例も、実機説明書を優先して読む。']),
('cultivator','exec-13a2191d-f011-4285-bc2f-0cc588037905.png','管理機：掲載部品と資料の条件',[
'始動前：主クラッチ・耕うんクラッチ「切」、変速「中立」。',
'エンジンスイッチを入れ、始動グリップを引く例。',
'停止例：アクセルを下げ、主クラッチを切り、停止を確認。',
'変速を中立へ戻し、エンジンスイッチを切る。',
'2号資料：燃料コックがある機種では始動時に開、停止後に閉。',
'機種ごとの操作位置・手順は実機の説明書で確認する。'])]
for k,f,title,labels in rows:
 src=A/f'{k}-components-original-v1.webp';buf=io.BytesIO();Image.open(src).save(buf,format='PNG');data=base64.b64encode(buf.getvalue()).decode();w,h=Image.open(src).size
 b=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1600" height="1800" viewBox="0 0 1600 1800"><rect width="1600" height="1800" fill="#FFFAEF"/><image x="40" y="100" width="1520" height="1140" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,{data}"/>'
 def t(x,y,s,z=30):return f'<text x="{x}" y="{y}" font-family="Noto Sans CJK JP" font-size="{z}" fill="#173750">{html.escape(s)}</text>'
 b+=t(40,63,title,43)
 for i,l in enumerate(labels):b+=t(40,1295+i*57,l,30)
 b+=t(40,1745,'部品の外観は独立例。全機種共通の始動手順・操作の承認ではありません。',29)+'</svg>'
 # SVG embeds private generated intermediary for deterministic rendering; only final asset and script are public.
 tmp=Path('/tmp/agri-food-more9')/f'{k}-composite.svg';tmp.write_text(b);png=tmp.with_suffix('.png');subprocess.run(['inkscape',str(tmp),'--export-type=png','--export-filename='+str(png)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);out=A/f'{k}-source-components-v1.webp';Image.open(png).convert('RGB').save(out,quality=94,method=6);print(out.relative_to(R))
