#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const assert=require('node:assert/strict');
const ts=require('typescript');
const root=path.resolve(__dirname,'../..');
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'agri-recognition-types-'));
try{
 const stubs=path.join(scratch,'runtime-stubs.d.ts');
 fs.writeFileSync(stubs,`declare function require(path:string):any;
declare module 'react' {export const Fragment:any;export function useState<T>(initial:T):[T,(next:T|((before:T)=>T))=>void];}
declare module 'react-native' {export const Text:any;export const View:any;export const Image:any;export const Pressable:any;export const ScrollView:any;export const StyleSheet:{create<T>(styles:T):T;absoluteFill:any};export type ImageSourcePropType=any;export type LayoutChangeEvent={nativeEvent:{layout:{width:number;height:number;x:number;y:number}}};export function useWindowDimensions():{width:number;height:number};}
declare namespace JSX {type Element=any;interface IntrinsicElements {[key:string]:any}}
`);
 const actual=path.join(root,'src/components/agriculture/RecognitionImages.tsx');
 const program=ts.createProgram([actual,stubs],{strict:true,noEmit:true,skipLibCheck:true,jsx:ts.JsxEmit.Preserve,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,resolveJsonModule:true,esModuleInterop:true,baseUrl:root,paths:{'@/*':['src/*']}});
 const diagnostics=ts.getPreEmitDiagnostics(program);
 assert.equal(diagnostics.length,0,ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>root,getNewLine:()=>"\n"}));
 console.log('PASS recognition-locale-types: actual RecognitionImages + actual ZoomableFigure/FlowerLegendFigure + real recognition/locale/legend JSON compile under strictTypeScript. MinimalReact/RNambient declarations isolate these components; not an entire app typecheck.');
}finally{fs.rmSync(scratch,{recursive:true,force:true});}
