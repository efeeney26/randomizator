const mongoose = require('mongoose');

const connection = process.env.MONGODB_URI;

mongoose.connect(connection,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

module.exports = mongoose.connection
