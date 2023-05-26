const winston = require('winston');
const jwt = require('jsonwebtoken')

const logConfiguration = {
  transports: [
      new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
      winston.format.label({
          label: `Label🏷️`
      }),
      winston.format.timestamp({
         format: 'MMM-DD-YYYY HH:mm:ss'
     }),
     
      winston.format.printf(info => 
        `${info.level}: ${info.label}: ${[info.timestamp]}
       ${info.message}
       "deviceID" : ${ JSON.stringify(info.meta) && JSON.stringify(info.meta.req.headers)  && JSON.stringify(info.meta.req.headers['x-request-deviceid'])!= undefined ? JSON.stringify(info.meta.req.headers['x-request-deviceid']): null}
       "token" :${JSON.stringify(info.meta) && JSON.stringify(info.meta.req) && JSON.stringify(info.meta.req.headers['authorization']) != undefined ? JSON.stringify(info.meta.req.headers['authorization']): null}
       `),
       
  ),
};

const logger = winston.createLogger(logConfiguration);

module.exports = logger;

