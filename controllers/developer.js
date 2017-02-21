const config = require("../config.json");
const execFile = require('child_process').spawn;
var request = require('request');
var fs = require('fs');

var process;
var DOLPHIN_RUNNING = false;

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
  .on('response', function(response) {
    file_size = parseInt(response.headers['content-length']);

  }).on('data', function(chunck){
      total += chunck.length;
      let percent = total/file_size * 100;
      console.log(percent + " percent");
      if(percent == 100)
        console.log("Download Complete");
  })
  .pipe(file)
}

//Download and check md5 hash of melee
function downloadMelee() {

}

//Callback for whenever the Dolphin core prodces stdout
function onCoreOutput(data) {
    console.log(data);
    //Removes the timestamp from the buffer
    let output = data.slice(13 ,data.length).toString();
    switch(output){
        case "Dolphin Launched":
            dolphinRunning = true;
        break;
    }
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
function sendHostCode(){

}

//When the host code is recieved
function onHostCode(){

}