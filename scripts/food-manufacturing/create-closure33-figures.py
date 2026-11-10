"""Original source-bound practice cards; never copy textbook artwork."""
from pathlib import Path
import hashlib
import io
import json
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyBboxPatch, PathPatch
from matplotlib.path import Path as MplPath
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'assets/food-manufacturing/source-practice33'
AUDIT = ROOT / 'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / '.gitattributes').write_text('*.webp -filter -diff -merge -text\n*.svg -filter -diff -merge -text\n')
font = Path(os.environ.get('FOOD_QA_JAPANESE_FONT', '/workspace/scratch/439bff9a1c34/qa-font/NotoSansCJK-JP.otf'))
assert font.is_file(), 'Set FOOD_QA_JAPANESE_FONT to a Japanese font'
font_manager.fontManager.addfont(str(font))
plt.rcParams.update({'font.family': font_manager.FontProperties(fname=font).get_name(),
                     'font.size': 16, 'svg.fonttype': 'path', 'svg.hashsalt': 'food-source33'})
lessons = {}
for path in [ROOT / 'src/data/food-manufacturing/lessons.1.ja.json',
             ROOT / 'src/data/food-manufacturing/lessons.2.ja.json',
             *sorted((ROOT / 'src/data/food-manufacturing/authoring-20261029').glob('part*.json'))]:
    lessons.update({l['id']: l for l in json.loads(path.read_text())['lessons']})
BLUE, INK, LIGHT = '#23678d', '#203e50', '#edf5fa'
manifest = []


def canvas(title, subtitle, height=7.5):
    fig, ax = plt.subplots(figsize=(10, height))
    ax.set(xlim=(0, 10), ylim=(0, height))
    ax.axis('off')
    ax.text(.3, height-.35, title, fontsize=23, color=INK, va='top', weight='bold')
    ax.text(.3, height-.9, subtitle, fontsize=13, color=INK, va='top')
    return fig, ax


def box(ax, x, y, w, h, title, body, color=LIGHT):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle='round,pad=0.08',
                               facecolor=color, edgecolor=BLUE, linewidth=1.5))
    ax.text(x+.18, y+h-.2, title, fontsize=18, color=INK, va='top', weight='bold')
    ax.text(x+.18, y+h-.65, body, fontsize=15, color=INK, va='top', linespacing=1.55)


def arrow(ax, start, end):
    ax.annotate('', xy=end, xytext=start, arrowprops={'arrowstyle': '-|>', 'color': BLUE, 'lw': 2})


def save(fig, name, lid, pid, document, pages, goals, scope):
    fig.tight_layout(pad=.5)
    fig.savefig(OUT / (name+'.svg'), metadata={'Date': None})
    buffer = io.BytesIO()
    fig.savefig(buffer, format='png', dpi=160, facecolor='white')
    plt.close(fig)
    buffer.seek(0)
    im = Image.open(buffer).convert('RGB')
    asset = OUT / (name+'.webp')
    im.save(asset, 'WEBP', quality=95)
    manifest.append({'id': 'food-source33-'+name, 'lessonId': lid,
                     'lessonSourceHash': lessons[lid]['sourceHash'], 'paragraphId': pid,
                     'assetFile': str(asset.relative_to(ROOT)),
                     'svgFile': str((OUT / (name+'.svg')).relative_to(ROOT)),
                     'width': im.width, 'height': im.height,
                     'sha256': hashlib.sha256(asset.read_bytes()).hexdigest(),
                     'sourceRefs': [{'document': document, 'pdfPage': p,
                                     'printedPage': p-(5 if document=='ssw1' else 9)} for p in pages],
                     'atomicOutcomesJa': goals, 'objectiveJa': goals[0], 'scopeLimits': scope,
                     'rights': 'project_original_controlled_geometry',
                     'humanReviewed': False, 'domainReviewed': False})


