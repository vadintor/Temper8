"use strict";
exports.__esModule = true;
var cors = require("cors");
var express = require("express");
var path = require("path");
var api_1 = require("./routes/api");
var index_1 = require("./routes/index");
var settings_1 = require("./routes/settings");
var usb_sensor_manager_1 = require("./models/usb-sensor-manager");
var logger_1 = require("./logger");
var app = express();
// TODO: CORS hardening
app.use(cors());
app.options('*', cors());
app.disable('etag');
usb_sensor_manager_1.USBSensorManager.factory();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_1["default"]);
app.use('/api', api_1["default"]);
app.use('/settings', settings_1["default"]);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found at server');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stack traces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.set('port', process.env.PORT || 80);
var server = app.listen(app.get('port'), function () {
    logger_1.log.info('iTemper listening on port ' + server.address().port);
});
