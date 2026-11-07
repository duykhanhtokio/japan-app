"""Source-bound remaining5k relationships; keep accurate custom diagrams untouched."""
from pathlib import Path
base=Path(__file__).with_name('draw-royal-differential-group05.py').read_text().split('# Material handling')[0]
base=base.replace('range(15,23)','[33,34,43,45,49,50,51,52,53,56,57]').replace('assert len(spec)==8','assert len(spec)==11')
exec(base)
OUT=ROOT/'docs/ssw-workspace/kensetsu/royal-differential-20261107/group06'
OUT.mkdir(parents=True,exist_ok=True)

# Component participation, qualitative dispersion, and different property targets.
b=rect(111,436,233,56,'#DDE5EA',NAVY,2)
b+='<path d="M202 385 H246 L239 418 H209 Z" fill="#E7CC8F" stroke="#173750" stroke-width="2"/>'
b+=line(224,420,224,433,TEAL,3)
for x,y in [(485,422),(505,422),(495,439),(505,451),(526,437)]:b+=circle(x,y,9,'#769AA5',NAVY,1)
for x,y in [(625,417),(667,424),(648,450),(692,459),(607,464)]:b+=circle(x,y,9,'#769AA5',NAVY,1)
b+=line(551,438,582,438,GOLD,3)
b+=rect(831,414,135,42,'#DDE5EA',TEAL,4)+text(898,443,'流動性',22,'middle')+rect(985,460,135,42,'#DDE5EA',GOLD,4)+text(1052,489,'硬化',22,'middle')
sheet(33,b)

# Wooden handle end metal band is a controlled component detail, not a procedure.
b=rect(178,386,173,45,'#DDE5EA',NAVY,10)+rect(250,431,29,99,'#D8C398',NAVY,2)+rect(247,509,35,22,'#A9B8B1',NAVY,3)
b+='<path d="M718 406 H752 L745 498 H725 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
b+=line(725,498,745,498,GOLD,5)+rect(873,407,112,75,'#DDE5EA',NAVY,5)
for x in range(886,980,20):
    for y in range(420,478,18):b+=circle(x,y,2,GOLD,GOLD,1)
sheet(34,b)

# Wire form and the two distinct ends of a pointed ratchet wrench.
b=''
for dx in [0,12,24]:b+=f'<ellipse cx="{260+dx}" cy="451" rx="95" ry="41" fill="none" stroke="#769AA5" stroke-width="4"/>'
b+='<path d="M719 454 H1020 L1085 443 L1020 431 H719 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
b+=circle(719,442,35,'#DDE5EA',NAVY,3)
b+='<path d="M719 422 L736 432 V452 L719 462 L702 452 V432 Z" fill="#FFFAEC" stroke="#173750" stroke-width="2"/>'
sheet(43,b)

# Side cover and underside support are separate examples; ruler is articulated.
b=rect(127,388,17,109,'#D8C398',NAVY,2)+circle(184,428,40,'#DDE5EA',TEAL,3)+circle(184,428,9,'#769AA5',NAVY,2)
b+=line(154,506,335,506,NAVY,3)+rect(246,468,44,37,'#D8C398',NAVY,2)+line(220,463,319,463,'#769AA5',10)
b+=line(496,400,496,470,'#769AA5',11)+rect(479,388,34,19,'#E7CC8F',NAVY,3)
b+='<path d="M573 497 L597 453 H661 L685 497 M585 449 H674" fill="none" stroke="#173750" stroke-width="5" stroke-linejoin="round"/>'
b+='<path d="M843 483 L912 416 L981 483 L1050 416" fill="none" stroke="#E7CC8F" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>'
for x,y in [(912,416),(981,483)]:b+=circle(x,y,5,'#DDE5EA',NAVY,2)
sheet(45,b)

# A one-cab/two-functions relationship avoids inventing a machine model/silhouette.
b=rect(145,379,231,50,'#DDE5EA',TEAL,5)+text(260,413,'一つの運転席',24,'middle')
b+='<path d="M260 430 V452 H167 V470 M260 452 H382 V470" fill="none" stroke="#22766D" stroke-width="3"/>'
b+=rect(105,472,129,50,'#F5EAD1',GOLD,5)+text(169,505,'走行',23,'middle')+rect(277,472,210,50,'#F5EAD1',GOLD,5)+text(382,505,'クレーン操作',23,'middle')
b+=rect(674,395,394,45,'#DDE5EA',TEAL,4)+text(871,426,'名称・構造・機種の仕様',24,'middle')
b+=text(871,493,'タイヤだけで分類しない',24,'middle')
sheet(49,b)

