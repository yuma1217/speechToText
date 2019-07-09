const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const {Storage} = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'vr-communication';

const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient();

const flag = false;

// ローカルファイルをflacに変換する
// .m4a -> flac
// 変数に.m4aまでの名前を入れる
async function convertAudio(name){
    const fileName = name;
    let flag = false;
    // ここのawait外すとエラーになる
    ffmpeg()
        .input(fileName + ".m4a")
        .on('start', function(commandLine){
            console.log(commandLine);
        })
        .on('progress', function(progress){
            console.log('Processing:' + progress.percent + '%done');
            console.log('Frames:' + progress.frames);
        })
        .on('end', async function(){
            console.log('finish!');
        })
        .on('error', function(){
            console.log(fileName + ' error');
        })
        .save(fileName + '.flac');
}

// StorageにUploadするスクリプト
async function uploadToStorage(name){
    await storage.bucket(bucketName).upload(name, {
        gzip: false,

        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });

    console.log(`${name} uploaded to ${bucketName}.`)
}

// 秒数待つメソッド
const wait = (sec) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, sec * 1000);
    })
}

function findFile(name){
    console.log("find file");
    try{
        fs.statSync(name);
    }catch(e){
        return false;
    }
    return true;
}

async function speechToText(name){
    const gcsUri = 'gs://vr-communication/' + name + '.flac';
    const encoding = 'FLAC';
    const languageCode = 'ja-JP';
    const config = {
        encoding: encoding,
        languageCode: languageCode,
    };
    const audio = {
        uri: gcsUri,
    };
    const request = {
        config: config,
        audio: audio,
    };

    const [operation] = await speechClient.longRunningRecognize(request);

    const [response] = await operation.promise();

    const transcription = response.results.map(result => result.alternatives[0].transcript)
                                            .join('\n');

    console.log('text output');
    fs.writeFileSync(name + '.txt', transcription, 'utf-8');
}

async function main(){
    const testFile = '1_direct_93159_test';
    convertAudio(testFile);

    while(!findFile(testFile + '.flac')){
        console.log("まだできていない");
    }
    // await wait(3);
    // await uploadToStorage(testFile + '.flac');
    // await speechToText(testFile);
    console.log("done");
}

main().catch(console.error);