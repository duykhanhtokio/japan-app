#!/usr/bin/env python3
"""Build the bundled, searchable JMdict SQLite database.

Usage:
  python3 scripts/build-jmdict-database.py /path/to/jmdict-eng-*.json.zip
"""

from __future__ import annotations

import json
import sqlite3
import sys
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "jmdict" / "jmdict.db"


def compact(values: list[str]) -> str:
    return json.dumps(values, ensure_ascii=False, separators=(",", ":"))


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Pass exactly one jmdict-eng-*.json.zip file.")

    archive = Path(sys.argv[1]).expanduser().resolve()
    with zipfile.ZipFile(archive) as zipped:
        names = [name for name in zipped.namelist() if name.endswith(".json")]
        if len(names) != 1:
            raise SystemExit("The archive must contain exactly one JMdict JSON file.")
        with zipped.open(names[0]) as stream:
            source = json.load(stream)

    if source.get("commonOnly") is not False or source.get("languages") != ["eng"]:
        raise SystemExit("Expected the complete English JMdict build (not common-only).")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.unlink(missing_ok=True)
    database = sqlite3.connect(OUTPUT)
    database.executescript(
        """
        PRAGMA journal_mode=OFF;
        PRAGMA synchronous=OFF;
        PRAGMA temp_store=MEMORY;
        CREATE TABLE metadata(key TEXT PRIMARY KEY, value TEXT NOT NULL);
        CREATE TABLE entries(
          seq INTEGER PRIMARY KEY,
          headword TEXT NOT NULL,
          reading TEXT NOT NULL,
          kanji_json TEXT NOT NULL,
          kana_json TEXT NOT NULL,
          gloss_json TEXT NOT NULL,
          pos_json TEXT NOT NULL,
          misc_json TEXT NOT NULL,
          field_json TEXT NOT NULL,
          common INTEGER NOT NULL
        );
        CREATE TABLE forms(
          form TEXT NOT NULL,
          normalized TEXT NOT NULL,
          seq INTEGER NOT NULL,
          form_type TEXT NOT NULL,
          common INTEGER NOT NULL,
          FOREIGN KEY(seq) REFERENCES entries(seq)
        );
        CREATE VIRTUAL TABLE entries_fts USING fts5(
          seq UNINDEXED,
          english,
          tokenize='unicode61 remove_diacritics 2'
        );
        """
    )

    metadata = {
        "source": "JMdict/EDRDG via jmdict-simplified",
        "version": str(source["version"]),
        "dictDate": str(source["dictDate"]),
        "entryCount": str(len(source["words"])),
        "license": "CC BY-SA 4.0",
        "licenseUrl": "https://www.edrdg.org/edrdg/licence.html",
        "projectUrl": "https://www.edrdg.org/jmdict/j_jmdict.html",
    }
    database.executemany("INSERT INTO metadata VALUES (?, ?)", metadata.items())

    entries: list[tuple] = []
    forms: list[tuple] = []
    full_text: list[tuple] = []
    for item in source["words"]:
        seq = int(item["id"])
        kanji = item.get("kanji", [])
        kana = item.get("kana", [])
        senses = item.get("sense", [])
        kanji_values = [row["text"] for row in kanji]
        kana_values = [row["text"] for row in kana]
        common_kanji = [row["text"] for row in kanji if row.get("common")]
        common_kana = [row["text"] for row in kana if row.get("common")]
        headword = (common_kanji or kanji_values or common_kana or kana_values)[0]
        reading = (common_kana or kana_values)[0]
        glosses = list(dict.fromkeys(
            gloss["text"]
            for sense in senses
            for gloss in sense.get("gloss", [])
            if gloss.get("lang") == "eng" and gloss.get("text")
        ))
        parts = list(dict.fromkeys(tag for sense in senses for tag in sense.get("partOfSpeech", [])))
        misc = list(dict.fromkeys(tag for sense in senses for tag in sense.get("misc", [])))
        fields = list(dict.fromkeys(tag for sense in senses for tag in sense.get("field", [])))
        is_common = int(any(row.get("common") for row in kanji + kana))
        entries.append((seq, headword, reading, compact(kanji_values), compact(kana_values), compact(glosses), compact(parts), compact(misc), compact(fields), is_common))
        for row in kanji:
            forms.append((row["text"], row["text"].casefold(), seq, "kanji", int(bool(row.get("common")))))
        for row in kana:
            forms.append((row["text"], row["text"].casefold(), seq, "kana", int(bool(row.get("common")))))
        full_text.append((seq, " ; ".join(glosses)))

        if len(entries) >= 4000:
            database.executemany("INSERT INTO entries VALUES (?,?,?,?,?,?,?,?,?,?)", entries)
            database.executemany("INSERT INTO forms VALUES (?,?,?,?,?)", forms)
            database.executemany("INSERT INTO entries_fts VALUES (?,?)", full_text)
            entries.clear(); forms.clear(); full_text.clear()

    if entries:
        database.executemany("INSERT INTO entries VALUES (?,?,?,?,?,?,?,?,?,?)", entries)
        database.executemany("INSERT INTO forms VALUES (?,?,?,?,?)", forms)
        database.executemany("INSERT INTO entries_fts VALUES (?,?)", full_text)

    database.executescript(
        """
        CREATE INDEX forms_normalized_idx ON forms(normalized, common DESC, seq);
        CREATE INDEX forms_seq_idx ON forms(seq);
        ANALYZE;
        PRAGMA optimize;
        """
    )
    database.commit()
    database.close()
    print(f"Built {OUTPUT} with {metadata['entryCount']} entries ({metadata['dictDate']}).")


if __name__ == "__main__":
    main()
