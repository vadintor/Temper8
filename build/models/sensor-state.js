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
    function SensorState() {
        this.sensors = [];
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
                logger_1.log.error('*** connectSensors, #sensors: %d !== total: %d', sensorIndex, total);
                return;
            }
        }
    };
    return SensorState;
}());
exports.SensorState = SensorState;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvc2Vuc29yLXN0YXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWtDO0FBQ2xDLDZDQUEyQztBQVkzQztJQUFBO0lBQWlFLENBQUM7SUFBRCxhQUFDO0FBQUQsQ0FBakUsQUFBa0UsSUFBQTtBQUFyRCx3QkFBTTtBQUNuQjtJQUFBO1FBR2MsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUV2Qix3QkFBbUIsR0FBeUIsRUFBRSxDQUFDO0lBeUc3RCxDQUFDO0lBdkdVLG1DQUFhLEdBQXBCO1FBQ0ksSUFBTSxVQUFVLEdBQWlCLEVBQUUsQ0FBQztRQUNwQyxLQUFxQixVQUFZLEVBQVosS0FBQSxJQUFJLENBQUMsT0FBTyxFQUFaLGNBQVksRUFBWixJQUFZLEVBQUU7WUFBOUIsSUFBTSxNQUFNLFNBQUE7WUFDYixVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QjtRQUNELE9BQU8sVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDTSwyQ0FBcUIsR0FBNUIsVUFBNkIsb0JBQWtELEVBQUUsTUFBcUI7UUFDbEcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBRSxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFFBQUEsRUFBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNPLDJCQUFLLEdBQWIsVUFBYyxJQUFnQixFQUFFLFVBQWtCO1FBQzlDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUNqRSxDQUFDO0lBQ08sK0JBQVMsR0FBakIsVUFBa0IsVUFBc0IsRUFBRSxZQUF3QixFQUFFLFVBQWtCO1FBQ2xGLElBQU0s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O0lBRUwsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0E5R0EsQUE4R0MsSUFBQTtBQTlHWSxrQ0FBVyIsImZpbGUiOiJtb2RlbHMvc2Vuc29yLXN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi8uLi9sb2dnZXInO1xyXG5pbXBvcnQgeyBTZW5zb3JEYXRhIH0gZnJvbSAnLi9zZW5zb3ItZGF0YSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEZpbHRlckNvbmZpZyB7XHJcbiAgICByZXNvbHV0aW9uPzogbnVtYmVyO1xyXG4gICAgbWF4VGltZURpZmY/OiBudW1iZXI7XHJcbiAgICBwb3J0cz86IG51bWJlcltdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNlbnNvckRhdGFMaXN0ZW5lciB7XHJcbiAgICBwdWJsaXNoOiAoc2Vuc29yOiBTZW5zb3JEYXRhKSA9PiB2b2lkO1xyXG4gICAgZmlsdGVyPzogRmlsdGVyQ29uZmlnO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBTZW5zb3IgeyBwdWJsaWMgcDogU2Vuc29yRGF0YTsgcHVibGljIHM6IFNlbnNvckRhdGE7fVxyXG5leHBvcnQgY2xhc3MgU2Vuc29yU3RhdGUge1xyXG5cclxuICAgIC8vIG9yIGEgaHVtaWRpdHkgc2Vuc29yLCBidXQgdGhlIGxhdHRlciBpcyBvdXQgb2Ygc2NvcGUuXHJcbiAgICBwcm90ZWN0ZWQgc2Vuc29yczogU2Vuc29yW10gPSBbXTtcclxuICAgIC8vIHByaXZhdGUgIHVzZWRQb3J0czogbnVtYmVyW107XHJcbiAgICBwcm90ZWN0ZWQgc2Vuc29yRGF0YUxpc3RlbmVyczogU2Vuc29yRGF0YUxpc3RlbmVyW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0U2Vuc29yRGF0YSgpOiBTZW5zb3JEYXRhW10ge1xyXG4gICAgICAgIGNvbnN0IHNlbnNvckRhdGE6IFNlbnNvckRhdGFbXSA9IFtdO1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2Vuc29yIG9mIHRoaXMuc2Vuc29ycykge1xyXG4gICAgICAgICAgICBzZW5zb3JEYXRhLnB1c2goc2Vuc29yLnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2Vuc29yRGF0YS5zbGljZSgpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFkZFNlbnNvckRhdGFMaXN0ZW5lcihvblNlbnNvckRhdGFSZWNlaXZlZDogKHNlbnNvcjogU2Vuc29yRGF0YSkgPT4gdm9pZCwgZmlsdGVyPzogRmlsdGVyQ29uZmlnKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zZW5zb3JEYXRhTGlzdGVuZXJzLnB1c2ggKHtwdWJsaXNoOiBvblNlbnNvckRhdGFSZWNlaXZlZCwgZmlsdGVyfSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJvdW5kKGRhdGE6IFNlbnNvckRhdGEsIHJlc29sdXRpb246IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgY29uc3QgbXVsdGlwbGllciA9IE1hdGgucG93KDEwLCByZXNvbHV0aW9uIHx8IDApO1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKGRhdGEuZ2V0VmFsdWUoKSAqIG11bHRpcGxpZXIpIC8gbXVsdGlwbGllcjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdmFsdWVEaWZmKHNlbnNvckRhdGE6IFNlbnNvckRhdGEsIHByZXZpb3VzRGF0YTogU2Vuc29yRGF0YSwgcmVzb2x1dGlvbjogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgdmFsdWVEaWZmID0gIE1hdGguYWJzKHRoaXMucm91bmQoc2Vuc29yRGF0YSwgcmVzb2x1dGlvbikgLSB0aGlzLnJvdW5kKHByZXZpb3VzRGF0YSwgcmVzb2x1dGlvbikpO1xyXG4gICAgICAgIGxvZy5kZWJ1ZygndmFsdWUgZGlmZicsIHZhbHVlRGlmZik7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlRGlmZiA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0aW1lRGlmZihzZW5zb3JEYXRhOiBTZW5zb3JEYXRhLCBwcmV2aW91c0RhdGE6IFNlbnNvckRhdGEsIG1heFRpbWVEaWZmOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICBjb25zdCB0aW1lRGlmZiA9IHNlbnNvckRhdGEudGltZXN0YW1wKCkgLSBwcmV2aW91c0RhdGEudGltZXN0YW1wKCk7XHJcbiAgICAgICAgbG9nLmRlYnVnKCdUaW1lIGRpZmY6ICcsIHRpbWVEaWZmKTtcclxuICAgICAgICByZXR1cm4gdGltZURpZmYgPiBtYXhUaW1lRGlmZjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgZmlsdGVyUG9ydChzZW5zb3JEYXRhOiBTZW5zb3JEYXRhLCBmaWx0ZXI6IEZpbHRlckNvbmZpZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgcmV0dXJuIGZpbHRlci5wb3J0cz8gZmlsdGVyLnBvcnRzLmZpbmQocG9ydCA9PiBwb3J0ID09PSBzZW5zb3JEYXRhLmdldFBvcnQoKSkgIT09IHVuZGVmaW5lZDogdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdXBkYXRlU2Vuc29yRGF0YUxpc3RlbmVycyhzZW5zb3JEYXRhOiBTZW5zb3JEYXRhLCBwcmV2aW91c0RhdGE6IFNlbnNvckRhdGEpIHtcclxuICAgICAgICBsb2cuZGVidWcoJ3VwZGF0ZVNlbnNvckRhdGFMaXN0ZW5lcnMnKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuc2Vuc29yRGF0YUxpc3RlbmVycykge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJ3VwZGF0ZVNlbnNvckRhdGFMaXN0ZW5lcnMsIGZpbHRlcjonLCBsaXN0ZW5lci5maWx0ZXIpO1xyXG4gICAgICAgICAgICBpZiAoIWxpc3RlbmVyLmZpbHRlcikge1xyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCd1cGRhdGVTZW5zb3JEYXRhTGlzdGVuZXJzLCBubyBmaWx0ZXIgZm91bmQnKTtcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnB1Ymxpc2goc2Vuc29yRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHByZXZpb3VzRGF0YSwgc2Vuc29yRGF0YSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZmlsdGVyUG9ydChzZW5zb3JEYXRhLCBsaXN0ZW5lci5maWx0ZXIpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmZpbHRlci5yZXNvbHV0aW9uICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlRGlmZihzZW5zb3JEYXRhLCBwcmV2aW91c0RhdGEsIGxpc3RlbmVyLmZpbHRlci5yZXNvbHV0aW9uKSAmJiBzZW5zb3JEYXRhLnZhbGlkKCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoJ3VwZGF0ZVNlbnNvckRhdGFMaXN0ZW5lcnMsIHB1Ymxpc2guZmlsdGVyLnJlc29sdXRpb24nKTtcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLnB1Ymxpc2goc2Vuc29yRGF0YSk7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHByZXZpb3VzRGF0YSwgc2Vuc29yRGF0YSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZmlsdGVyUG9ydChzZW5zb3JEYXRhLCBsaXN0ZW5lci5maWx0ZXIpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuZmlsdGVyLm1heFRpbWVEaWZmICYmIHNlbnNvckRhdGEudmFsaWQoKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZURpZmYoc2Vuc29yRGF0YSwgcHJldmlvdXNEYXRhLCBsaXN0ZW5lci5maWx0ZXIubWF4VGltZURpZmYpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoJ3VwZGF0ZVNlbnNvckRhdGFMaXN0ZW5lcnMsIHB1Ymxpc2guZmlsdGVyLm1heFRpbWVEaWZmJyk7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5wdWJsaXNoKHNlbnNvckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwcmV2aW91c0RhdGEsIHNlbnNvckRhdGEpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlclBvcnQoc2Vuc29yRGF0YSwgbGlzdGVuZXIuZmlsdGVyKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCd1cGRhdGVTZW5zb3JEYXRhTGlzdGVuZXJzLCBwdWJsaXNoLmZpbHRlci5wb3J0Jyk7XHJcbiAgICAgICAgICAgICAgICBsaXN0ZW5lci5wdWJsaXNoKHNlbnNvckRhdGEpO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwcmV2aW91c0RhdGEsIHNlbnNvckRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVNlbnNvcihwb3J0OiBudW1iZXIsIHRlbXBlcmF0dXJlOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5zZW5zb3JzICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbnNvcjogU2Vuc29yIHwgdW5kZWZpbmVkID0gdGhpcy5zZW5zb3JzLmZpbmQocyA9PiBzLnMuZ2V0UG9ydCgpID09PSBwb3J0KTtcclxuICAgICAgICAgICAgaWYgKHNlbnNvcikge1xyXG4gICAgICAgICAgICAgICAgc2Vuc29yLnMuc2V0VmFsdWUodGVtcGVyYXR1cmUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTZW5zb3JEYXRhTGlzdGVuZXJzKHNlbnNvci5zLCBzZW5zb3IucCk7XHJcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoJ1NlbnNvclN0YXRlLnVwZGF0ZVNlbnNvciwgcG9ydDogJWQsIHRlbXBlcmF0dXJlICVkJywgcG9ydCwgdGVtcGVyYXR1cmUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbG9nLmVycm9yKCcqKiogU2Vuc29yU3RhdGUudXBkYXRlU2Vuc29yLCB1bmRlZmluZWQsIHBvcnQ6ICVkLCB0ZW1wZXJhdHVyZSAlZCcsIHBvcnQsIHRlbXBlcmF0dXJlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZy5lcnJvcignKioqIFNlbnNvclN0YXRlLnVwZGF0ZVNlbnNvciwgbm8gc2Vuc29ycywgcG9ydDogJWQsIHRlbXBlcmF0dXJlICVkJywgcG9ydCwgdGVtcGVyYXR1cmUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBjb25uZWN0U2Vuc29ycyh0b3RhbDogbnVtYmVyLCB1c2VkOiBudW1iZXIpIHtcclxuICAgICAgICBsb2cuZGVidWcoJy0tLSBjb25uZWN0U2Vuc29ycywgdG90YWw6JWQnLCB0b3RhbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2Vuc29ycy5sZW5ndGggPT09IDApIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2Vuc29ycyA9IG5ldyBBcnJheTxTZW5zb3I+KHRvdGFsKTtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKCdjb25uZWN0U2Vuc29ycywgdGhpcy5zZW5zb3JzLmxlbmd0aDogJywgdGhpcy5zZW5zb3JzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJpdHM6IG51bWJlcltdID0gWzB4MDEsIDB4MDIsIDB4MDQsIDB4MDgsIDB4MTAsIDB4MjAsIDB4NDAsIDB4ODBdO1xyXG4gICAgICAgICAgICBsZXQgc2Vuc29ySW5kZXg6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayB0aGUgYml0IGFycmF5IGZvciB1c2VkIHBvcnRzLCBvbmUgYml0IGF0IGEgdGltZVxyXG4gICAgICAgICAgICBmb3IgKGxldCBiaXQgPSAwOyBiaXQgPCBiaXRzLmxlbmd0aDsgYml0KyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoKHVzZWQgJiBiaXRzW2JpdF0pID09PSBiaXRzW2JpdF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3J0ID0gYml0O1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZygnLS0tIGNvbm5lY3RTZW5zb3JzLCBwb3J0OiAnLCBwb3J0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbnNvcnNbc2Vuc29ySW5kZXhdID0geyBwOiBuZXcgU2Vuc29yRGF0YShwb3J0KSwgczogbmV3IFNlbnNvckRhdGEocG9ydCkgfTtcclxuICAgICAgICAgICAgICAgICAgICBsb2cuZGVidWcoJysrKyBjb25uZWN0U2Vuc29ycywgcG9ydDogJWQnLCBwb3J0KTtcclxuICAgICAgICAgICAgICAgICAgICBzZW5zb3JJbmRleCArPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2Vuc29ySW5kZXggIT09IHRvdGFsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBFcnJvciBoYW5kbGluZ1xyXG4gICAgICAgICAgICAgICAgbG9nLmVycm9yKCcqKiogY29ubmVjdFNlbnNvcnMsICNzZW5zb3JzOiAlZCAhPT0gdG90YWw6ICVkJywgc2Vuc29ySW5kZXgsIHRvdGFsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuIl19
