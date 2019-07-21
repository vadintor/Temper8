"use strict";
exports.__esModule = true;
/*
 * GET home page.
 */
var express = require("express");
var router = express.Router();
var sensor_data_1 = require("../models/sensor-data");
var usb_sensor_manager_1 = require("../models/usb-sensor-manager");
var logger_1 = require("./../logger");
router.get('/', function (_req, res) {
    var sensorLogger = usb_sensor_manager_1.USBSensorManager.getLoggers()
        .find(function (logger) { return logger.getState !== undefined; });
    var data = new sensor_data_1.SensorData();
    if (sensorLogger && sensorLogger.getState()) {
        var sensorData = sensorLogger.getState().getSensorData();
        logger_1.log.debug('--- / get, state: ', sensorLogger.getState());
        logger_1.log.debug('--- / get, data:', sensorData);
        Object.assign(data, sensorData);
    }
    res.render('index', {
        title: 'Temperatur',
        port0: data.getPort(),
        value0: data.getValue(),
        date0: new Date(data.timestamp()).toTimeString()
    });
});
exports["default"] = router;
