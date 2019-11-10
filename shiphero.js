const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const debug = require('debug');
const cors = require('cors');
const mongo = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bgapp', {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
})
    .then(() => console.log('Database Connection Successful!!'))
    .catch(err => console.error(err));
const db = mongoose.connection;

const config = require('./shared/config');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const label = require('./routes/label');

const shiphero = express();

// view engine setup
shiphero.set('views', path.join(__dirname, 'views'));
shiphero.set('view engine', 'jade');

shiphero.use(logger('dev'));
shiphero.use(express.json());
shiphero.use(express.urlencoded({extended: false}));
shiphero.use(cookieParser());
shiphero.use(express.static(path.join(__dirname, 'public')));

shiphero.use(config.apiRoot, indexRouter);
shiphero.use(config.apiRoot + 'users', usersRouter);
shiphero.use(config.apiRoot+ 'label', label);

// catch 404 and forward to error handler
shiphero.use(function (req, res, next) {
    next(createError(404));
});

// error handler
shiphero.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

shiphero.set('port', process.env.PORT || 3333);

const server = shiphero.listen(shiphero.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

module.exports = shiphero;
