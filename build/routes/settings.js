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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUMsQ0FBQyxDQUFDO0lBQ25DLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxRQUFRLEVBQUcsOEJBQWEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFDLElBQUksRUFBQyxDQUFDLENBQUM7SUFDcEUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUNsRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuQyxDQUFDLENBQUMsQ0FBQztBQUNILGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJyb3V0ZXMvc2V0dGluZ3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBHRVQgc2Vuc29yIGRhdGEuXHJcbiAqL1xyXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcclxuaW1wb3J0IGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbmNvbnN0IHJvdXRlcjogZXhwcmVzcy5Sb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5pbXBvcnQgeyBnZXRMZXZlbCwgbG9nLCBzZXRMZXZlbCB9IGZyb20gJy4vLi4vbG9nZ2VyJztcclxuXHJcbmltcG9ydCB7IFVTQkNvbnRyb2xsZXIgfSBmcm9tICcuLi9tb2RlbHMvdXNiLWNvbnRyb2xsZXInO1xyXG5cclxucm91dGVyLnBvc3QoJy8nLCBjb3JzKCksIChfcmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkgPT4ge1xyXG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgIHJlcy5zdGF0dXMoNDA0KTtcclxuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIGlmIChfcmVxLnF1ZXJ5LmxldmVsKSB7XHJcbiAgICAgICAgY29uc3QgbGV2ZWwgPSBfcmVxLnF1ZXJ5LmxldmVsO1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnL3NldHRpbmdzIF9yZXEucXVlcnkubGV2ZWw6ICcgKyBsZXZlbCk7XHJcbiAgICAgICAgaWYgKGxldmVsICYmIChsZXZlbCA9PT0gJ2RlYnVnJyB8fCBsZXZlbCA9PT0gJ2luZm8nIHx8IGxldmVsID09PSAnd2FybicgfHwgbGV2ZWwgPT09ICdlcnJvcicpKSB7XHJcbiAgICAgICAgICAgIGxvZy5pbmZvKCcvc2V0dGluZ3MgbG9nIGxldmVsOiAnICsgbGV2ZWwpO1xyXG4gICAgICAgICAgICBzZXRMZXZlbChsZXZlbCk7XHJcbiAgICAgICAgICAgIHJlc3BvbnNlLnB1c2goe2xldmVsfSk7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJy9zZXR0aW5ncyBsZXZlbCBub3Qgc2V0OiAnICsgIGxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKF9yZXEucXVlcnkuaW50ZXJ2YWwpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbDogbnVtYmVyID0gX3JlcS5xdWVyeS5pbnRlcnZhbDtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKCcvc2V0dGluZ3MgX3JlcS5xdWVyeS5pbnRlcnZhbDonICsgaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICBpZiAoMSA8PSBpbnRlcnZhbCAmJiBpbnRlcnZhbCA8PSA2MCAqIDYwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtczogbnVtYmVyID0gMTAwMCAqIGludGVydmFsO1xyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCcvc2V0dGluZ3MgaW50ZXJ2YWwgbXM6ICcgKyBtcyk7XHJcbiAgICAgICAgICAgICAgICBVU0JDb250cm9sbGVyLnNldFBvbGxpbmdJbnRlcnZhbChtcyk7XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZS5wdXNoKHtpbnRlcnZhbH0pO1xyXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cygyMDApO1xyXG4gICAgICAgICAgICAgICAgbG9nLmluZm8oJy9zZXR0aW5ncyBpbnRlcnZhbCBzZXQ6ICcgKyBpbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2cud2FybignL3NldHRpbmdzIGludGVydmFsIG91dCBvZiByYW5nZTogJyArICBfcmVxLnF1ZXJ5LmludGVydmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2goZSkge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJy9zZXR0aW5ncyBpbnRlcnZhbCBub3Qgc2V0OiAnICsgIF9yZXEucXVlcnkuaW50ZXJ2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXMuc2VuZChyZXNwb25zZSk7XHJcbn0pO1xyXG5cclxucm91dGVyLmdldCgnLycsIChfcmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkgPT4ge1xyXG4gICAgY29uc3QgcmVzcG9uc2U6IGFueVtdID0gW107XHJcbiAgICByZXNwb25zZS5wdXNoKHtsZXZlbDogZ2V0TGV2ZWwoKX0pO1xyXG4gICAgcmVzcG9uc2UucHVzaCh7aW50ZXJ2YWw6ICBVU0JDb250cm9sbGVyLmdldFBvbGxpbmdJbnRlcnZhbCgpLzEwMDB9KTtcclxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbihyZXNwb25zZSk7XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcblxyXG4iXX0=
