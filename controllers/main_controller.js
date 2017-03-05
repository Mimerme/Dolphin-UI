const config = require("../config.json");
const execFile = require('child_process').spawn;
const request = require('request');
const fs = require('fs');
const cryp = require('crypto');
const unzip = require('unzip');
const SmashLadderSocket = require("../components-core/smashladdersocket.js");
const CoreInterface = require("../components-core/coreinterface.js");

var process;
var DOLPHIN_RUNNING = false;
var NETPLAY_CONNECTED = false;
var NETPLAY_CONNECTING = false;
var WEBSOCKET = null;
var NETPLAY_HOST_CODE = "";

var smashLadderSocket, coreInterface;

initalize();

//Called when the controller is started
function initalize() {
    if (!config.LoggedIn) {
        coreInterface = new CoreInterface(config.DolphinExecutable);
        //TODO: Replace the placeholder session with a real session id
        smashLadderSocket = new SmashLadderSocket("wss://www.smashladder.com/?type=5", config.Session, config.playerID, coreInterface);
        smashLadderSocket.connect();
    }
}

//Called when the user needs to generate a session
function authenticate() {
    coreInterface.beginAuthentication();
}

//Call this function after authenticating
function getUserData(){
    coreInterface.getUserData();
}

//Starts netplay: pass 'host' as the room id to host a server
function startNetplay(roomID) {}

//Log the memory addresses of 'stocks' to the console
function logMemory() {}

//Test the hash with known Melee versions
function testHash() {}