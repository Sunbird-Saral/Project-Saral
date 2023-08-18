const app = require('./app')
const logger = require('./logging/logger')
const port = process.env.PORT
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`, numCPUs);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {

app.listen(port, () => {
     logger.info('Server is up on port '+port);
})
}
