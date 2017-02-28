const execFile = require('child_process').spawn;
const request = require('request');
const fs = require('fs');
const cryp = require('crypto');

module.exports = class CoreInterface{
    constructor(executableLocation)
    {
        this.LOG_CORE_OUTPUT = true;
        this.AUTHENTICATING = false;
        this.DOLPHIN_RUNNING = false;
        this.process;
        this.executable = executableLocation;
        //Register callable functions
        this.functionCalls = {
            "startNetplay": startNetplay,
            "quitDolphin": quitDolphin
        };
    }

    

    //NOTE: Arguments must be passed as an array
    callFunction(functionName, functionArguments){
        this.functionCalls[functionName](functionArguments)
    }

    //Pasted from developer.js, needs testing
    onCoreOutput(data) {
    //Removes the timestamp from the buffer
    let output = data.slice(12, data.length).toString();
    if(this.LOG_CORE_OUTPUT)
        console.log(output);
    
        if(output == "Dolphin Launched")
            this.DOLPHIN_RUNNING = true;
        else if(output.includes("Host Code ")){
            let code = output.substring(10, output.length);
            if(this.AUTHENTICATING){
                this.AUTHENTICATING = false;
                sendAuthenticationRequest(code);
                quitDolphin();
            }
        }
    }

    quitDolphin(){
        this.process.kill('SIGKILL');
        this.DOLPHIN_RUNNING = false;
    }

    sendAuthenticationRequest(netplay_code){
     this.AUTHENTICATING = true;
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

    beginAuthentication(){
        this.AUTHENTICATING = true;
        startNetplay("host");
    }

    startNetplay(netplay_code){
        console.log("Starting Netplay : " + netplay_code[0]);
        startDolphin(["/n " + netplay_code[0]]);
    }

    startDolphin(args) {
        this.process = execFile(this.executable, args, {
           detached: false
        });

        this.process.stdout.on('data', onCoreOutput);

        this.process.on('error', (err) => {
            console.log('Failed to start Dolphin...');
            console.log(err);
        });
    }


}
