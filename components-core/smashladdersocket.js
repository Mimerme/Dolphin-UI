const ws = require("nodejs-websocket");
var SOCKET_CONNECTION = false, connection;

module.exports = class SmashLadderSocket{
    constructor(path, session){
        this.path = path;
        this.session = session;
    }

    connect(){
        connection = (ws.connect(path));
        
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
    }
    error(){}
    startMatchSearch(){}
    stopMatchSearch(){}
    mathFound(){}
    mathFoundUserResponse(){}
};
