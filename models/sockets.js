class Sockets {
    constructor(io) {
        this.io = io;
        this.socketEvents();
        this.sendingDataByIntervalsIdentifier;
        this.isSendingDataByIntervals = false;
    }

    socketEvents() {
        this.io.on('connection', (socket) => {
            console.log('Client conected')

            socket.on('hey-backend', (payload, callback) => {
                console.log(payload)
                if (payload.callbackToExecute) {
                    console.log('Executing callback')
                    callback({ ...payload, 'backendResponse': 'Hi Front!' });
                }

                socket.emit('hey-frontend', { ...payload, 'backendResponse': 'Hi Front!' });
            })

            this.startToSendingDataByIntervals();
        });
    }

    startToSendingDataByIntervals() {
        if (!this.isSendingDataByIntervals) {
            this.isSendingDataByIntervals = true;
            this.sendingDataByIntervalsIdentifier = setInterval(() => this.sendingDataByIntervals(), 1000);
        }
    }

    sendingDataByIntervals() {
        this.io.emit('hey-frontend', { 'backendResponse': 'Hi Front!' });
    }

    stopSendingDataByIntervas() {
        this.isSendingDataByIntervals = false;
        clearInterval(this.sendingDataByIntervalsIdentifier);
    }
}

module.exports = Sockets;