const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
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
        this.server.listen(this.port, () => (console.log('Server running on port: 8080!')));
    }

    middlewares() {
        this.app.use(express.static(path.resolve(__dirname, '../public')));
    }

    socketEvents() {
        new Sockets(this.io);
    }
}

module.exports = Server;