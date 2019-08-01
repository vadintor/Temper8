"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var usb_controller_1 = require("../models/usb-controller");
var logger_1 = require("./../logger");
router.get('/', function (_req, res) {
    logger_1.log.debug('GET /');
    var sensorLogger = usb_controller_1.USBController.getLoggers()
        .find(function (logger) { return logger.getState !== undefined; });
    if (sensorLogger && sensorLogger.getState()) {
        var sensorData = sensorLogger.getState().getSensorData();
        var sensorDataString = JSON.stringify(sensorData);
        logger_1.log.debug('GET / Sensor data found');
        res.render('index', {
            title: 'Sensor Data',
            data: sensorDataString,
        });
    }
    else {
        logger_1.log.debug('GET / Sensor data NOT found');
        res.render('index', {
            title: 'Sensor data',
            data: 'not found',
        });
    }
});
exports.default = router;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxpQ0FBb0M7QUFDcEMsSUFBTSxNQUFNLEdBQW1CLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVoRCwyREFBeUQ7QUFFekQsc0NBQWtDO0FBRWxDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFVBQUMsSUFBcUIsRUFBRSxHQUFxQjtJQUN6RCxZQUFHLENBQUMsS0FBSyxDQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRXBCLElBQU0sWUFBWSxHQUFHLDhCQUFhLENBQUMsVUFBVSxFQUFFO1NBQzFDLElBQUksQ0FBQyxVQUFBLE1BQU0sSUFBRyxPQUFBLE1BQU0sQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUE3QixDQUE2QixDQUFDLENBQUM7SUFHbEQsSUFBSSxZQUFZLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQ3pDLElBQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMzRCxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEQsWUFBRyxDQUFDLEtBQUssQ0FBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFO1lBQ2hCLEtBQUssRUFBRSxhQUFhO1lBQ3BCLElBQUksRUFBRSxnQkFBZ0I7U0FDekIsQ0FBQyxDQUFDO0tBRU47U0FBTTtRQUNILFlBQUcsQ0FBQyxLQUFLLENBQUUsNkJBQTZCLENBQUMsQ0FBQztRQUMxQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtZQUNoQixLQUFLLEVBQUUsYUFBYTtZQUNwQixJQUFJLEVBQUUsV0FBVztTQUNwQixDQUFDLENBQUM7S0FDTjtBQUVMLENBQUMsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsTUFBTSxDQUFDIiwiZmlsZSI6InJvdXRlcy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEdFVCBob21lIHBhZ2UuXHJcbiAqL1xyXG5pbXBvcnQgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcclxuY29uc3Qgcm91dGVyOiBleHByZXNzLlJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG5pbXBvcnQgeyBVU0JDb250cm9sbGVyIH0gZnJvbSAnLi4vbW9kZWxzL3VzYi1jb250cm9sbGVyJztcclxuXHJcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vLi4vbG9nZ2VyJztcclxuXHJcbnJvdXRlci5nZXQoJy8nLCAoX3JlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UpID0+IHtcclxuICAgIGxvZy5kZWJ1ZyAoJ0dFVCAvJyk7XHJcblxyXG4gICAgY29uc3Qgc2Vuc29yTG9nZ2VyID0gVVNCQ29udHJvbGxlci5nZXRMb2dnZXJzKClcclxuICAgICAgICAuZmluZChsb2dnZXI9PiBsb2dnZXIuZ2V0U3RhdGUgIT09IHVuZGVmaW5lZCk7XHJcblxyXG5cclxuICAgIGlmIChzZW5zb3JMb2dnZXIgJiYgc2Vuc29yTG9nZ2VyLmdldFN0YXRlKCkpIHtcclxuICAgICAgICBjb25zdCBzZW5zb3JEYXRhID0gc2Vuc29yTG9nZ2VyLmdldFN0YXRlKCkuZ2V0U2Vuc29yRGF0YSgpO1xyXG4gICAgICAgIGNvbnN0IHNlbnNvckRhdGFTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShzZW5zb3JEYXRhKTtcclxuICAgICAgICBsb2cuZGVidWcgKCdHRVQgLyBTZW5zb3IgZGF0YSBmb3VuZCcpO1xyXG4gICAgICAgIHJlcy5yZW5kZXIoJ2luZGV4Jywge1xyXG4gICAgICAgICAgICB0aXRsZTogJ1NlbnNvciBEYXRhJyxcclxuICAgICAgICAgICAgZGF0YTogc2Vuc29yRGF0YVN0cmluZyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxvZy5kZWJ1ZyAoJ0dFVCAvIFNlbnNvciBkYXRhIE5PVCBmb3VuZCcpO1xyXG4gICAgICAgIHJlcy5yZW5kZXIoJ2luZGV4Jywge1xyXG4gICAgICAgICAgICB0aXRsZTogJ1NlbnNvciBkYXRhJyxcclxuICAgICAgICAgICAgZGF0YTogJ25vdCBmb3VuZCcsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIl19
