"use strict";

//Import packages
const
    fs = require("fs"),
    ffmpegPath = require("@ffmpeg-installer/ffmpeg").path,
    ffmpeg = require("fluent-ffmpeg"),
    cors = require('cors')({ origin: true }),
    moment = require("moment");
// set ffmpeg package path
ffmpeg.setFfmpegPath(ffmpegPath);

//Scope variables
const
    // GCF allowes to store files inside its own local folder name "tmp"
    inputTempFileName = "/tmp/in_HelloWorld_Temp.wav",
    outputTempFileName = "/tmp/out_HelloWorld_Temp.wav";

//Exporting GCF modul 
// Parameter description:
// Main_req.body.AudioBytes: this is sting parameter which i am passing from Lambda
// process.env.TempBytes: this is Default audio bytes string of "Hello" word, which i stored locally
exports.ffmpeg_handler = function(Main_req, Main_resp) {
    try {
        // Implementing CORS on received request & responce Object 
        cors(Main_req, Main_resp, () => {});
        // Website you wish to allow to connect
        Main_resp.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        Main_resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        // Request headers you wish to allow
        Main_resp.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // Set to true if you need the Caller to include cookies in the requests which 
        // sent to the API (e.g. in case you use sessions)
        Main_resp.setHeader('Access-Control-Allow-Credentials', true);

        //check if audiobytes param exist in request
        if (fnIsNullorEmpty(Main_req.body.AudioBytes)) {
            console.log("Request start at: ", fnTime());

            // for calculating time to process the request            
            console.time("time:");

            // get Audio Bytes from Request 
            const AudioBytes = (fnIsNullorEmpty(Main_req.body.AudioBytes) ? Main_req.body.AudioBytes : process.env.TempBytes);

            // create buffer object from base64 encoded string, 
            // it is important to tell the constructor that the string is base64 encoded
            var BufferData = new Buffer.from(AudioBytes, "base64");

            // file metadata to write buffer to audio file
            let metadata = {
                metadata: {
                    contentType: "audio/wav"
                }
            }

            let writeStream = fs.createWriteStream(inputTempFileName, metadata);
            // write some data with a base64 encoding
            writeStream.write(BufferData, "base64");

            // the "finish" event is emitted when all data has been flushed from the stream
            writeStream.on("finish", () => {
                console.log("Bytes to Audio file created in local storage successfully!...");
                // FFmpeg operation starts here
                const command = ffmpeg(inputTempFileName)
                    .withAudioChannels(1)
                    .withAudioFrequency(16000)
                    .withAudioQuality(5)
                    .withOutputFormat("wav")
                    .on("start", (commandLine) => {
                        //console.log("ffmpeg conversion start: ", commandLine);
                    })
                    .on("progress", function(progress) {
                        //console.log("Processing: " + progress.percent + "% done");
                    })
                    .on("stderr", function(stderrLine) {
                        //console.log("Stderr output: " + stderrLine);
                    })
                    .on("codecData", function(data) {
                        //console.log("Input is " + data.audio + " audio " + "with " + data.video + " video");
                    })
                    .on("end", () => {
                        console.log("ffmpeg file has been locally converted successfully!...");
                        // now Work on your audio file here & once done, just delete the file :)
                        fnDeletefilesFromlocalStorage(inputTempFileName);
                        fnDeletefilesFromlocalStorage(outputTempFileName);
                        // ent to calculate the process time
                        console.timeEnd("time:");
                    })
                    .on("error", (error) => {
                        console.log("ffmpeg Error: ", error);
                        // ent to calculate the process time
                        console.timeEnd("time:");
                        // send back the reponse 
                        Main_resp.status(417).send(`{"ffmpeg Error": "${error}"}`);
                    })
                    .pipe(fs.createWriteStream(outputTempFileName), { 
                        end: true 
                    });
            });
            // close the writter stream
            writeStream.end();
        } else {
            console.log(`{"Audio Bytes null": "${JSON.stringify(Main_req.body.AudioBytes)}"}`);
            // send back the reponse 
            Main_resp
                .status(406)
                .send(`{"Audio Bytes null": "${JSON.stringify(Main_req.body.AudioBytes)}"}`);
        }
    } catch (error) {
        console.error("Error: ", error);
        // send back the reponse 
        Main_resp.status(417).send(`{"Main Error": "${error}"}`);
    }
}

// this function will delete the locally stored file inside GCF "tmp" folder
function fnDeletefilesFromlocalStorage(filename) {
    try {
        // Deletes file from local storage
        fs.unlink(filename, (error) => {
            if (error) {
                console.error(`delet ${filename} file ERROR:`, error);
            } else {
                console.log(`${filename} file deleted.`);
            }
        });
    } catch (error) {
        console.error("fnDeletefilesFromlocalStorage() > ERROR:", error);
    }
}

// this function will return the current time with pre-specified format
function fnTime() {
    return moment(new Date()).format("hh:mm:ss A");
}

// this function will validate weather specified parameter is "undefined/null/empty"
function fnIsNullorEmpty(data) {
    if ((typeof data !== "undefined") && (data !== null) && (data.length != 0)) {
        return true;
    } else {
        return false;
    }
}