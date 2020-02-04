//Rota de busca utilizada pelo aplicativo mobile
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

module.exports = {
    async index(request, response) {
        // Buscar todos devs num raio 10km(fazer um filtro de geolocalização, distância)
        // Filtrar por tecnologias
        const { latitude, longitude, techs } = request.query

        const techsArray = parseStringAsArray(techs)

        const devs = await Dev.find({//Quais infos quremos filtrar desse dev
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry : {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        })

        return response.json({ devs })
    }
}