const express = require('express')
const router = express.Router()
const ClassSubject = require('../../../models/class')
const authetication = require('../../../middlewares/auth')
require('dotenv').config()

router.get('/list', authetication, async (req, res) => {
    try {
        ClassSubject.find()
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
        ClassSubject.findById(req.params.id)
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
        new ClassSubject({
            ...req.body
        }).save().then((newClassSubjectSubject) => {
            res.status(201).json(newClassSubjectSubject)
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
        ClassSubject.findOneAndUpdate(
            { _id: req.body.id},
            {$set: {profile: req.body.name}}
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
    try {
        ClassSubject.findOneAndDelete(
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