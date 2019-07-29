const util = require('./getFile');
const upStt = require('./ffmpeg_upload_stt');
const path = require('path');
async function main(){
    const audioPath = "C:\\Users\\yuma1217\\GoodSync\\1on1\\解析\\92732";
    console.log(audioPath);
    const result = util.getFullPathWithFileType(audioPath, '.flac');
    result.forEach(async res => {
        console.log(res);
        await upStt.uploadToStorage(res);
        await upStt.speechToText(res);
    })
}

function baseNameTest(){
    const audioPath = "C:\\Users\\yuma1217\\GoodSync\\1on1\\解析\\90551";
    console.log(audioPath);
    const result = util.getFullPathWithFileType(audioPath, '.flac');
    result.forEach(res => {
        console.log(path.basename(res).replace('.flac'));
    })
}

// baseNameTest();
main();