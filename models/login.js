const mongoose = require('mongoose');
const md5 = require('md5');

const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    active: {
        type: Boolean,
        require: true
    },
    password: {
        type: String,
        require: true,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        require: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    }
})

loginSchema.pre('save', async function(next) {
    const hash = await md5(this.password);
    this.password = hash;

    next();
})

module.exports = mongoose.model('Login', loginSchema)