"use strict";
exports.__esModule = true;
/*
 * GET sensor data.
 */
var express = require("express");
var router = express.Router();
var usb_sensor_manager_1 = require("../models/usb-sensor-manager");
var logger_1 = require("./../logger");
router.get('/', function (_req, res) {
    var sensorLogger = usb_sensor_manager_1.USBSensorManager.getLoggers()
        .find(function (logger) { return logger.getState !== undefined; });
    res.setHeader('Content-Type', 'application/json');
    if (sensorLogger) {
        var sensorData = sensorLogger.getState().getSensorData();
        logger_1.log.debug('--- /api.get, state: ', sensorLogger.getState());
        logger_1.log.debug('--- /api.get, data:', sensorData);
        res.send(JSON.stringify(sensorData));
    }
    else {
        res.send(JSON.stringify([]));
        console.log('--- /api.get:', JSON.stringify([]));
    }
});
router.post('/debug', function (_req, res) {
    res.setHeader('Content-Type', 'application/json');
    var level = _req.query.level;
    if (level && (level === 'debug' || level === 'info' || level === 'warn' || level === 'error')) {
        logger_1.setLevel(level);
        logger_1.log.info('/debug log level:', level);
        res.status(200).send({ level: level });
    }
    else {
        logger_1.log.info('/debug log level not set:', level);
        res.sendStatus(404);
    }
});
exports["default"] = router;