fig, ax = canvas('入場前：服装の確認カード', '教材の例を整理した模式図。実際は職場の指定と照合する。', 9)
box(ax,.4,5.25,4.3,2.3,'頭・襟・内側','ネットは帽子の内側\n縦襟／内衣はボタンなし\n髪とほこりを持ち込まない')
box(ax,5.25,5.25,4.3,2.3,'上着','清潔なもの\nポケット・ボタンなしの例\n職場の服装全体を確認')
box(ax,.4,2.55,4.3,2.3,'袖・裾・腰','袖・裾に絞り\n上着と内衣の端を\nズボンに入れる')
box(ax,5.25,2.55,4.3,2.3,'上に着ける物・足','必要なエプロン・腕カバー\n→ 作業服の上に着ける\n清潔な履き物')
box(ax,.4,.45,9.15,1.6,'説明して確認','各部を指し、異物や汚染を防ぐ目的を説明する。\n一部だけをまねて、他の確認を省かない。')
save(fig,'garment','food-1-044','p2','ssw1',[27],
     ['内側ネット・縦襟・ボタンなし内衣を確認する','清潔な作業服とポケット・ボタンの例を読む',
      '袖裾の絞り・上着と内衣の収納を確認する','エプロン・腕カバーの重ね方と清潔な履物を確認する'],
     'Garment examples do not override workplace-specific clothing requirements.')

fig, ax = canvas('鏡で確認：頭・マスク・手袋', '清潔さ・適合・破損を別々に確認する。', 9)
box(ax,.4,5.25,9.15,2.3,'頭・帽子','髪をまとめる → ネットと帽子へ収める\n帽子を深く着け、裾を上着の内側へ\n髪や耳が出ていないか確認')
box(ax,.4,2.55,4.3,2.3,'マスク','鼻からあごまで覆う\n鼻の針金を合わせる\n鼻・頬に隙間を作らない')
box(ax,5.25,2.55,4.3,2.3,'手袋','手に合うサイズ\n破れ・汚れがない\n不適合なら交換・確認')
box(ax,.4,.45,9.15,1.6,'見つける練習','鼻が出る／髪が出る／大きすぎる手袋。\nそれぞれ、入場前にどこを直すか説明する。')
save(fig,'head-mask-gloves','food-1-044','p3','ssw1',[24,28],
     ['長髪・帽子の深さ・裾収納を確認する','鼻から顎の被覆と鼻頬の隙間を確認する',
      '手袋のサイズ・破れ・汚れを分けて確認する'],
     'A check card, not a replacement for fitting practice or workplace hygiene rules.')

fig, ax = canvas('薬剤作業：保護と禁止を分ける', '食品用の手袋と、薬剤作業で指定される保護具を混同しない。', 7.8)
box(ax,.4,3.5,4.3,2.8,'身体を守る','保護メガネ → 目\n指定の手袋 → 手\nエプロン → 身体\n用途に合う物を正しく着ける')
box(ax,5.25,3.5,4.3,2.8,'混ぜてはいけない','塩素系洗剤 ＋ 酸性洗剤\n→ 有毒なガスの危険\n保護具があっても\n混ぜて使わない', '#fff1e7')
box(ax,.4,.5,9.15,2.35,'作業前に説明する','「何を守るか」と「してはいけないこと」を別々に答える。\n指定・表示・承認済み手順を確認し、不明なら責任者へ。\n保護具だけで薬剤の誤使用を安全にできるわけではない。')
save(fig,'chemical-ppe','food-1-012','p2','ssw1',[23,57],
     ['薬剤飛散から目・手・身体を守る保護具の目的を説明する',
      '塩素系と酸性洗剤の混合を保護具では正当化できない'],
     'No chemical compatibility, concentration or material rating is invented. Follow approved workplace selection.')

