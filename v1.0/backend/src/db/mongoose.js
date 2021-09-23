const mongoose = require('mongoose')

// url/databasename
const connectionURL = process.env.MONGODB_URL

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false, // to handle deprication warning for findByIdandUpdate
})