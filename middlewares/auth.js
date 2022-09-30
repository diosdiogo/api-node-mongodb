
require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({ error: 'Token não enviado'})

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token Erro'})

    const [scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token mal formatado'})
    
    jwt.verify(token, process.env.secret, (err, decoded) => {
        if(err) return res.status(401).send({ error: 'Token inválido'})

        req.userId = decoded.id;
        return next();
    })
}