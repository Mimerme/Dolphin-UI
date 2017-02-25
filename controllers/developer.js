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
var WEBSOCKET = null;
var NETPLAY_HOST_CODE = "";

//Turn off during release
const LOG_CORE_OUTPUT = true;

//Detect which version of Melee
const knownChecksums = {
    "MeleeNTSC10": "3a62f8d10fd210d4928ad37e3816e33c",
    "MeleeNTSC101": "67136bd167b471e0ad72e98d10cf4356",
    "MeleeNTSC102": "0e63d4223b01d9aba596259dc155a174",
    "MeleePAL": "5e118fc2d85350b7b092d0192bfb0f1a",
    "MeleeNTSCJ": "dc07abd4b6a5e1517da575274ceefcf8"
}

var AUTHENTICATING = false;

//Basic implementation of all crucial functions
console.log("Enter Developer View");

function testAuthenticate(){
    AUTHENTICATING = true;
    startNetPlay("host");
}

//Sends a simple post request with an identifier
function authenticate(netplay_code){
     let auth = request.post('https://www.smashladder.com/apiv1/dolphin_host', {form:{host_code: netplay_code}},
     function(err, response, body){
        if(JSON.parse(body).success){
            console.log("Authentication response OK");
        }
        else{
            console.log(err);
            console.log(response);
            console.log(body);
        }
     }); 
}

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

function quitDolphin(){
    process.kill('SIGKILL');
}

//Callback for whenever the Dolphin core prodces stdout
function onCoreOutput(data) {
    //Removes the timestamp from the buffer
    let output = data.slice(12, data.length).toString();
    if(LOG_CORE_OUTPUT)
        console.log(output);
    
        if(output == "Dolphin Launched")
            dolphinRunning = true;
        else if(output.includes("Host Code ")){
            let code = output.substring(10, output.length);
            if(AUTHENTICATING){
                AUTHENTICATING = false;
                authenticate(code);
                quitDolphin();
            }
        }
    }


function testHash(){
    getHash("D:\\Windows2\\Games\\M\\melee.iso", function(hash){
        console.log(hash);
	for(checksum in knownChecksums){
	  if(knownChecksums[checksum] == hash){
          console.log("ISO is " + checksum);
          return;
      }
     }
     console.log("Unknown ISO");
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

function intializeWebsocket(){

}

//Sends the host code
function sendHostCode() {
  
}

//When the host code is recieved
function onHostCode() {

}
