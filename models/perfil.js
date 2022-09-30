const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    profile: {
        type: String,
        require: true
    },
})

module.exports = mongoose.model('Profile', profileSchema)