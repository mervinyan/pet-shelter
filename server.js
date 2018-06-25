const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    config = require('config'),
    router = require('./router');

let morgan = require('morgan');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: config.databaseURL,
    collection: 'sessions'
});

const chalk = require('chalk');

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || config.databaseURL);

if (config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined'));
}
// console.log(chalk.green(`Starting express server in ${environment} mode...`));

const server = app.listen(process.env.PORT || 8080 );
if (process.env.PORT) {
    console.log(chalk.green('Pet Shelter is running on port ' + process.env.PORT));
} else {
    console.log(chalk.green('Pet Shelter is running on port 8080'));
}


app.use(session({
    secret: 'petweather secret key',
    resave: false,
    saveUninitialized: true,
    store: store,
    unset: 'destroy',
    name: 'petweather'
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Locale, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

router(app);

module.exports = server;