fig, ax = canvas('OJT：受講から実行確認へ', '充填量の確認を教える、授業内の仮想例。', 9.4)
box(ax,.4,5.6,4.3,2.25,'1 目標と準備','本人の知識・技能を確認\n測定器・基準・連絡先\n何ができればよいか決める')
box(ax,5.25,5.6,4.3,2.25,'2 指導者が示す','測定と記録を実演\n重要な点と理由を説明\n質問で理解を確かめる')
box(ax,5.25,2.9,4.3,2.25,'3 本人が実施','手順を説明して実施\n安全・測定・記録を観察\n異常時の連絡も確認')
box(ax,.4,2.9,4.3,2.25,'4 評価して改善','目標と実際の行動を照合\n不足に合わせて再指導\n安全にできるか再確認')
arrow(ax,(4.8,6.7),(5.1,6.7));arrow(ax,(7.4,5.5),(7.4,5.25));arrow(ax,(5.1,4.05),(4.8,4.05))
ax.annotate('',xy=(2.5,5.5),xytext=(2.5,5.25),arrowprops={'arrowstyle':'-|>','color':BLUE,'lw':2})
box(ax,.4,.45,9.15,1.85,'閉じる条件','受講記録や速さだけで習得済みにしない。\n本人の能力と実作業に合わせて指導し、効果を確認する。')
save(fig,'ojt-cycle','food-2-004','p3','ssw2',[22,23],
     ['目標と実施条件を先に定める','説明・実演から本人の実施へ移す',
      '安全・測定・記録・異常時連絡を観察する','評価結果を再指導へ戻す'],
     'Four cards organise the current lesson example; they are not a verbatim mandatory four-step textbook procedure.')

fig, ax = canvas('設備改善：変えた後も確認する', '設計例は検討のための模式図。設備担当者と相談する。', 9)
box(ax,.4,5.0,4.3,2.6,'尖った端','変更前：接触で刺す危険\n変更案：角を丸くする\n確認：接触部・残る危険')
ax.plot([5.9,6.8,5.9],[6,6.7,7.4],color=INK,lw=5)
arrow(ax,(7.1,6.7),(7.7,6.7))
ax.add_patch(PathPatch(MplPath([(8.15,6),(9.25,6.7),(8.15,7.4)],
                              [MplPath.MOVETO,MplPath.CURVE3,MplPath.CURVE3]),
                       fill=False,edgecolor=BLUE,linewidth=5))
ax.text(6.2,5.25,'尖った端',ha='center',fontsize=14);ax.text(8.5,5.25,'丸い端',ha='center',fontsize=14)
box(ax,.4,2.65,4.3,1.9,'重い扉','軽い扉への変更を検討\n挟まれる危険は残る')
box(ax,5.25,2.65,4.3,1.9,'原因を取り去る','危険の除去・低減を検討\n保護具だけに頼らない')
box(ax,.4,.4,9.15,1.75,'効果と残る負担を確認','変更後の環境・作業を確認。不十分なら再改善。\n残る負担には保護具・服装・作業時間の調整も組み合わせる。')
save(fig,'engineering-check','food-2-046','p2','ssw2',[131,132],
     ['尖った端を丸くして危険を小さくする','扉を軽くしても挟まれの危険は残る',
      '改善後の効果と残る負担を確認し対策を組み合わせる'],
     'Not an engineering modification specification. No promise that a rounded edge or lighter door eliminates injury.')

(AUDIT / 'figures33.json').write_text(json.dumps({'figures':manifest}, ensure_ascii=False, indent=2)+'\n')
registry = ['import type {ImageSourcePropType} from "react-native";',
            'export const foodSourcePractice33: {id:string;lessonId:string;lessonSourceHash:string;paragraphId:string;source:ImageSourcePropType;width:number;height:number;aspectRatio:number}[] = [']
for f in manifest:
    row = {k:f[k] for k in ['id','lessonId','lessonSourceHash','paragraphId','width','height']}
    registry.append(' '+json.dumps(row)[:-1]+',source:require("../../../'+f['assetFile']+'"),aspectRatio:'+str(f['width']/f['height'])+'},')
registry.append('];')
(ROOT / 'src/data/food-manufacturing/source-practice33.ts').write_text('\n'.join(registry)+'\n')
print(json.dumps({'figures':len(manifest),'atomicOutcomes':sum(len(f['atomicOutcomesJa']) for f in manifest)}))
