class Sockets {
    constructor(io) {
        this.io = io;
        this.socketEvents();
        this.sendingDataByIntervalsIdentifier;
        this.isSendingDataByIntervals = false;
        this.colorValues = {};
        this.colorValuesPackages = { red: [0, 0, 0, 0, 0, 0], green: [0, 0, 0, 0, 0, 0], blue: [0, 0, 0, 0, 0, 0] };
        this.numberOfElementsPerPackage = 6;
    }

    socketEvents() {
        this.io.on('connection', (socket) => {
            console.log('Client conected')

            socket.on('values', (payload) => {
                this.generateColorsValuesPackages(payload.rgbValues)
                this.colorValues = {
                    lastRgbColorValue: payload.rgbValues,
                    rgbColorsValuesPackages: this.colorValuesPackages,
                    temperatureAndHumidityValues: payload.temperatureAndHumidityValues
                };
                console.log(payload);
                this.io.emit('values', this.colorValues);
            });

            socket.on('hey-backend', (payload, callback) => {
                console.log(payload)
                if (payload.callbackToExecute) {
                    console.log('Executing callback')
                    callback({ ...payload, 'backendResponse': 'Hi Front!' });
                }

                socket.emit('hey-frontend', { ...payload, 'backendResponse': 'Hi Front!' });
            });

            socket.on("disconnect", () => {
                let numberOfClientsConnected = this.getNumberOfClientsConnected()
                if (numberOfClientsConnected <= 0) {
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

    getNumberOfClientsConnected() {
        return this.io.engine.clientsCount;
    }


    generateColorsValuesPackages(rgbValues) {

        const deleteFirstColorValue = (listValues) => {
            listValues.splice(0, 1);
            return listValues;
        }

        const deleteFirstElementIfItHasMoreThanTheCondition = (listValues, numberOfElementsPerPackage) => {
            if (listValues.length > numberOfElementsPerPackage) {
                listValues = deleteFirstColorValue(listValues);
            }
            return listValues;
        }

        const lastColorValue = (listValues) => {
            return listValues[listValues.length - 1];
        }

        const areDifferent = (lastColorValue, currentColorValue) => (lastColorValue !== currentColorValue && (currentColorValue > (lastColorValue + 15) || currentColorValue < (lastColorValue - 15)));

        const generateIndividualColorValuePackage = (rgbValue, rgbValues) => {
            if (areDifferent(lastColorValue(this.colorValuesPackages[rgbValue]), rgbValues[rgbValue])) {
                this.colorValuesPackages[rgbValue].push(rgbValues[rgbValue]);
                this.colorValuesPackages[rgbValue] = deleteFirstElementIfItHasMoreThanTheCondition(this.colorValuesPackages[rgbValue], this.numberOfElementsPerPackage);
            }
        }

        for (var rgbValue in rgbValues) {
            generateIndividualColorValuePackage(rgbValue, rgbValues);
        }
    }
}

module.exports = Sockets;