# Plan-view two-axis rail movement and separate vertical hoisting relation.
b=line(117,409,489,409,NAVY,5)+line(117,496,489,496,NAVY,5)+rect(243,399,24,108,'#DDE5EA',TEAL,2)+rect(234,441,42,26,'#E7CC8F',NAVY,2)
b+=line(299,454,455,454,TEAL,4)+line(255,430,255,475,GOLD,4)
b+='<path d="M310 444 L299 454 L310 464 M444 444 L455 454 L444 464 M245 440 L255 430 L265 440 M245 465 L255 475 L265 465" fill="none" stroke="#22766D" stroke-width="3"/>'
b+=line(774,391,774,489,NAVY,3)
b+='<path d="M760 489 Q760 514 780 514 Q798 514 798 497" fill="none" stroke="#173750" stroke-width="5"/>'
b+=line(862,400,862,501,TEAL,4)+line(851,412,862,400,TEAL,4)+line(873,412,862,400,TEAL,4)+line(851,489,862,501,TEAL,4)+line(873,489,862,501,TEAL,4)
sheet(50,b)

# Task differences versus linear/rotary mechanisms and two setup categories.
b=line(103,443,198,443,'#769AA5',19)+line(221,443,316,443,'#769AA5',19)+line(209,415,209,471,GOLD,3)
b+='<path d="M138 493 H245 Q267 493 267 470" fill="none" stroke="#769AA5" stroke-width="12" stroke-linecap="round"/>'
b+=rect(462,408,75,40,'#DDE5EA',NAVY,3)+line(538,428,568,428,TEAL,5)
b+='<path d="M556 420 L568 428 L556 436" fill="none" stroke="#22766D" stroke-width="3"/>'
b+=circle(663,458,32,'#DDE5EA',NAVY,3)+line(663,430,663,486,TEAL,3)+line(635,458,691,458,TEAL,3)
b+='<path d="M628 428 A47 47 0 0 1 709 447 M709 447 L697 439 M709 447 L712 433" fill="none" stroke="#B38432" stroke-width="3"/>'
b+=rect(830,403,291,44,'#DDE5EA',TEAL,4)+text(975,434,'携帯式',23,'middle')+rect(830,475,291,44,'#DDE5EA',GOLD,4)+text(975,506,'定置式',23,'middle')
sheet(51,b)

# Two separate gas channels controlled together; not a physical piping/valve design.
b=line(128,421,458,421,TEAL,6)+line(128,487,458,487,GOLD,6)
b+=circle(293,421,17,'#FFFAEC',NAVY,3)+circle(293,487,17,'#FFFAEC',NAVY,3)+line(293,407,293,501,NAVY,4)+line(275,401,311,401,NAVY,5)
b+=circle(872,452,61,'#E7CC8F',GOLD,4)+circle(872,452,38,'#FFFAEC',GOLD,3)
sheet(52,b)

# Bucket opening and relative approach direction; no machine/attachment specification.
b=''
for x in [102,659]:b+=rect(x,468,73,39,'#DDE5EA',NAVY,3)+line(x-12,514,x+420,514,NAVY,2)
b+='<path d="M280 412 V459 Q324 490 368 459 V412" fill="#DDE5EA" stroke="#173750" stroke-width="5"/>'
b+=line(324,408,324,376,TEAL,4)+line(314,386,324,376,TEAL,4)+line(334,386,324,376,TEAL,4)
b+='<path d="M948 410 H1004 Q1030 451 1004 485 H948" fill="#DDE5EA" stroke="#173750" stroke-width="5"/>'
b+=line(934,449,866,449,TEAL,4)+line(878,439,866,449,TEAL,4)+line(878,459,866,449,TEAL,4)
sheet(53,b)

# Masking boundary on a surface versus blade geometry; no guaranteed adhesion shown.
b=rect(106,402,372,105,'#DDE5EA',NAVY,2)+rect(110,406,170,97,'#D8E9E1',TEAL,1)+line(281,405,281,503,GOLD,12)
b+='<path d="M706 487 L749 424 H800 L843 487 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
b+=rect(757,379,35,46,'#D8C398',NAVY,3)
b+='<path d="M919 487 L939 424 H982 L1002 487 Z" fill="#D8E9E1" stroke="#22766D" stroke-width="3"/>'
b+=rect(943,379,35,46,'#D8C398',NAVY,3)
sheet(56,b)

# Tapered alignment tool relates to existing holes, not to creation of a new hole.
b=rect(117,411,192,79,'#DDE5EA',NAVY,2)+rect(137,427,192,79,'#DDE5EA',TEAL,2)
b+=circle(221,453,23,'#FFFAEC',TEAL,3)
b+='<path d="M219 455 L369 406 L380 427 Z" fill="#E7CC8F" stroke="#173750" stroke-width="3"/>'
b+=line(854,423,854,512,'#D8C398',14)
b+='<path d="M784 409 H861 L914 422 L896 433 L873 425 H784 Z" fill="#DDE5EA" stroke="#173750" stroke-width="3"/>'
b+=line(890,420,905,427,'#FFFAEC',3)
sheet(57,b)
