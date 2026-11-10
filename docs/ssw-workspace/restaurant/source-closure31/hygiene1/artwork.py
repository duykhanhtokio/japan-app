from pathlib import Path
import html
import cairosvg
P=Path(__file__).resolve().parents[5]/'assets/restaurant/source31/hygiene1';P.mkdir(parents=True,exist_ok=True)
def svg(name,w,h,body):
 s=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><rect width="100%" height="100%" fill="#fffdf8"/><g font-family="Noto Sans CJK JP,sans-serif" fill="#183b4e">{body}</g></svg>';(P/f'{name}.svg').write_text(s);cairosvg.svg2png(bytestring=s.encode(),write_to=str(P/f'{name}.png'))
def t(x,y,s,size=22,color='#183b4e'):return f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}">{html.escape(s)}</text>'
# Controlled time-temperature relationships, independent layout. Not a safe schedule or numeric endpoint claim.
b=t(45,45,'工程によって温度の動きが違う',30)+t(45,80,'模式図：時間の長さや最高温度の基準を示す図ではありません',19)
b+='<rect x="85" y="220" width="1010" height="235" fill="#fff0db"/><path d="M85 130 V540 H1110" fill="none" stroke="#183b4e" stroke-width="3"/>'
b+=t(15,225,'60℃',20)+t(15,455,'10℃',20)+t(930,585,'時間 →',22)+t(110,255,'資料の危険温度帯',20)
for x,title,path,col in [(115,'非加熱で提供','M120 490 H340','#18689a'),(430,'加熱して提供','M440 490 L545 155 H650','#aa3150'),(740,'冷却・再加熱','M750 490 L810 155 L895 490 H940 L1020 155','#8c5b18')]:
 b+=t(x,125,title,22)+f'<path d="{path}" fill="none" stroke="{col}" stroke-width="7" stroke-linejoin="round"/>'
b+=t(110,620,'低温を保つ',22)+t(440,620,'中心の加熱を確認',22)+t(750,620,'冷却も再加熱も確認',22)
svg('temperature-paths',1160,670,b)
# Two independent worked forms: meaningful visual row/column intersections, not copied source layout.
cols=[55,145,290,435,585,755,1020];rows=[115,170,230,290,350]
b=t(40,45,'一般衛生の実施記録を読む（架空例）',30)+t(40,80,'基準：冷蔵10℃以下。空欄は未確認。実測と基準を混ぜない。',20)
for x in cols:b+=f'<path d="M{x} 115 V350" stroke="#527082"/>'
for y in rows:b+=f'<path d="M55 {y} H1020" stroke="#527082"/>'
for x,s in zip(cols,['日付','冷蔵 / 冷凍','受入れ','手洗い','日々確認','確認者']):b+=t(x+8,150,s,19)
for y,vals in [(205,['5/1','4℃ / −18℃','良','否','済','田中']),(265,['5/2','12℃ / −18℃','良','良','済','佐藤']),(325,['5/3','—','—','—','—','—'])]:
 for x,s in zip(cols,vals):b+=t(x+8,y,s,20)
b+='<ellipse cx="475" cy="198" rx="28" ry="25" fill="none" stroke="#b02f42" stroke-width="3"/><ellipse cx="190" cy="259" rx="35" ry="23" fill="none" stroke="#b02f42" stroke-width="3"/>'
b+=t(55,405,'特記事項',23)+t(55,450,'5/1 10:10　会計後の手洗い忘れ → 洗い直しを確認。',22)+t(55,495,'5/2 08:00　冷蔵12℃ → 責任者へ報告し、食品は確認待ち。',22)+t(55,540,'同日08:15　処置後8℃を再確認。食品の使用判断は別に記録。',22)
b+='<path d="M475 225 C500 370 170 365 150 425 M190 282 C180 375 105 400 105 470" fill="none" stroke="#b02f42" stroke-width="2"/>'
b+=t(55,605,'行の日付と列の項目を見て、同じ日付の特記事項へ結び付ける。',22)
svg('general-record-worked',1080,650,b)
# A blank and a completed five-process plan, arranged as five horizontal lanes.
lanes=[('非加熱・冷製','冷奴','低温保管から取り出し、すぐ提供'),('加熱・熱提供','焼き魚','検証した加熱条件と中心を確認'),('加熱後・高温保管','保温するごはん','保管中の温度を計画通り確認'),('冷却・再加熱','翌日のカレー','冷却と再加熱の時間・温度を確認'),('冷却・冷製提供','ポテトサラダ','加熱後の冷却、保存、提供を確認')]
b=t(40,45,'重要管理計画：三群を五つの工程欄へ',29)+t(40,82,'左は工程、中央は料理、右は確認方法。これは独立した架空の計画例です。',19)
for i,(a,c,d)in enumerate(lanes):
 y=110+i*90;b+=f'<rect x="40" y="{y}" width="1040" height="90" fill="{["#eef7fb","#fceef0","#fff4da","#eef5e8","#f2edfb"][i]}" stroke="#607987"/>'
 b+=t(55,y+52,a,22)+t(320,y+52,c,22)+t(590,y+52,d,20)
