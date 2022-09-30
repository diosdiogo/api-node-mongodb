const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const productSchema = new mongoose.Schema({
    CODCOLPRD: {
        type: Number,
        require: false
    },
    CODCOLIGADA: {
        type: Number,
        require: false
    },
    IDPRD: {
        type: Number,
        require: true
    },
    CODIGOPRD: {
        type: String,
        require: false
    },
    NOMEFANTASIA: {
        type: String,
        require: true
    },
    CODIGOREDUZIDO: {
        type: String,
        require: false
    },
    TIPO: {
        type: String,
        require: false
    },
    INATIVO: {
        type: Number,
        require: false
    },
    CODFAB: {
        type: String,
        require: false
    },
    NUMNOFABRIC: {
        type: String,
        require: false
    },
    DESCRICAO: {
        type: String,
        require: false
    },    
    DATABASEPRECO1: {
        type: Date,
        require: false
    },
    DATABASEPRECO2: {
        type: Date,
        require: false
    },
    DATABASEPRECO3: {
        type: Date,
        require: false
    },
    DATABASEPRECO4: {
        type: Date,
        require: false
    },
    DATABASEPRECO5: {
        type: Date,
        require: false
    },
    PRECO1: {
        type: Number,
        require: false
    },
    PRECO2: {
        type: Number,
        require: false
    },
    PRECO3: {
        type: Number,
        require: false
    },
    PRECO4: {
        type: Number,
        require: false
    },
    PRECO5: {
        type: Number,
        require: false
    },
    CODUNDCONTROLE: {
        type: String,
        require: false
    },
    CODUNDCOMPRA: {
        type: String,
        require: false
    },
    CODUNDVENDA: {
        type: String,
        require: false
    },
    CUSTOMEDIO: {
        type: Number,
        require: false
    },
    CUSTOUNITARIO: {
        type: Number,
        require: false
    },
    CUSTOREPOSICAO: {
        type: Number,
        require: false
    },
    CUSTOREPOSICAOB: {
        type: Number,
        require: false
    },
    SALDOGERALFISICO: {
        type: String,
        require: false
    },
    SALDOGERALFINANC: {
        type: String,
        require: false
    },
    CONTROLADOPORLOTE: {
        type: Number,
        require: false
    },
    USANUMSERIE: {
        type: Number,
        require: false
    },
    PRODUTOBASE: {
        type: Number,
        require: false
    },
    NUMEROCCF: {
        type: String,
        require: false
    },
    NOME: {
        type: String,
        require: false
    },
    EXIGEFORNQUALIFICADO: {
        type: Number,
        require: false
    },
    PRODVISIVELCLICBUSINESS: {
        type: Number,
        require: false
    },
    PRDISENTOFUNRURAL: {
        type: Number,
        require: false
    },
    IMAGEM: {
        type: { data: Buffer, contentType: String }
    },
})

module.exports = mongoose.model('Product', productSchema)