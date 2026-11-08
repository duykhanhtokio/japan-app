/** Preserve a record's public API while evaluating its large backing data on first use. */
export function lazyRecord<T extends object>(load:()=>T):T{
 let cached:T|undefined;const value=()=>cached??(cached=load());
 return new Proxy({} as T,{
  get:(_target,key)=>Reflect.get(value(),key),
  set:(_target,key,item)=>Reflect.set(value(),key,item),
  has:(_target,key)=>Reflect.has(value(),key),
  ownKeys:()=>Reflect.ownKeys(value()),
  getOwnPropertyDescriptor:(_target,key)=>{const descriptor=Reflect.getOwnPropertyDescriptor(value(),key);return descriptor?{...descriptor,configurable:true}:undefined;},
  deleteProperty:(_target,key)=>Reflect.deleteProperty(value(),key),
 });
}
