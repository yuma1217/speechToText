const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const audioToFlac = (filePath) => {

    console.log(filePath);
    const res = path.extname(filePath);
    let result = '';
    if(res == '.m4a' || res == '.mp3'){
        result = filePath.replace(res, '');
    }else{
        console.log("拡張子が予期されたものではありません");
        return;
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

module.exports.audioToFlac = audioToFlac;