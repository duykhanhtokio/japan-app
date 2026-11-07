const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const source=fs.readFileSync(path.join(__dirname,'check-royal-differential-group01.cjs'),'utf8'),needle='for(let n of [3,4,5])';
assert.equal(source.split(needle).length,2);
new Function('require','__dirname',source.replace(needle,'for(let n of [9,10,11])'))(require,__dirname);
