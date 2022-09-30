require('dotenv').config();
const express = require('express')
const router = express.Router();
const Product = require('../models/product')
const jwt = require('jsonwebtoken');
const XMLMapping = require('xml-mapping');
const soap = require('soap');
const parser = require('xml2json');
var js2xmlparser = require("js2xmlparser");
const sgMail = require('@sendgrid/mail');
const Sale = require('../models/sale');
const url = process.env.URL_WSDL;
const url_sql = process.env.URL_WSDL_SQL;
const url_process = process.env.URL_WSDL_PROCESS;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/new', async (req, res) => {
    console.log(req.body);
    let dateNow = new Date().toISOString().split("T")[0];
    let order = js2xmlparser.parse("MovMovimento", req.body);
    order = order.replace("<?xml version='1.0'?>", "");
    soap.createClient(url, function(err, client) { 
        client.setSecurity(new soap.BasicAuthSecurity(process.env.USR_WSDL_ROOT, process.env.PWRD_WSDL_ROOT));
        console.log(order);
        client.SaveRecord({DataServerName: "MOVMOVIMENTOTBCDATA", XML: `<![CDATA[${order}]]>`, Contexto: `CODSISTEMA=T;CODCOLIGADA=6;CODUSUARIO=${process.env.USR_WSDL_ROOT}`}, async (err, result) => {
            if(err) {
                var error = XMLMapping.load(err.body);
                res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
            } 

            let newMov = result.SaveRecordResult.split(";")[1];
            console.log(newMov);
            soap.createClient(url_sql, function(err, clientSQL) {
                clientSQL.setSecurity(new soap.BasicAuthSecurity(process.env.USR_WSDL_ROOT, process.env.PWRD_WSDL_ROOT));
                clientSQL.RealizarConsultaSQL({codSentenca: "cava4", codColigada: 3, codSistema: "S", parameters: `CODCOLIGADA=${req.body.TMOV.CODCOLIGADA};IDMOV=${newMov}`}, (err, result) => {
                    if(err) {
                        var error = XMLMapping.load(err.body);
                        res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
                    }
                    var children = JSON.parse(parser.toJson(result.RealizarConsultaSQLResult));                                                     
                    

                    const xml = "<FinTBCBaixaParamsProc>"+
                                    `<CodColigada>${req.body.TMOV.CODCOLIGADA}</CodColigada>`+
                                    `<DataBaixa>${dateNow}</DataBaixa>`+
                                    "<CodMoeda>R$</CodMoeda>"+
                                    "<HistoricoBaixa>Baixa Automatica</HistoricoBaixa>"+
                                    "<CotacaoBaixa></CotacaoBaixa>"+
                                    "<UsarDataVencimentoBaixa></UsarDataVencimentoBaixa>"+
                                    "<UsarDataDefaultBaixa>false</UsarDataDefaultBaixa>"+
                                    "<TipoGeracaoExtratoBaixa>ExtratoParaCadaLancamento</TipoGeracaoExtratoBaixa>"+
                                    "<ContabilizarPosBaixa>false</ContabilizarPosBaixa>"+
                                    `<CodUsuario>${req.body.TMOV.CODUSUARIO}</CodUsuario>`+
                                    "<Lancamentos>"+
                                        "<FinTBCBaixaLancamento>"+
                                            `<CodColigada>${req.body.TMOV.CODCOLIGADA}</CodColigada>`+
                                            `<IdLan>${children.NewDataSet.Resultado.IDLAN}</IdLan>`+
                                            "<ValorJuros></ValorJuros>"+
                                            "<ValorDesconto></ValorDesconto>"+
                                            "<ValorMulta></ValorMulta>"+
                                            "<ValorOp1></ValorOp1>"+
                                            "<ValorOp2></ValorOp2>"+
                                            "<ValorOp3></ValorOp3>"+
                                            "<ValorOp4></ValorOp4>"+
                                            "<ValorOp5></ValorOp5>"+
                                            "<ValorOp6></ValorOp6>"+
                                            "<ValorOp7></ValorOp7>"+
                                            "<ValorOp8></ValorOp8>"+
                                            "<Pagamentos>"+
                                                "<FinTBCBaixaPagamento>"+
                                                    `<CodColigada>${req.body.TMOV.CODCOLIGADA}</CodColigada>`+
                                                    "<IdFormaPagamento>2</IdFormaPagamento>"+
                                                    "<IdPagto>-1</IdPagto>"+
                                                    `<Valor>${req.body.TMOV.VALORBRUTO}</Valor>`+
                                                    `<CodColCxa>${req.body.TMOV.CODCOLIGADA}</CodColCxa>`+
                                                    "<CodCxa>504</CodCxa>"+
                                                "</FinTBCBaixaPagamento>"+
                                            "</Pagamentos>"+	  
                                        "</FinTBCBaixaLancamento>"+
                                    "</Lancamentos>"+
                                "</FinTBCBaixaParamsProc>";
                    console.log(xml);
                    soap.createClient(url_process, function(err, clientProcess) {
                        clientProcess.setSecurity(new soap.BasicAuthSecurity(process.env.USR_WSDL_ROOT, process.env.PWRD_WSDL_ROOT));
                        clientProcess.ExecuteWithParams({ProcessServerName: "FinTBCBaixaDataProcess", strXmlParams: `<![CDATA[${xml}]]>`}, async (errorProcess, resultProcess) => {
                            if(err) {
                                var error = XMLMapping.load(errorProcess.body);
                                res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
                            }
                            console.log("Baixa---->");
                            res.send(newMov);
                        });
                    });                    
                });
            });             
        });
    });
});

