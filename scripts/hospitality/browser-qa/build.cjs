/* Uses esbuild already declared in the repository; does not install dependencies. */
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const repoRoot = path.resolve(__dirname, '../../..');
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('node scripts/hospitality/browser-qa/build.cjs [--out DIRECTORY]');
  process.exit(0);
}
if (args.some((arg, index) => arg !== '--out' && args[index - 1] !== '--out') ||
    (args.includes('--out') && !args[args.indexOf('--out') + 1])) {
  throw new Error('Expected only --out DIRECTORY');
}
const outDir = args.includes('--out')
  ? path.resolve(args[args.indexOf('--out') + 1])
  : fs.mkdtempSync(path.join(os.tmpdir(), 'japan-app-hotel-browser-qa-'));
if (outDir === repoRoot || outDir.startsWith(repoRoot + path.sep)) {
  throw new Error('QA output must stay outside the repository; use a temporary directory.');
}
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
async function main() {
  let esbuild;
  try { esbuild = require('esbuild'); }
  catch { throw new Error('Missing declared repository dependency esbuild. Run the normal repository dependency setup first. No dependency was installed by this script.'); }
  fs.mkdirSync(outDir, {recursive: true});
  const result = await esbuild.build({
    absWorkingDir: repoRoot,
    entryPoints: [path.join(__dirname, 'entry.cjs')],
    outfile: path.join(outDir, 'bundle.js'),
    bundle: true, platform: 'browser', format: 'iife', target: ['es2020'],
    jsx: 'automatic', metafile: true,
    define: {'process.env.NODE_ENV': '"production"', __DEV__: 'false'},
    alias: {'react-native': 'react-native-web'},
    plugins: [{name: 'repository-at-alias', setup(build) {
      build.onResolve({filter: /^@\//}, ({path: name}) => {
        const base = path.join(repoRoot, 'src', name.slice(2));
        const resolved = [base, base + '.ts', base + '.tsx', base + '.json', path.join(base, 'index.ts')]
          .find(file => fs.existsSync(file) && fs.statSync(file).isFile());
        if (!resolved) throw new Error(`Missing repository alias: ${name}`);
        return {path: resolved};
      });
    }}],
  });
  const closurePath = path.join(repoRoot, 'docs/ssw-workspace/hospitality/ROYAL_CURRENT_RUNTIME_SCOPE_CLOSURE_20261107.json');
  const closure = JSON.parse(fs.readFileSync(closurePath, 'utf8'));
  const sourceFiles = Object.keys(result.metafile.inputs)
    .map(file => path.resolve(repoRoot, file))
    .filter(file => file.startsWith(repoRoot + path.sep) && !file.includes(path.sep + 'node_modules' + path.sep));
  const productionPaths = [...new Set([...Object.keys(closure.postMergeProductionSha256 || {}),
    ...sourceFiles.map(file => path.relative(repoRoot, file))])].sort();
  const productionSha256 = Object.fromEntries(productionPaths.map(file => [file, sha256(path.join(repoRoot, file))]));
  const manifest = {
    schemaVersion: 1, repoRoot, builtAt: new Date().toISOString(),
    method: 'Production components bundled by repository esbuild with actual React, ReactDOM and react-native-web; no native mocks.',
    dependencyVersions: Object.fromEntries(['esbuild', 'react', 'react-dom', 'react-native-web', 'typescript']
      .map(name => [name, require(name + '/package.json').version])),
    productionSha256, bundleSha256: sha256(path.join(outDir, 'bundle.js')),
    browserRenderingVerified: false, physicalDeviceTested: false,
  };
  fs.writeFileSync(path.join(outDir, 'build-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  fs.writeFileSync(path.join(outDir, 'index.html'), '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body{margin:0;width:100%;background:#fff}#app{box-sizing:border-box;padding:16px;width:100%;max-width:980px;margin:auto}</style></head><body><div id="app"></div><script src="bundle.js"></script></body></html>');
  console.log(JSON.stringify({outputDirectory: outDir, inputFiles: productionPaths.length, browserExecuted: false}));
}
main().catch(error => {console.error(error.message); process.exitCode = 1;});
