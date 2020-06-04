"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./../logger");
var sensor_data_1 = require("./sensor-data");
var settings_1 = require("./settings");
var Sensor = (function () {
    function Sensor() {
    }
    return Sensor;
}());
exports.Sensor = Sensor;
var SensorState = (function () {
    function SensorState(attr) {
        this.sensors = [];
        this.sensorDataListeners = [];
        this.attr = attr;
        settings_1.Settings.onChange(settings_1.Settings.SERIAL_NUMBER, this.SNChanged.bind(this));
    }
    SensorState.prototype.getAttr = function () {
        return this.attr;
    };
    SensorState.prototype.setAttr = function (attr) {
        this.attr = attr;
    };
    SensorState.prototype.maxSampleRate = function () {
        return this.attr.maxSampleRate;
    };
    SensorState.prototype.getSensorData = function () {
        var sensorData = [];
        for (var _i = 0, _a = this.sensors; _i < _a.length; _i++) {
            var sensor = _a[_i];
            sensorData.push(sensor.s);
        }
        return sensorData.slice();
    };
    SensorState.prototype.addSensorDataListener = function (onSensorDataReceived, filter) {
        this.sensorDataListeners.push({ publish: onSensorDataReceived, filter: filter });
    };
    SensorState.prototype.SNChanged = function (setting) {
        var sn = setting.value;
        this.attr.SN = sn;
        logger_1.log.info('SensorState.SNChanged to ' + sn);
    };
    SensorState.prototype.round = function (data, resolution) {
        var multiplier = Math.pow(10, resolution || 0);
        return Math.round(data.getValue() * multiplier) / multiplier;
    };
    SensorState.prototype.valueDiff = function (sensorData, previousData, resolution) {
        var valueDiff = Math.abs(this.round(sensorData, resolution) - this.round(previousData, resolution));
        logger_1.log.debug('SensorState.valueDiff: diff=' + valueDiff);
        return valueDiff > 0;
    };
    SensorState.prototype.timeDiff = function (sensorData, previousData, maxTimeDiff) {
        var timeDiff = sensorData.timestamp() - previousData.timestamp();
        logger_1.log.debug('SensorState.timeDiff diff=' + timeDiff);
        return timeDiff > maxTimeDiff;
    };
    SensorState.prototype.filterPort = function (sensorData, filter) {
        return filter.ports ? filter.ports.find(function (port) { return port === sensorData.getPort(); }) !== undefined : true;
    };
    SensorState.prototype.updateSensorDataListeners = function (sensorData, previousData) {
        var published = false;
        logger_1.log.debug('SensorState.updateSensorDataListeners: filtering before publishing');
        for (var _i = 0, _a = this.sensorDataListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            logger_1.log.debug('SensorState.updateSensorDataListeners: filter:' + JSON.stringify(listener.filter));
            if (!listener.filter) {
                logger_1.log.debug('SensorState.updateSensorDataListeners: no filter found');
                listener.publish(sensorData);
                published = true;
                Object.assign(previousData, sensorData);
            }
            else if (this.filterPort(sensorData, listener.filter) &&
                listener.filter.resolution &&
                this.valueDiff(sensorData, previousData, listener.filter.resolution) && sensorData.valid()) {
                listener.publish(sensorData);
                published = true;
                Object.assign(previousData, sensorData);
            }
            else if (this.filterPort(sensorData, listener.filter) &&
                listener.filter.maxTimeDiff && sensorData.valid() &&
                this.timeDiff(sensorData, previousData, listener.filter.maxTimeDiff)) {
                logger_1.log.debug('SensorState.updateSensorDataListeners: publish.filter.maxTimeDiff');
                listener.publish(sensorData);
                published = true;
                Object.assign(previousData, sensorData);
            }
            else if (this.filterPort(sensorData, listener.filter)) {
                logger_1.log.debug('SensorState.updateSensorDataListeners: publish.filter.port');
                listener.publish(sensorData);
                published = true;
                Object.assign(previousData, sensorData);
            }
        }
        if (published) {
            logger_1.log.info('SensorState.updateSensorDataListeners: Sensor data published to listener(s)');
        }
        else {
            logger_1.log.debug('SensorState.updateSensorDataListeners: No sensor data published');
        }
    };
    SensorState.prototype.updateSensor = function (port, temperature) {
        if (this.sensors !== null) {
            var sensor = this.sensors.find(function (s) { return s.s.getPort() === port; });
            if (sensor) {
                sensor.s.setValue(temperature);
                this.updateSensorDataListeners(sensor.s, sensor.p);
                logger_1.log.info('SensorState.updateSensor: sensor updated, port=' + port + ', temperature=' + temperature);
            }
            else {
                logger_1.log.error('SensorState.updateSensor: undefined port=' + port + ', temperature=' + temperature);
            }
        }
        else {
            logger_1.log.error('SensorState.updateSensor: no sensors, port=' + port + ', temperature=' + temperature);
        }
    };
    SensorState.prototype.connectSensors = function (ports) {
        logger_1.log.debug('SensorState.connectSensors: ports=' + JSON.stringify(ports));
        if (this.sensors.length === 0) {
            this.sensors = new Array(ports.length);
            for (var port = 0; port < ports.length; port++) {
                this.sensors[port] = { p: new sensor_data_1.SensorData(ports[port]), s: new sensor_data_1.SensorData(ports[port]) };
            }
        }
    };
    return SensorState;
}());
exports.SensorState = SensorState;
//# sourceMappingURL=sensor-state.js.map