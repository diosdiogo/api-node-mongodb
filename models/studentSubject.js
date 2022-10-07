const mongoose = require('mongoose');

const studentSubjectSchema = new mongoose.Schema({
    student : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subject:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "mentoringSubject"
    }],
})

module.exports = mongoose.model('studentSubject', studentSubjectSchema)
