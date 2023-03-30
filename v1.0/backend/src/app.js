const express = require('express')
require('./db/mongoose')
const expressPinoLogger = require('express-pino-logger')
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
const {getLoginData,getToken,logger} = require('./logging/logger')

const spec = fs.readFileSync(`${__dirname}/swagger-saral-frontend.yaml`, 'utf-8');
const spec2 = fs.readFileSync(`${__dirname}/swagger-saral-maintenance.yaml`, 'utf-8');

const frontendSpec = yaml.load(spec);
const maintenanceSpec = yaml.load(spec2);
const app = express()


const expressMiddleware = async(req, res, next) => {
 let data= await getLoginData();
  next()
}

const loggerMidlleware = expressPinoLogger({
    logger: logger,
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        user: req.raw.user,
        token:req.raw.token
      }),
    },
    autoLogging: true,
  });

  app.use((req, res, next) => {
    req.user =  getLoginData();
    req.token = getToken()
    next();
  })
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.json())
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Register the function as middleware for the application

app.use(expressMiddleware)
app.use(loggerMidlleware)
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