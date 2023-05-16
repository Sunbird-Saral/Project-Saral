// const pino = require('pino')
// const prettty = require('pino-pretty')
// const store = require('store')
// const LOGIN_DATA_KEY = 'login_data_key'
// const TOKEN = 'token'

//  const setLoginData =(data) => {
//   let saved =store.set(LOGIN_DATA_KEY,{'userID':data.body.schoolId,'deviceID':data.headers['x-request-deviceid']})
//  }

//  const getLoginData = () => {
//   let loginData =store.get(LOGIN_DATA_KEY)
//     return loginData
// }

// const setToken =(data) => {
//   let saved =store.set(TOKEN,data)
//  }

//  const getToken = () => {
//   let token =store.get(TOKEN)
//     return token
// }

// const levels = {
//   error: 50,
//   warn: 40,
//   notice: 30,
//   info: 20,
//   debug: 10,
// };


// const logger = pino({
//   level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
//   customLevels: levels,
//    useOnlyCustomLevels: true,


//   timestamp: pino.stdTimeFunctions.isoTime,
//   formatters: {
//     bindings: (bindings) => {
//       return { pid: bindings.pid, host: bindings.hostname};
//     },
//     level: (label) => {
//       return { level: label.toUpperCase() };
//     },
    
//   },
//  },
//    prettty()

// )
  
//   module.exports = {
//     logger,getLoginData,setLoginData,setToken,getToken
//   };



const winston = require('winston');
// const { combine, timestamp, label, printf } = format;
const jwt = require('jsonwebtoken')

// const myFormat = format.printf(({level, meta, timestamp})=>{

//   //  const token = JSON.stringify(meta) && JSON.stringify(meta.req) && JSON.stringify(meta.req.headers['authorization']).replace('Bearer ', '')
  
//   // // const decoded = jwt.verify(token, process.env.JWT_SECRET)
//   // console.log('decoded',token);

  // const deviceId =  JSON.stringify(meta) && JSON.stringify(meta.req.headers)  && JSON.stringify(meta.req.headers['x-request-deviceid']) != undefined && JSON.stringify(meta.req.headers['x-request-deviceid']) 
  // console.log('deviceId?>>>>>>>>>>>',deviceId == undefined && '');
  
//   return `${timestamp} ${level} "deviceID : ${deviceId == undefined ? '' : deviceId}`
// })

const myFormat = winston.format.printf(({ level, message, meta, timestamp, data }) => {
  console.log('meta>>>>',meta);
    const deviceId =  JSON.stringify(meta) && JSON.stringify(meta.req.headers)  && JSON.stringify(meta.req.headers['x-request-deviceid']) 
    const token = JSON.stringify(meta) && JSON.stringify(meta.req) && JSON.stringify(meta.req.headers['authorization'])
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
  
    //  console.log('decoded?>>>>>>>>>>>',decoded);
  
  return `${timestamp}  ${level} "deviceID" : ${deviceId} "token" : ${token}  ${message} `;
});

const logConfiguration = {
  transports: [
      new winston.transports.Console()
  ],
  format: winston.format.combine(
      winston.format.label({
          label: `Label🏷️`
      }),
      winston.format.timestamp({
         format: 'MMM-DD-YYYY HH:mm:ss'
     }),
      winston.format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}
       ${info.message}
       "deviceID" :${JSON.stringify(info.meta) && JSON.stringify(info.meta.req.headers)  && JSON.stringify(info.meta.req.headers['x-request-deviceid'])}
       "token" :${JSON.stringify(info.meta) && JSON.stringify(info.meta.req) && JSON.stringify(info.meta.req.headers['authorization'])}
       `),
       
  )
};

const logger = winston.createLogger(logConfiguration);
// logger.info("Hello, Winston logger, some info!");

// const logger = createLogger({
//   transports: [
//     new transports.Console()
// ],
// // exitOnError: false,
// format : format.combine(
//     format.json(),
//     format.timestamp(),
//     // format.prettyPrint(),
//     myFormat
// )
// })

module.exports = logger;

