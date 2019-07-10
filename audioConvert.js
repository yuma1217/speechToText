const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const m4aToFlac = (filePath) => {

    console.log(filePath);
    const res = path.extname(filePath);
    let result = '';
    if(res == '.m4a'){
        result = filePath.replace(res, '');
    }

    result = result + '.flac';
    console.log(result);

    ffmpeg()
        .input(filePath)
        .on('start', function(commandLine){
            console.log(commandLine);
        })
        .save(result)
}

module.exports.m4aToFlac = m4aToFlac;