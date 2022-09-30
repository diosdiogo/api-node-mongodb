const express = require('express')
const router = express.Router()
const MentoringSubject = require('../../../models/MentoringSubject')
const authetication = require('../../../middlewares/auth')
require('dotenv').config()

router.get('/list', authetication, async (req, res) => {
    try {
        MentoringSubject.find()
        .then(async (mentoringSubject) => {
            res.status(200).send({
                response: mentoringSubject
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
        MentoringSubject.findById(req.params.id)
        .then(async (mentoringSubject) => {
            res.status(200).send({
                response: mentoringSubject
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
        new MentoringSubject({
            ...req.body
        }).save().then((newMentoringSubject) => {
            res.status(201).json(newMentoringSubject)
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
    try {
        MentoringSubject.findOneAndUpdate(
            {_id: req.body.id},
            {$set: {...req.body}}
        ).then(() => {
            res.status(201).json(req.body)
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
    try {
        MentoringSubject.findOneAndDelete(
            {_id: req.body.id},
        ).then(() => {
            res.status(201).json(true)
        }).catch(function(erro) {
            console.log(erro)
            res.status(400).send({
                message: erro,
                response: null
            })
        })  
    }catch (e) {
        res.status(400).json({message: e.message})
    }  
         
})

module.exports = router