const mongoose = require('mongoose')
const PointSchema = require('./utils/PointSchema')

//DevSchema é a Estruturação de uma entidade dentro do banco de dados
const DevSchema = new mongoose.Schema({
    //Quais os campos que o usuário vai ter e qual o formato que será salvo no banco
    name: String,
    github_username: String,
    bio: String,
    avatar_url: String,
    //O campo de tecnologias armazena várias strings(um array)
    techs: [String],
    location: {
        type: PointSchema,
        index: '2dsphere'
    }
})

//Dev é o nome que será salvo no banco
module.exports = mongoose.model('Dev', DevSchema)