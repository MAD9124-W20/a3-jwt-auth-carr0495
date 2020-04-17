// 'use strict'
// const debug = require('debug')('week8')
// require('./startup/database')()

// const compression = require('compression')
// const express = require('express')
// const helmet = require('helmet')
// const cors = require('cors')
// const app = express()

// app.use(helmet())
// app.use(cors())
// app.use(compression())
// app.use(express.json())
// app.get('/', (req, res) => res.send({ data: { healthStatus: 'UP' } }));
// app.use(require('express-mongo-sanitize')())
// app.use('/api/auth', require('./routes/auth'));

// app.use('/api/auth/person', require('./routes/auth/person'))
// app.use('/api/auth/gift', require('./routes/auth/gift'))

// app.use(require('./middleware/logErrors'));
// app.use(require('./middleware/errorHandler'));

// const port = process.env.PORT || 3030
// app.listen(port, () => debug(`Express is listening on port ${port} ...`))

require('./startup/database')();
const express = require('express');
const app = express();

// Apply global middleware with app.use()

// Add the health check route
app.get('/', (req, res) => res.send({ data: { healthStatus: 'UP' } }));

// Link the auth and api route handler modules

// Apply the global error handler middleware

// Export the `app` object
module.exports = app;
