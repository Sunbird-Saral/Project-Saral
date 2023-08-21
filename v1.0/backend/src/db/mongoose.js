const mongoose = require('mongoose');
const { createPool } = require('generic-pool');
const { MongoClient } = require('mongodb');

// url/databasename
const connectionURL = process.env.MONGODB_URL
const maxPoolSize = process.env.MONGODB_POOL_SIZE || 100
const minPoolSize = process.env.MIN_MONGODB_POOL_SIZE || 30

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

const nativePoolFactory = {
  create: async () => {
    const client = new MongoClient(connectionURL, options);
    await client.connect();
    return client.db();
  },
  destroy: dbInstance => {
    dbInstance.client.close();
  },
};

const pool = createPool(poolFactory, { max: maxPoolSize });
const nativePool = createPool(nativePoolFactory, { max: 100 });

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

const getNativeClient = () => {
  return nativePool.acquire();
};

const releaseNativeClient = (connection) => {
      if(connection){
        nativePool.release(connection);
      }
};


module.exports = { getClientPool , releaseClientPool, pool, getNativeClient, releaseNativeClient };
