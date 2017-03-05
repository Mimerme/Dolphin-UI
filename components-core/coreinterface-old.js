const execFile = require('child_process').spawn;
const request = require('request');
const fs = require('fs');
const cryp = require('crypto');
var LOG_CORE_OUTPUT = true;
var AUTHENTICATING = false;
var DOLPHIN_RUNNING = false;
var process, executable;
module.exports = class CoreInterface {


    constructor(executableLocation) {

        executable = executableLocation;
        //Register callable functions
        this.functionCalls = {
            "startNetplay": this.beginNetplay,
            "quitDolphin": this.quitDolphin
        };
    }



    //NOTE: Arguments must be passed as an array
    callFunction(functionName, functionArguments) {
        this.functionCalls[functionName](functionArguments)
    }

    //Pasted from developer.js, needs testing
    quitDolphin() {
        process.kill('SIGKILL');
        DOLPHIN_RUNNING = false;
    }

    getUserData(){
        let auth = request.post('https://www.smashladder.com/apiv1/dolphin_host', {
                form: {
                    "host_code": "aaaaaa" 
                }
            },
            function (err, response, body) {
                console.log(body);
                if (JSON.parse(body).success) {
                    console.log("Authentication response OK");
                } else {
                    console.log(err);
                    console.log(response);
                    console.log(body);
                }
            });
    }

    sendAuthenticationRequest(netplay_code) {
        AUTHENTICATING = true;
        let auth = request.post('https://www.smashladder.com/apiv1/dolphin_host', {
                form: {
                    host_code: netplay_code
                }
            },
            function (err, response, body) {
                console.log(body);
                if (JSON.parse(body).success) {
                    console.log("Authentication response OK");
                } else {
                    console.log(err);
                    console.log(response);
                    console.log(body);
                }
            });
    }

    beginAuthentication() {
        AUTHENTICATING = true;
        this.beginNetplay(["host"], this.startDolphin, this.sendAuthenticationRequest, this.quitDolphin);
    }

    beginNetplay(netplay_code, launchDolphin, a, q) {
        console.log(netplay_code);
        console.log("Starting Netplay : " + netplay_code[0]);
        launchDolphin(a, q, ["/n " + netplay_code[0]]);
    }

    startDolphin(sendAuthenticationRequest, quitDolphin, args) {
        process = execFile(executable, args, {
            detached: false
        });

        process.stdout.on('data', function onCoreOutput(data) {
                //Removes the timestamp from the buffer
                let output = data.slice(12, data.length).toString();
                if (LOG_CORE_OUTPUT)
                    console.log(output);

                if (output == "Dolphin Launched")
                    DOLPHIN_RUNNING = true;
                else if (output.includes("Host Code ")) {
                    let code = output.substring(10, output.length);
                    if (AUTHENTICATING) {
                        AUTHENTICATING = false;
                        sendAuthenticationRequest(code);
                        quitDolphin();
                    }
                }
            }

        );

        process.on('error', (err) => {
            console.log('Failed to start Dolphin...');
            console.log(err);
        });
    }


}