const util = require('./getFile');
const audioConverter = require('./audioConvert');

const audioPath = "C:\\Users\\yuma1217\\GoodSync\\1on1\\解析";
console.log(audioPath);

const result = util.getFullPathWithFileType(audioPath, '.m4a');
result.forEach(res => {
    audioConverter.audioToFlac(res);
})

const result2 = util.getFullPathWithFileType(audioPath, '.mp3');
result2.forEach(res => {
    audioConverter.audioToFlac(res);
})