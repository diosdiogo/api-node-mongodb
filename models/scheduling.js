const mongoose = require('mongoose');
const md5 = require('md5');

const schedulingSchema = new mongoose.Schema({
    week: {
        type: String,
        require: true
    },
    day: {
        type: Number,
        require: true
    },
    time: {
        type: String,
        require: true
    },
})

module.exports = mongoose.model('scheduling', schedulingSchema)