b+='<path d="M300 110 V560 M570 110 V560" stroke="#607987"/>'
b+=t(45,610,'練習用空欄：料理＿＿＿＿＿　実際の工程＿＿＿＿＿　確認方法＿＿＿＿＿',22)
svg('five-process-plan',1120,660,b)
# Source-independent practical record: all five process columns, one anomaly and unfilled future dates.
b=t(35,42,'重要管理の実施記録（架空例）',28)+t(35,78,'5月1日：焼き魚の中心確認が未実施。提供を止め、責任者の指示で確認。',19)
headers=['日付','非加熱冷製','加熱熱提供','高温保管','冷却再加熱','冷却冷製','確認者'];xs=[35,100,265,430,595,760,925,1080]
for x in xs:b+=f'<path d="M{x} 110 V420" stroke="#607987"/>'
for y in [110,160,220,270,320,370,420]:b+=f'<path d="M35 {y} H1080" stroke="#607987"/>'
for x,h in zip(xs,headers):b+=t(x+5,145,h,18)
for x,s in zip(xs,['料理','冷奴','焼き魚','ごはん','カレー','ポテトサラダ','—']):b+=t(x+5,195,s,18)
for y,v in [(250,['5/1','良','否','良','良','良','山田']),(300,['5/2','—','—','—','—','—','—']),(350,['5/3','—','—','—','—','—','—']),(400,['…','…','…','…','…','…','…'])]:
 for x,s in zip(xs,v):b+=t(x+10,y,s,20)
b+='<ellipse cx="320" cy="244" rx="29" ry="22" fill="none" stroke="#b02f42" stroke-width="3"/>'
b+=t(35,470,'特記：5/1 12:05　焼き魚の中心確認漏れ。対象品は提供待ち。',22)+t(35,510,'処置・再確認：実際の条件と結果をここへ記録する。未確認値は作らない。',20)+t(35,560,'色の申し出や温度確認漏れを「加熱」の欄から特記事項へ追う。',22)
svg('critical-record-worked',1120,610,b)
# Complete independent monthly forms: actual seven hygiene columns / five process columns.
def month(name,critical=False):
 w=1570;headers=['日','受入れ','冷蔵℃','冷凍℃','交差汚染','器具','トイレ','従業員','手洗い','日々確認','確認者']if not critical else ['日','非加熱冷製','加熱熱提供','高温保管','冷却再加熱','冷却冷製','日々確認','確認者']
 xs=[35]
 widths=[55,130,130,130,140,130,130,140,130,150,150]if not critical else [55,210,210,210,210,210,150,150]
 for wd in widths:xs.append(xs[-1]+wd)
 b=t(35,45,('重要管理'if critical else '一般衛生')+'の月間実施表（5月・独立した架空例）',29)+t(35,82,'空欄は未確認。実際に確認した欄だけ記入し、異常と処置を特記事項へ結び付けます。',21)
 y0=115;headerh=60;rh=29;bottom=y0+headerh+31*rh
 b+=f'<rect x="35" y="{y0}" width="{xs[-1]-35}" height="{headerh}" fill="#e7eff5"/>'
 for x in xs:b+=f'<path d="M{x} {y0} V{bottom}" stroke="#637e8e"/>'
 for y in [y0,y0+headerh]+[y0+headerh+i*rh for i in range(1,32)]:b+=f'<path d="M35 {y} H{xs[-1]}" stroke="#637e8e"/>'
 for x,h in zip(xs,headers):b+=t(x+7,150,h,19)
 for day in range(1,32):
  y=y0+headerh+(day-1)*rh+21;b+=t(42,y,str(day),18)
  if day<=2:
   vals=(['良','否'if day==1 else'良','良','良','良','済','山田']if critical else ['良','12'if day==2 else'4','−18','良','良','良','良','否'if day==1 else'良','済','佐藤'if day==2 else'田中'])
   for x,v in zip(xs[1:],vals):b+=t(x+9,y,v,18)
 # full rows plus explicit exemplar note links; no fabricated successful retest values.
 yy=bottom+45;b+=t(35,yy,'特記事項（同じ月・日付・対象に対応）',23)
 if critical:
  b+=t(35,yy+40,'5/1 12:05　焼き魚の中心確認漏れ。提供を止め、責任者へ報告。',22)+t(35,yy+80,'処置と実際の再確認：＿＿＿＿＿＿＿＿＿＿＿＿　確認者：＿＿＿＿',22)
  b+=t(35,yy+125,'メニュー対応：冷奴 / 焼き魚 / 保温ごはん / 翌日のカレー / ポテトサラダ',22)
 else:
  b+=t(35,yy+40,'5/1 10:10　会計後の手洗い忘れ。洗い直しを確認。（田中）',22)+t(35,yy+80,'5/2 08:00　冷蔵12℃。報告し、対象食品は確認待ち。（佐藤）',22)+t(35,yy+120,'同日08:15　処置後8℃を再確認。食品の判断は別に記録。',22)
  b+=t(35,yy+165,'この例の冷蔵基準：10℃以下。12℃を8℃に上書きして消しません。',22)
 svg(name,w,int(yy+210),b)
month('general-record-monthly');month('critical-record-monthly',True)
