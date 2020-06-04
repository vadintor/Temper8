"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var express = require("express");
var router = express.Router();
var logger_1 = require("./../logger");
var usb_controller_1 = require("../models/usb-controller");
router.post('/', cors_1.default(), function (_req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(404);
    var response = [];
    if (_req.query.level) {
        var level = _req.query.level;
        logger_1.log.debug('/settings _req.query.level: ' + level);
        if (level && (level === 'debug' || level === 'info' || level === 'warn' || level === 'error')) {
            logger_1.log.info('/settings log level: ' + level);
            logger_1.setLevel(level);
            response.push({ level: level });
            res.status(200);
        }
        else {
            logger_1.log.debug('/settings level not set: ' + level);
        }
    }
    if (_req.query.interval) {
        try {
            var interval = _req.query.interval;
            logger_1.log.debug('/settings _req.query.interval:' + interval);
            if (1 <= interval && interval <= 60 * 60) {
                var ms = 1000 * interval;
                logger_1.log.debug('/settings interval ms: ' + ms);
                usb_controller_1.USBController.setPollingInterval(ms);
                response.push({ interval: interval });
                res.status(200);
                logger_1.log.info('/settings interval set: ' + interval);
            }
            else {
                logger_1.log.warn('/settings interval out of range: ' + _req.query.interval);
            }
        }
        catch (e) {
            logger_1.log.debug('/settings interval not set: ' + _req.query.interval);
        }
    }
    res.send(response);
});
router.get('/', function (_req, res) {
    var response = [];
    response.push({ level: logger_1.getLevel() });
    response.push({ interval: usb_controller_1.USBController.getPollingInterval() / 1000 });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(response);
});
exports.default = router;
//# sourceMappingURL=settings.js.map