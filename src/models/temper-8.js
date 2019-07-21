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
// Temper8 parser understands HID reports from Temper8 devices
// Independent of USB lib used.
var Temper8 = /** @class */ (function (_super) {
    __extends(Temper8, _super);
    function Temper8() {
        // Device has 8 ports, each of which can hold a 1-wire temperature sensor
        // The sensors are polled in sequence, starting from port 0 to port 7.
        // We do not know how many sensors are connected until we received the config
        // in a USB HID report
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Track what sensor we should request value from next time
        _this.nextSensor = 0;
        return _this;
    }
    // Interface methods implementation
    Temper8.prototype.initReport = function () {
        // This starts the polling. First we ask the device about sensors attached configuration
        // We also request temperature from port zero (for the sake of it, unclear reason)
        this.nextSensor = 0;
        return [this.usedPortsRequest(), this.temperatureRequest(this.nextSensor)];
    };
    // This function parses all input reports and check what to do
    // We are interested in two types of data from the device: which ports are used and
    // the temperature of the sensors connected.
    Temper8.prototype.parseInput = function (data) {
        try {
            if (this.matchUsedPorts(data)) {
                logger_1.log.debug('+++ Temper8.matchUsedPorts:', data);
                var response = this.temperatureRequest(this.sensors[this.nextSensor].s.getPort());
                this.nextSensor += 1;
                return response;
            }
            else if (this.matchTemperature(data)) {
                logger_1.log.debug('+++ Temper8.matchTemperature:', data);
                if (this.nextSensor < this.sensors.length) {
                    var response = this.temperatureRequest(this.sensors[this.nextSensor].s.getPort());
                    this.nextSensor += 1;
                    return response;
                }
                else {
                    this.nextSensor = 0;
                    return this.check03Request();
                }
            }
            else if (this.matchCheck03(data)) {
                return this.check05Request();
            }
            else if (this.matchCheck05(data)) {
                return this.check0DRequest();
            }
            else if (this.matchCheck0D(data)) {
                return [];
            }
            else if (this.matchCheckFF(data)) {
                logger_1.log.error('*** Temper8.matchCheckFF: restart?');
                // This indicates fault device
                // Don't know whether there is a way to recover
                // Maybe restarting the device is necessary.
                throw Error('*** Temper8.matchCheckFF');
            }
        }
        catch (e) {
            logger_1.log.error(e);
        }
        return [];
    };
    // Temper 8 specific methods
    // Poll used ports
    Temper8.prototype.usedPortsRequest = function () {
        return [0x01, 0x8A, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00];
    };
    Temper8.prototype.matchUsedPorts = function (data) {
        // Make sure the input report states sensors
        // connected to the this. These hex values were found by using using USBlyzer
        // I.e. they might be different on your Device device
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x01) {
            // Byte 4 contains no of sensors and
            // Byte 5 contains a bit array of connected sensors
            this.connectSensors(data[4], data[5]);
            return true;
        }
        else {
            return false;
        }
    };
    // Poll temperature and update sensor data
    Temper8.prototype.temperatureRequest = function (port) {
        return [0x01, 0x80, 0x01, 0x00, 0x00, port, 0x00, 0x00];
    };
    Temper8.prototype.matchTemperature = function (data) {
        // get the temperature and update sensor value
        // Make sure the HID input report is a temperature report,
        // These hex values were found by analyzing USB using USBlyzer.
        // I.e. they might be different on your Device device
        // byte 4 contains the port number.
        if (data.length === 8
            && data[0] === 0x80
            && data[1] === 0x08
            && data[2] === 0x01) {
            logger_1.log.debug('+++ matchTemperature, data: %d', data);
            var port = data[4];
            var msb = data[5];
            var lsb = data[6];
            var temperatureCelsius = this.GetTemperature(msb, lsb);
            this.updateSensor(port, temperatureCelsius);
            return true;
        }
        else {
            return false;
        }
    };
    Temper8.prototype.GetTemperature = function (msb, lsb) {
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
        // The east significant bit is 2^-4 so we need to divide by 16 to get absolute temperature in Celsius
        // Multiply in the result to get whether the temperature is below zero degrees and convert to
        // floating point
        temperature = result * reading / 16.0;
        return temperature;
    };
    // Poll checks
    Temper8.prototype.check03Request = function () {
        return [0x01, 0x8A, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00];
    };
    Temper8.prototype.matchCheck03 = function (data) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x03) {
            return true;
        }
        else {
            return false;
        }
    };
    Temper8.prototype.check05Request = function () {
        return [0x01, 0x8A, 0x01, 0x05, 0x00, 0x00, 0x00, 0x00];
    };
    Temper8.prototype.matchCheck05 = function (data) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x05) {
            return true;
        }
        else {
            return false;
        }
    };
    Temper8.prototype.check0DRequest = function () {
        return [0x01, 0x8A, 0x01, 0x0D, 0x00, 0x00, 0x00, 0x00];
    };
    Temper8.prototype.matchCheck0D = function (data) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x0D) {
            return true;
        }
        else {
            return false;
        }
    };
    // private  checkFFRequest() {
    //     return [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
    // }
    Temper8.prototype.matchCheckFF = function (data) {
        if (data.length === 8
            && data[0] === 0xFF
            && data[1] === 0xFF
            && data[2] === 0xFF
            && data[3] === 0xFF) {
            return true;
        }
        else {
            return false;
        }
    };
    return Temper8;
}(sensor_state_1.SensorState));
exports.Temper8 = Temper8;
