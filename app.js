const express = require('express');
const logger = require('morgan');

global.util = require('./config/util');
const api = require('./routes');
const app = express();
app.use(express.json());

const mongoose = require('mongoose');
const dev_db_url = 'mongodb+srv://tc022:9viR331w@cluster0.rsbhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const mongoDB = process.env.MONGODB_URI || dev_db_url;

const dbOptions = { useUnifiedTopology: true, useNewUrlParser: true};
mongoose.connect(mongoDB, dbOptions);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));


app.use('/api', api);

require('./config/error-handler')(app)

const port = 4040;
function errorHandler(err, req, res, next) {
    if(err.status) {
        res.status(err.status).json({err: err.message});
    } else {
         res.sendStatus(500);
    }
}

app.use(errorHandler);

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
