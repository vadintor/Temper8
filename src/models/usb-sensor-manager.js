"use strict";
exports.__esModule = true;
var HID = require("node-hid");
var sensor_attributes_1 = require("./sensor-attributes");
var temper_8_1 = require("./temper-8");
var temper_gold_1 = require("./temper-gold");
var usb_controller_1 = require("./usb-controller");
var sensor_log_1 = require("./sensor-log");
var logger_1 = require("./../logger");
var DeviceConfig = /** @class */ (function () {
    function DeviceConfig() {
    }
    return DeviceConfig;
}());
exports.DeviceConfig = DeviceConfig;
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
var USBSensorManager = /** @class */ (function () {
    function USBSensorManager() {
    }
    USBSensorManager.getLoggers = function () {
        return USBSensorManager.loggers;
    };
    USBSensorManager.factory = function () {
        HID.devices().find(function (device) {
            logger_1.log.debug('device: ', device);
            if (isTemperGold(device) && device.path !== undefined) {
                logger_1.log.info('Sensor TEMPer Gold found: ', device);
                var hid = new HID.HID(device.path);
                var temperGold = new temper_gold_1.TemperGold();
                var attr = {
                    SN: 'TGold',
                    model: 'Temper Gold',
                    category: sensor_attributes_1.SensorCategory.Temperature,
                    accuracy: 2.0,
                    resolution: 1,
                    maxSampleRate: 1
                };
                var logger = new sensor_log_1.SensorLog(attr, temperGold);
                logger.startLogging();
                USBSensorManager.loggers.push(logger);
                var temperGoldDevice = new usb_controller_1.USBController(hid, temperGold);
                USBSensorManager.devices.push(temperGoldDevice);
                // return true;
            }
            else if (isTemper8(device) && device.path !== undefined) {
                logger_1.log.info('Sensor TEMPer 8 found: ', device);
                var hid = new HID.HID(device.path);
                var temper8 = new temper_8_1.Temper8();
                var attr = {
                    SN: 'Temper8',
                    model: 'Temper 8',
                    category: sensor_attributes_1.SensorCategory.Temperature,
                    accuracy: 0.5,
                    resolution: 1,
                    maxSampleRate: 0.2
                };
                var logger = new sensor_log_1.SensorLog(attr, temper8);
                logger.startLogging();
                USBSensorManager.loggers.push(logger);
                var temper8Device = new usb_controller_1.USBController(hid, temper8);
                USBSensorManager.devices.push(temper8Device);
                // return true;
            }
            return false;
        });
        if (USBSensorManager.devices.length === 0) {
            logger_1.log.error('Found 0 devices');
        }
        else {
            logger_1.log.info('Found %d device(s)', USBSensorManager.devices.length);
        }
    };
    USBSensorManager.setPollingInterval = function (ms) {
        logger_1.log.debug('USBSensorManager.setPollingInterval:', ms);
        for (var _i = 0, _a = USBSensorManager.devices; _i < _a.length; _i++) {
            var device = _a[_i];
            logger_1.log.debug('USBSensorManager.setPollingInterval - device');
            device.setPollingInterval(ms);
        }
    };
    USBSensorManager.devices = [];
    USBSensorManager.loggers = [];
    return USBSensorManager;
}());
exports.USBSensorManager = USBSensorManager;
