'use strict'
const debug = require('debug')('week8')
require('./startup/database')()

const express = require('express')
const app = express()

app.use(express.json())
app.use(require('express-mongo-sanitize')())
app.use('/api/auth', require('./routes/auth'));

app.use('/api/auth/student', require('./routes/auth/student'))
app.use('/api/auth/course', require('./routes/auth/course'))

const port = process.env.PORT || 3030
app.listen(port, () => debug(`Express is listening on port ${port} ...`))
