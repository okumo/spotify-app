const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const app = express();

const WS_PORT = process.env.WS_PORT || 3001;
const HTTP_PORT = process.env.HTTP_PORT || 3000;
const PORT= process.env.PORT || 5000;
const wsServer = new WebSocket.Server({ port: WS_PORT }, () => console.log(`WS server is listening at ws://localhost:${WS_PORT}`));

let connectedClients = [];

wsServer.on('connection', (ws, req) => {
    console.log('Connected to websocket');
    // add new connected client
    connectedClients.push(ws);
    // listen for messages from the streamer, the clients will not send anything so we don't need to filter
    ws.on('message', data => {
        // send the base64 encoded frame to each connected ws
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) { // check if it is still connected
                ws.send(data); // send
            } else { // if it's not connected remove from the array of connected ws
                connectedClients.splice(i, 1);
            }
        });
    });
});

app.get('/client', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client.html'));
});
app.get('/streamer', (req, res) => {
    res.sendFile(path.resolve(__dirname, './streamer.html'));
});
//HTTP_PORT
app.listen(PORT, () => {
    console.log(`HTTP server listening at http://localhost:${PORT}`)
});