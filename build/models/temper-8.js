"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sensor_attributes_1 = require("./sensor-attributes");
var sensor_state_1 = require("./sensor-state");
var settings_1 = require("./settings");
var logger_1 = require("../logger");
var Temper8 = (function (_super) {
    __extends(Temper8, _super);
    function Temper8(config) {
        var _this = _super.call(this, new sensor_attributes_1.SensorAttributes(Temper8.SN(config), Temper8.model(config), sensor_attributes_1.SensorCategory.Temperature, 0.5, 1, 0.2)) || this;
        _this.nextSensor = 0;
        settings_1.Settings.onChange(settings_1.Settings.SERIAL_NUMBER, function (setting) {
            _this.attr.SN = setting.value.toString();
            logger_1.log.debug('SensorLog.settingChanged: SERIAL_NUMBER=' + _this.attr.SN);
        });
        return _this;
    }
    Temper8.model = function (config) {
        return config.manufacturer || '' + config.product || 'Temper 8';
    };
    Temper8.SN = function (config) {
        return config.serialNumber || settings_1.Settings.get(settings_1.Settings.SERIAL_NUMBER).value.toString();
    };
    Temper8.prototype.initWriteReport = function () {
        this.nextSensor = 0;
        return [this.usedPortsRequest(), this.temperatureRequest(this.nextSensor)];
    };
    Temper8.prototype.readReport = function (data) {
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
                throw Error('*** Temper8.matchCheckFF');
            }
        }
        catch (e) {
            logger_1.log.error(e);
        }
        return [];
    };
    Temper8.prototype.usedPortsRequest = function () {
        return [0x01, 0x8A, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00];
    };
    Temper8.prototype.getUsedPorts = function (total, used) {
        var usedPorts = new Array(total);
        var bits = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80];
        var portIndex = 0;
        for (var bit = 0; bit < bits.length; bit++) {
            if ((used & bits[bit]) === bits[bit]) {
                var port = bit;
                usedPorts[portIndex] = port;
                logger_1.log.debug('+++ Temper8: Sensor connected to port: ' + port);
                portIndex += 1;
            }
        }
        return usedPorts;
    };
    Temper8.prototype.matchUsedPorts = function (data) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x01) {
            this.connectSensors(this.getUsedPorts(data[4], data[5]));
            return true;
        }
        else {
            return false;
        }
    };
    Temper8.prototype.temperatureRequest = function (port) {
        return [0x01, 0x80, 0x01, 0x00, 0x00, port, 0x00, 0x00];
    };
    Temper8.prototype.matchTemperature = function (data) {
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
        var result = 1;
        if ((reading & 0x8000) > 0) {
            reading = (reading ^ 0xffff) + 1;
            result = -1;
        }
        temperature = result * reading / 16.0;
        return temperature;
    };
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
//# sourceMappingURL=temper-8.js.map