import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const ts = require('typescript');
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'src/data/generated', name), 'utf8'));
const source = fs.readFileSync(path.join(root, 'src/data/jlpt-grammar-supplements.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context, { timeout: 1000 });
const { jlptGrammarSupplements, replacedGrammarIds } = context.exports;
const entries = [
  ...read('vocabulary.json'),
  ...read('grammar.json').filter(item => !replacedGrammarIds.has(item.id)),
  ...jlptGrammarSupplements,
];
const index = Object.fromEntries(['N5', 'N4', 'N3', 'N2', 'N1'].map(level => [
  level, [...new Set(entries.filter(item => item.jlpt === level).map(item => item.id))].sort(),
]));
const target = path.join(root, 'src/data/generated/learning-progress-ids.json');
const output = JSON.stringify(index, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (fs.readFileSync(target, 'utf8') !== output) {
    throw new Error('Learning progress IDs are stale; run node scripts/build-learning-progress-ids.mjs');
  }
  console.log('LEARNING PROGRESS IDS PASS: vocabulary, grammar and replacement IDs match at every level');
} else {
  fs.writeFileSync(target, output);
  console.log(`Wrote ${entries.length} source IDs to ${path.relative(root, target)}`);
}
