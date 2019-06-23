async function main() {
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');
  const fs = require('fs');

  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
  // const fileName = './resources/2019_04_26_14_34_39.flac';

  const gcsUri = 'gs://vr-communication/92081/93159/1_direct_93159.m4a';
  // const uri = fileName;
  const encoding = 'FLAC';
  // const sampleRateHertz = 16000;
  const languageCode = 'ja-JP';
  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const model = 'phone_call';

  const config = {
    encoding: encoding,
    languageCode: languageCode,
    // タイムスタンプを設定
    // enableWordTimeOffsets: true,
    // sampleRateHertz: sampleRateHertz,

    // modelは日本語の対応まだしていない
    // model: model,
  };
  
  const audio = {
    uri: gcsUri,
    //content: fs.readFileSync(fileName).toString('base64'),
  };
  
  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file
  // long version
  const [operation] = await client.longRunningRecognize(request);

  const [response] = await operation.promise();

  const transcription = response.results.map(result => result.alternatives[0].transcript)
                              .join('\n');
  console.log(`Transcription: ${transcription}`);

  console.log('text output');

  fs.writeFileSync('long_output.txt', transcription, 'utf-8');

}
main().catch(console.error);