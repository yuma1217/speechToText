const ffmpeg = require('fluent-ffmpeg');

ffmpeg()
    .input('audio.m4a')
    .on('start', function(commandLine){
        // ffmpegで実際に行っているコマンドを出力
        console.log('spawned ffmpeg with command: ' + commandLine);
    })
    .on('progress', function(progress){
        console.log('Processing:' + progress.percent + '%done');
        console.log('Frames:' + progress.frames);
    })
    .on('end', function(){
        console.log("finish!");
    })
    .on('error', function(){
        console.log('error');
    })
    .save('audio.flac');