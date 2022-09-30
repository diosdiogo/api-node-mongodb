const mongoose = require('mongoose');

const notaSchema = new mongoose.Schema({
    date: {
        type: Date,
        require: true
    },
    tema: {
        type: String,
        require: true
    },
    nota: {
        type: Number
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    mentoringSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MentoringSubject"
    }
})

module.exports = mongoose.model('Nota', notaSchema);
