const pino = require('pino')
// const logger = pino({
//     // level: process.env.PINO_LOG_LEVEL || 'info',
//     transport:{
//         target: 'pino-pretty',
//         options:{
//             colorize: true,
//             translateTime: 'SYS:dd-mm-yyyy HH-MM',
//             ignore: 'pid,hostname'
//         }
//     }
// })

module.exports = pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    formatters: {
        bindings: (bindings) => {
            return {   pid: bindings.pid,
                // host: bindings.hostname,
                // node_version: process.version,
            };
          },
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
  });