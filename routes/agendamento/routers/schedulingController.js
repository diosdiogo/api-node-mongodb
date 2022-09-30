const express = require('express')
const router = express.Router()
const Scheduling = require('../../../models/scheduling')
const MentoringSubject = require('../../../models/MentoringSubject')
const authetication = require('../../../middlewares/auth')
require('dotenv').config()

router.get('/list', authetication, async (req, res) => {
    try {
        Scheduling.find()
                  .populate('Mentoringsubject')
        .then(async (scheduling) => {
            res.status(200).send({
                response: scheduling
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
        Scheduling.findById(req.params.id)
                  .populate('mentoringsubject')
        .then(async (scheduling) => {
            res.status(200).send({
                response: scheduling
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
        new Scheduling({
            ...req.body
        }).save().then((newScheduling) => {
            res.status(201).json(newScheduling)
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
        Scheduling.findOneAndUpdate(
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
        Scheduling.findOneAndDelete(
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
