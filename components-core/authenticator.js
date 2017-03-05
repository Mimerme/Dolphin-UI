const request = require('request');
const config = require("../config.json");
const fs = require("fs");

module.export = class SmashLadderAuthenticator {
    constructor(core_interface) {
        this.auth_code = "";
        this.core_interface = core_interface;
    }

    authenticationStep1(netplay_code) {
        this.auth_code = netplay_code;
        this.sendDolphinAuth(netplay_code, function (JSONresponse) {
            //TODO: Show actual message box
            console.log("Paste this code into smashladder : " + netplay_code);
            console.log("Continue with auth2");
        });
    }
    authenticationStep2() {
        this.sendDolphinAuth(this.auth_code, function (JSONresponse) {
            let session_key = JSONresponse.session_key;
            let player_id = JSONresponse.player.id;
            config.Session = session_key;
            config.PlayerID = player_id;
            config.LoggedIn = true;
            writeToConfig(config);
        });
    }
    writeToConfig(config) {
        fs.writeFile("../config.json", JSON.stringify(config), {
            flag: 'wx'
        });
    }
    sendDolphinAuth(netplay_code, callback) {
        let auth = request.post('https://www.smashladder.com/apiv1/dolphin_host', {
                form: {
                    host_code: netplay_code
                }
            },
            function (err, response, body) {
                if (!err) {
                    let JSONresponse = JSON.parse(body);
                    if (JSONresponse.success) {
                        console.log("Response succesful");
                        callback(JSONresponse);
                    } else {
                        console.log("Error in response");
                        console.log(body);
                    }
                } else {
                    console.log(err);
                    console.log(response);
                    console.log(body);
                }
            });
    }
}