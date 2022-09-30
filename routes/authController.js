require('dotenv').config();
const express = require('express')
const router = express.Router();
const User = require('../models/login')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth');
const XMLMapping = require('xml-mapping');
const soap = require('soap');
const parser = require('xml2json');
const url = process.env.URL_WSDL;
const url_sql = process.env.URL_WSDL_SQL;

router.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');

    if(user) {
        if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Senha inválida.'});

        user.password = undefined;

        const token = jwt.sign({ id: user.id }, process.env.secret, {
            expiresIn: 86400
        })

        res.send(user);
    }else {
        soap.createClient(url, function(err, client) {
            client.setSecurity(new soap.BasicAuthSecurity(username, password));
            client.AutenticaAcesso((e,r) => {
                if(e) {
                    var error = XMLMapping.load(e.body);
                    res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
                }        
                if(r.AutenticaAcessoResult == 1){
                    client.setSecurity(new soap.BasicAuthSecurity(process.env.USR_WSDL_ROOT, process.env.PWRD_WSDL_ROOT));
                    client.ReadRecord({DataServerName: "GlbUsuarioData", PrimaryKey: username, Contexto: "CODSISTEMA=G"}, (err, result) => {
                        if(err) {
                            var error = XMLMapping.load(err.body);
                            res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
                        } 
                        var user = JSON.parse(parser.toJson(result.ReadRecordResult));
                        const token = jwt.sign({ id: user.id }, process.env.secret, {
                            expiresIn: 86400
                        })
                        user.GlbUsuario.GUSUARIO.token = token;
                        res.send(user.GlbUsuario.GUSUARIO);
                    });
                }
            });
        });
    }    
});

router.post('/dependents', async (req, res) => {
    const { codusuario } = req.body;
    soap.createClient(url_sql, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity(process.env.USR_WSDL_ROOT, process.env.PWRD_WSDL_ROOT));
        client.RealizarConsultaSQL({codSentenca: "cava1", codColigada: 3, codSistema: "S", parameters: `PLETIVO=2022;CODUSUARIO=${codusuario};CODCOLIGADA=3`}, (err, result) => {
            if(err) {
                var error = XMLMapping.load(err.body);
                res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
            } 
            var children = JSON.parse(parser.toJson(result.RealizarConsultaSQLResult));                                 
            res.send(children.NewDataSet.Resultado);
        });
    });
});

router.post('/register', async (req, res) => {
    const { username } = req.body;
    try {
        if(await User.findOne({ username }))
            res.status(400).send({ error: 'Usuário já existe.'})

        const user = await User.create(req.body);
        user.password = undefined;

        return res.send({ user })
    } catch (error) {
        return res.status(400).send({ error: 'Falha ao realizar o registro.' })
    }
});

module.exports = router