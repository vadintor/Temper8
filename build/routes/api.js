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
        logger_1.log.debug('--- /api.get, state: ', sensorLogger.getState());
        logger_1.log.debug('--- /api.get, data:', sensorData);
        res.status(200).send(JSON.stringify(sensorData));
    }
    else {
        res.status(200).send(JSON.stringify([]));
        console.log('--- /api.get:', JSON.stringify([]));
    }
});
exports.default = router;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0EsaUNBQW9DO0FBQ3BDLElBQU0sTUFBTSxHQUFtQixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEQsOENBQXdCO0FBRXhCLDJEQUF5RDtBQUV6RCxzQ0FBa0M7QUFFbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsY0FBSSxFQUFFLEVBQUUsVUFBQyxJQUFxQixFQUFFLEdBQXFCO0lBRWpFLElBQU0sWUFBWSxHQUNsQiw4QkFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sSUFBRyxPQUFBLE1BQU0sQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUE3QixDQUE2QixDQUFDLENBQUM7SUFFeEUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUNsRCxJQUFJLFlBQVksRUFBRTtRQUNkLElBQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzRCxZQUFHLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRTVELFlBQUcsQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDN0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0tBRXBEO1NBQU07UUFDSCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3BEO0FBRUwsQ0FBQyxDQUFDLENBQUM7QUFHSCxrQkFBZSxNQUFNLENBQUMiLCJmaWxlIjoicm91dGVzL2FwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEdFVCBzZW5zb3IgZGF0YS5cclxuICovXHJcbmltcG9ydCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG5jb25zdCByb3V0ZXI6IGV4cHJlc3MuUm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XHJcblxyXG5pbXBvcnQgeyBVU0JDb250cm9sbGVyIH0gZnJvbSAnLi4vbW9kZWxzL3VzYi1jb250cm9sbGVyJztcclxuXHJcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vLi4vbG9nZ2VyJztcclxuXHJcbnJvdXRlci5nZXQoJy8nLCBjb3JzKCksIChfcmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkgPT4ge1xyXG5cclxuICAgIGNvbnN0IHNlbnNvckxvZ2dlciA9XHJcbiAgICBVU0JDb250cm9sbGVyLmdldExvZ2dlcnMoKS5maW5kKGxvZ2dlcj0+IGxvZ2dlci5nZXRTdGF0ZSAhPT0gdW5kZWZpbmVkKTtcclxuXHJcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgaWYgKHNlbnNvckxvZ2dlcikge1xyXG4gICAgICAgIGNvbnN0IHNlbnNvckRhdGEgPSBzZW5zb3JMb2dnZXIuZ2V0U3RhdGUoKS5nZXRTZW5zb3JEYXRhKCk7XHJcbiAgICAgICAgbG9nLmRlYnVnKCctLS0gL2FwaS5nZXQsIHN0YXRlOiAnLCBzZW5zb3JMb2dnZXIuZ2V0U3RhdGUoKSk7XHJcblxyXG4gICAgICAgIGxvZy5kZWJ1ZygnLS0tIC9hcGkuZ2V0LCBkYXRhOicsIHNlbnNvckRhdGEpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKEpTT04uc3RyaW5naWZ5KHNlbnNvckRhdGEpKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKEpTT04uc3RyaW5naWZ5KFtdKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJy0tLSAvYXBpLmdldDonLCBKU09OLnN0cmluZ2lmeShbXSkpO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG5cclxuIl19
