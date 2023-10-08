const express = require('express')
const db = require('./db/mongoose')
var path = require('path');
const fs = require('fs')
const puppeteer = require('puppeteer')
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const schoolRouter = require('./routers/school.route')
const studentRouter = require('./routers/student.route')
const classRouter = require('./routers/class.route')
const examRouter = require('./routers/exam.route')
const markRouter = require('./routers/mark.route')
const roiRouter = require('./routers/roi.route')
const brandRouter = require('./routers/brand.route')
const optionsRouter = require('./routers/options.route')
var cors = require('cors');
const expressWinston = require('express-winston')
const logger = require('./logging/logger')

const spec = fs.readFileSync(`${__dirname}/swagger-saral-frontend.yaml`, 'utf-8');
const spec2 = fs.readFileSync(`${__dirname}/swagger-saral-maintenance.yaml`, 'utf-8');

const frontendSpec = yaml.load(spec);
const maintenanceSpec = yaml.load(spec2);
const app = express()

app.use(expressWinston.logger({
   winstonInstance : logger,
   statusLevels : true
}))

app.use(express.json({limit: '50mb'}));
const loggerMiddleware = (req, res, next) => {
    console.log('New request to: ' + req.method + ' ' + req.path, req.body)
    next()
}

const generateJestReportPdf = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
        const invoicePath = path.resolve("./output/coverage/lcov-report/index.html");
    await page.goto(invoicePath, { waitUntil: 'networkidle0' });
    await page.pdf({
        path: './output/jestTestReport.pdf',
        displayHeaderFooter: true,
        headerTemplate: '',
        footerTemplate: '',
        printBackground: true,
        margin: {
            top: '20px', right: '20px', bottom: '20px', left: '20px'
    }
    });
        await browser.close();
    console.log("pdf printed")
}

const CORS_ORIGIN = [{ "origin": 'https://saral-dev-api.anuvaad.org', "optionsSuccessStatus": 200, "methods": ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] },{ "origin": 'https://saral-api.anuvaad.org', "optionsSuccessStatus": 200, "methods": ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }, { "origin": 'https://saral-api.anuvaad.org', "optionsSuccessStatus": 200, "methods": ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }]

const checkURL = (req, res, next) => {
    const { origin, url, methods } = req.headers;
    let isUrlExist = CORS_ORIGIN.findIndex((el) => { return el.origin == origin });
    let isMethodAvailable = methods ? methods.toUpperCase() : "";

    let isMethodExist = CORS_ORIGIN[isUrlExist] ? CORS_ORIGIN[isUrlExist].methods.findIndex((el) => { return el == isMethodAvailable }) : -1;
    
    if (isUrlExist == -1) {
      return res.status(403).json({ error: 'Invalid URL' });
    } else if (isMethodExist == -1) {
        return res.status(403).json({ error: 'Invalid Method' });
    }
    next();
  };

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.json())
app.use(cors());
app.use(checkURL)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Register the function as middleware for the application

// app.use(expressMiddleware)
// app.use(loggerMidlleware)
app.use(db.getClientPool)
app.use(schoolRouter)
app.use(studentRouter)
app.use(classRouter)
app.use(examRouter)
app.use(markRouter)
app.use(roiRouter)
app.use(brandRouter)
app.use(optionsRouter)
app.use(db.releaseClientPool)
app.use("/api-docs/saral/frontend", swaggerUi.serve, (...args) => swaggerUi.setup(frontendSpec)(...args));
app.use("/api-docs/saral/maintenance", swaggerUi.serve, (...args) => swaggerUi.setup(maintenanceSpec)(...args));

// uncomment below function to generate jest report pdf 
// generateJestReportPdf() 

module.exports = app