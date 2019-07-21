"use strict";
exports.__esModule = true;
var logger_1 = require("./../logger");
var sensor_data_1 = require("./sensor-data");
var Sensor = /** @class */ (function () {
    function Sensor() {
    }
    return Sensor;
}());
exports.Sensor = Sensor;
var SensorState = /** @class */ (function () {
    function SensorState() {
        // or a humidity sensor, but the latter is out of scope.
        this.sensors = [];
        // private  usedPorts: number[];
        this.sensorDataListeners = [];
    }
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
    SensorState.prototype.round = function (data, resolution) {
        var multiplier = Math.pow(10, resolution || 0);
        return Math.round(data.getValue() * multiplier) / multiplier;
    };
    SensorState.prototype.valueDiff = function (sensorData, previousData, resolution) {
        var valueDiff = Math.abs(this.round(sensorData, resolution) - this.round(previousData, resolution));
        logger_1.log.debug('value diff', valueDiff);
        return valueDiff > 0;
    };
    SensorState.prototype.timeDiff = function (sensorData, previousData, maxTimeDiff) {
        var timeDiff = sensorData.timestamp() - previousData.timestamp();
        logger_1.log.debug('Time diff: ', timeDiff);
        return timeDiff > maxTimeDiff;
    };
    SensorState.prototype.filterPort = function (sensorData, filter) {
        return filter.ports ? filter.ports.find(function (port) { return port === sensorData.getPort(); }) !== undefined : true;
    };
    SensorState.prototype.updateSensorDataListeners = function (sensorData, previousData) {
        logger_1.log.debug('updateSensorDataListeners');
        for (var _i = 0, _a = this.sensorDataListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            logger_1.log.debug('updateSensorDataListeners, filter:', listener.filter);
            if (!listener.filter) {
                logger_1.log.debug('updateSensorDataListeners, no filter found');
                listener.publish(sensorData);
                Object.assign(previousData, sensorData);
                return;
            }
            else if (this.filterPort(sensorData, listener.filter) &&
                listener.filter.resolution &&
                this.valueDiff(sensorData, previousData, listener.filter.resolution) && sensorData.valid()) {
                logger_1.log.debug('updateSensorDataListeners, publish.filter.resolution');
                listener.publish(sensorData);
                Object.assign(previousData, sensorData);
            }
            else if (this.filterPort(sensorData, listener.filter) &&
                listener.filter.maxTimeDiff && sensorData.valid() &&
                this.timeDiff(sensorData, previousData, listener.filter.maxTimeDiff)) {
                logger_1.log.debug('updateSensorDataListeners, publish.filter.maxTimeDiff');
                listener.publish(sensorData);
                Object.assign(previousData, sensorData);
            }
            else if (this.filterPort(sensorData, listener.filter)) {
                logger_1.log.debug('updateSensorDataListeners, publish.filter.port');
                listener.publish(sensorData);
                Object.assign(previousData, sensorData);
            }
        }
    };
    SensorState.prototype.updateSensor = function (port, temperature) {
        if (this.sensors !== null) {
            var sensor = this.sensors.find(function (s) { return s.s.getPort() === port; });
            if (sensor) {
                sensor.s.setValue(temperature);
                this.updateSensorDataListeners(sensor.s, sensor.p);
                logger_1.log.debug('SensorState.updateSensor, port: %d, temperature %d', port, temperature);
            }
            else {
                logger_1.log.error('*** SensorState.updateSensor, undefined, port: %d, temperature %d', port, temperature);
            }
        }
        else {
            logger_1.log.error('*** SensorState.updateSensor, no sensors, port: %d, temperature %d', port, temperature);
        }
    };
    SensorState.prototype.connectSensors = function (total, used) {
        logger_1.log.debug('--- connectSensors, total:%d', total);
        if (this.sensors.length === 0) {
            this.sensors = new Array(total);
            logger_1.log.debug('connectSensors, this.sensors.length: ', this.sensors.length);
            var bits = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80];
            var sensorIndex = 0;
            // Check the bit array for used ports, one bit at a time
            for (var bit = 0; bit < bits.length; bit++) {
                if ((used & bits[bit]) === bits[bit]) {
                    var port = bit;
                    logger_1.log.debug('--- connectSensors, port: ', port);
                    this.sensors[sensorIndex] = { p: new sensor_data_1.SensorData(port), s: new sensor_data_1.SensorData(port) };
                    logger_1.log.debug('+++ connectSensors, port: %d', port);
                    sensorIndex += 1;
                }
            }
            if (sensorIndex !== total) {
                // TODO: Error handling
                logger_1.log.error('*** connectSensors, #sensors: %d !== total: %d', sensorIndex, total);
                return;
            }
        }
    };
    return SensorState;
}());
exports.SensorState = SensorState;
