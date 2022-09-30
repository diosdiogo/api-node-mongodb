const express = require('express')
const router = express.Router()
const authetication = require('../../../middlewares/auth')
const Profile = require('../../../models/perfil')
require('dotenv').config()

router.get('/list', authetication, async (req, res) => {
    try {
        Profile.find()
        .then(async (profile) => {
            res.status(200).send({
                response: profile
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
    console.log(req.params.id)
    try {
        Profile.findById(req.params.id)
        .then(async (profile) => {
            res.status(200).send({
                response: profile
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

router.post('/save', authetication, async(req, res) => {
    console.log(req.body)
   
    try {
        new Profile({
            ...req.body
        }).save().then((newProfile) => {
            res.status(201).json(newProfile)
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
        Profile.findOneAndUpdate(
            { _id: req.body.id},
            {$set: {profile: req.body.profile}}
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
        Profile.findOneAndDelete(
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
