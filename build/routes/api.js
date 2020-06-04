"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var cors_1 = __importDefault(require("cors"));
var usb_controller_1 = require("../models/usb-controller");
var logger_1 = require("./../logger");
router.get('/', cors_1.default(), function (_req, res) {
    var sensorLogger = usb_controller_1.USBController.getLoggers().find(function (logger) { return logger.getState !== undefined; });
    res.setHeader('Content-Type', 'application/json');
    if (sensorLogger) {
        var sensorData = sensorLogger.getState().getSensorData();
        logger_1.log.debug('api.router.get: state: ', sensorLogger.getState());
        logger_1.log.debug('api.router.get: data=', sensorData);
        res.status(200).send(JSON.stringify(sensorData));
    }
    else {
        res.status(200).send(JSON.stringify([]));
        logger_1.log.debug('api.router.get: no sensor log');
    }
});
exports.default = router;
//# sourceMappingURL=api.js.map