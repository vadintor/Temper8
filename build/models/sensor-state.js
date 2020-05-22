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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvc2Vuc29yLXN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtDO0FBRWxDLDZDQUEyQztBQUUzQyx1Q0FBZ0Q7QUFZaEQ7SUFBQTtJQUFpRSxDQUFDO0lBQUQsYUFBQztBQUFELENBQWpFLEFBQWtFLElBQUE7QUFBckQsd0JBQU07QUFDbkI7SUFNSSxxQkFBWSxJQUFzQjtRQUp4QixZQUFPLEdBQWEsRUFBRSxDQUFDO1FBRXZCLHdCQUFtQixHQUF5QixFQUFFLENBQUM7UUFHckQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsbUJBQVEsQ0FBQyxRQUFRLENBQUMsbUJBQVEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRU0sNkJBQU8sR0FBZDtRQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sNkJBQU8sR0FBZCxVQUFlLElBQXNCO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxtQ0FBYSxHQUFwQjtRQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDbkMsQ0FBQztJQUVNLG1DQUFhLEdBQXBCO1FBQ0ksSUFBTSxVQUFVLEdBQWlCLEVBQUUsQ0FBQztRQUNwQyxLQUFxQixVQUFZLEVBQVosS0FBQSxJQUFJLENBQUMsT0FBTyxFQUFaLGNBQVksRUFBWixJQUFZLEVBQUU7WUFBOUIsSUFBTSxNQUFNLFNBQUE7WUFDYixVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDTSwyQ0FBcUIsR0FBNUIsVUFBNkIsb0JBQWtELEVBQUUsTUFBcUI7UUFDbEcsSUFBSSxD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LEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUUvQyxLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLHdCQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksd0JBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQzNGO1NBQ0o7SUFFTCxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQTVIQSxBQTRIQyxJQUFBO0FBNUhZLGtDQUFXIiwiZmlsZSI6Im1vZGVscy9zZW5zb3Itc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBsb2cgfSBmcm9tICcuLy4uL2xvZ2dlcic7XHJcbmltcG9ydCB7IFNlbnNvckF0dHJpYnV0ZXMgfSBmcm9tICcuL3NlbnNvci1hdHRyaWJ1dGVzJztcclxuaW1wb3J0IHsgU2Vuc29yRGF0YSB9IGZyb20gJy4vc2Vuc29yLWRhdGEnO1xyXG5cclxuaW1wb3J0IHsgU2V0dGluZywgU2V0dGluZ3MgIH0gZnJvbSAnLi9zZXR0aW5ncyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEZpbHRlckNvbmZpZyB7XHJcbiAgICByZXNvbHV0aW9uPzogbnVtYmVyO1xyXG4gICAgbWF4VGltZURpZmY/OiBudW1iZXI7XHJcbiAgICBwb3J0cz86IG51bWJlcltdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNlbnNvckRhdGFMaXN0ZW5lciB7XHJcbiAgICBwdWJsaXNoOiAoc2Vuc29yOiBTZW5zb3JEYXRhKSA9PiB2b2lkO1xyXG4gICAgZmlsdGVyPzogRmlsdGVyQ29uZmlnO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBTZW5zb3IgeyBwdWJsaWMgcDogU2Vuc29yRGF0YTsgcHVibGljIHM6IFNlbnNvckRhdGE7fVxyXG5leHBvcnQgY2xhc3MgU2Vuc29yU3RhdGUge1xyXG4gICAgcHJvdGVjdGVkIGF0dHI6IFNlbnNvckF0dHJpYnV0ZXM7XHJcbiAgICBwcm90ZWN0ZWQgc2Vuc29yczogU2Vuc29yW10gPSBbXTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgc2Vuc29yRGF0YUxpc3RlbmVyczogU2Vuc29yRGF0YUxpc3RlbmVyW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhdHRyOiBTZW5zb3JBdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgdGhpcy5hdHRyID0gYXR0cjtcclxuICAgICAgICBTZXR0aW5ncy5vbkNoYW5nZShTZXR0aW5ncy5TRVJJQUxfTlVNQkVSLCB0aGlzLlNOQ2hhbmdlZC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0QXR0cigpOiBTZW5zb3JBdHRyaWJ1dGVzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRBdHRyKGF0dHI6IFNlbnNvckF0dHJpYnV0ZXMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmF0dHIgPSBhdHRyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBtYXhTYW1wbGVSYXRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0ci5tYXhTYW1wbGVSYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTZW5zb3JEYXRhKCk6IFNlbnNvckRhdGFbXSB7XHJcbiAgICAgICAgY29uc3Qgc2Vuc29yRGF0YTogU2Vuc29yRGF0YVtdID0gW107XHJcbiAgICAgICAgZm9yIChjb25zdCBzZW5zb3Igb2YgdGhpcy5zZW5zb3JzKSB7XHJcbiAgICAgICAgICAgIHNlbnNvckRhdGEucHVzaChzZW5zb3Iucyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzZW5zb3JEYXRhLnNsaWNlKCk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYWRkU2Vuc29yRGF0YUxpc3RlbmVyKG9uU2Vuc29yRGF0YVJlY2VpdmVkOiAoc2Vuc29yOiBTZW5zb3JEYXRhKSA9PiB2b2lkLCBmaWx0ZXI/OiBGaWx0ZXJDb25maWcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNlbnNvckRhdGFMaXN0ZW5lcnMucHVzaCAoe3B1Ymxpc2g6IG9uU2Vuc29yRGF0YVJlY2VpdmVkLCBmaWx0ZXJ9KTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgU05DaGFuZ2VkKHNldHRpbmc6IFNldHRpbmcpIHtcclxuICAgICAgICBjb25zdCBzbiA9IDxzdHJpbmc+c2V0dGluZy52YWx1ZTtcclxuICAgICAgICB0aGlzLmF0dHIuU04gPSBzbjtcclxuICAgICAgICBsb2cuaW5mbygnU2Vuc29yU3RhdGUuU05DaGFuZ2VkIHRvICcgKyBzbik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJvdW5kKGRhdGE6IFNlbnNvckRhdGEsIHJlc29sdXRpb246IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IE1hdGgucG93KDEwLCByZXNvbHV0aW9uIHx8IDApO1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKGRhdGEuZ2V0VmFsdWUoKSAqIG11bHRpcGxpZXIpIC8gbXVsdGlwbGllcjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdmFsdWVEaWZmKHNlbnNvckRhdGE6IFNlbnNvckRhdGEsIHByZXZpb3VzRGF0YTogU2Vuc29yRGF0YSwgcmVzb2x1dGlvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWVEaWZmID0gIE1hdGguYWJzKHRoaXMucm91bmQoc2Vuc29yRGF0YSwgcmVzb2x1dGlvbikgLSB0aGlzLnJvdW5kKHByZXZpb3VzRGF0YSwgcmVzb2x1dGlvbikpO1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUudmFsdWVEaWZmOiBkaWZmPScgKyB2YWx1ZURpZmYpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZURpZmYgPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdGltZURpZmYoc2Vuc29yRGF0YTogU2Vuc29yRGF0YSwgcHJldmlvdXNEYXRhOiBTZW5zb3JEYXRhLCBtYXhUaW1lRGlmZjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdGltZURpZmYgPSBzZW5zb3JEYXRhLnRpbWVzdGFtcCgpIC0gcHJldmlvdXNEYXRhLnRpbWVzdGFtcCgpO1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUudGltZURpZmYgZGlmZj0nICsgdGltZURpZmYpO1xyXG4gICAgICAgIHJldHVybiB0aW1lRGlmZiA+IG1heFRpbWVEaWZmO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaWx0ZXJQb3J0KHNlbnNvckRhdGE6IFNlbnNvckRhdGEsIGZpbHRlcjogRmlsdGVyQ29uZmlnKTogYm9vbGVhbiB7XHJcbiAgICAgICByZXR1cm4gZmlsdGVyLnBvcnRzPyBmaWx0ZXIucG9ydHMuZmluZChwb3J0ID0+IHBvcnQgPT09IHNlbnNvckRhdGEuZ2V0UG9ydCgpKSAhPT0gdW5kZWZpbmVkOiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTZW5zb3JEYXRhTGlzdGVuZXJzKHNlbnNvckRhdGE6IFNlbnNvckRhdGEsIHByZXZpb3VzRGF0YTogU2Vuc29yRGF0YSkge1xyXG4gICAgICAgIGxldCBwdWJsaXNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBsb2cuZGVidWcoJ1NlbnNvclN0YXRlLnVwZGF0ZVNlbnNvckRhdGFMaXN0ZW5lcnM6IGZpbHRlcmluZyBiZWZvcmUgcHVibGlzaGluZycpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5zZW5zb3JEYXRhTGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUudXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVyczogZmlsdGVyOicgKyBKU09OLnN0cmluZ2lmeShsaXN0ZW5lci5maWx0ZXIpKTtcclxuICAgICAgICAgICAgaWYgKCFsaXN0ZW5lci5maWx0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUudXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVyczogbm8gZmlsdGVyIGZvdW5kJyk7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5wdWJsaXNoKHNlbnNvckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcHVibGlzaGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocHJldmlvdXNEYXRhLCBzZW5zb3JEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5maWx0ZXJQb3J0KHNlbnNvckRhdGEsIGxpc3RlbmVyLmZpbHRlcikgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuZmlsdGVyLnJlc29sdXRpb24gJiZcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVEaWZmKHNlbnNvckRhdGEsIHByZXZpb3VzRGF0YSwgbGlzdGVuZXIuZmlsdGVyLnJlc29sdXRpb24pICYmIHNlbnNvckRhdGEudmFsaWQoKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnB1Ymxpc2goc2Vuc29yRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBwdWJsaXNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwcmV2aW91c0RhdGEsIHNlbnNvckRhdGEpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlclBvcnQoc2Vuc29yRGF0YSwgbGlzdGVuZXIuZmlsdGVyKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmZpbHRlci5tYXhUaW1lRGlmZiAmJiBzZW5zb3JEYXRhLnZhbGlkKCkgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVEaWZmKHNlbnNvckRhdGEsIHByZXZpb3VzRGF0YSwgbGlzdGVuZXIuZmlsdGVyLm1heFRpbWVEaWZmKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCdTZW5zb3JTdGF0ZS51cGRhdGVTZW5zb3JEYXRhTGlzdGVuZXJzOiBwdWJsaXNoLmZpbHRlci5tYXhUaW1lRGlmZicpO1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIucHVibGlzaChzZW5zb3JEYXRhKTtcclxuICAgICAgICAgICAgICAgIHB1Ymxpc2hlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHByZXZpb3VzRGF0YSwgc2Vuc29yRGF0YSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZmlsdGVyUG9ydChzZW5zb3JEYXRhLCBsaXN0ZW5lci5maWx0ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoJ1NlbnNvclN0YXRlLnVwZGF0ZVNlbnNvckRhdGFMaXN0ZW5lcnM6IHB1Ymxpc2guZmlsdGVyLnBvcnQnKTtcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnB1Ymxpc2goc2Vuc29yRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBwdWJsaXNoZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwcmV2aW91c0RhdGEsIHNlbnNvckRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwdWJsaXNoZWQpIHtcclxuICAgICAgICAgICAgbG9nLmluZm8oJ1NlbnNvclN0YXRlLnVwZGF0ZVNlbnNvckRhdGFMaXN0ZW5lcnM6IFNlbnNvciBkYXRhIHB1Ymxpc2hlZCB0byBsaXN0ZW5lcihzKScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUudXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVyczogTm8gc2Vuc29yIGRhdGEgcHVibGlzaGVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB1cGRhdGVTZW5zb3IocG9ydDogbnVtYmVyLCB0ZW1wZXJhdHVyZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2Vuc29ycyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zdCBzZW5zb3I6IFNlbnNvciB8IHVuZGVmaW5lZCA9IHRoaXMuc2Vuc29ycy5maW5kKHMgPT4gcy5zLmdldFBvcnQoKSA9PT0gcG9ydCk7XHJcbiAgICAgICAgICAgIGlmIChzZW5zb3IpIHtcclxuICAgICAgICAgICAgICAgIHNlbnNvci5zLnNldFZhbHVlKHRlbXBlcmF0dXJlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVycyhzZW5zb3Iucywgc2Vuc29yLnApO1xyXG4gICAgICAgICAgICAgICAgbG9nLmluZm8oJ1NlbnNvclN0YXRlLnVwZGF0ZVNlbnNvcjogc2Vuc29yIHVwZGF0ZWQsIHBvcnQ9JyArIHBvcnQgKyAnLCB0ZW1wZXJhdHVyZT0nICsgdGVtcGVyYXR1cmUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9nLmVycm9yKCdTZW5zb3JTdGF0ZS51cGRhdGVTZW5zb3I6IHVuZGVmaW5lZCBwb3J0PScgKyBwb3J0ICsgJywgdGVtcGVyYXR1cmU9JyArIHRlbXBlcmF0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZy5lcnJvcignU2Vuc29yU3RhdGUudXBkYXRlU2Vuc29yOiBubyBzZW5zb3JzLCBwb3J0PScgKyBwb3J0ICsgJywgdGVtcGVyYXR1cmU9JyArIHRlbXBlcmF0dXJlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RTZW5zb3JzKHBvcnRzOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yU3RhdGUuY29ubmVjdFNlbnNvcnM6IHBvcnRzPScgKyBKU09OLnN0cmluZ2lmeShwb3J0cykpO1xyXG4gICAgICAgIGlmICh0aGlzLnNlbnNvcnMubGVuZ3RoID09PSAwKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNlbnNvcnMgPSBuZXcgQXJyYXk8U2Vuc29yPihwb3J0cy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgcG9ydCA9IDA7IHBvcnQgPCBwb3J0cy5sZW5ndGg7IHBvcnQrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5zb3JzW3BvcnRdID0geyBwOiBuZXcgU2Vuc29yRGF0YShwb3J0c1twb3J0XSksIHM6IG5ldyBTZW5zb3JEYXRhKHBvcnRzW3BvcnRdKSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iXX0=
