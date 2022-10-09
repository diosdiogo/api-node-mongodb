const express = require('express')
const router = express.Router()
const soap = require('soap');
const Login = require('../models/login')
const User = require('../models/user')
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const XMLMapping = require('xml-mapping');
const parser = require('xml2json');
const url = process.env.URL_WSDL;
require('dotenv').config()

router.put('/', async (req, res) => {
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

router.post('/', async (req, res) => {
    
    console.log(req.body)
    console.log(Login)
    const user = req.body.codusuario
    const passwordDB = await md5(req.body.password)
    const password = req.body.password;

    try {
        soap.createClient(url, function(err, client) {
            const soup = new soap.BasicAuthSecurity(user, password);
            client.setSecurity(new soap.BasicAuthSecurity(user, password));
            client.AutenticaAcesso ((e,r) => {
                if(e) {
                    var error = XMLMapping.load(e.body);
                    res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
                }
                if(r.AutenticaAcessoResult == 1){
                    client.setSecurity(new soap.BasicAuthSecurity(process.env.USR_WSDL_ROOT, process.env.PWRD_WSDL_ROOT));
                    client.ReadRecord({DataServerName: "GlbUsuarioData", PrimaryKey: user, Contexto: "CODSISTEMA=G"}, async (err, result) => {
                        if(err) {
                            var error = XMLMapping.load(err.body);
                            res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
                        } 
                        var userLogin = JSON.parse(parser.toJson(result.ReadRecordResult));
                        const token = jwt.sign({ id: userLogin.id }, process.env.secret, {
                            expiresIn: 86400
                        })

                        userLogin.GlbUsuario.GUSUARIO.token = token;
                        let userDB= {
                            profile: {},
                            mentoringAdmin: {}
                        }
                        var getU;
                        getU = await getUser(userLogin.GlbUsuario.GUSUARIO, password, res);
                        console.log("82")
                        console.log(getU)
                        if(getU === undefined){
                            let param = {
                                codusuario: userLogin.GlbUsuario.GUSUARIO.CODUSUARIO,
                                password: password,
                                profile: "633b4d76350e3e6e44d9b969"
                            }
                            getU = await setUser(userLogin.GlbUsuario.GUSUARIO, password);
                            if(getU){
                                console.log("91")
                                getUser(userLogin.GlbUsuario.GUSUARIO, password, res);
                            }
                        }
                        //userLogin.GlbUsuario.GUSUARIO.profile = getU.profile.profile;
                        console.log("94")
                        console.log(userLogin.GlbUsuario.GUSUARIO)
                        //res.send(userLogin.GlbUsuario.GUSUARIO);
                    })
                }
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

async function getUser(user, password, res) {
    console.warn(141)
    const pass = await md5(password)
    console.log(pass)
    console.log(user.CODUSUARIO)
    try {
        User.findOne({
            codusuario: user.CODUSUARIO,
            password: pass
        })
        .populate("mentoringAdmin")
        .populate("profile")
        
        .then(async (usuario) => {
            if(usuario){
                const profile = usuario.profile.profile
                const id = usuario.id
                res.status(200).send({
                    id,
                    user,
                    profile
                });
            }
            return usuario;
        }).catch((err) => {
            console.log(err)
           return null;
        })
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

async function setUser(user, password) {
    const param = {
        codusuario: user.CODUSUARIO,
        password: password,
        profile: "633b4d76350e3e6e44d9b969"
    }
    console.log(param)
    try {
        new User({
            ...param
        }).save().then( async (newUser) => {
            console.log("178")
            console.log(newUser)
            return newUser
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
}


module.exports = router