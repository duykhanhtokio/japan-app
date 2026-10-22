"""Pronunciation regressions for previously observed corpus defects."""
from furigana.reading_rules import counted, number, parse_number, integer_reading

COUNTERS = [
 (10,'分','じゅっぷん'),(20,'分','にじゅっぷん'),(30,'分','さんじゅっぷん'),(100,'分','ひゃっぷん'),(1000,'分','せんぷん'),
 (20,'本','にじゅっぽん'),(30,'本','さんじゅっぽん'),(3,'本','さんぼん'),(6,'本','ろっぽん'),
 (1,'人','ひとり'),(2,'人','ふたり'),(4,'人','よにん'),(14,'人','じゅうよにん'),(24,'人','にじゅうよにん'),
 (1,'日','いちにち'),(24,'日','にじゅうよっか'),(3,'日間','みっかかん'),(2,'日間','ふつかかん'),
 (4,'時','よじ'),(7,'時','しちじ'),(9,'時','くじ'),(17,'時','じゅうしちじ'),(24,'時','にじゅうよじ'),
 (4,'年','よねん'),(4,'年生','よねんせい'),(4,'月','しがつ'),(7,'月','しちがつ'),(9,'月','くがつ'),
 (1,'か月','いっかげつ'),(6,'か月','ろっかげつ'),(8,'か月','はっかげつ'),(20,'か月','にじゅっかげつ'),
 (20,'歳','はたち'),(3,'階','さんがい'),(1000,'階','せんがい'),
]
for n, unit, expected in COUNTERS:
    actual = counted(n,unit)
    assert actual == expected, (n, unit, actual, expected)
NUMBERS = [(300,'さんびゃく'),(600,'ろっぴゃく'),(800,'はっぴゃく'),(3000,'さんぜん'),(8000,'はっせん'),(29670,'にまんきゅうせんろっぴゃくななじゅう')]
for n, expected in NUMBERS:
    assert number(n) == expected, (n,number(n),expected)
assert parse_number('二万九千六百七十') == 29670
assert parse_number('２０') == 20
assert parse_number('二〇三') == 203
for source,expected in [('万','まん'),('一千','いっせん'),('一千万','いっせんまん')]:
    assert integer_reading(source)==expected,(source,integer_reading(source),expected)
print(f'READING RULES PASS: {len(COUNTERS)+len(NUMBERS)+6} counter/integer regressions')
