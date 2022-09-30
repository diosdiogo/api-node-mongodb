const mongoose = require('mongoose');

const mentoringSubjectSchema = new mongoose.Schema({
    name : {
        type: String,
        require: true
    } 
})

module.exports = mongoose.model('mentoringSubject', mentoringSubjectSchema)
