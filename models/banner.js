const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true,
    },
    value: {
        type: String
    },
    description: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Banner', bannerSchema)