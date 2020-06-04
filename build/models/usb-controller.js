"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HID = require("node-hid");
var temper_8_1 = require("./temper-8");
var temper_gold_1 = require("./temper-gold");
var usb_device_1 = require("./usb-device");
var sensor_log_1 = require("./sensor-log");
var logger_1 = require("../logger");
var VID = 0x0C45;
var PID = 0x7401;
var TEMPER_GOLD = 'TEMPerV1.4';
var TEMPER_8 = 'TEMPer8_V1.5';
var INTERFACE = 1;
function isTemperGold(device) {
    return (device.vendorId === VID &&
        device.productId === PID &&
        device.product === TEMPER_GOLD &&
        device.interface === INTERFACE);
}
exports.isTemperGold = isTemperGold;
function isTemper8(device) {
    return (device.vendorId === VID &&
        device.productId === PID &&
        device.product === TEMPER_8 &&
        device.interface === INTERFACE);
}
exports.isTemper8 = isTemper8;
var USBController = (function () {
    function USBController() {
    }
    USBController.getLoggers = function () {
        return USBController.loggers;
    };
    USBController.createSensorLog = function (sensorState) {
        var sensorLog = new sensor_log_1.SensorLog(sensorState);
        USBController.loggers.push(sensorLog);
        sensorLog.startLogging();
    };
    USBController.createUSBDevice = function (path, reporter) {
        var hid = new HID.HID(path);
        var usbDevice = new usb_device_1.USBDevice(hid, reporter);
        USBController.devices.push(usbDevice);
    };
    USBController.initialize = function () {
        logger_1.log.info('USBController.initialize: start time=' + new Date().toISOString());
        HID.devices().find(function (device) {
            var deviceStr = JSON.stringify(device);
            if (isTemperGold(device) && device.path !== undefined) {
                logger_1.log.info('USBController.initialize: TEMPer Gold found: ' + deviceStr);
                var sensorState = new temper_gold_1.TemperGold(device);
                USBController.createUSBDevice(device.path, sensorState);
                USBController.createSensorLog(sensorState);
            }
            else if (isTemper8(device) && device.path !== undefined) {
                logger_1.log.info('USBController.initialize sensor TEMPer 8 found: ' + deviceStr);
                var sensorState = new temper_8_1.Temper8(device);
                USBController.createUSBDevice(device.path, sensorState);
                USBController.createSensorLog(sensorState);
            }
            else {
                logger_1.log.debug('USBController.initialize: unsupported USB device found=' + deviceStr);
            }
            return false;
        });
        logger_1.log.info('USBController.initialize: Found ' + USBController.devices.length + ' HID device(s)');
    };
    USBController.setPollingInterval = function (ms) {
        logger_1.log.debug('USBController.setPollingInterval: ms=' + ms);
        for (var _i = 0, _a = USBController.devices; _i < _a.length; _i++) {
            var device = _a[_i];
            device.setPollingInterval(ms);
        }
    };
    USBController.getPollingInterval = function () {
        for (var _i = 0, _a = USBController.devices; _i < _a.length; _i++) {
            var device = _a[_i];
            return device.getPollingInterval();
        }
        return 0;
    };
    USBController.devices = [];
    USBController.loggers = [];
    return USBController;
}());
exports.USBController = USBController;
//# sourceMappingURL=usb-controller.js.map