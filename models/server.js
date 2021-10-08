const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');

const Sockets = require('./sockets');

class Server {
    constructor() {
        this.app;
        this.port;
        this.server;
        this.initServerWithExpress();
        this.initSocketServer();
        this.io;
    }

    initServerWithExpress(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);
    }

    initSocketServer(){
        this.io = socketio(this.server, {/*config*/ });
    }

    execute() {
        this.middlewares();
        this.socketEvents();
        this.server.listen(this.port, () => (console.log('Server running on port:', process.env.PORT)));
    }

    middlewares() {
        this.app.use(express.static(path.resolve(__dirname, '../public')));
        this.enableCors()
    }

    socketEvents() {
        new Sockets(this.io);
    }

    enableCors() {
        this.app.use(cors());
    }
}

module.exports = Server;