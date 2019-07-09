// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');
const fs = require('fs');
// Creates a client
const storage = new Storage();
const speechClient = new speech.SpeechClient();

const bucketName = 'vr-communication';
const filename = './testUpload.flac';
async function main(){


    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000',
    },
    });

    console.log(`${filename} uploaded to ${bucketName}.`);

    const gcsUri = 'gs://vr-communication/testUpload.flac';
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
    console.log(`Transcription: ${transcription}`);

    console.log('text output');

    fs.writeFileSync('long_output.txt', transcription, 'utf-8');
}

main().catch(console.error);

