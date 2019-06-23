const fs = require('fs');
const fileType = require('file-type');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// 全てのファイルを出力する
function printAllFiles(dir){
    const filenames = fs.readdirSync(dir);
    filenames.forEach((filename) => {
        const fullPath = path.join(dir, filename);
        const stats = fs.statSync(fullPath);
        if(stats.isFile()){
            if(path.extname(fullPath) != '.flac'){
                console.log(fullPath);
                ffmpeg()
                    .input(fullPath)
                    .on('start', function(commandLine){
                        console.log(commandLine);
                    })
                    .save('')
            }
        }else if(stats.isDirectory()){
            printAllFiles(fullPath);
        }
    })
}

// main
// const dir = process.cwd();
// printAllFiles(dir + '/resources');


// fs.readdir('./resources', function(err, files){
//     if(err) {
//         console.log('error');
//     }
//     console.log(files);
// })

// const filenames = fs.readdirSync('./resources');

// for(const file of filenames){
//     var type = fileType(file);
//     console.log(type);
// }