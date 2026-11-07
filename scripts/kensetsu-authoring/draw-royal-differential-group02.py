"""Source-bound inspection/support-tool relationships; no operating steps."""
from pathlib import Path
# Reuse only the established SVG helper definitions, never its image-writing calls.
helper = Path(__file__).with_name('draw-royal-differential-group01.py').read_text()
exec(helper.split('# Clamp:')[0])
OUT = ROOT / 'docs/ssw-workspace/kensetsu/royal-differential-20261107/group02'
OUT.mkdir(parents=True, exist_ok=True)

def joint(cx,cy,inside=False):
    body=f'<path d="M{cx-105} {cy-17} H{cx-33} Q{cx} {cy-50} {cx+33} {cy-17} H{cx+105} V{cy+17} H{cx+33} Q{cx} {cy+50} {cx-33} {cy+17} H{cx-105} Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
    if inside:
        body+=f'<path d="M{cx-95} {cy} H{cx+95}" stroke="#769AA5" stroke-width="2" stroke-dasharray="6 6"/>'
    return body

b=''.join(rect(x,135,347,425) for x in [55,426,797])
b+=text(78,185,'外側の形',31)+text(449,185,'超音波',31)+text(820,185,'引張・曲げ試験',29)
b+=text(78,235,'外観・形状の測定')+text(449,235,'内部の状態の検査')+text(820,235,'力を加える試験')
b+=joint(228,350)
# Dimension endpoints refer to the external bulge only; no numerical tolerance.
b+=line(189,306,267,306,GOLD,3)+line(189,297,189,316,GOLD,3)+line(267,297,267,316,GOLD,3)
b+=joint(600,350,True)+rect(552,286,48,30,'#E7CC8F',GOLD,4)
b+='<path d="M561 323 Q579 341 561 359 M571 318 Q600 341 571 364 M581 313 Q621 341 581 369" fill="none" stroke="#22766D" stroke-width="3"/>'
b+=joint(970,326)
b+='<path d="M858 326 H833 M833 326 L843 318 M833 326 L843 334 M1082 326 H1107 M1107 326 L1097 318 M1107 326 L1097 334" fill="none" stroke="#B38432" stroke-width="4"/>'
b+='<path d="M892 402 Q970 456 1048 402" fill="none" stroke="#769AA5" stroke-width="12" stroke-linecap="round"/>'
b+=text(78,495,'外側の情報')+text(449,495,'内部の情報')+text(820,495,'実施と承認を区別',25)
save('b6','接合部を調べる方法と情報',b)

b=''.join(rect(x,135,347,425) for x in [55,426,797])
b+=text(78,185,'石筆',31)+text(449,185,'やっとこ',31)+text(820,185,'付着を抑える製品',29)
b+=text(78,235,'材料への印')+text(449,235,'材料の保持')+text(820,235,'材料表面への対応')
b+=rect(110,332,235,82,'#769AA5',NAVY,3)
b+=line(150,375,285,375,'#FFFDF4',5)
b+='<path d="M216 283 L285 356 L273 371 L201 299 Z" fill="#FFFDF4" stroke="#173750" stroke-width="3"/><path d="M273 371 L285 356 L290 378 Z" fill="#E7CC8F" stroke="#173750" stroke-width="2"/>'
# Two pivoted arms grasp a separate workpiece; schematic, no user/heat scene.
b+=rect(563,385,76,34,'#769AA5',NAVY,3)
b+='<path d="M510 280 L601 348 L578 384 L578 398 M681 280 L601 348 L624 384 L624 398" fill="none" stroke="#173750" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'
b+=circle(601,348,9,'#E7CC8F',NAVY,3)
# The gold layer identifies the treated material surface, not a protective barrier.
b+=rect(850,360,240,47,'#769AA5',NAVY,3)+line(854,357,1086,357,GOLD,7)
b+=rect(924,276,72,47,'#F5EAD1',GOLD,5)
b+=text(78,495,'目印を付ける')+text(449,495,'つかむ')
b+=text(820,475,'目・呼吸の保護とは',25)+text(820,514,'別の役割',25)
save('b7','溶接の周辺にある道具・製品',b)
