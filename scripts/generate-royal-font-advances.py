"""Regenerate map advances from the exact bundled fonts; runtime needs no fontTools."""
import json
from pathlib import Path
from fontTools.ttLib import TTFont
root = Path(__file__).resolve().parents[1]
result = {}
for role, name in [('heading','NotoSerifJP-SemiBold.ttf'), ('body','NotoSansJP-Medium.ttf')]:
    font = TTFont(root/'assets/app/fonts'/name)
    em = font['head'].unitsPerEm
    metrics = font['hmtx'].metrics
    result[role] = {chr(code):round(metrics[glyph][0]/em,6) for code,glyph in font.getBestCmap().items() if code>=32 and metrics[glyph][0]!=em}
(root/'src/components/world/royal-font-advances.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
