require('dotenv').config();
const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const jwt = require('jsonwebtoken');
const XMLMapping = require('xml-mapping');
const soap = require('soap');
const parser = require('xml2json');
const url = process.env.URL_WSDL;
const url_sql = process.env.URL_WSDL_SQL;

router.post('/sync-all', async (req, res) => {
    soap.createClient(url, function(err, client) { 
        client.setSecurity(new soap.BasicAuthSecurity(process.env.USR_WSDL_ROOT, process.env.PWRD_WSDL_ROOT));
        client.ReadView({DataServerName: "EstPrdDataBR", Filtro: "TPRODUTO.CODFAB=0099", Contexto: "CODSISTEMA=G"}, async (err, result) => {
            if(err) {
                var error = XMLMapping.load(err.body);
                res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
            } 
            var productList = JSON.parse(parser.toJson(result.ReadViewResult)).NewDataSet.TPRODUTO;
            for (let prd of productList) {
                const prdExt = await Product.find({IDPRD: prd.IDPRD});
                if(prdExt.length == 0){
                    let product = new Product({
                        IDPRD: prd.IDPRD,
                        NOMEFANTASIA: prd.NOMEFANTASIA,
                        IMAGEM: null
                    })
                    
                    await product.save();                     
                }else {
                    const filter = {IDPRD: prd.IDPRD};
                    const update = {NOMEFANTASIA: prd.NOMEFANTASIA};
                    await Product.findOneAndUpdate(filter, update);
                }
            }
            
            res.send(productList);
        });
    });
});

router.get('/all-local', async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
});

router.post('/all', async (req, res) => {
    const { ra } = req.body;
    try {
        soap.createClient(url_sql, function(err, client) {
            client.setSecurity(new soap.BasicAuthSecurity(process.env.USR_WSDL_ROOT, process.env.PWRD_WSDL_ROOT));
            client.RealizarConsultaSQL({codSentenca: "cava2", codColigada: 3, codSistema: "S", parameters: `CODCOLIGADA=3;RA=${ra}`}, (err, result) => {
                if(err) {
                    var error = XMLMapping.load(err.body);
                    res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
                } 
                var children = JSON.parse(parser.toJson(result.RealizarConsultaSQLResult));                                                    
                res.send(children.NewDataSet.Resultado.length > 1 ? children.NewDataSet.Resultado : [children.NewDataSet.Resultado]);
            });
        });        
    } catch (e) {
        res.status(500).json({message: e.message})
    }
});

router.post('/set-image', async (req, res) => {
    const { IDPRD, IMAGEM } = req.body;

    try {
        const filter = {IDPRD: IDPRD};
        const update = {IMAGEM: IMAGEM};
        const prdupdt = await Product.findOneAndUpdate(filter, update);
              
        res.status(201).json(prdupdt)
    } catch (e) {
        res.status(400).json({message: e.message})
    }      
})

module.exports = router