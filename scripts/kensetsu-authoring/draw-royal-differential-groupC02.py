"""Civil cross-sections and material/tool relations; no site design or operation."""
from pathlib import Path
from PIL import ImageFont
base=Path(__file__).with_name('draw-royal-differential-groupC01.py').read_text().split('# Material retained')[0]
base=base.replace("in ['c3','c5','c6']", "in ['c7','c8','c9']")
base=base.replace("for j,label in enumerate(labels):s+=text(x+22,234+43*j,label,26)","wrapped=[]\n  for label in labels:\n   part=''\n   for char in label:\n    if part and font.getlength(part+char)>w-44:wrapped.append(part);part=''\n    part+=char\n   wrapped.append(part)\n  assert len(wrapped)<=4\n  for j,label in enumerate(wrapped):s+=text(x+22,231+34*j,label,26)")
exec(base)
font=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',26)
O=R/'docs/ssw-workspace/kensetsu/royal-differential-20261107/groupC02';O.mkdir(parents=True,exist_ok=True)
# Ground/rod/bit relationship separate from screened intake and riser.
b=soil(91,438,454,98)+line(109,437,534,437,G,4)+rect(266,423,52,113,'#FFFAEC',N,2)+line(293,378,293,495,N,12)
b+=path('M276 491 H309 L317 513 L293 526 L270 513 Z','url(#metal)')+line(293,365,293,384,N,5)
b+=path('M238 412 Q231 383 270 376','none',T,3)+path('M262 369 L271 376 L263 384','none',T,3)
b+=soil(657,439,445,97)+rect(836,379,28,109,'url(#metal)',N,3)+rect(827,478,46,54,'#C7DCD5',T,4)
for y in range(487,529,8):b+=line(832,y,868,y,T,2)
for x,dx in [(775,1),(914,-1)]:
 b+=line(x,501,x+dx*44,501,'#3183A2',4)+path(f'M{x+dx*35} 494 L{x+dx*44} 501 L{x+dx*35} 508','none','#3183A2',3)
b+=line(850,480,850,381,'#3183A2',4)+path('M843 393 L850 381 L857 393','none','#3183A2',3)
save('c7',b)
# Cutting contact, root/soil contact and string reference are independent targets.
b=path('M108 500 L199 399 L177 449 L253 496','none',N,6)+path('M154 451 Q140 416 168 403 Q200 411 181 440','none',G,6)+path('M184 450 Q207 425 223 442 Q237 463 211 477','none',G,6)
b+=line(152,405,245,437,'#756540',7)+path('M224 431 Q245 406 259 426','none',T,3)
b+=soil(463,472,254,54)+path('M483 477 Q533 451 570 480 Q610 495 660 485','none','#806340',5)+line(566,373,566,455,N,6)+path('M549 449 H583 L578 495 L554 497 Z','url(#metal)')
b+=line(672,384,672,472,G,6)+rect(640,474,62,12,'#D2BD91',N,2)
b+=soil(835,492,263,36)+line(866,414,866,520,G,5)+line(1060,414,1060,520,G,5)+line(866,431,1060,431,T,3)
b+=path('M919 460 Q932 429 950 451 Q961 476 937 480','none',N,4)+f'<ellipse cx="921" cy="462" rx="5" ry="8" fill="none" stroke="{G}" stroke-width="2"/>'
save('c8',b)
# Prohibited undercut, slope shoulder and layer-by-layer fill are schematic only.
b=path('M92 397 H312 V438 H261 V468 H312 V526 H92 Z','#DCC699',G,3)+path('M118 411 L287 511 M287 411 L118 511','none','#B34F40',7)
b+=path('M464 416 H580 L691 514 H722','none',G,5)+path('M464 417 H580 L691 515 H464 Z','#DCC699',G,2)+f'<circle cx="580" cy="417" r="8" fill="#E5C47C" stroke="{N}" stroke-width="2"/>'
b+=line(514,382,581,407,N,2)+path('M579 401 L581 407 L575 410','none',N,2)
b+=path('M837 392 V528 H1107 V392','none',N,4)
for y in [490,460,430]:
 b+=soil(844,y,256,30)+line(849,y+29,1095,y+29,T,3)
b+=line(930,377,1014,377,N,5)+line(970,377,970,404,N,3)+path('M962 396 L970 404 L978 396','none',N,3)
save('c9',b)
print('Wrote c7/c8/c9 pictorial cross-sections,1200x650; original Japanese text retained')
