const pino = require('pino')
const prettty = require('pino-pretty')
const uuid = require('uuid');
const uniqeId = uuid.v4();
const moment = require('moment')
const log = pino({});
const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};
const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  customLevels: levels,
  useOnlyCustomLevels: true,
  
  // formatters: {
  //   level: (label) => {
  //     return { severity: label.toUpperCase() };
  //   },
  // },
  // base: {
  //   pid : true
  // },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    bindings: (bindings) => {
      return { pid: bindings.pid, host: bindings.hostname ,uuid: uniqeId};
    },
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
},
prettty()
)








log.customError = (error, req, details = '', LogLevel = process.env.LOG_LEVEL) => {
    // const req = global.reqInfo;
    console.log("This is req part>>>", req.schoolId)
    const e = new Error(error);
    const frame = e.stack.split('\n')[2];
    const functionName = frame.split(' ')[5];
    const lineNumber = frame.split(':').reverse()[1];
    const errorInfo = {
      // If we have a request object then parse it otherwise it is null
    //   reqInfo: req
    //     ? {
    //         req: {
    //           req: req.method,
    //           path: req.path,
    //           body: req.body,
    //           query: req.query,
    //         },
    //         // If a req has a property with key user then extract relevant information otherwise return null
    //         user: req.user
    //           ? {
    //               id: req.userId,
    //               name: req.user.name,
    //             }
    //           : null,
    //         // The server information at the moment of error handling
    //         server: {
    //           ip: req.ip
    //         //   servertime: moment().format('YYYY-MM-DD HH:mm:ss'),
    //         },
    //       }
    //     : null,
    //   req.schoolId,  
      schoolId: req.schoolId,
        functionName,
      lineNumber,
      // Assuming that error is occured in application layer and not the database end.
      errorType: 'application error',
      stack: error.stack || e.stack,
      message: error.message || e.message,
      env: process.env.NODE_ENV,
      // defaults read from environment variable
      logLevel: LogLevel,
      process: details,
    };
    // Print appropriate level of log from [info, debug, warn, error]
    switch (LogLevel) {
      case 'info':
        log.info(errorInfo);
        break;
      case 'debug':
        log.debug(errorInfo);
        break;
      case 'warn':
        log.warn(errorInfo);
        break;
      case 'error':
        log.error(errorInfo);
        break;
      default:
        log.error(errorInfo);
    }
  };
  
  module.exports = {
    log,logger
  };