const express = require('express')
const router = express.Router()
const authetication = require('../middlewares/auth')
const MentoringAdmin = require('../models/MentoringAdmin')
const User = require('../models/user')
require('dotenv').config()

router.get('/', authetication, async (req, res) => {
    try {
        const users = await User.find().populate("profile")
        res.json(users)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.get('/list', authetication, async (req, res) => {
    try {
        const users = await User.find().populate("profile")
        res.json(users)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})
router.get('/list/:id', authetication, async (req, res) => {
    try {
        let users = await User.findById(req.params.id)
                                .populate("profile")
                                .populate("mentoringAdmin")
        
        var mentoring = [];
        await users.mentoring.forEach(async (e, i) => {
         MentoringAdmin.findOne({
                _id: e.mentoring
            })
            .then(async (m) => {
                console.log(m)
                mentoring.push({m})
            }).catch((err) => {
                console.log(err)
                res.status(400).send({
                    message: erro,
                    response: null
                })
            })
        });

        console.log(mentoring);
        users.mentoring = mentoring;
        res.json(users)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.post('/save', authetication, async (req, res) => {
    console.log(req.body);
    try {
        new User({
            ...req.body
        }).save().then((newUser) => {
            res.status(201).json(newUser)
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
router.post('/update', authetication, async (req, res) => {
    try {
        User.findOneAndUpdate(
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
    }catch (e) {
        res.status(400).json({message: e.message})
    }  
})

router.post('/delete', authetication, async (req, res) => {
    try {
        User.findOneAndDelete(
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
