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
        logger_1.log.debug('value diff: ' + valueDiff);
        return valueDiff > 0;
    };
    SensorState.prototype.timeDiff = function (sensorData, previousData, maxTimeDiff) {
        var timeDiff = sensorData.timestamp() - previousData.timestamp();
        logger_1.log.debug('Time diff: ' + timeDiff);
        return timeDiff > maxTimeDiff;
    };
    SensorState.prototype.filterPort = function (sensorData, filter) {
        return filter.ports ? filter.ports.find(function (port) { return port === sensorData.getPort(); }) !== undefined : true;
    };
    SensorState.prototype.updateSensorDataListeners = function (sensorData, previousData) {
        logger_1.log.debug('updateSensorDataListeners');
        for (var _i = 0, _a = this.sensorDataListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            logger_1.log.debug('updateSensorDataListeners, filter:' + JSON.stringify(listener.filter));
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
                logger_1.log.debug('SensorState.updateSensor, port: ' + port + ', temperature ' + temperature);
            }
            else {
                logger_1.log.error('*** SensorState.updateSensor, undefined, port: ' + port + ', temperature ' + temperature);
            }
        }
        else {
            logger_1.log.error('*** SensorState.updateSensor, no sensors, port: ' + port + ', temperature ' + temperature);
        }
    };
    SensorState.prototype.connectSensors = function (ports) {
        logger_1.log.debug('--- connectSensors, ports: ' + JSON.stringify(ports));
        if (this.sensors.length === 0) {
            this.sensors = new Array(ports.length);
            for (var port = 0; port < ports.length; port++) {
                this.sensors[port] = { p: new sensor_data_1.SensorData(port), s: new sensor_data_1.SensorData(port) };
            }
        }
    };
    return SensorState;
}());
exports.SensorState = SensorState;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvc2Vuc29yLXN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtDO0FBRWxDLDZDQUEyQztBQVkzQztJQUFBO0lBQWlFLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FBakUsQUFBa0UsSUFBQTtBQUFyRCx3QkFBTTtBQUNuQjtJQU1JLHFCQUFZLElBQXNCO1FBSnhCLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFFdkIsd0JBQW1CLEdBQXlCLEVBQUUsQ0FBQztRQUdyRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sNkJBQU8sR0FBZDtRQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sNkJBQU8sR0FBZCxVQUFlLElBQXNCO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxtQ0FBYSxHQUFwQjtRQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDbkMsQ0FBQztJQUVNLG1DQUFhLEdBQXBCO1FBQ0ksSUFBTSxVQUFVLEdBQWlCLEVBQUUsQ0FBQztRQUNwQyxLQUFxQixVQUFZLEVBQVosS0FBQSxJQUFJLENBQUMsT0FBTyxFQUFaLGNBQVksRUFBWixJQUFZLEVBQUU7WUFBOUIsSUFBTSxNQUFNLFNBQUE7WUFDYixVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDTSwyQ0FBcUIsR0FBNUIsVUFBNkIsb0JBQWtELEVBQUUsTUFBcUI7UUFDbEcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBRSxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFFBQUEsRUFBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNPLDJCQUFLLEdBQWIsVUFBYyxJ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Q0FBQyxDQUFDO2FBQ3pGO2lCQUFNO2dCQUNILFlBQUcsQ0FBQyxLQUFLLENBQUMsaURBQWlELEdBQUcsSUFBSSxHQUFHLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxDQUFDO2FBQ3hHO1NBQ0o7YUFBTTtZQUNILFlBQUcsQ0FBQyxLQUFLLENBQUMsa0RBQWtELEdBQUcsSUFBSSxHQUFHLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxDQUFDO1NBQ3pHO0lBQ0wsQ0FBQztJQUVTLG9DQUFjLEdBQXhCLFVBQXlCLEtBQWU7UUFDcEMsWUFBRyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFFM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBUyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFL0MsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsSUFBSSx3QkFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLHdCQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQzthQUM3RTtTQUNKO0lBRUwsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0E3R0EsQUE2R0MsSUFBQTtBQTdHWSxrQ0FBVyIsImZpbGUiOiJtb2RlbHMvc2Vuc29yLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi8uLi9sb2dnZXInO1xyXG5pbXBvcnQgeyBTZW5zb3JBdHRyaWJ1dGVzIH0gZnJvbSAnLi9zZW5zb3ItYXR0cmlidXRlcyc7XHJcbmltcG9ydCB7IFNlbnNvckRhdGEgfSBmcm9tICcuL3NlbnNvci1kYXRhJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyQ29uZmlnIHtcclxuICAgIHJlc29sdXRpb24/OiBudW1iZXI7XHJcbiAgICBtYXhUaW1lRGlmZj86IG51bWJlcjtcclxuICAgIHBvcnRzPzogbnVtYmVyW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2Vuc29yRGF0YUxpc3RlbmVyIHtcclxuICAgIHB1Ymxpc2g6IChzZW5zb3I6IFNlbnNvckRhdGEpID0+IHZvaWQ7XHJcbiAgICBmaWx0ZXI/OiBGaWx0ZXJDb25maWc7XHJcbn1cclxuZXhwb3J0IGNsYXNzIFNlbnNvciB7IHB1YmxpYyBwOiBTZW5zb3JEYXRhOyBwdWJsaWMgczogU2Vuc29yRGF0YTt9XHJcbmV4cG9ydCBjbGFzcyBTZW5zb3JTdGF0ZSB7XHJcbiAgICBwcm90ZWN0ZWQgYXR0cjogU2Vuc29yQXR0cmlidXRlcztcclxuICAgIHByb3RlY3RlZCBzZW5zb3JzOiBTZW5zb3JbXSA9IFtdO1xyXG5cclxuICAgIHByb3RlY3RlZCBzZW5zb3JEYXRhTGlzdGVuZXJzOiBTZW5zb3JEYXRhTGlzdGVuZXJbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGF0dHI6IFNlbnNvckF0dHJpYnV0ZXMpIHtcclxuICAgICAgICB0aGlzLmF0dHIgPSBhdHRyO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRBdHRyKCk6IFNlbnNvckF0dHJpYnV0ZXMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF0dHI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEF0dHIoYXR0cjogU2Vuc29yQXR0cmlidXRlcyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXR0ciA9IGF0dHI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG1heFNhbXBsZVJhdGUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyLm1heFNhbXBsZVJhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFNlbnNvckRhdGEoKTogU2Vuc29yRGF0YVtdIHtcclxuICAgICAgICBjb25zdCBzZW5zb3JEYXRhOiBTZW5zb3JEYXRhW10gPSBbXTtcclxuICAgICAgICBmb3IgKGNvbnN0IHNlbnNvciBvZiB0aGlzLnNlbnNvcnMpIHtcclxuICAgICAgICAgICAgc2Vuc29yRGF0YS5wdXNoKHNlbnNvci5zKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNlbnNvckRhdGEuc2xpY2UoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhZGRTZW5zb3JEYXRhTGlzdGVuZXIob25TZW5zb3JEYXRhUmVjZWl2ZWQ6IChzZW5zb3I6IFNlbnNvckRhdGEpID0+IHZvaWQsIGZpbHRlcj86IEZpbHRlckNvbmZpZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2Vuc29yRGF0YUxpc3RlbmVycy5wdXNoICh7cHVibGlzaDogb25TZW5zb3JEYXRhUmVjZWl2ZWQsIGZpbHRlcn0pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByb3VuZChkYXRhOiBTZW5zb3JEYXRhLCByZXNvbHV0aW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IG11bHRpcGxpZXIgPSBNYXRoLnBvdygxMCwgcmVzb2x1dGlvbiB8fCAwKTtcclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChkYXRhLmdldFZhbHVlKCkgKiBtdWx0aXBsaWVyKSAvIG11bHRpcGxpZXI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHZhbHVlRGlmZihzZW5zb3JEYXRhOiBTZW5zb3JEYXRhLCBwcmV2aW91c0RhdGE6IFNlbnNvckRhdGEsIHJlc29sdXRpb246IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlRGlmZiA9ICBNYXRoLmFicyh0aGlzLnJvdW5kKHNlbnNvckRhdGEsIHJlc29sdXRpb24pIC0gdGhpcy5yb3VuZChwcmV2aW91c0RhdGEsIHJlc29sdXRpb24pKTtcclxuICAgICAgICBsb2cuZGVidWcoJ3ZhbHVlIGRpZmY6ICcgKyB2YWx1ZURpZmYpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZURpZmYgPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdGltZURpZmYoc2Vuc29yRGF0YTogU2Vuc29yRGF0YSwgcHJldmlvdXNEYXRhOiBTZW5zb3JEYXRhLCBtYXhUaW1lRGlmZjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdGltZURpZmYgPSBzZW5zb3JEYXRhLnRpbWVzdGFtcCgpIC0gcHJldmlvdXNEYXRhLnRpbWVzdGFtcCgpO1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnVGltZSBkaWZmOiAnICsgdGltZURpZmYpO1xyXG4gICAgICAgIHJldHVybiB0aW1lRGlmZiA+IG1heFRpbWVEaWZmO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBmaWx0ZXJQb3J0KHNlbnNvckRhdGE6IFNlbnNvckRhdGEsIGZpbHRlcjogRmlsdGVyQ29uZmlnKTogYm9vbGVhbiB7XHJcbiAgICAgICByZXR1cm4gZmlsdGVyLnBvcnRzPyBmaWx0ZXIucG9ydHMuZmluZChwb3J0ID0+IHBvcnQgPT09IHNlbnNvckRhdGEuZ2V0UG9ydCgpKSAhPT0gdW5kZWZpbmVkOiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTZW5zb3JEYXRhTGlzdGVuZXJzKHNlbnNvckRhdGE6IFNlbnNvckRhdGEsIHByZXZpb3VzRGF0YTogU2Vuc29yRGF0YSkge1xyXG4gICAgICAgIGxvZy5kZWJ1ZygndXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVycycpO1xyXG4gICAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5zZW5zb3JEYXRhTGlzdGVuZXJzKSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygndXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVycywgZmlsdGVyOicgKyBKU09OLnN0cmluZ2lmeShsaXN0ZW5lci5maWx0ZXIpKTtcclxuICAgICAgICAgICAgaWYgKCFsaXN0ZW5lci5maWx0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZygndXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVycywgbm8gZmlsdGVyIGZvdW5kJyk7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5wdWJsaXNoKHNlbnNvckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwcmV2aW91c0RhdGEsIHNlbnNvckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlclBvcnQoc2Vuc29yRGF0YSwgbGlzdGVuZXIuZmlsdGVyKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5maWx0ZXIucmVzb2x1dGlvbiAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZURpZmYoc2Vuc29yRGF0YSwgcHJldmlvdXNEYXRhLCBsaXN0ZW5lci5maWx0ZXIucmVzb2x1dGlvbikgJiYgc2Vuc29yRGF0YS52YWxpZCgpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCd1cGRhdGVTZW5zb3JEYXRhTGlzdGVuZXJzLCBwdWJsaXNoLmZpbHRlci5yZXNvbHV0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5wdWJsaXNoKHNlbnNvckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwcmV2aW91c0RhdGEsIHNlbnNvckRhdGEpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlclBvcnQoc2Vuc29yRGF0YSwgbGlzdGVuZXIuZmlsdGVyKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmZpbHRlci5tYXhUaW1lRGlmZiAmJiBzZW5zb3JEYXRhLnZhbGlkKCkgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVEaWZmKHNlbnNvckRhdGEsIHByZXZpb3VzRGF0YSwgbGlzdGVuZXIuZmlsdGVyLm1heFRpbWVEaWZmKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCd1cGRhdGVTZW5zb3JEYXRhTGlzdGVuZXJzLCBwdWJsaXNoLmZpbHRlci5tYXhUaW1lRGlmZicpO1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIucHVibGlzaChzZW5zb3JEYXRhKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocHJldmlvdXNEYXRhLCBzZW5zb3JEYXRhKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5maWx0ZXJQb3J0KHNlbnNvckRhdGEsIGxpc3RlbmVyLmZpbHRlcikpIHtcclxuICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZygndXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVycywgcHVibGlzaC5maWx0ZXIucG9ydCcpO1xyXG4gICAgICAgICAgICAgICAgbGlzdGVuZXIucHVibGlzaChzZW5zb3JEYXRhKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocHJldmlvdXNEYXRhLCBzZW5zb3JEYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCB1cGRhdGVTZW5zb3IocG9ydDogbnVtYmVyLCB0ZW1wZXJhdHVyZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2Vuc29ycyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zdCBzZW5zb3I6IFNlbnNvciB8IHVuZGVmaW5lZCA9IHRoaXMuc2Vuc29ycy5maW5kKHMgPT4gcy5zLmdldFBvcnQoKSA9PT0gcG9ydCk7XHJcbiAgICAgICAgICAgIGlmIChzZW5zb3IpIHtcclxuICAgICAgICAgICAgICAgIHNlbnNvci5zLnNldFZhbHVlKHRlbXBlcmF0dXJlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVycyhzZW5zb3Iucywgc2Vuc29yLnApO1xyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCdTZW5zb3JTdGF0ZS51cGRhdGVTZW5zb3IsIHBvcnQ6ICcgKyBwb3J0ICsgJywgdGVtcGVyYXR1cmUgJyArIHRlbXBlcmF0dXJlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxvZy5lcnJvcignKioqIFNlbnNvclN0YXRlLnVwZGF0ZVNlbnNvciwgdW5kZWZpbmVkLCBwb3J0OiAnICsgcG9ydCArICcsIHRlbXBlcmF0dXJlICcgKyB0ZW1wZXJhdHVyZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2cuZXJyb3IoJyoqKiBTZW5zb3JTdGF0ZS51cGRhdGVTZW5zb3IsIG5vIHNlbnNvcnMsIHBvcnQ6ICcgKyBwb3J0ICsgJywgdGVtcGVyYXR1cmUgJyArIHRlbXBlcmF0dXJlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGNvbm5lY3RTZW5zb3JzKHBvcnRzOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnLS0tIGNvbm5lY3RTZW5zb3JzLCBwb3J0czogJyArIEpTT04uc3RyaW5naWZ5KHBvcnRzKSk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2Vuc29ycy5sZW5ndGggPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2Vuc29ycyA9IG5ldyBBcnJheTxTZW5zb3I+KHBvcnRzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBwb3J0ID0gMDsgcG9ydCA8IHBvcnRzLmxlbmd0aDsgcG9ydCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbnNvcnNbcG9ydF0gPSB7IHA6IG5ldyBTZW5zb3JEYXRhKHBvcnQpLCBzOiBuZXcgU2Vuc29yRGF0YShwb3J0KSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG4iXX0=
