const esbuild=require(process.env.KAIGO_ESBUILD_MODULE||'esbuild');
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../../../..'),fallback=process.env.KAIGO_ASSET_FALLBACK_ROOT||root;
const publicDir=process.env.KAIGO_BROWSER_PUBLIC||path.join(__dirname,'public');fs.mkdirSync(publicDir,{recursive:true});
const plugin={name:'focused-rn-web',setup(build){
 build.onResolve({filter:/^react-native$/},()=>({path:require.resolve(root+'/node_modules/react-native-web')}));
 build.onResolve({filter:/^expo-image$/},()=>({path:'image',namespace:'shim'}));
 build.onLoad({filter:/.*/,namespace:'shim'},()=>({contents:"export {Image} from 'react-native';",loader:'js',resolveDir:root}));
 build.onResolve({filter:/^@\//},args=>{const p=path.join(root,args.path.replace(/^@\//,'src/'));const found=['.tsx','.ts','.js','/index.ts',''].map(e=>p+e).find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());if(!found)throw Error('Missing alias '+p);return {path:found};});
 build.onResolve({filter:/\.(png|ttf)$/},args=>{const p=path.resolve(args.resolveDir,args.path);return {path:fs.existsSync(p)?p:p.replace(root,fallback)};});
 }};
(async()=>{await esbuild.build({entryPoints:[__dirname+'/entry.tsx'],bundle:true,outfile:publicDir+'/app.js',platform:'browser',format:'iife',jsx:'automatic',define:{__DEV__:'true','process.env.NODE_ENV':'"development"'},plugins:[plugin],resolveExtensions:['.web.tsx','.web.ts','.web.js','.tsx','.ts','.js','.json'],nodePaths:[root+'/node_modules'],loader:{'.png':'dataurl','.ttf':'file'}});fs.copyFileSync(fallback+'/assets/app/fonts/NotoSansJP-Medium.ttf',publicDir+'/NotoSansJP.ttf');fs.copyFileSync(fallback+'/assets/app/fonts/NotoSerifJP-SemiBold.ttf',publicDir+'/NotoSerifJP.ttf');fs.writeFileSync(publicDir+'/index.html',`<meta name="viewport" content="width=device-width, initial-scale=1"><style>@font-face{font-family:RoyalSansJP-Medium;src:url('/NotoSansJP.ttf')}@font-face{font-family:RoyalSerifJP-SemiBold;src:url('/NotoSerifJP.ttf')}html,body,#root{height:100%;margin:0;background:#142335;font-family:RoyalSansJP-Medium}#root{display:flex;flex-direction:column}</style><div id="root"></div><script src="/app.js"></script>`);console.log('FOCUSED RN WEB BUILD PASS: actual KaigoCourse + existing Royal components; expo-image shim to RN Image.');})();
