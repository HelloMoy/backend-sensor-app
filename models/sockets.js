class Sockets {
    constructor(io) {
        this.io = io;
        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', (socket) => {
            console.log('Client conected')

            socket.on('hey-backend', (payload, callback) => {
                console.log(payload)
                if(payload.callbackToExecute){
                    console.log('Executing callback')
                    callback({...payload, 'backendResponse': 'Hi Front!'});
                }

                socket.emit('hey-frontend',{...payload, 'backendResponse': 'Hi Front!'});

            })
        });
    }
}

module.exports = Sockets;