const pino = require('pino')
const prettty = require('pino-pretty')


const levels = {
  error: 50,
  warn: 40,
  notice: 30,
  info: 20,
  debug: 10,
};


const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  customLevels: levels,
   useOnlyCustomLevels: true,


  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    bindings: (bindings) => {
      return { pid: bindings.pid, host: bindings.hostname};
    },
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    
  },
 },
   prettty()

)
  
  module.exports = {
    logger
  };