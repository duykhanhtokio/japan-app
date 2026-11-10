"""Original educational pictograms; not regulatory sign artwork or source reproductions."""
from pathlib import Path
from io import BytesIO
import sys
from PIL import Image
import cairosvg
root=Path(__file__).resolve().parents[2]
out=root/'assets/food-manufacturing/recognition';out.mkdir(parents=True,exist_ok=True)
(out/'.gitattributes').write_text('*.webp -filter -diff -merge -text\n*.svg -filter -diff -merge -text\n')
people='<circle cx="160" cy="84" r="19" fill="black"/><path d="M160 108V183M160 124L113 155M160 124L208 151M160 180L124 237M160 180L199 237"/>'
icons={
'no-entry':people,
'no-running':'<circle cx="184" cy="78" r="18" fill="black"/><path d="M169 101L140 151L197 178L230 225M140 151L99 208L57 208M164 110L208 128L240 108M163 112L118 96L88 125M57 104H90M45 139H77"/>',
'keep-door-closed':'<path d="M77 67H192V253H77ZM192 68L248 105V225L192 253M109 143H136"/><path d="M245 69Q285 165 251 258" stroke-dasharray="10 10"/>',
'no-touch':'<path d="M117 242L98 185L93 131Q96 114 107 128L125 165V77Q130 60 140 77V151L148 62Q154 48 165 64L166 150L180 76Q189 65 197 79L191 165L210 117Q222 107 229 121L210 205L191 244Z"/>',
'pinch':'<path d="M82 103H237V138H82ZM82 211H237V247H82ZM75 180H168L196 160L218 175L195 192H155"/><path d="M160 77V101M148 91L160 103L172 91M160 267V246M148 255L160 243L172 255"/>',
'burn':'<path d="M89 232H239M111 222V182H221V222M104 152Q91 129 109 109Q125 87 111 68M161 152Q145 129 163 108Q180 86 165 66M215 152Q202 129 219 108Q235 87 222 67"/>',
'slip':'<circle cx="196" cy="85" r="17" fill="black"/><path d="M181 108L137 155L90 142M163 127L207 150L248 139M137 155L178 192L228 204M137 155L98 211L57 222M70 258H251M208 242L226 234L244 242"/>',
'fall':'<path d="M54 172H148V265M149 172L183 198"/><circle cx="194" cy="123" r="18" fill="black"/><path d="M185 146L219 181L252 174M217 180L198 224L213 255M187 150L157 127M188 150L160 185M217 182L253 220"/>',
'cut':'<path d="M190 75L202 88L221 80L226 99L247 104L240 124L254 140L239 154L245 176L223 181L217 202L197 195L181 210L167 194L145 201L139 181L118 176L125 156L111 140L127 126L121 105L143 99L148 79L169 86Z"/><circle cx="184" cy="142" r="18"/><path d="M69 229L100 197L138 197L163 214L145 231L104 224M70 247L104 224"/>',
'entangle':'<circle cx="145" cy="190" r="34"/><circle cx="231" cy="190" r="34"/><path d="M112 190H178M145 157V223M198 190H264M231 157V223M95 238H274M95 238V255M274 238V255M69 118L116 139L159 144L179 163L159 179L111 162L69 151M202 121Q246 110 264 147M252 132L264 147L267 128"/>',
'electric':'<path d="M170 64L115 164H160L136 251L224 132H177L205 64Z" fill="black" stroke="none"/>',
'head-impact':'<path d="M67 75H246V112H67M72 258V178L112 144H176L204 176V254M130 162V234M130 231L100 266M130 231L161 265"/><circle cx="137" cy="135" r="17" fill="black"/><path d="M211 132L229 142M218 115L235 110M197 136L201 155"/>',
'eye-protection':'<path d="M59 126L86 119H234L261 126M84 124V183Q112 207 139 185L151 152H169L181 185Q208 207 236 183V124M81 143H57M239 143H263"/>',
'exit':'<circle cx="127" cy="92" r="17" fill="white" stroke="none"/><path d="M123 115L107 165L151 190L177 237M109 165L68 216M119 131L162 147M184 154H263M239 133L263 154L239 175M54 65H170V96M54 65V258H170V230"/>',
'extinguisher':'<path d="M126 108H192V248H126ZM139 108V81H185M185 81L215 100M159 81V60H193M192 118Q238 127 237 177M237 177H255M145 158H174"/>',
}
warning={'pinch','burn','slip','fall','cut','entangle','electric','head-impact'}
prohibited={'no-entry','no-running','keep-door-closed','no-touch'}
for name,icon in icons.items():
 if name in warning:frame='<path d="M160 16L300 288H20Z" fill="#ffe45e" stroke="black" stroke-width="13"/>';color='black'
 elif name in prohibited:frame='<circle cx="160" cy="160" r="140" fill="white" stroke="#c9252a" stroke-width="16"/>';color='black'
 elif name=='eye-protection':frame='<circle cx="160" cy="160" r="140" fill="#086ca9"/>';color='white'
 else:frame=f'<rect x="15" y="20" width="290" height="280" rx="10" fill="{"#087d40" if name=="exit" else "#c9252a"}"/>';color='white'
 slash='<path d="M62 62L258 258" stroke="#c9252a" stroke-width="20"/>' if name in prohibited else ''
 transform='translate(60 78) scale(.65)' if name in warning else ''
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><rect width="320" height="320" fill="white"/>{frame}<g transform="{transform}" fill="none" stroke="{color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">{icon}</g>{slash}</svg>'
 (out/(name+'.svg')).write_text(svg)
 png=cairosvg.svg2png(bytestring=svg.encode(),output_width=640,output_height=640)
 Image.open(BytesIO(png)).convert('RGB').save(out/(name+'.webp'),'WEBP',quality=92)
print('Created',len(icons),'independent educational pictograms')
