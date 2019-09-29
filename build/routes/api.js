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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBR0EsaUNBQW9DO0FBQ3BDLElBQU0sTUFBTSxHQUFtQixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDaEQsOENBQXdCO0FBRXhCLDJEQUF5RDtBQUV6RCxzQ0FBa0M7QUFFbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsY0FBSSxFQUFFLEVBQUUsVUFBQyxJQUFxQixFQUFFLEdBQXFCO0lBRWpFLElBQU0sWUFBWSxHQUNsQiw4QkFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sSUFBRyxPQUFBLE1BQU0sQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUE3QixDQUE2QixDQUFDLENBQUM7SUFFeEUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUNsRCxJQUFJLFlBQVksRUFBRTtRQUNkLElBQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzRCxZQUFHLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRTlELFlBQUcsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDL0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0tBRXBEO1NBQU07UUFDSCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekMsWUFBRyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0tBQzlDO0FBRUwsQ0FBQyxDQUFDLENBQUM7QUFHSCxrQkFBZSxNQUFNLENBQUMiLCJmaWxlIjoicm91dGVzL2FwaS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEdFVCBzZW5zb3IgZGF0YS5cclxuICovXHJcbmltcG9ydCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG5jb25zdCByb3V0ZXI6IGV4cHJlc3MuUm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XHJcblxyXG5pbXBvcnQgeyBVU0JDb250cm9sbGVyIH0gZnJvbSAnLi4vbW9kZWxzL3VzYi1jb250cm9sbGVyJztcclxuXHJcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vLi4vbG9nZ2VyJztcclxuXHJcbnJvdXRlci5nZXQoJy8nLCBjb3JzKCksIChfcmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSkgPT4ge1xyXG5cclxuICAgIGNvbnN0IHNlbnNvckxvZ2dlciA9XHJcbiAgICBVU0JDb250cm9sbGVyLmdldExvZ2dlcnMoKS5maW5kKGxvZ2dlcj0+IGxvZ2dlci5nZXRTdGF0ZSAhPT0gdW5kZWZpbmVkKTtcclxuXHJcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgaWYgKHNlbnNvckxvZ2dlcikge1xyXG4gICAgICAgIGNvbnN0IHNlbnNvckRhdGEgPSBzZW5zb3JMb2dnZXIuZ2V0U3RhdGUoKS5nZXRTZW5zb3JEYXRhKCk7XHJcbiAgICAgICAgbG9nLmRlYnVnKCdhcGkucm91dGVyLmdldDogc3RhdGU6ICcsIHNlbnNvckxvZ2dlci5nZXRTdGF0ZSgpKTtcclxuXHJcbiAgICAgICAgbG9nLmRlYnVnKCdhcGkucm91dGVyLmdldDogZGF0YT0nLCBzZW5zb3JEYXRhKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChKU09OLnN0cmluZ2lmeShzZW5zb3JEYXRhKSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChKU09OLnN0cmluZ2lmeShbXSkpO1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnYXBpLnJvdXRlci5nZXQ6IG5vIHNlbnNvciBsb2cnKTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuXHJcbiJdfQ==
