const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

//O controller geralmente tem 5 funções: index(mostrar lista), show(mostrar um único), store(criar), update(alterar), destroy(deletar)

module.exports = {
    async index(request, response) {
        const devs = await Dev.find()

        return response.json(devs)
    },

    async store(request, response) {
    
        //BUSCANDO OS DADOS DO DEV QUE QUERO CADASTRAR' 
        //Pegar Fazendo uma desestruturação do (request.body)
        const { github_username, techs, latitude, longitude } = request.body

        //Evitar que um Dev seja cadastrado de forma repetida
        let dev = await Dev.findOne({ github_username })

        if (!dev) {
            //Indo até a API do github buscar os dados deste usuario(instale a lib=yarn add axios) que faz chamada para outras API's
    
            //REGRA DE NEGÓCIO  
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)//await aguarda a API responder para depois continuar com o restante do código
        
            //Se o nome não existir ele pega o valor padrão =login
            const { name = login, avatar_url, bio } = (apiResponse.data)
            //Convertendo a string em array para mandar para o banco..O trim remove espaçamento antes e depois de uma string
            const techsArray = parseStringAsArray(techs)
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            //Salvar como constante para ter um retorno do banco 
            dev = await Dev.create({//criando um novo dev
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,//nome da propriedade diferente da variável
                location,
            })

            // Filtrar as conexões que estão há no máximo 10km de distância,
            // e que o novo dev tenha pelo menos uma das tecnologias filtradas.

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev)
        }
        
    
        return response.json(dev)
    },

    async update() {

    },

    async destroy() {

    },
}