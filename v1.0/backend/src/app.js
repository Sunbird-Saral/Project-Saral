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
const admissionRouter = require('./routers/admission.route');
const roiv2Router = require('./routers/roiv2.route');
var cors = require('cors');
const expressWinston = require('express-winston')
const logger = require('./logging/logger')

// const spec = fs.readFileSync(`${__dirname}/swagger-saral-frontend.yaml`, 'utf-8');
// const spec2 = fs.readFileSync(`${__dirname}/swagger-saral-maintenance.yaml`, 'utf-8');

// const frontendSpec = yaml.load(spec);
// const maintenanceSpec = yaml.load(spec2);
const app = express()
app.disable("x-powered-by");

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

const whitelist = process.env.WHITELIST_DOMAINS || ['https://saral-dev-api.anuvaad.org', 'https://saral-api.anuvaad.org', 'https://test-api.dummy.org']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Invalid URL'))
    }
  },
  methods: 'GET',
  optionsSuccessStatus: 200
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(express.json())
app.use(cors(corsOptions));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Register the function as middleware for the application

app.use(db.getClientPool)
app.use(schoolRouter)
app.use(studentRouter)
app.use(classRouter)
app.use(examRouter)
app.use(markRouter)
app.use(roiRouter)
app.use(brandRouter)
app.use(admissionRouter)
app.use(roiv2Router)
app.use(db.releaseClientPool)
// app.use("/api-docs/saral/frontend", swaggerUi.serve, (...args) => swaggerUi.setup(frontendSpec)(...args));
// app.use("/api-docs/saral/maintenance", swaggerUi.serve, (...args) => swaggerUi.setup(maintenanceSpec)(...args));

//error handling middleware
app.use((err, req, res, next) => {
    if(err.message == 'Invalid URL') {
        return res.status(403).json({ error: 'Invalid URL' });
    } else {
        return res.status(500).json({ error: 'Internal Server Error'});
    }
    
});

// uncomment below function to generate jest report pdf 
// generateJestReportPdf() 

module.exports = app