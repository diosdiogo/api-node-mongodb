const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userCardSchema = new mongoose.Schema({
    userid: {
        type: String,
        require: true
    },
    cardToken: {
        type: String,
        require: true,
    },
    main: {
        type: Boolean,
        require: true
    },
    lastNumbers: {
        type: String,
        require: true
    },
    namePrinted: {
        type: String,
        require: true
    },
    brand: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('UserCard', userCardSchema)