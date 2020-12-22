const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

require('./backend/config/db');

const app = express();
const port = process.env.PORT || 5000;

const users = require('./backend/api/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get('/api/ping', (req, res) => {
    res.send({ message: 'pong' });
});

app.use('/api/users', users);

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
