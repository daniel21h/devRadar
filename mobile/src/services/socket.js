import socketio from 'socket.io-client'

const socket = socketio('http://192.168.10.100:3333', {
    autoConnect: false,
})

function subscribeToNewDevs(subscribeFunction) {
    socket.io('new-dev', subscribeFunction)
}

function connect(latitude, longitude, techs) {
    //Enviando parâmetros para o backend
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    }

    socket.connect()
}

function disconnect() {
    if (socket.connected) {
        socket.disconnect()
    }
}


export {
    subscribeToNewDevs,
    connect,
    disconnect,
}