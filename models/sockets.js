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

            socket.on("disconnect", () => {
                let numberOfClientsConnected =  this.getNumberOfClientsConnected()
                if(numberOfClientsConnected <= 0){
                    this.stopSendingDataByIntervas();
                }
            });

            this.startToSendingDataByIntervals();
        });
    }

    startToSendingDataByIntervals() {
        if (!this.isSendingDataByIntervals) {
            this.isSendingDataByIntervals = true;
            this.sendingDataByIntervalsIdentifier = setInterval(() => this.sendingDataByIntervals(), 1500);
        }
    }

    sendingDataByIntervals() {
        this.io.emit('hey-frontend', {
            'Red': this.getRandomInt(),
            'Blue': this.getRandomInt(),
            'Yellow': this.getRandomInt(),
            'Green': this.getRandomInt(),
            'Purple': this.getRandomInt(),
            'Orange': this.getRandomInt()
        });
    }

    stopSendingDataByIntervas() {
        this.isSendingDataByIntervals = false;
        clearInterval(this.sendingDataByIntervalsIdentifier);
    }

    getRandomInt() {
        return Math.floor(Math.random() * (100 - 1)) + 1;
    }

    getNumberOfClientsConnected(){
        return this.io.engine.clientsCount;
    }
}

module.exports = Sockets;