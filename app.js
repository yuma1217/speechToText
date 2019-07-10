const util = require('./getFile');
const audioConverter = require('./audioConvert');

const result = util.getFullPathWithFileType(process.cwd(), '.m4a');
console.log(result);
// audioConverter.m4aToFlac()
result.forEach(res => {
    audioConverter.m4aToFlac(res);
})

