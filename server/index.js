require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const websocketHandler = require('./websocket'); // Import obsługi WebSockets


app.use(express.json());
app.use(cors());

const connection = require('./db');
connection();

/*
const httpServer = require("http").createServer(require("./index"));
require("./websocket")(httpServer); // Pass httpServer as a parameter

httpServer.listen(8081, () => {
  console.log("WebSocket server listening on port 8080");
});*/

const server = http.createServer(app);

// Przekaż serwer do obsługi WebSockets
websocketHandler(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Websocket działa na porcie ${PORT}`);
});

//routes
app.use('/api/users', userRoutes);



const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
