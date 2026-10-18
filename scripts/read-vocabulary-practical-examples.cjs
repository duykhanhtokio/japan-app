// One catalog for authoring/QA: keep the verified baseline byte-preserved and
// load subsequent entries (or explicit editorial replacements) as an overlay.
const fs = require('node:fs');
const path = require('node:path');
module.exports = root => {
  const dir = path.join(root, 'src/data/generated');
  const base = JSON.parse(fs.readFileSync(path.join(dir, 'vocabulary-practical-examples.json'), 'utf8'));
  const file = path.join(dir, 'vocabulary-practical-example-additions.json');
  const additions = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { entries: {} };
  const entries = { ...base.entries, ...additions.entries };
  const shards = path.join(dir, 'vocabulary-practical-example-shards');
  const manifest = path.join(shards, 'manifest.json');
  if (fs.existsSync(manifest)) for (const item of JSON.parse(fs.readFileSync(manifest, 'utf8')).files) {
    if (!/^direct-\d+\.json$/.test(item.file)) throw Error('Invalid vocabulary shard path');
    const shard = JSON.parse(fs.readFileSync(path.join(shards, item.file), 'utf8'));
    for (const [id, value] of Object.entries(shard.entries)) {
      if (entries[id]) throw Error('Duplicate vocabulary shard ID ' + id);
      entries[id] = value;
    }
  }
  return { ...base, entries };
};
