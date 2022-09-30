require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors');
const bodyParser = require('body-parser');

mongoose.connect(
  process.env.DATABASE_STRING,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
);
const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('Database Connected'))

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,PATCH');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    app.use(cors());
    next();
});

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

const authControllerRouter = require('./routes/authController')
const productsControllerRouter = require('./routes/productsController')
const bannersControllerRouter = require('./routes/bannersController')
const loginRouter = require('./routes/loginController')
const scheduling = require('./routes/agendamento')
const userRouter = require('./routes/userController')
const userCardsRouter = require('./routes/card')
const purchasesControllerRouter = require('./routes/purchasesController')

app.get('/app', ((req, res, next) => {
  res.status(200).send({
    response: process.env.APP_NAME,
  })  
}));

app.use('/products', productsControllerRouter)
app.use('/purchases', purchasesControllerRouter)
app.use('/auth', authControllerRouter)
app.use('/login', loginRouter)
app.use('/user', userRouter)
app.use('/card', userCardsRouter)
app.use('/banners', bannersControllerRouter)
app.use('/scheduling', scheduling)

app.listen(3000, () => console.log('Servidor está rodando'))   