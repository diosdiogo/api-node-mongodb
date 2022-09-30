const express = require('express')
const router = express.Router()
const Banner = require('../models/banner')
require('dotenv').config()

router.post('/', async (req, res) => {      
    const banner = new Banner(req.body)

    try {
        const newBanner = await banner.save()        
        res.status(201).json(newBanner);
    } catch (e) {
        res.status(400).json({message: e.message})
    }      
})

router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find();
        res.json(banners)
    } catch (e) {
        res.status(500).json({message: e.message})
    }
})

router.get('/:id', getBanner, (req, res) => {
    res.json(res.banner)
})

async function getBanner(req, res, next) {
    try {
        banner = await Banner.findById(req.params.id)
        if(banner == null) {
            return res.status(404).json({message: 'Banner não encontrado'})
        }
    } catch (e) {
        return res.status(500).json({message: error.message})
    }

    res.banner = banner
    next()
}

module.exports = router