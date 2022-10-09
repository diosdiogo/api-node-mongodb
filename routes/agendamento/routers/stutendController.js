const express = require('express')
const router = express.Router()
const ClassSubject = require('../../../models/class')
const Student = require('../../../models/user')
const StudentSubject = require('../../../models/studentSubject')
const authetication = require('../../../middlewares/auth')
require('dotenv').config()

router.get('/studentSubject/:id', authetication, async (req, res) => {
    console.log("10")
    console.log(req.params)
    try {
        StudentSubject.findOne({
            student: req.params.id
            })
                      .populate("subject")
        .then(async (studentSubject) => {
            res.status(200).send({
                response: studentSubject
            })
        }).catch((err) => {
            console.log(err)
            res.status(400).send({
                response: null
            })
        })
    }catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.get('/list', authetication, async (req, res) => {
    try {
        StudentSubject.find()
                      .populate("subject")
        .then(async (studentSubject) => {
            res.status(200).send({
                response: studentSubject
            })
        }).catch((err) => {
            console.log(err)
            res.status(400).send({
                message: err,
                response: null
            })
        })
    }catch (error) {
        res.status(500).json({message: error.message})
    }
})



router.post('/save', authetication, async (req, res) => {
    try {
        new StudentSubject({
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
    try {
        StudentSubject.findOneAndUpdate(
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


module.exports = router
