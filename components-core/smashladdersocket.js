const ws = require("nodejs-websocket");
var SOCKET_CONNECTION = false, connection;

module.exports = class SmashLadderSocket{
    constructor(path, session, coreInterface){
        this.path = path;
        this.session = session;
        this.coreInterface = coreInterface;
    }

    connect(){
        connection = (ws.connect(this.path));
        
        connection.on("pong", function(data){
            console.log("Pong: " + data);
        });
        
        connection.on("connect", function(){
            console.log("Post-handshake Established");
        });

        connection.on("text", function(msg){
           parseResponse(msg); 
        });

    }
    disconnect(){}
    parseResponse(text){
        let data = JSON.parse(text);
        let functionCall = data.functionCall;
        let parameters = data.parameters;
        coreInterface.callFunction(functionCall, parameters);
    }
};
