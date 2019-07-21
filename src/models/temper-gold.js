"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var sensor_state_1 = require("./sensor-state");
var logger_1 = require("./../logger");
// Temper Gold parser understands HID reports from Temper8 devices
// Independent of USB lib used.
var TemperGold = /** @class */ (function (_super) {
    __extends(TemperGold, _super);
    // Interface methods implementation
    function TemperGold() {
        var _this = _super.call(this) || this;
        _this.connectSensors(1, 1);
        return _this;
    }
    TemperGold.prototype.initReport = function () {
        return [this.temperatureRequest()];
    };
    // This function parses all input reports and check what to do
    TemperGold.prototype.parseInput = function (data) {
        try {
            logger_1.log.debug('--- TemperGold.parseInput:', data);
            if (!this.matchTemperature(data)) {
                logger_1.log.warning('*** no match: ', data);
            }
        }
        catch (e) {
            console.log(e);
        }
        return [];
    };
    // Poll temperature and update sensor data
    // byte string for requesting the temperature from Temper Gold
    TemperGold.prototype.temperatureRequest = function () {
        return [0x01, 0x80, 0x33, 0x01, 0x00, 0x00, 0x00, 0x00];
    };
    // This methods update sensor state if data contains the temperature byte string
    TemperGold.prototype.matchTemperature = function (data) {
        // Make sure the input report is a temperature report,
        // These hex values were found by analyzing USB using USBlyzer.
        // I.e. they might be different on your Device device
        if (data.length === 8
            && data[0] === 0x80
            && data[1] === 0x02) {
            logger_1.log.debug('+++ TemperGold.matchTemperature:', data);
            var msb = data[2];
            var lsb = data[3];
            var temperatureCelsius = this.GetTemperature(msb, lsb);
            var port = 0;
            this.updateSensor(port, temperatureCelsius);
            return true;
        }
        else {
            return false;
        }
    };
    TemperGold.prototype.GetTemperature = function (msb, lsb) {
        var temperature = 0.0;
        var reading = (lsb & 0xFF) + (msb << 8);
        // Assume positive temperature value
        var result = 1;
        if ((reading & 0x8000) > 0) {
            // Below zero
            // get the absolute value by converting two's complement
            reading = (reading ^ 0xffff) + 1;
            // Remember a negative result
            result = -1;
        }
        // The least significant bit is 2^-8 so we need to divide by 256 to get absolute temperature in Celsius
        // Then we multiply in the result to get whether the temperature is below zero degrees. We convert to
        // floating point in the process.
        temperature = result * reading / 256.0;
        return temperature;
    };
    return TemperGold;
}(sensor_state_1.SensorState));
exports.TemperGold = TemperGold;
