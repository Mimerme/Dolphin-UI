const config = require("../config.json");
const execFile = require('child_process').spawn;
var request = require('request');
var fs = require('fs');
var cryp = require('crypto');
const unzip = require('unzip');

var process;
var DOLPHIN_RUNNING = false;
var NETPLAY_CONNECTED = false;
var NETPLAY_CONNECTING = false;

const knownChecksums = {
    "MeleeNTSC10": "",
    "MeleeNTSC101": "",
    "MeleeNTSC102": "",
    "MeleePAL10": "",
}

//Basic implementation of all crucial functions
console.log("Enter Developer View");

function startNetPlay(netplay_code) {
    console.log("Starting Netplay : " + netplay_code);
    startDolphin(["/n " + netplay_code]);
}

//Fetches the latest Dolphin Core from GitHub
function updateDolphinCore() {
    let file_size, total;
    total = 0;

    console.log("Starting Download...");
    let url = "http://raw.githubusercontent.com/Mimerme/SmashLadderDolphin/master/latest.zip";
    var file = fs.createWriteStream("dolphin_core.zip");
    request
        .get(url)
        .on('response', function (response) {
            file_size = parseInt(response.headers['content-length']);

        }).on('data', function (chunck) {
            total += chunck.length;
            let percent = total / file_size * 100;
            console.log(percent + " percent");
            if (percent == 100) {
                console.log("Download Complete");
                extractFiles("dolphin_core.zip", config.Data + "\\dolphincore");
            }
        })
        .pipe(file)
}

function extractFiles(zipPath, destination) {
    fs.createReadStream(zipPath).pipe(unzip.Extract({ path: destination }));
    fs.unlink(zipPath);
}

//Download and check md5 hash of melee
function downloadMelee() {

}

//Callback for whenever the Dolphin core prodces stdout
function onCoreOutput(data) {
    //Removes the timestamp from the buffer
    let output = data.slice(13, data.length).toString();
    switch (output) {
        case "Dolphin Launched":
            dolphinRunning = true;
            break;
    }
}

function testHash(){
    console.log("asdsd");
    getHash("D:\\Windows2\\Games\\M\\melee.iso", function(hash){
        console.log(hash);
    });
}

function getHash(filePath, callback) {
    var md5sum = cryp.createHash('md5');
    console.log("Calculating md5 Checksum...");
    var fileInfo = fs.statSync(filePath);
    console.log("File Size : " + fileInfo.size);
    let total = 0, lastUpdate = 0;

    var s = fs.ReadStream(filePath);
    s.on('data', function (d) {
        total += d.length;
        md5sum.update(d);
        let newInt = parseInt((total/fileInfo.size) * 100);
        if(newInt != lastUpdate){
            lastUpdate = newInt;
            console.log(newInt + "% complete");
        }
    });

    s.on('end', function () {
        var d = md5sum.digest('hex');
        callback(d);
    });
}

//Starts Dolphin with arguments
function startDolphin(args) {
    process = execFile(config.DolphinExecutable, args, {
        detached: false
    });

    process.stdout.on('data', onCoreOutput);

    process.on('error', (err) => {
        console.log('Failed to start Dolphin...');
        console.log(err);
    });
}

//Sends the host code
function sendHostCode() {

}

//When the host code is recieved
function onHostCode() {

}