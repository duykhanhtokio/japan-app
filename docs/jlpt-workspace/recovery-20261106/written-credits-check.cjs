const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const Module = require('node:module');
const esbuild = require('esbuild');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '../../..');

(async () => {
  const mock = `
    import React from 'react';
    export const Text=({children,accessibilityRole,selectable,...props})=>React.createElement(accessibilityRole==='header'?'h2':'p',null,children);
    export const View=({children,testID})=>React.createElement('section',{'data-testid':testID},children);
    export const ScrollView=View,Pressable=View,Modal=View;
    export const StyleSheet={create:x=>x}; export const Alert={alert:()=>{}};
    export const EffectsSettings=()=>null; export const RoyalBackButton=()=>null;
    export const backPrepared=()=>{}; export default View;
  `;
  const built = await esbuild.build({
    entryPoints: [path.join(root, 'src/app/settings/index.tsx')], bundle: true,
    platform: 'node', format: 'cjs', jsx: 'automatic', write: false,
    external: ['react', 'react/jsx-runtime'], logLevel: 'silent',
    plugins: [{ name: 'settings-platform-fixture', setup(build) {
      build.onResolve({filter:/^react-native$|^@\/components\/effects\/EffectsSettings$|^@\/components\/ui\//}, args => ({path:args.path,namespace:'platform'}));
      build.onLoad({filter:/.*/,namespace:'platform'},()=>({contents:mock,loader:'jsx'}));
      build.onResolve({filter:/^@\/context\/LanguageContext$/},()=>({path:'language',namespace:'language'}));
      build.onLoad({filter:/.*/,namespace:'language'},()=>({contents:`export const useAppLanguage=()=>({language:globalThis.__jlptCreditLanguage,setLanguage:async()=>{},t:key=>key});`,loader:'js'}));
      build.onResolve({filter:/^@\//},args=>{const stem=path.join(root,'src',args.path.slice(2));return {path:['.tsx','.ts','.json','/index.tsx','/index.ts'].map(suffix=>stem+suffix).find(file=>fs.existsSync(file))};});
    }}],
  });
  const compiled = new Module(path.join(root, 'settings-credit-render.cjs'), module);
  compiled.paths = module.paths;
  compiled.filename = path.join(root, 'settings-credit-render.cjs');
  compiled._compile(built.outputFiles[0].text, compiled.filename);
  const casting = JSON.parse(fs.readFileSync(path.join(root, 'src/data/jlpt-original/voice-casting.json')));
  const credits = Object.values(casting.roles).map(voice => voice.credit);
  assert.equal(new Set(credits).size,4);
  const languages=['ja','vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
  for (const language of languages) {
    globalThis.__jlptCreditLanguage=language;
    const html=renderToStaticMarkup(React.createElement(compiled.exports.default));
    assert.match(html,/data-testid="jlpt-voice-credits"/);
    for(const credit of credits) assert.equal(html.split(credit).length-1,1,language+': '+credit);
    assert.ok(html.includes(language==='ja'?'JLPT練習音声のクレジット':language==='vi'?'Ghi công giọng đọc luyện thi JLPT':'JLPT practice voice credits'));
  }
  delete globalThis.__jlptCreditLanguage;
  console.log(JSON.stringify({status:'PASS',scope:'Actual Settings route and credits component server-rendered with mocked platform/navigation/language dependencies; not full-router or native-device validation',languages:languages.length,canonicalCredits:credits.length,visibleWithoutModal:true}));
})().catch(error=>{console.error(error);process.exitCode=1});
