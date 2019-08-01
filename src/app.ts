import * as cors from 'cors';
import express = require('express');
import * as http from 'http';
import path = require('path');

import route_api from './routes/api';
import route_index from './routes/index';
import route_settings from './routes/settings';

import { USBController } from './models/usb-controller';

import { log } from './logger';

const app: express.Express = express();
// TODO: CORS hardening
app.use(cors());
app.options('*', cors());
app.disable('etag');

USBController.initializeDevices();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', route_index);
app.use('/api', route_api);
app.use('/settings', route_settings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    if (req) {
        // To be implemented
    }
    if (res) {
        // To be implemented
    }
    const err: any = new Error('Not Found at server');
    err['status'] = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req: any, res: any, next: any) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err});
        if (next) {
            // to be implemented
        }
        if (req) {
            // to be implemented
        }
    });
}

// production error handler
// no stack traces leaked to user
app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}});
    if (next) {
        // to be implemented
    }
    if (req) {
        // to be implemented
    }
});

app.set('port', process.env.PORT || 80);

const server: http.Server = app.listen(app.get('port'), function() {
    log.info('iTemper listening on port ' + server.address().port);
});

export default server;
