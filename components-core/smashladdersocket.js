const ws = require("nodejs-websocket");
var SOCKET_CONNECTION = false;

module.exports = class SmashLadderSocket{
    constructor(path, session){
        this.path = path;
        this.session = session;
    }

    connect(){
        let connection = (ws.connect("wss://www.smashladder.com/?type=5"));
        
        connection.on("pong", function(data){
            console.log("Pong: " + data);
        });
        
        connection.on("connect", function(){
            console.log("Post-handshake Established");
        });

        connection.on("text", function(msg){
            switch(msg){
                
            }
        });

    }
    disconnect(){}
    parseResponse(){}
    error(){}
    startMatchSearch(){}
    stopMatchSearch(){}
    mathFound(){}
    mathFoundUserResponse(){}
};