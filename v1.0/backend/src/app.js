const express = require('express')
require('./db/mongoose')
var path = require('path');
const schoolRouter = require('./routers/school.route')
const studentRouter = require('./routers/student.route')
const classRouter = require('./routers/class.route')
const examRouter = require('./routers/exam.route')
const markRouter = require('./routers/mark.route')
const roiRouter = require('./routers/roi.route')

const app = express()

const loggerMiddleware = (req, res, next) => {
    console.log('New request to: ' + req.method + ' ' + req.path, req.body)
    next()
}

app.use(express.json())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Register the function as middleware for the application
app.use(loggerMiddleware)
app.use(schoolRouter)
app.use(studentRouter)
app.use(classRouter)
app.use(examRouter)
app.use(markRouter)
app.use(roiRouter)


module.exports = app