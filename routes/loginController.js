const express = require('express')
const router = express.Router()
const Login = require('../models/login')
const md5 = require('md5');
const jwt = require('jsonwebtoken');
require('dotenv').config()


router.get('/', async (req, res) => {
    console.log(req.query)
    console.log(Login)
    const user = req.query.codusuario
    const password = await md5(req.query.password)
    try {
        Login.findOne({
            email: user,
            password: password
        })
        .populate("user")
        .populate("mentoringAdmin")
        .populate("profile")
        
        .then(async (usuario) => {
            const user = await getLoginReturn(usuario)
            res.status(200).send({
                response: user
            })
        }).catch((err) => {
            console.log(err)
            res.status(400).send({
                message: erro,
                response: null
            })
        })
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
});

router.get('/:id', (req, res) => {
    res.json(res.Login)
})

router.post('/save', async (req, res) => {
    console.log(req.body);
    try {
        new Login({
            ...req.body
        }).save().then((newUser) => {
            res.status(201).json(newUser)
        }).catch(function(erro) {
            console.log(erro)
            res.status(400).send({
                message: erro,
                response: null
            })
        }) 
    } catch (e) {
        res.status(400).json({message: e.message})
    }      
})

router.delete('/:id', async (req, res) => {
    try {
        await res.Login.remove()
        res.json({message: 'Usuário excluído com sucesso'})
    } catch (e) {
        res.status(500).json({message: error.message})
    }
})

async function getLoginReturn(resp) {
    console.log(resp)
    const token = jwt.sign({
        id: resp._id,
        senha: resp.password
    }, process.env.secret, { expiresIn: '24h' })

    const ret = {
        profile: resp.profile.profile,
        token: token,
        user: {
            aluno: resp.user.aluno,
            matricula: resp.user.matricula,
            cpf: resp.user.cpf,
            dtnascimento: resp.user.dtnascimento,
            sexo: resp.user.sexo,
            email: resp.user.email,
            pai: resp.user.pai,
            pai_falecido:resp.user.pai_falecido,
            email1: resp.user.email1,
            mae: resp.user.mae,
            mae_falecido: resp.user.mae_falecido,
            email2: resp.user.email2,
            curso: resp.user.curso,
            habilitacao: resp.user.habilitacao,
            turno: resp.user.turno,
            turma: resp.user.turma,
            dtmatricula: resp.user.dtmatricula,
            codcoligada: resp.user.codcoligada,
            tipo_aluno: resp.user.tipo_aluno,
            endereco: resp.user.endereco,
            cidade: resp.user.cidade,
            bairro: resp.user.bairro,
            estado: resp.user.estado,
            cep: resp.user.cep,
            imagem: resp.user.imagem,
            codcfo: resp.user.codcfo,
            codcolcfo: resp.user.codcolcfo,
            codpessoa: resp.user.codpessoa
        },
        mentoring: [
            ...resp.user.mentoring
        ]
    };
    console.log(ret)
    return ret;
}

module.exports = router