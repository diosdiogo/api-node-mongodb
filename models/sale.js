const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    date: {
        type: Date,
        require: true
    },
    CODUSUARIO: {
        type: String,
        require: true,
    },
    EMAILSUARIO: {
        type: String,
        require: true,
    },
    RESULTCIELO: {
        type: String,
        require: true,
    },
    RMXML: {
        type: String,
        require: true,
    },
    IDMOV: {
        type: String,
    }
})

module.exports = mongoose.model('Sale', saleSchema)