// One catalog for authoring/QA: keep the verified baseline byte-preserved and
// load subsequent entries (or explicit editorial replacements) as an overlay.
const fs = require('node:fs');
const path = require('node:path');
module.exports = root => {
  const dir = path.join(root, 'src/data/generated');
  const base = JSON.parse(fs.readFileSync(path.join(dir, 'vocabulary-practical-examples.json'), 'utf8'));
  const file = path.join(dir, 'vocabulary-practical-example-additions.json');
  const additions = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { entries: {} };
  return { ...base, entries: { ...base.entries, ...additions.entries } };
};
