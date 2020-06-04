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
var TemperGold = (function (_super) {
    __extends(TemperGold, _super);
    function TemperGold(config) {
        var _this = _super.call(this, new sensor_attributes_1.SensorAttributes(TemperGold.SN(config), TemperGold.model(config), sensor_attributes_1.SensorCategory.Temperature, 2.0, 1, 1)) || this;
        _this.connectSensors([0]);
        settings_1.Settings.onChange(settings_1.Settings.SERIAL_NUMBER, function (setting) {
            _this.attr.SN = setting.value.toString();
            logger_1.log.debug('TemperGold.settingChanged: SERIAL_NUMBER=' + _this.attr.SN);
        });
        return _this;
    }
    TemperGold.model = function (config) {
        return config.manufacturer || '' + config.product || 'Temper Gold';
    };
    TemperGold.SN = function (config) {
        return config.serialNumber || settings_1.Settings.get(settings_1.Settings.SERIAL_NUMBER).value.toString();
    };
    TemperGold.prototype.initWriteReport = function () {
        return [this.temperatureRequest()];
    };
    TemperGold.prototype.readReport = function (data) {
        try {
            logger_1.log.debug('TemperGold.readReport: data=', data);
            if (!this.matchTemperature(data)) {
                logger_1.log.warning('TemperGold.readReport: no match data=', data);
            }
        }
        catch (e) {
            console.log(e);
        }
        return [];
    };
    TemperGold.prototype.temperatureRequest = function () {
        return [0x01, 0x80, 0x33, 0x01, 0x00, 0x00, 0x00, 0x00];
    };
    TemperGold.prototype.matchTemperature = function (data) {
        if (data.length === 8
            && data[0] === 0x80
            && data[1] === 0x02) {
            logger_1.log.debug('TemperGold.matchTemperature: data=', data);
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
        var result = 1;
        if ((reading & 0x8000) > 0) {
            reading = (reading ^ 0xffff) + 1;
            result = -1;
        }
        temperature = result * reading / 256.0;
        return temperature;
    };
    return TemperGold;
}(sensor_state_1.SensorState));
exports.TemperGold = TemperGold;
//# sourceMappingURL=temper-gold.js.map