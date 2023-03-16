const app = require('./app')
const {logger} = require('./logging/logger')
const port = process.env.PORT

app.listen(port, () => {
     logger.info('Server is up on port '+port);
})
