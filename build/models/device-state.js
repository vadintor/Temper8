"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var device_data_1 = require("./device-data");
var logger_1 = require("../logger");
var settings_1 = require("./settings");
var DeviceState = (function () {
    function DeviceState() {
        this.deviceDataListeners = [];
        this.previousData = new device_data_1.DeviceData();
        settings_1.Settings.onChange(settings_1.Settings.HOSTNAME, this.hostnameChanged.bind(this));
    }
    DeviceState.prototype.getDeviceData = function () {
        return this.deviceData;
    };
    DeviceState.prototype.addDeviceDataListener = function (onDeviceDataReceived) {
        this.deviceDataListeners.push({ publish: onDeviceDataReceived });
    };
    DeviceState.prototype.hostnameChanged = function (setting) {
        var hostname = setting.value;
        logger_1.log.info('DeviceState. hostnameChanged to ' + hostname);
    };
    DeviceState.prototype.updateDeviceDataListeners = function (deviceData, previousData) {
        var published = false;
        logger_1.log.debug('DeviceState.updateDeviceDataListeners: no filtering before publishing');
        for (var _i = 0, _a = this.deviceDataListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener.publish(deviceData);
            published = true;
            logger_1.log.debug('DeviceState.updateDeviceDataListeners, previousData=' + previousData);
            logger_1.log.debug('DeviceState.updateDeviceDataListeners, deviceData=' + deviceData);
            Object.assign(previousData, deviceData);
        }
        if (published) {
            logger_1.log.info('DeviceState.updateDeviceDataListeners: Device data published to listener(s)');
        }
        else {
            logger_1.log.debug('DeviceState.updateDeviceDataListeners: No device data published');
        }
    };
    DeviceState.prototype.updateDeviceData = function (data) {
        this.deviceData = data;
        this.updateDeviceDataListeners(data, this.previousData);
        logger_1.log.info('DeviceState.updateDeviceData: device data updated' + data.timestamp);
    };
    return DeviceState;
}());
exports.DeviceState = DeviceState;
//# sourceMappingURL=device-state.js.map