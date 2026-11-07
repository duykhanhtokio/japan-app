"""Controlled source-example lookup; not a fuel-identification or suitability guide."""
from pathlib import Path
import html,subprocess
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/agriculture/royal-actual-food-owner-20261107';A=R/'assets/agriculture/royal-food-owner-20261107'
def t(x,y,s,z=30):return f'<text x="{x}" y="{y}" font-family="Noto Sans CJK JP" font-size="{z}" fill="#173750">{html.escape(s)}</text>'
b='<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1100" viewBox="0 0 1400 1100"><rect width="1400" height="1100" fill="#FFFAEF"/>'
b+=t(40,65,'燃料：資料の対応例を読み、実機は別に確認',40)+t(40,123,'燃料名',31)+t(490,123,'資料にある機械の例',31)
for i,(fuel,machine) in enumerate([('ガソリン','管理機・移植機'),('軽油','トラクタ・コンバイン'),('ガソリンとオイルの混合油','2サイクルエンジンの草刈り機'),('重油・灯油','穀物乾燥機・温風暖房機')]):
 y=150+i*120;b+=f'<rect x="35" y="{y}" width="1330" height="112" rx="10" fill="{"#F0F3EC" if i%2==0 else "#F4EBD8"}" stroke="#B38432"/><path d="M455 {y} V{y+112}" stroke="#B38432"/>'+t(55,y+64,fuel,28)+t(490,y+64,machine,32)
b+=t(40,700,'2号の色の例：ガソリンは薄いオレンジ系（購入店で差がある）。',29)+t(40,755,'軽油は薄黄色、灯油は無色。色だけで油種・品質・適合を決めません。',29)+t(40,835,'実機の表示・取扱説明書を確認します。混合比や法要件は別に確認。',29)+t(40,900,'掲載例を、全ての管理機・全てのトラクタの指定燃料へ広げません。',29)+t(40,1010,'出典の位置：1号PDF42（印刷36）・2号PDF58（印刷56）。',29)+t(40,1060,'資料の例の読み取り。燃料選択・給油操作・現行の着色義務の認定ではありません。',25)+'</svg>'
svg=D/'F08-fuel-source-map.svg';svg.write_text(b);p=A/'fuel-source-mapping-v1.png';subprocess.run(['inkscape',str(svg),'--export-type=png','--export-filename='+str(p)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);print(p.relative_to(R))
