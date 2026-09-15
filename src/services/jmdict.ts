import type { SQLiteDatabase } from 'expo-sqlite';

export type JmdictRow = {
    seq: number;
    headword: string;
    reading: string;
    kanji_json: string;
    kana_json: string;
    gloss_json: string;
    pos_json: string;
    misc_json: string;
    field_json: string;
    common: number;
};

export type JmdictEntry = Omit<JmdictRow, 'kanji_json' | 'kana_json' | 'gloss_json' | 'pos_json' | 'misc_json' | 'field_json'> & {
    kanji: string[];
    kana: string[];
    glosses: string[];
    partsOfSpeech: string[];
    misc: string[];
    fields: string[];
};

const parse = (value: string): string[] => {
    try { return JSON.parse(value) as string[]; } catch { return []; }
};

export const hydrateJmdictEntry = (row: JmdictRow): JmdictEntry => ({
    seq: row.seq,
    headword: row.headword,
    reading: row.reading,
    common: row.common,
    kanji: parse(row.kanji_json),
    kana: parse(row.kana_json),
    glosses: parse(row.gloss_json),
    partsOfSpeech: parse(row.pos_json),
    misc: parse(row.misc_json),
    fields: parse(row.field_json),
});

const englishFtsQuery = (query: string) => query
    .toLocaleLowerCase()
    .split(/\s+/)
    .map(token => token.replace(/[^a-z0-9'-]/g, ''))
    .filter(Boolean)
    .map(token => `"${token.replace(/"/g, '""')}"*`)
    .join(' AND ');

export async function searchJmdict(
    db: SQLiteDatabase,
    rawQuery: string,
    limit = 50,
    offset = 0,
): Promise<JmdictEntry[]> {
    const query = rawQuery.trim().toLocaleLowerCase();
    let rows: JmdictRow[];
    if (!query) {
        rows = await db.getAllAsync<JmdictRow>(
            'SELECT * FROM entries WHERE common=1 ORDER BY seq LIMIT ? OFFSET ?',
            limit,
            offset,
        );
    } else if (/^[\x00-\x7F]+$/.test(query)) {
        const fts = englishFtsQuery(query);
        if (!fts) return [];
        rows = await db.getAllAsync<JmdictRow>(
            `SELECT e.* FROM entries_fts f
             JOIN entries e ON e.seq=f.seq
             WHERE entries_fts MATCH ?
             ORDER BY bm25(entries_fts), e.common DESC
             LIMIT ? OFFSET ?`,
            fts,
            limit,
            offset,
        );
    } else {
        rows = await db.getAllAsync<JmdictRow>(
            `SELECT e.* FROM entries e
             JOIN (
               SELECT seq, MAX(common) AS form_common,
                      MAX(CASE WHEN normalized=? THEN 1 ELSE 0 END) AS exact
               FROM forms
               WHERE normalized LIKE ?
               GROUP BY seq
             ) hit ON hit.seq=e.seq
             ORDER BY hit.exact DESC, hit.form_common DESC, e.common DESC,
                      LENGTH(e.headword), e.seq
             LIMIT ? OFFSET ?`,
            query,
            `${query}%`,
            limit,
            offset,
        );
    }
    return rows.map(hydrateJmdictEntry);
}

export async function getJmdictEntry(db: SQLiteDatabase, seq: number) {
    const row = await db.getFirstAsync<JmdictRow>('SELECT * FROM entries WHERE seq=?', seq);
    return row ? hydrateJmdictEntry(row) : null;
}

export async function getJmdictMetadata(db: SQLiteDatabase) {
    const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT key,value FROM metadata');
    return Object.fromEntries(rows.map(row => [row.key, row.value]));
}
