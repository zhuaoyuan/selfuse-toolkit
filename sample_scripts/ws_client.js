let WebSocket = require('ws');
let ws = new WebSocket("");

ws.onopen = function()
{
    console.log("ws open");
};

ws.onmessage = function (evt)
{
    console.log("message: "+evt);
};

ws.onclose = function()
{
    console.log("ws close");
};

