const { Router } = require('express')

const DevController = require('./controllers/DevController')
const SearchController = require('./controllers/SearchController')

const routes = Router()

//LISTAGEM: listando todos os devs cadastrados
routes.get('/devs', DevController.index)
//Rota para cadastro de Devs(obs.:é sempre bom deixar as rotas no plural)
//a flag async significa que a função pode demorar para responder por causa da chamada da API
routes.post('/devs', DevController.store)

routes.get('/search', SearchController.index)

module.exports = routes
