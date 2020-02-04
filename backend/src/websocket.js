//Trabalhando com realtime
const socketio = require('socket.io')
const parseStringAsArray = require('./utils/parseStringAsArray')
const calculateDistance = require('./utils/calculateDistance')

let io
//Armazenando todas as conexões que a nossa aplicação teve(em uma var no node)
const connections = []


exports.setupWebsocket = (server) => {
    io = socketio(server)

    //Toda vez que eu receber uma conexão recebo um objeto chamado socket
    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query
    
        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },

            techs: parseStringAsArray(techs),
        })
    })
}

exports.findConnections = (coordinates, techs) => {

    //Verificação(se o Dev tem alguma das techs pesquisadas dentro da distância percorrida)
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
        && connection.techs.some(item => techs.includes(item))
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data)
    })
}