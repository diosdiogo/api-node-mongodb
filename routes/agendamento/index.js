require('dotenv').config()
const express = require('express')
const appAg = express.Router()


const profileRouter = require('./routers/profileController')
const mentoringAdminRouter = require('./routers/MentoringAdminController')
const mentoringSubjectsRouter = require('./routers/mentoringSubject')
const classRouter = require('./routers/classController')
const schedulingRouter = require('./routers/schedulingController')
const studentRouter = require('./routers/stutendController')
const notaRouter = require('./routers/notaController')

appAg.use('/profile', profileRouter)
appAg.use('/mentoringAdmin', mentoringAdminRouter)
appAg.use('/mentoringSubjects', mentoringSubjectsRouter)
appAg.use('/class', classRouter)
appAg.use('/scheduling', schedulingRouter)
appAg.use('/student', studentRouter)
appAg.use('/nota', notaRouter)

module.exports = appAg