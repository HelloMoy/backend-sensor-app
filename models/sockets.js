class Sockets {
    constructor(io) {
        this.io = io;
        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', () => {
            console.log('Client conected')
        });
    }
}

module.exports = Sockets;