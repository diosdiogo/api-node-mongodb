const express = require('express')
const router = express.Router()
const UserCard = require('../models/userCard')
require('dotenv').config()

router.post('/', VerifyCard, async (req, res) => {      
    const userCard = new UserCard(req.body)

    try {
        const newUserCard = await userCard.save()        
        res.status(201).json(newUserCard);
    } catch (e) {
        res.status(400).json({message: e.message})
    }      
})

router.post('/getAll', async (req, res) => {
    try {
        const cards = await UserCard.find({userid: req.body.userid});
        res.json(cards)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        card = await UserCard.findById(req.params.id)
        if(card == null) {
            return res.status(404).json({message: 'Cartão não encontrado'})
        }
        if(card.main == true) {
            cards = await UserCard.find({userid: card.userid});
            let newMainCard = cards[0];
            newMainCard.main = true
            await newMainCard.save();
        }
        await card.remove()
        res.json({message: 'Cartão excluído com sucesso'})
    } catch (e) {
        res.status(500).json({message: error.message})
    }
})

async function VerifyCard(req, res, next) {
    if(req.body.main) {
        card = await UserCard.find({userid: req.body.userid, main:true});
        if(card.length > 0) {            
            card[0].main = false;
            card[0].save();
        }
    }

    next()
}

module.exports = router