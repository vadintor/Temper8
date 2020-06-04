"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SensorData = (function () {
    function SensorData(port, value) {
        if (port === void 0) { port = -1; }
        if (value === void 0) { value = 85.0; }
        this.port = -1;
        this.value = 85.0;
        this.date = 0;
        this.port = port;
        this.value = value;
        this.date = Date.now();
    }
    SensorData.prototype.getValue = function () {
        return this.value;
    };
    SensorData.prototype.valid = function () {
        return this.value < 85.0;
    };
    SensorData.prototype.setValue = function (value) {
        this.value = value;
        this.date = Date.now();
    };
    SensorData.prototype.updateValue = function (value) {
        this.value = value;
    };
    SensorData.prototype.setPort = function (port) {
        this.port = port;
    };
    SensorData.prototype.getPort = function () {
        return this.port;
    };
    SensorData.prototype.timestamp = function () {
        return this.date;
    };
    SensorData.prototype.isConnected = function () {
        return this.port >= 0;
    };
    return SensorData;
}());
exports.SensorData = SensorData;
//# sourceMappingURL=sensor-data.js.map