const mongoose = require('mongoose')

// url/databasename
const connectionURL = process.env.MONGODB_URL
const poolSize = process.env.POOL_SIZE

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    poolSize: poolSize,
    useFindAndModify: false, // to handle deprication warning for findByIdandUpdate
})