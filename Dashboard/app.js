var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var configDB = require('./db/database.js');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var routes = require('./routes/routes.js');
var path = require('path');
var swig = require('swig');
var log = require('./utils/log')(module);

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(configDB.url);

var db = mongoose.connection;

db.on('error', function (err) {
	log.error('connection error:', err.message);
});
db.once('open', function callback () {
	log.info("Connected to DB!");
});


app.set('views', path.join(__dirname, 'views'));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// required for passport
require('./auth/passport')(passport)
app.use(session({
    secret: 'alexburak',
    resave: true,
    saveUninitialized: true
})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require("./routes/routes"));
app.use('/', require("./routes/projects"));
app.use('/', require("./routes/ticket"));


var user = require('./auth/roles');
app.use(user.middleware());


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        log.error('Internal error(%d): %s',res.statusCode,err.message);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;