const mongoose = require('mongoose');
const { createPool } = require('generic-pool');

// url/databasename
const connectionURL = process.env.MONGODB_URL
const maxPoolSize = process.env.MONGODB_POOL_SIZE || 50
const minPoolSize = process.env.MIN_MONGODB_POOL_SIZE || 20

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};

// Create a connection pool manager
const poolFactory = {
    create: () => mongoose.createConnection(connectionURL, options),
    destroy: (connection) => connection.close(),
};

const pool = createPool(poolFactory, {
  max: maxPoolSize,
  min: minPoolSize, // Minimum number of connections in the pool,
  autostart: true,
  idleTimeoutMillis: 30000, // How long a resource can stay idle in the pool before being removed (30 seconds in this case)
});

const getClientPool = (req, res, next) => {
    pool.acquire()
      .then((connection) => {
        req.dbConnection = connection;
        next();
      })
      .catch((error) => {
        res.status(500).json({ error: 'Internal Server Error' });
      });
};

const releaseClientPool = (req, res, next) => {
        if(req.dbConnection){
            pool.release(req.dbConnection);
        }
        next()
};


module.exports = { getClientPool , releaseClientPool, pool };
