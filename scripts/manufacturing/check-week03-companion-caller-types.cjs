// Focused TypeScript semantic gate for the week03 companion-figure API and its real callers.
// This does not replace the app-wide typecheck; unrelated app/platform imports are outside this gate.
const fs=require('fs'),path=require('path'),ts=require('typescript'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'../..'),component=path.join(root,'src/components/manufacturing/Week03CompanionFigure.tsx');
const inventory=execFileSync('git',['ls-tree','-r','--name-only','HEAD','--','src/components/manufacturing'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(x=>x.endsWith('.tsx'));const callers=inventory.map(x=>path.join(root,x)).filter(file=>file!==component&&fs.readFileSync(file,'utf8').includes('Week03CompanionFigure'));const companionCaller=path.join(root,'src/components/manufacturing/ManufacturingDailySupport.tsx');
const virtual=path.join(root,'__manufacturing_direct_api_environment.d.ts');
const declarations=`declare namespace JSX {interface Element {} interface IntrinsicElements {[name:string]:any;}}
declare var require:(name:string)=>any;
declare module 'react' {
 export type PropsWithChildren<P={}>=P&{children?:any};
 export function useState<T>(initial:T|(()=>T)):[T,(value:T|((previous:T)=>T))=>void];
 export function createContext<T>(value:T):any; export function useContext(context:any):any;
 export function useRef<T>(value:T):{current:T}; export function useEffect(effect:()=>void|(()=>void),deps?:any[]):void;
}
declare module 'react-native' {export const Image:any,Modal:any,Pressable:any,ScrollView:any,Text:any,View:any,StyleSheet:any;export function useWindowDimensions():{width:number;height:number};}
declare module 'react-native-safe-area-context' {export function useSafeAreaInsets():{top:number;bottom:number;left:number;right:number};}`;
const options={target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,moduleResolution:ts.ModuleResolutionKind.Node10,jsx:ts.JsxEmit.Preserve,strict:true,noEmit:true,skipLibCheck:true,esModuleInterop:true,resolveJsonModule:true,baseUrl:root,paths:{'@/*':['src/*']},types:[]};
function program(removeCompanionProp=false){
 const host=ts.createCompilerHost(options),originalGet=host.getSourceFile.bind(host),originalRead=host.readFile.bind(host),originalExists=host.fileExists.bind(host);
 host.fileExists=file=>file===virtual||originalExists(file);
 host.readFile=file=>file===virtual?declarations:originalRead(file);
 host.getSourceFile=(file,version,onError,createNew)=>{if(file===virtual)return ts.createSourceFile(file,declarations,version,true);if(removeCompanionProp&&file===companionCaller)return ts.createSourceFile(file,originalRead(file).replace('<Week03CompanionFigure lesson={companion} paragraphIds={binding.paragraphIds}','<Week03CompanionFigure lesson={companion}'),version,true,ts.ScriptKind.TSX);return originalGet(file,version,onError,createNew);};
 return ts.createProgram([component,...callers,virtual],options,host);
}
const current=program(),checker=current.getTypeChecker();let checked=0;const sites=[];
for(const caller of callers){const source=current.getSourceFile(caller);if(!source)throw Error('missing actual caller '+caller);function visit(node){if((ts.isJsxSelfClosingElement(node)||ts.isJsxOpeningElement(node))){
 const type=checker.getTypeAtLocation(node.tagName),signature=checker.getSignaturesOfType(type,ts.SignatureKind.Call)[0];if(!signature||path.resolve(signature.getDeclaration().getSourceFile().fileName)!==component){ts.forEachChild(node,visit);return;}
 const props=checker.getTypeOfSymbolAtLocation(signature.parameters[0],node),required=checker.getPropertyOfType(props,'paragraphIds');if(!required||(required.flags&ts.SymbolFlags.Optional))throw Error('paragraph selection must be required');
 const attribute=node.attributes.properties.find(x=>ts.isJsxAttribute(x)&&x.name.text==='paragraphIds');if(!attribute||!attribute.initializer||!ts.isJsxExpression(attribute.initializer)||!attribute.initializer.expression)throw Error('missing actual paragraphIds prop');
 const actual=checker.getTypeAtLocation(attribute.initializer.expression),expected=checker.getTypeOfSymbolAtLocation(required,node);if(!checker.isArrayType(actual)||!checker.isTypeAssignableTo(actual,expected))throw Error('paragraph selection must resolve to string[], not any/unknown');const sourceAttr=node.attributes.properties.find(x=>ts.isJsxAttribute(x)&&x.name.text==='lesson');if(!sourceAttr?.initializer||!ts.isJsxExpression(sourceAttr.initializer)||!sourceAttr.initializer.expression)throw Error('missing actual lesson');const sourceType=checker.getTypeAtLocation(sourceAttr.initializer.expression),hashSymbol=checker.getPropertyOfType(sourceType,'sourceHash');if(!hashSymbol||!(checker.getTypeOfSymbolAtLocation(hashSymbol,sourceAttr.initializer.expression).flags&ts.TypeFlags.StringLike))throw Error('lesson must carry actual typed sourceHash');
 const errors=current.getSemanticDiagnostics(source).filter(d=>d.start>=node.getStart(source)&&d.start<node.getEnd());if(errors.length)throw Error(ts.flattenDiagnosticMessageText(errors[0].messageText,' '));
 sites.push({caller:path.relative(root,caller),expression:attribute.initializer.expression.getText(source),type:checker.typeToString(actual)});checked++;
 }ts.forEachChild(node,visit);}visit(source);}
if(checked!==2)throw Error('expected both actual manufacturing callers');
const missing=program(true),baseline=missing.getSemanticDiagnostics(missing.getSourceFile(companionCaller)).filter(d=>d.code===2741&&ts.flattenDiagnosticMessageText(d.messageText,' ').includes('paragraphIds'));
if(!baseline.length)throw Error('focused type gate must detect a missing paragraph selection on the real companion caller');
console.log(JSON.stringify({relevantProductionComponentInventory:inventory.length,focusedProductionCompanionCallerTypeChecks:checked,sites,baselineMissingRequiredPropDetected:true,currentApiDiagnostics:0,scope:'Actual production companion component signature and both real caller JSX semantic checks; canonical lesson/sourceHash and string[] paragraph selections resolved; platform declarations adapted; no app-wide tsc claim'}));
