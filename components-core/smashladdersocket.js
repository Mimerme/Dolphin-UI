const ws = require("nodejs-websocket");
var SOCKET_CONNECTION = false,
    connection;
var LOGGED_IN = false;


module.exports = class SmashLadderSocket {
    constructor(path, session, coreInterface, playerID) {
        this.path = path;
        this.session = session;
        this.coreInterface = coreInterface;
        this.playerID = playerID;
    }

    connect() {
        let responseCallback = function (text) {
            let data = JSON.parse(text);

            if (data.hasOwnProperty("authentication")) {
                if (!data.authentication) {
                    console.log(data.error + "\n" + data.error_type);
                }
            }
            else if (data.hasOwnProperty("version_good")) {
                if (data.version_good) {
                    console.log("Succesfully logged in");
                    LOGGED_IN = true;
                }
            }

            let functionCall = data.functionCall;
            let parameters = data.parameters;
            coreInterface.callFunction(functionCall, parameters);
        }
        //Probably shouldn't hardcode this path
        let constructedURL = (this.path + "&session_key=" + this.session + "&player_id=" + this.playerID + "&version=9.11.4");
        var connection = (ws.connect(constructedURL));
        connection.on("pong", function (data) {
            console.log("Pong: " + data);
        });

        connection.on("connect", function () {
            console.log("Connection established...");
        });
        connection.on("close", function (code, reason) {
            console.log("Connection closed")
            console.log(code);
            console.log(reason);
        })
        connection.on("error", function (error) {
            console.log(error)
        })
        connection.on("text", function (msg) {
            console.log(msg);
            responseCallback(msg);
        });
        console.log(connection.readyState);

    }
    disconnect() {}
};