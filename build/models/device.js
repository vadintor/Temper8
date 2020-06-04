"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var device_checks_1 = require("./device-checks");
var device_log_1 = require("./device-log");
var logger_1 = require("../logger");
var Device = (function () {
    function Device() {
    }
    Device.getLoggers = function () {
        return Device.loggers;
    };
    Device.initialize = function () {
        logger_1.log.info('Device.initialize: start time=' + new Date().toISOString());
        var deviceChecks = new device_checks_1.DeviceChecks();
        Device.checks.push(deviceChecks);
        Device.createDeviceLog(deviceChecks);
        logger_1.log.debug('Device.initialize POLLING INTERVAL=' + Device.POLL_INTERVAL);
        Device.deviceInitialized = true;
        Device.startPolling();
        logger_1.log.info('Device.initialize done');
    };
    Device.createDeviceLog = function (DeviceState) {
        var deviceLog = new device_log_1.DeviceLog(DeviceState);
        Device.loggers.push(deviceLog);
        deviceLog.startLogging();
    };
    Device.startPolling = function () {
        clearInterval(Device.timer);
        Device.timer = setInterval(Device.poll, Device.POLL_INTERVAL);
        logger_1.log.info('Device.startPolling: ' + Device.POLL_INTERVAL + ' ms');
    };
    Device.poll = function () {
        if (!Device.deviceInitialized) {
            Device.initialize();
        }
        else {
            logger_1.log.debug('Device.poll');
            for (var _i = 0, _a = Device.checks; _i < _a.length; _i++) {
                var check = _a[_i];
                check.check();
            }
        }
    };
    Device.loggers = [];
    Device.checks = [];
    Device.POLL_INTERVAL = 60000;
    Device.deviceInitialized = false;
    return Device;
}());
exports.Device = Device;
//# sourceMappingURL=device.js.map