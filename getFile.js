const path = require('path');
const fs = require('fs');

// 全てのファイルのfullpathを取得する
// 引数をディレクトリ名としその直下のすべてを検索
const getFullPath = (dir) => {
    const fileNames = fs.readdirSync(dir);
    // console.log(fileNames);

    fileNames.forEach((fileName) => {
        const fullPath = path.join(dir, fileName);
        // console.log(fullPath);
        const stats = fs.statSync(fullPath);
        if(stats.isFile()){
            console.log(fullPath);
        }else if(stats.isDirectory()){
            getFullPath(fullPath);
        }
    });
}

// 指定したファイルタイプのみのファイルパスを取得する
const getFullPathWithFileType = (dir, fileType) => {
    let data = [];
    
    const fileNames = fs.readdirSync(dir);

    fileNames.forEach((fileName) => {
        const fullPath = path.join(dir, fileName);
        // console.log(fullPath);
        const stats = fs.statSync(fullPath);
        if(stats.isFile()){
            if(path.extname(fileName) == fileType){
                // console.log(fullPath);
                data.push(fullPath);
                // console.log(data);
            }
        }else if(stats.isDirectory()){
            data = data.concat(getFullPathWithFileType(fullPath, fileType));
        }
    });
    return data;
}

var result = getFullPathWithFileType(process.cwd(), '.flac');

console.log(result);
