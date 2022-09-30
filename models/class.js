const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name : {
        type: String,
        require: true
    } 
})

module.exports = mongoose.model('class', classSchema)
