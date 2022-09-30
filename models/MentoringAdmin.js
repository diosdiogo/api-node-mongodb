const mongoose = require('mongoose');

const MentoringAdminSchema = new mongoose.Schema({

    subject: 
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "mentoringSubject"
        }],
        
    classes: [
        {
            classes: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class"
            }
        }],
    spaces: {
        type: Number,
    },
    month: {
        type: Number,
    },
    year: {
        type: Number,
    },
    domingo	: {
        type: Boolean
    },
    domingo_start	: {
        type: String
    },
    domingo_end	: {
        type: String
    },
    segunda	: {
        type: Boolean
    },
    segunda_start	: {
        type: String
    },
    segunda_end	: {
        type: String
    },
    terca	: {
        type: Boolean
    },
    terca_start	: {
        type: String
    },
    terca_end	: {
        type: String
    },
    quarta	: {
        type: Boolean
    },
    quarta_start	: {
        type: String
    },
    quarta_end	: {
        type: String
    },
    quinta	: {
        type: Boolean
    },
    quinta_start	: {
        type: String
    },
    quinta_end	: {
        type: String
    },
    sexta	: {
        type: Boolean
    },
    sexta_start	: {
        type: String
    },
    sexta_end	: {
        type: String
    },
    sabado	: {
        type: Boolean
    },
    sabado_start	: {
        type: String
    },
    sabado_end	: {
        type: String
    },
    almoco_start	: {
        type: String
    },
    almoco_end	: {
        type: String
    },
    tempo	: {
        type: Number
    },
})

module.exports = mongoose.model('MentoringAdmin', MentoringAdminSchema)
