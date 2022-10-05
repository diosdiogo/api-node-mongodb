const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    aluno: {
        type: String,
        require: true
    },
    matricula: {
        type: String

    },
    cpf: {
        type: String
    },
    dtnascimento: {
        type: Date
    },
    sexo: {
        type: String,
        require: true
    },
    email: {
        type: String
    },
    pai: {
        type: String
    },
    pai_falecido: {
        type: String
    },
    email1: {
        type: String
    },
    mae: {
        type: String
    },
    mae_falecido: {
        type: String
    },
    email2: {
        type: String
    },
    curso: {
        type: String
    },
    habilitacao: {
        type: String
    },
    turno: {
        type: String
    },
    turma: {
        type: String
    },
    dtmatricula: {
        type: Date
    },
    codcoligada: {
        type: String
    },
    tipo_aluno: {
        type: String
    },
    endereco: {
        type: String
    },
    cidade: {
        type: String
    },
    bairro: {
        type: String
    },
    estado: {
        type: String
    },
    cep: {
        type: String
    },
    imagem: {
        type: String
    },
    codcfo: {
        type: String
    },
    codcolcfo: {
        type: String
    },
    codpessoa: {
        type: String
    },
    profile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    login: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Login"
    },
    mentoring:
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentoringadmin"
    }]
})

module.exports = mongoose.model('User', userSchema);
