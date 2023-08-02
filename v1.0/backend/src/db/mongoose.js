const mongoose = require('mongoose');
const { createPool } = require('generic-pool');

// url/databasename
const connectionURL = process.env.MONGODB_URL
const poolSize = process.env.MONGODB_POOL_SIZE || 50

//TODO would be removed
// mongoose.connect(connectionURL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     poolSize: poolSize,
//     useFindAndModify: false, // to handle deprication warning for findByIdandUpdate
// })

//----------New way of getting connection to mongodb-----------

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
  max: 100,
  min: 30, // Minimum number of connections in the pool,
  autostart: true,
  idleTimeoutMillis: 30000, // How long a resource can stay idle in the pool before being removed (30 seconds in this case)
});

const getClientPool = (req, res, next) => {
    const startTime = new Date();
    req.startTime = startTime;
    pool.acquire()
      .then((connection) => {
        req.connectionWaitTime = (new Date() - startTime);
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
