const mongoose = require('mongoose');
const md5 = require('md5');

const userSchema = new mongoose.Schema({
    codusuario: {
        type: String
    },
    profile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    password: {
        type: String,
        require: true,
    },
    mentoring:
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentoringadmin"
    }]
})

userSchema.pre('save', async function(next) {
    const hash = await md5(this.password);
    this.password = hash;

    next();
})
module.exports = mongoose.model('User', userSchema);
