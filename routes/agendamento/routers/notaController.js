const express = require('express')
const router = express.Router()
const Nota = require('../../../models/nota')
const MentoringSubject = require('../../../models/MentoringSubject')
const authetication = require('../../../middlewares/auth')
require('dotenv').config()

router.get('/list', authetication, async (req, res) => {
    try {
        Nota.find()
            .populate('User')
            .populate("MentoringSubject")
        .then(async (nota) => {
            res.status(200).send({
                response: nota
            })
        }).catch((err) => {
            console.log(err)
            res.status(400).send({
                message: erro,
                response: null
            })
        })
    }catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/list/:id', authetication, async (req, res) => {
    try {
        Nota.findById(req.params.id)
            .populate('mentoringsubject')
        .then(async (nota) => {
            res.status(200).send({
                response: nota
            })
        }).catch((err) => {
            console.log(err)
            res.status(400).send({
                message: erro,
                response: null
            })
        })
    }catch (error) {
        res.status(500).json({message: error.message})
    }
})
router.post('/save', authetication, async (req, res) => {
    console.log(req.body)
    try {
        new Nota({
            ...req.body
        }).save().then((newNota) => {
            res.status(201).json(newNota)
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
router.post('/update', authetication, async (req, res) => {
    console.log(req.body)
    try {
        Nota.findOneAndUpdate(
            {_id: req.body.id},
            {$set: {...req.body}}
        ).then(() => {
            res.status(201).json(true)
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
router.post('/delete', authetication, async (req, res) => {
    console.log(req.body)
    try {
        Nota.findOneAndDelete(
            { _id: req.body.id},
        ).then(() => {
            res.status(201).json(true)
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

module.exports = router
