const mongoose = require('mongoose');
const md5 = require('md5');

const schedulingSchema = new mongoose.Schema({
    student : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "mentoringSubject"
    },
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
    start: {
        type: String,
        require: true
    },
    end: {
        type: String,
        require: true
    },
})

module.exports = mongoose.model('scheduling', schedulingSchema)
