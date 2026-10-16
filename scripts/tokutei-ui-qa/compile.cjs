// Isolated native host fixtures: test real course hooks and data, without claiming device rendering.
const fs = require("node:fs"),
  path = require("node:path");
module.exports = async function compile(root, modules, jsonSnapshots = new Map()) {
  const base = root + path.sep;
  const dependency = (name) =>
    require(require.resolve(name, { paths: [modules || root] }));
  const esbuild = dependency("esbuild"),
    fixture = require("./fixtures.cjs");
  const mocks = {
    "react-native": `import React,{forwardRef,useImperativeHandle} from 'react'; export const View='View',Text='Text',Pressable='Pressable',Image='Image',TextInput='TextInput';export const ScrollView=forwardRef((props,ref)=>{useImperativeHandle(ref,()=>({scrollTo(){}}));return React.createElement('ScrollView',props,props.children)});export const Modal=props=>props.visible?React.createElement('Modal',props,props.children):null;export const StyleSheet={create:x=>x,absoluteFill:{position:'absolute',left:0,right:0,top:0,bottom:0},absoluteFillObject:{position:'absolute',left:0,right:0,top:0,bottom:0},flatten:x=>Object.assign({},...[x].flat(Infinity).filter(Boolean))};export const useWindowDimensions=()=>globalThis.__tokuteiViewport??({width:430,height:932,fontScale:1});export const AppState={currentState:'active',addEventListener:()=>({remove(){}})};`,
    "@react-native-async-storage/async-storage": `export default {getItem:async key=>globalThis.__tokuteiStorage.get(key)??null,setItem:async(key,value)=>{if(globalThis.__tokuteiFailSave)throw Error('save failure');globalThis.__tokuteiStorage.set(key,value)},getAllKeys:async()=>[...globalThis.__tokuteiStorage.keys()]};`,
    "react-native-safe-area-context": `export const useSafeAreaInsets=()=>({top:59,bottom:34,left:0,right:0});`,
    "@/components/ui/RoyalSurface": `import React from 'react';export const ROYAL_FONT={body:'System',heading:'System'},ROYAL_LAYOUT={screenGutter:12,backSafeTop:8};export const RoyalBackButton=({onPress,style})=>React.createElement('Pressable',{accessibilityLabel:'戻る',onPress,style},React.createElement('Text',null,'戻る'));`,
    "@/components/ui/RoyalPanels": `import React from 'react';export const RoyalContentPanel=({children,style})=>React.createElement('View',{style},children);export const RoyalExplanationPanel=RoyalContentPanel;`,
    "@/components/ui/RoyalPageBackground": `import React from 'react';export default ({children})=>React.createElement('View',{},children);`,
    "@/context/LanguageContext": `export const useAppLanguage=()=>({language:globalThis.__tokuteiLanguage??'vi'});`,
    "@/data/kensetsu": `export const fields=[{id:'utilities',title:'ライフライン・設備'}],weeks=[{id:'week-01',titleJa:'安全確認',sessionIds:['session-001']}],illustrations={},illustrationAspectRatios={};export const sessionById=new Map([['session-001',${JSON.stringify(fixture.fixtureSession)}]]);export const completionId=s=>s.id,completionKey=(learner,level,field)=>'kensetsu:'+learner+':'+level+':'+field;export const restoreProgress=raw=>JSON.parse(raw||'{}');`,
    "@/data/kensetsu/review-tests": `export const reviewTests=[{id:'test-01',version:1,contentRevision:'v1',titleJa:'建設学習確認テスト 第1回',questions:${JSON.stringify(fixture.questions)}}];`,
    "@/data/kaigo/weekly-art-allocation": `export const illustrationForStudyDay=day=>({source:1,aspectRatio:1.5,captionVi:'BẢN_DỊCH_HÌNH'});`,
    "@/data/kaigo/depth-figures": `export const kaigoDepthFigures={};`,
    "@/data/kaigo/figures": `export const kaigoFigures={};`,
    "@/data/kaigo/lesson-illustrations": `export const illustrationFor=()=>undefined;`,
  };
  const plugin = {
    name: "fixtures",
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (mocks[args.path]) return { path: args.path, namespace: "fixture" };
        if (args.path === "react" || args.path.startsWith("react/"))
          return { path: args.path, external: true };
        if (args.path.startsWith("@/"))
          return { path: resolve(base + "src/" + args.path.slice(2)) };
      });
      build.onLoad({ filter: /.*/, namespace: "fixture" }, (args) => ({
        contents: mocks[args.path],
        loader: "tsx",
      }));
      // Optional committed JSON inputs let revision tests run the actual old data adapter.
      // Normal fixture callers read the working tree exactly as before.
      build.onLoad({ filter: /\.json$/, namespace: "file" }, (args) => {
        const snapshot = jsonSnapshots.get(path.resolve(args.path));
        return snapshot === undefined ? undefined : { contents: snapshot, loader: "json" };
      });
      build.onResolve({ filter: /\.(png|jpg|jpeg|webp|mp3)$/ }, (args) => ({
        path: args.path,
        namespace: "asset",
      }));
      build.onLoad({ filter: /.*/, namespace: "asset" }, () => ({
        contents: "export default 1;",
        loader: "js",
      }));
    },
  };
  function resolve(p) {
    for (const suffix of [".ts", ".tsx", ".json", "/index.ts"])
      if (fs.existsSync(p + suffix)) return p + suffix;
    throw Error(p);
  }
  const entries = [
    "src/components/kensetsu/KensetsuCourse",
    "src/components/kensetsu/KensetsuReviewTests",
    "src/components/kaigo/KaigoCourse",
    "src/data/kaigo/japanese-reading",
    "src/data/kaigo/japanese-master",
    "src/data/kaigo/catalog",
    "src/data/kaigo/weekly-learning",
    "src/data/kaigo/japanese-assessments",
    "src/data/kaigo/japanese-mock-reviews",
    "src/data/kaigo/japanese-mock-translations",
    "src/services/kaigo-session",
    "src/components/tokutei/StudyAppearance",
    "src/data/kaigo/index",
  ];
  const contents = entries
    .map((p) => `export * from ${JSON.stringify(base + p)};`)
    .join("\n");
  const result = await esbuild.build({
    stdin: { contents, resolveDir: base, loader: "tsx" },
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    jsx: "automatic",
    plugins: [plugin],
    logLevel: "error",
  });
  const box = { exports: {} };
  new Function("module", "exports", "require", result.outputFiles[0].text)(
    box,
    box.exports,
    (name) => dependency(name),
  );
  return box.exports;
};
