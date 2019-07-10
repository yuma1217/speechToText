const util = require('./getFile');
const audioConverter = require('./audioConvert');

const result = util.getFullPathWithFileType(process.cwd(), '.m4a');
result.forEach(res => {
    audioConverter.audioToFlac(res);
})

const result2 = util.getFullPathWithFileType(process.cwd(), '.mp3');
result2.forEach(res => {
    audioConverter.audioToFlac(res);
})