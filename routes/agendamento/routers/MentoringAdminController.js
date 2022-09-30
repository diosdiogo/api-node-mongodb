const express = require('express')
const router = express.Router()
const MentoringAdmin = require('../../../models/MentoringAdmin')
const authetication = require('../../../middlewares/auth')
require('dotenv').config()

router.get('/list', authetication, async (req, res) => {
    try {
        MentoringAdmin.find()
                    .populate("MentoringAdmin")
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
        MentoringAdmin.findById(req.params.id)
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
        new MentoringAdmin({
            ...req.body
        }).save().then((newMentoringAdmin) => {
            res.status(201).json(newMentoringAdmin)
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
        MentoringAdmin.findOneAndUpdate(
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
        MentoringAdmin.findOneAndDelete(
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