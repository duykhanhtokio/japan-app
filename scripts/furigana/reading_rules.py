"""Offline Japanese numeric and editorial rules. No network or app dependency."""
import re
import unicodedata

DIGITS = dict(zip('零〇一二三四五六七八九', [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
UNITS = {'十': 10, '百': 100, '千': 1000, '万': 10000}
NUMERAL = r'[0-9０-９〇零一二三四五六七八九十百千万]+'
COUNTERS = ('か月', 'ヶ月', 'ケ月', 'カ月', '箇月', '日間', '年生', '人', '分', '時', '階', '本', '匹', '杯', '歳', '日', '月', '回', '冊', '年')
COUNTER_PATTERN = re.compile('(' + NUMERAL + ')(' + '|'.join(COUNTERS) + ')')
INTEGER_PATTERN = re.compile(NUMERAL)


def parse_number(source):
    source = unicodedata.normalize('NFKC', source)
    if source.isdecimal():
        return int(source)
    if not any(c in UNITS for c in source):
        return int(''.join(str(DIGITS[c]) for c in source))
    total = section = digit = 0
    for c in source:
        if c in DIGITS:
            digit = DIGITS[c]
        elif c == '万':
            total += (section + digit or 1) * 10000
            section = digit = 0
        else:
            section += (digit or 1) * UNITS[c]
            digit = 0
    return total + section + digit


def number(n):
    if n == 0:
        return 'ぜろ'
    if n >= 10000:
        q, remainder = divmod(n, 10000)
        return number(q) + 'まん' + (number(remainder) if remainder else '')
    digits = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう']
    out = ''
    for unit, label, irregular in [(1000, 'せん', {3: 'さんぜん', 8: 'はっせん'}), (100, 'ひゃく', {3: 'さんびゃく', 6: 'ろっぴゃく', 8: 'はっぴゃく'}), (10, 'じゅう', {})]:
        digit, n = divmod(n, unit)
        if digit:
            out += irregular.get(digit, ('' if digit == 1 else digits[digit]) + label)
    return out + digits[n]


def counted(n, counter):
    reading, tail = number(n), n % 10
    prefix = number(n - tail) if n > tail else ''
    if counter == '人':
        if n in (1, 2):
            return {1: 'ひとり', 2: 'ふたり'}[n]
        return (prefix + 'よ' if tail == 4 else reading) + 'にん'
    if counter in ('日', '日間'):
        days = {1: 'いちにち', 2: 'ふつか', 3: 'みっか', 4: 'よっか', 5: 'いつか', 6: 'むいか', 7: 'なのか', 8: 'ようか', 9: 'ここのか', 10: 'とおか', 14: 'じゅうよっか', 20: 'はつか', 24: 'にじゅうよっか'}
        return days.get(n, reading + 'にち') + ('かん' if counter == '日間' else '')
    if counter == '時':
        return (prefix + {4: 'よ', 7: 'しち', 9: 'く'}[tail] if tail in (4, 7, 9) else reading) + 'じ'
    if counter == '月':
        return {4: 'しがつ', 7: 'しちがつ', 9: 'くがつ'}.get(n, reading + 'がつ')
    if counter == '年生':
        return counted(n, '年') + 'せい'
    if counter == '年':
        return (prefix + 'よ' if tail == 4 else reading) + 'ねん'
    if counter in ('か月', 'ヶ月', 'ケ月', 'カ月', '箇月'):
        if tail in (1, 6, 8):
            return prefix + {1: 'いっ', 6: 'ろっ', 8: 'はっ'}[tail] + 'かげつ'
        if n % 10 == 0 and reading.endswith('じゅう'):
            return reading[:-3] + 'じゅっかげつ'
        return reading + 'かげつ'
    defaults = {'分': 'ふん', '本': 'ほん', '匹': 'ひき', '杯': 'はい', '階': 'かい', '回': 'かい', '冊': 'さつ', '歳': 'さい'}
    special = {
        '分': {1: 'いっぷん', 3: 'さんぷん', 4: 'よんぷん', 6: 'ろっぷん', 8: 'はっぷん'},
        '本': {1: 'いっぽん', 3: 'さんぼん', 6: 'ろっぽん', 8: 'はっぽん'},
        '匹': {1: 'いっぴき', 3: 'さんびき', 6: 'ろっぴき', 8: 'はっぴき'},
        '杯': {1: 'いっぱい', 3: 'さんばい', 6: 'ろっぱい', 8: 'はっぱい'},
        '階': {1: 'いっかい', 3: 'さんがい', 6: 'ろっかい', 8: 'はっかい'},
        '回': {1: 'いっかい', 6: 'ろっかい', 8: 'はっかい'},
        '冊': {1: 'いっさつ', 8: 'はっさつ'},
        '歳': {1: 'いっさい', 8: 'はっさい'},
    }
    if n == 20 and counter == '歳':
        return 'はたち'
    if tail in special[counter]:
        return prefix + special[counter][tail]
    if tail == 0:
        tens = {'分': 'ぷん', '本': 'ぽん', '匹': 'ぴき', '杯': 'ぱい', '階': 'かい', '回': 'かい', '冊': 'さつ', '歳': 'さい'}
        if reading.endswith('じゅう'):
            return reading[:-3] + 'じゅっ' + tens[counter]
        if reading.endswith('ひゃく') and counter in ('分', '本', '匹', '杯', '階', '回'):
            return reading[:-3] + 'ひゃっ' + tens[counter]
        if reading.endswith('せん') and counter in ('分', '本', '匹', '杯', '階'):
            return reading + {'分': 'ぷん', '本': 'ぼん', '匹': 'びき', '杯': 'ばい', '階': 'がい'}[counter]
    return reading + defaults[counter]


def correct_phrases(text, parts, rules, pattern, split_kana, counter):
    boundaries, offset = {0: 0}, 0
    for i, part in enumerate(parts):
        offset += len(part[0])
        boundaries[offset] = i + 1
    replacements = {}
    for match in pattern.finditer(text):
        if match.start() not in boundaries or match.end() not in boundaries:
            continue
        a, b = boundaries[match.start()], boundaries[match.end()]
        before = ''.join(p[1] if len(p) > 1 else p[0] for p in parts[a:b])
        for rule in rules[match.group()]:
            if rule.get('from', before) == before and rule['to'] != before:
                replacements[a] = (b, split_kana(match.group(), rule['to']))
                counter['editorialPhraseCorrections'] += 1
                break
    output, i = [], 0
    while i < len(parts):
        if i in replacements:
            end, replacement = replacements[i]
            output.extend(replacement)
            i = end
        else:
            output.append(parts[i])
            i += 1
    return output


def correct_context(text, parts, diagnostics):
    """Bounded grammatical cases; do not substitute all dictionary alternatives."""
    output, offset = [], 0
    for p in parts:
        surface = p[0]
        reading = p[1] if len(p) > 1 else None
        left, right = text[:offset], text[offset + len(surface):]
        replacement = reading
        if surface == '台' and reading == 'たい':
            replacement = 'だい'
        elif surface == '房' and reading == 'ぼう':
            replacement = 'ふさ'
        elif surface == '土' and reading == 'ど' and not right.startswith(('曜', '日')):
            if not re.search(r'[月火水木金土日・、]$', left) and not re.match(r'[\u3400-\u9fff]',right):
                replacement = 'つち'
        elif surface == '何' and right.startswith(('の', 'です', 'だ', 'と')):
            replacement = 'なん'
        elif surface == '角' and reading == 'かく' and right.startswith(('まで', 'から', 'が', 'は', 'を', 'に', 'も', 'の', 'へ')):
            if not left.endswith(('三', '四', '多', '直', '鋭', '鈍')):
                replacement = 'かど'
        elif surface == '値' and reading == 'ね' and re.search(r'測|平均|血圧|目盛|ミリ|数値', text):
            if not right.startswith(('引', '下', '上', '段', '札', '頃')):
                replacement = 'あたい'
        elif surface == '分' and reading in ('わ', 'わか') and not right.startswith(('け','かる','から','かり','かれ','かっ')) and re.search(r'(の|た|本人|家族|友人|一人|二人|その|全員)$', left):
            replacement = 'ぶん'
        elif surface == '柄' and reading == 'え' and re.search(r'服|模様|花柄|柄入り|衣類|布|着物|シャツ|スカート|試着', text):
            replacement = 'がら'
        elif surface == '紙' and reading == 'し' and re.search(r'[のはをがにとでた。、「]$', left):
            replacement = 'かみ'
        elif surface == '手' and reading == 'しゅ' and right.startswith(('を', 'で', 'が', 'に', 'も')):
            if not left.endswith(('運転', '選', '歌', '投', '捕', '騎')):
                replacement = 'て'
        elif surface == '上' and reading == 'じょう' and (left.endswith(('一番', '番', 'の')) or right.startswith(('の席', 'の段', 'に置', 'へ置'))):
            replacement = 'うえ'
        elif surface == '下' and reading in ('もと', 'しも', 'か') and (left.endswith(('一番', '番', 'の')) or right.startswith(('の席', 'の段', 'に置', 'へ置', 'です'))):
            replacement = 'した'
        elif surface == '弦' and reading == 'つる' and re.search(r'ギター|楽器|演奏|バイオリン|ヴァイオリン', text):
            replacement = 'げん'
        elif surface == '着' and reading in ('き','ぎ') and left.endswith(('分','時','正午')):
            replacement = 'ちゃく'
        elif surface == '来' and right.startswith(('られ','れ','ない','なかっ','なく','よう')):
            replacement = 'こ'
        elif surface == '来' and right.startswith(('て','た','ます','まし','ませ')):
            replacement = 'き'
        elif surface == '書' and right.startswith('き') and left.endswith('お'):
            replacement = 'か'
        elif surface == '替' and right.startswith('わりの') and (not left or not re.search(r'[\u3400-\u9fff]$',left)):
            replacement = 'か'
        elif surface == '疲' and reading == 'づか' and (not left or re.search(r'[\u3040-\u309f。]$',left)):
            replacement = 'つか'
        elif surface == '後' and reading == 'ご' and (not left or re.search(r'[たるの。、「]$', left)):
            replacement = 'あと'
        if replacement != reading:
            diagnostics['grammaticalContextCorrections'] += 1
        output.append([surface, replacement] if replacement is not None else [surface])
        offset += len(surface)
    return output


def integer_reading(source):
    reading = number(parse_number(source))
    if source == '万':
        return 'まん'
    if source.startswith('一千') and reading.startswith('せん'):
        return 'いっせん' + reading[2:]
    return reading
