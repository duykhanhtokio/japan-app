// Reuse the tested actual StudyImage/localization checks for the next source group.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const file=path.join(__dirname,'check-royal-differential-group01.cjs');
const source=fs.readFileSync(file,'utf8'),needle='for(let n of [3,4,5])';
assert.equal(source.split(needle).length,2,'Expected one explicit asset-scope loop');
new Function('require','__dirname',source.replace(needle,'for(let n of [6,7,8])'))(require,__dirname);
