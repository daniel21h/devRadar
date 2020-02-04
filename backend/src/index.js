const express = require('express')
const mongoose = require ('mongoose')
const cors = require ('cors')
const http = require('http')

const routes = require('./routes')
const { setupWebsocket } = require('./websocket')

const app = express()

//Levando o servidor http para fora do express(conseguindo trabalhar com ele diretamente)
const server = http.Server(app)

setupWebsocket(server)

// Principais métodos HTTP: GET, POST, PUT, DELETE

//Tipos de parâmetro:

//Query params: req.query(Filtros, ordenação, paginação, ...)
//Route params: request.params (Identificar um recurso na alteração ou remoção)
//Body: request.body (Dados para criação ou alteração de um registro)

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-xqstv.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors(/*{ origin: 'http://localhost:3000' }*/))
//Tem que vir antes de routes para ela ter config do express json
app.use(express.json())
app.use(routes)



server.listen(3333)
//app.listen(3333)