router.post('/register', async (req, res) => {
    // ENVIA E-MAIL ADM
    const msg = {
        from: 'hostmaster@galois.com.br',
        template_id: 'd-a62a2ce514fd415998af995ca874ae80',
        personalizations: [{
            to: {email: 'ecommerce@galois.com.br'},
            dynamic_template_data: {
                IDMOV: req.body.IDMOV,
                CLIENTE: req.body.CODUSUARIO,
                VALOR: req.body.RMXML.TMOV.VALORLIQUIDO.toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'})
            },
        }],
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('E-mail enviado para ecommerce@galois.com.br.')
        })
        .catch((error) => {
            console.error(error)
        })

    // ENVIA E-MAIL CLIENTE
    const msgClient = {
        from: 'hostmaster@galois.com.br',
        template_id: 'd-ceb57adaab76400d86005ff12a807996',
        personalizations: [{
            to: {email: req.body.EMAILSUARIO},
            dynamic_template_data: {                
                CLIENTE: req.body.CODUSUARIO,
                QTD_ITENS: req.body.RMXML.TITMMOV.length,
                VALOR: req.body.RMXML.TMOV.VALORLIQUIDO.toLocaleString('pt-BR', {style: 'currency',currency: 'BRL'}),
                FINAL: req.body.CARD.lastNumbers
            },
        }],
    }
    sgMail.send(msgClient).then(
        () => {
            console.log('E-mail enviado para '+req.body.EMAILSUARIO)
    })
    .catch((error) => {
            console.error(error.response.body.errors)
    }); 
    
    const sale = new Sale(req.body)
    sale.RESULTCIELO = JSON.stringify(req.body.RESULTCIELO)
    let order = js2xmlparser.parse("MovMovimento", req.body.RMXML);
    order = order.replace("<?xml version='1.0'?>", "");
    sale.RMXML = `<![CDATA[${order}]]>`.toString();

    try {
        const newSale = await sale.save()        
        res.status(201).json(newSale);
    } catch (e) {
        res.status(400).json({message: e.message})
    }      
});

router.get('/my-purchases/:codusuario', async (req, res) => {
    const codusuario = req.params.codusuario;
    soap.createClient(url_sql, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity(process.env.USR_WSDL_ROOT, process.env.PWRD_WSDL_ROOT));
        client.RealizarConsultaSQL({codSentenca: "cava3", codColigada: 3, codSistema: "S", parameters: `CODUSUARIO=${codusuario}`}, (err, result) => {
            if(err) {
                var error = XMLMapping.load(err.body);
                res.status(400).send({ error: error.s$Envelope.s$Body.s$Fault.faultstring.$t});            
            } 
            var children = JSON.parse(parser.toJson(result.RealizarConsultaSQLResult));                                 
            res.send(children.NewDataSet.Resultado);
        });
    });
})

module.exports = router