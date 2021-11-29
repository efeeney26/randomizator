const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config()

const dbConfig = require('./db/config')
const usersRouter = require('./routes/users')

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', usersRouter);

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

dbConfig
    .on('error', (err) => {
        console.error(err)
    })
    .once('open', () => {
        console.log('Database Connected Successfully')
    })

