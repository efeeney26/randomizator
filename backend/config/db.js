const mongoose = require('mongoose');

const connection = "mongodb+srv://efeeney:fgs1Cmprdan.@cluster0.ssw8z.mongodb.net/randomizator?retryWrites=true&w=majority";

mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));
