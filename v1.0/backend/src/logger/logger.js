const pino = require('pino')
const pinoLogging = pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
    transport:{
        target: 'pino-pretty',
        options:{
            colorize: true,
            translateTime: 'SYS:dd-mm-yyyy HH-MM',
            ignore: 'pid,hostname'
        }
    }
})

module.exports = pinoLogging