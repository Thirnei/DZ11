const WebSocket = require('ws');

const PORT = 8080;
const server = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server is running on ws://localhost:${PORT}`);

const clients = new Set();

server.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected');

    // Send welcome message to the new client
    ws.send(JSON.stringify({ message: 'Welcome to the chat!' }));

    ws.on('message', (data) => {
        console.log(`Received message: ${data}`);
    
        // Broadcast the message to all connected clients in JSON format
        for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ message: data.toString() })); // Ensure data is sent as JSON
            }
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
    });
});