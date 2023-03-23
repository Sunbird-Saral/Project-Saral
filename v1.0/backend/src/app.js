const express = require('express')
require('./db/mongoose')
var path = require('path');
const fs = require('fs')
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const schoolRouter = require('./routers/school.route')
const studentRouter = require('./routers/student.route')
const classRouter = require('./routers/class.route')
const examRouter = require('./routers/exam.route')
const markRouter = require('./routers/mark.route')
const roiRouter = require('./routers/roi.route')
const brandRouter = require('./routers/brand.route')
var cors = require('cors');

const spec = fs.readFileSync(`${__dirname}/swagger-saral-frontend.yaml`, 'utf-8');
const spec2 = fs.readFileSync(`${__dirname}/swagger-saral-maintenance.yaml`, 'utf-8');

const frontendSpec = yaml.load(spec);
const maintenanceSpec = yaml.load(spec2);
const app = express()

const CORS_ORIGIN = [{"origin": 'http://192.168.0.102:3000', "optionsSuccessStatus": 200,"methods": ["GET", "PUT"]},{"origin": 'http://192.168.0.104:3000', "optionsSuccessStatus": 200,"methods": ["GET", "PUT"]}]

    const corsOptionsDelegate = (req, callback) => {

    let isDomainAllowed = CORS_ORIGIN.filter((el)=> { return el.origin == req.header('Origin') });

    if (isDomainAllowed.length > 0) {
        callback(null, isDomainAllowed[0])
    } else {
        callback(new Error('Not allowed by CORS'))
    }
}

const loggerMiddleware = (req, res, next) => {
    console.log('New request to: ' + req.method + ' ' + req.path, req.body)
    next()
}

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.json())
app.use(cors(corsOptionsDelegate));
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
app.use(brandRouter)
app.use("/api-docs/saral/frontend", swaggerUi.serve, (...args) => swaggerUi.setup(frontendSpec)(...args));
app.use("/api-docs/saral/maintenance", swaggerUi.serve, (...args) => swaggerUi.setup(maintenanceSpec)(...args));
module.exports = app