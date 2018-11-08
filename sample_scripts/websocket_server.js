let ws = require("nodejs-websocket")

// Scream server example: "hi" -> "HI!!!"
let server = ws.createServer(function (conn) {
    console.log("New connection");
    conn.on("text", function (str) {
        console.log("Received "+str);
        conn.sendText(str.toUpperCase()+"!!!");
        if(new Date().getTime()%2) {
            setTimeout(function(){conn.sendText('???');},1000);
        }

    });
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    });
    conn.on("error", function (e) {
        console.log(e)
    })
}).listen(8001);