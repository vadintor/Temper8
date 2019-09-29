"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./../logger");
var sensor_data_1 = require("./sensor-data");
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvc2Vuc29yLXN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtDO0FBRWxDLDZDQUEyQztBQVkzQztJQUFBO0lBQWlFLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FBakUsQUFBa0UsSUFBQTtBQUFyRCx3QkFBTTtBQUNuQjtJQU1JLHFCQUFZLElBQXNCO1FBSnhCLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFFdkIsd0JBQW1CLEdBQXlCLEVBQUUsQ0FBQztRQUdyRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sNkJBQU8sR0FBZDtRQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sNkJBQU8sR0FBZCxVQUFlLElBQXNCO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxtQ0FBYSxHQUFwQjtRQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDbkMsQ0FBQztJQUVNLG1DQUFhLEdBQXBCO1FBQ0ksSUFBTSxVQUFVLEdBQWlCLEVBQUUsQ0FBQztRQUNwQyxLQUFxQixVQUFZLEVBQVosS0FBQSxJQUFJLENBQUMsT0FBTyxFQUFaLGNBQVksRUFBWixJQUFZLEVBQUU7WUFBOUIsSUFBTSxNQUFNLFNBQUE7WUFDYixVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDTSwyQ0FBcUIsR0FBNUIsVUFBNkIsb0JBQWtELEVBQUUsTUFBcUI7UUFDbEcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBRSxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFFBQUEsRUFBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNPLDJCQUFLLEdBQWIsVUFBYyxJ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O0lBQ0wsa0JBQUM7QUFBRCxDQXRIQSxBQXNIQyxJQUFBO0FBdEhZLGtDQUFXIiwiZmlsZSI6Im1vZGVscy9zZW5zb3Itc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBsb2cgfSBmcm9tICcuLy4uL2xvZ2dlcic7XHJcbmltcG9ydCB7IFNlbnNvckF0dHJpYnV0ZXMgfSBmcm9tICcuL3NlbnNvci1hdHRyaWJ1dGVzJztcclxuaW1wb3J0IHsgU2Vuc29yRGF0YSB9IGZyb20gJy4vc2Vuc29yLWRhdGEnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGaWx0ZXJDb25maWcge1xyXG4gICAgcmVzb2x1dGlvbj86IG51bWJlcjtcclxuICAgIG1heFRpbWVEaWZmPzogbnVtYmVyO1xyXG4gICAgcG9ydHM/OiBudW1iZXJbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTZW5zb3JEYXRhTGlzdGVuZXIge1xyXG4gICAgcHVibGlzaDogKHNlbnNvcjogU2Vuc29yRGF0YSkgPT4gdm9pZDtcclxuICAgIGZpbHRlcj86IEZpbHRlckNvbmZpZztcclxufVxyXG5leHBvcnQgY2xhc3MgU2Vuc29yIHsgcHVibGljIHA6IFNlbnNvckRhdGE7IHB1YmxpYyBzOiBTZW5zb3JEYXRhO31cclxuZXhwb3J0IGNsYXNzIFNlbnNvclN0YXRlIHtcclxuICAgIHByb3RlY3RlZCBhdHRyOiBTZW5zb3JBdHRyaWJ1dGVzO1xyXG4gICAgcHJvdGVjdGVkIHNlbnNvcnM6IFNlbnNvcltdID0gW107XHJcblxyXG4gICAgcHJvdGVjdGVkIHNlbnNvckRhdGFMaXN0ZW5lcnM6IFNlbnNvckRhdGFMaXN0ZW5lcltdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXR0cjogU2Vuc29yQXR0cmlidXRlcykge1xyXG4gICAgICAgIHRoaXMuYXR0ciA9IGF0dHI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEF0dHIoKTogU2Vuc29yQXR0cmlidXRlcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0QXR0cihhdHRyOiBTZW5zb3JBdHRyaWJ1dGVzKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hdHRyID0gYXR0cjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbWF4U2FtcGxlUmF0ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF0dHIubWF4U2FtcGxlUmF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U2Vuc29yRGF0YSgpOiBTZW5zb3JEYXRhW10ge1xyXG4gICAgICAgIGNvbnN0IHNlbnNvckRhdGE6IFNlbnNvckRhdGFbXSA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2Vuc29yIG9mIHRoaXMuc2Vuc29ycykge1xyXG4gICAgICAgICAgICBzZW5zb3JEYXRhLnB1c2goc2Vuc29yLnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2Vuc29yRGF0YS5zbGljZSgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFNlbnNvckRhdGFMaXN0ZW5lcihvblNlbnNvckRhdGFSZWNlaXZlZDogKHNlbnNvcjogU2Vuc29yRGF0YSkgPT4gdm9pZCwgZmlsdGVyPzogRmlsdGVyQ29uZmlnKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZW5zb3JEYXRhTGlzdGVuZXJzLnB1c2ggKHtwdWJsaXNoOiBvblNlbnNvckRhdGFSZWNlaXZlZCwgZmlsdGVyfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJvdW5kKGRhdGE6IFNlbnNvckRhdGEsIHJlc29sdXRpb246IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IE1hdGgucG93KDEwLCByZXNvbHV0aW9uIHx8IDApO1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKGRhdGEuZ2V0VmFsdWUoKSAqIG11bHRpcGxpZXIpIC8gbXVsdGlwbGllcjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdmFsdWVEaWZmKHNlbnNvckRhdGE6IFNlbnNvckRhdGEsIHByZXZpb3VzRGF0YTogU2Vuc29yRGF0YSwgcmVzb2x1dGlvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWVEaWZmID0gIE1hdGguYWJzKHRoaXMucm91bmQoc2Vuc29yRGF0YSwgcmVzb2x1dGlvbikgLSB0aGlzLnJvdW5kKHByZXZpb3VzRGF0YSwgcmVzb2x1dGlvbikpO1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUudmFsdWVEaWZmOiBkaWZmPScgKyB2YWx1ZURpZmYpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZURpZmYgPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdGltZURpZmYoc2Vuc29yRGF0YTogU2Vuc29yRGF0YSwgcHJldmlvdXNEYXRhOiBTZW5zb3JEYXRhLCBtYXhUaW1lRGlmZjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdGltZURpZmYgPSBzZW5zb3JEYXRhLnRpbWVzdGFtcCgpIC0gcHJldmlvdXNEYXRhLnRpbWVzdGFtcCgpO1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUudGltZURpZmYgZGlmZj0nICsgdGltZURpZmYpO1xyXG4gICAgICAgIHJldHVybiB0aW1lRGlmZiA+IG1heFRpbWVEaWZmO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaWx0ZXJQb3J0KHNlbnNvckRhdGE6IFNlbnNvckRhdGEsIGZpbHRlcjogRmlsdGVyQ29uZmlnKTogYm9vbGVhbiB7XHJcbiAgICAgICByZXR1cm4gZmlsdGVyLnBvcnRzPyBmaWx0ZXIucG9ydHMuZmluZChwb3J0ID0+IHBvcnQgPT09IHNlbnNvckRhdGEuZ2V0UG9ydCgpKSAhPT0gdW5kZWZpbmVkOiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTZW5zb3JEYXRhTGlzdGVuZXJzKHNlbnNvckRhdGE6IFNlbnNvckRhdGEsIHByZXZpb3VzRGF0YTogU2Vuc29yRGF0YSkge1xyXG4gICAgICAgIGxldCBwdWJsaXNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBsb2cuZGVidWcoJ1NlbnNvclN0YXRlLnVwZGF0ZVNlbnNvckRhdGFMaXN0ZW5lcnM6IGZpbHRlcmluZyBiZWZvcmUgcHVibGlzaGluZycpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5zZW5zb3JEYXRhTGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUudXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVyczogZmlsdGVyOicgKyBKU09OLnN0cmluZ2lmeShsaXN0ZW5lci5maWx0ZXIpKTtcclxuICAgICAgICAgICAgaWYgKCFsaXN0ZW5lci5maWx0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUudXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVyczogbm8gZmlsdGVyIGZvdW5kJyk7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5wdWJsaXNoKHNlbnNvckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcHVibGlzaGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocHJldmlvdXNEYXRhLCBzZW5zb3JEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5maWx0ZXJQb3J0KHNlbnNvckRhdGEsIGxpc3RlbmVyLmZpbHRlcikgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuZmlsdGVyLnJlc29sdXRpb24gJiZcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVEaWZmKHNlbnNvckRhdGEsIHByZXZpb3VzRGF0YSwgbGlzdGVuZXIuZmlsdGVyLnJlc29sdXRpb24pICYmIHNlbnNvckRhdGEudmFsaWQoKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnB1Ymxpc2goc2Vuc29yRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBwdWJsaXNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwcmV2aW91c0RhdGEsIHNlbnNvckRhdGEpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlclBvcnQoc2Vuc29yRGF0YSwgbGlzdGVuZXIuZmlsdGVyKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmZpbHRlci5tYXhUaW1lRGlmZiAmJiBzZW5zb3JEYXRhLnZhbGlkKCkgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVEaWZmKHNlbnNvckRhdGEsIHByZXZpb3VzRGF0YSwgbGlzdGVuZXIuZmlsdGVyLm1heFRpbWVEaWZmKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCdTZW5zb3JTdGF0ZS51cGRhdGVTZW5zb3JEYXRhTGlzdGVuZXJzOiBwdWJsaXNoLmZpbHRlci5tYXhUaW1lRGlmZicpO1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIucHVibGlzaChzZW5zb3JEYXRhKTtcclxuICAgICAgICAgICAgICAgIHB1Ymxpc2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHByZXZpb3VzRGF0YSwgc2Vuc29yRGF0YSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZmlsdGVyUG9ydChzZW5zb3JEYXRhLCBsaXN0ZW5lci5maWx0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoJ1NlbnNvclN0YXRlLnVwZGF0ZVNlbnNvckRhdGFMaXN0ZW5lcnM6IHB1Ymxpc2guZmlsdGVyLnBvcnQnKTtcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnB1Ymxpc2goc2Vuc29yRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBwdWJsaXNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwcmV2aW91c0RhdGEsIHNlbnNvckRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwdWJsaXNoZWQpIHtcclxuICAgICAgICAgICAgbG9nLmluZm8oJ1NlbnNvclN0YXRlLnVwZGF0ZVNlbnNvckRhdGFMaXN0ZW5lcnM6IFNlbnNvciBkYXRhIHB1Ymxpc2hlZCB0byBsaXN0ZW5lcihzKScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUudXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVyczogTm8gc2Vuc29yIGRhdGEgcHVibGlzaGVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB1cGRhdGVTZW5zb3IocG9ydDogbnVtYmVyLCB0ZW1wZXJhdHVyZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2Vuc29ycyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zdCBzZW5zb3I6IFNlbnNvciB8IHVuZGVmaW5lZCA9IHRoaXMuc2Vuc29ycy5maW5kKHMgPT4gcy5zLmdldFBvcnQoKSA9PT0gcG9ydCk7XHJcbiAgICAgICAgICAgIGlmIChzZW5zb3IpIHtcclxuICAgICAgICAgICAgICAgIHNlbnNvci5zLnNldFZhbHVlKHRlbXBlcmF0dXJlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVycyhzZW5zb3Iucywgc2Vuc29yLnApO1xyXG4gICAgICAgICAgICAgICAgbG9nLmluZm8oJ1NlbnNvclN0YXRlLnVwZGF0ZVNlbnNvcjogc2Vuc29yIHVwZGF0ZWQsIHBvcnQ9JyArIHBvcnQgKyAnLCB0ZW1wZXJhdHVyZT0nICsgdGVtcGVyYXR1cmUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9nLmVycm9yKCdTZW5zb3JTdGF0ZS51cGRhdGVTZW5zb3I6IHVuZGVmaW5lZCBwb3J0PScgKyBwb3J0ICsgJywgdGVtcGVyYXR1cmU9JyArIHRlbXBlcmF0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZy5lcnJvcignU2Vuc29yU3RhdGUudXBkYXRlU2Vuc29yOiBubyBzZW5zb3JzLCBwb3J0PScgKyBwb3J0ICsgJywgdGVtcGVyYXR1cmU9JyArIHRlbXBlcmF0dXJlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RTZW5zb3JzKHBvcnRzOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUuY29ubmVjdFNlbnNvcnM6IHBvcnRzPScgKyBKU09OLnN0cmluZ2lmeShwb3J0cykpO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbnNvcnMubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNlbnNvcnMgPSBuZXcgQXJyYXk8U2Vuc29yPihwb3J0cy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgcG9ydCA9IDA7IHBvcnQgPCBwb3J0cy5sZW5ndGg7IHBvcnQrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5zb3JzW3BvcnRdID0geyBwOiBuZXcgU2Vuc29yRGF0YShwb3J0c1twb3J0XSksIHM6IG5ldyBTZW5zb3JEYXRhKHBvcnRzW3BvcnRdKSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iXX0=
