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
Object.defineProperty(exports, "__esModule", { value: true });
var sensor_state_1 = require("./sensor-state");
var logger_1 = require("./../logger");
var Temper8 = (function (_super) {
    __extends(Temper8, _super);
    function Temper8() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.nextSensor = 0;
        return _this;
    }
    Temper8.prototype.initReport = function () {
        this.nextSensor = 0;
        return [this.usedPortsRequest(), this.temperatureRequest(this.nextSensor)];
    };
    Temper8.prototype.parseInput = function (data) {
        try {
            if (this.matchUsedPorts(data)) {
                logger_1.log.debug('+++ Temper8.matchUsedPorts:', JSON.stringify(data));
                var response = this.temperatureRequest(this.sensors[this.nextSensor].s.getPort());
                this.nextSensor += 1;
                return response;
            }
            else if (this.matchTemperature(data)) {
                logger_1.log.debug('+++ Temper8.matchTemperature:', JSON.stringify(data));
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
                logger_1.log.warning('*** Temper8.matchCheckFF: restart?');
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
    Temper8.prototype.matchUsedPorts = function (data) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x01) {
            this.connectSensors(data[4], data[5]);
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
            logger_1.log.debug('+++ matchTemperature, data: %d', JSON.stringify(data));
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvdGVtcGVyLTgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsK0NBQTZDO0FBRzdDLHNDQUFrQztBQU1sQztJQUE2QiwyQkFBVztJQUF4QztRQUFBLHFFQWlNQztRQTFMYSxnQkFBVSxHQUFXLENBQUMsQ0FBQzs7SUEwTHJDLENBQUM7SUF0TFUsNEJBQVUsR0FBakI7UUFHSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUtNLDRCQUFVLEdBQWpCLFVBQWtCLElBQWM7UUFDNUIsSUFBSSxDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLFlBQUcsQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQ3BGLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO2dCQUNyQixNQUFNLENBQUMsUUFBUSxDQUFDO1lBRXBCLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsWUFBRyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2pFLEVB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QUFLLElBQUk7ZUFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7SUFDTCxDQUFDO0lBQ1EsZ0NBQWMsR0FBdkI7UUFDSSxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUNRLDhCQUFZLEdBQXJCLFVBQXNCLElBQWM7UUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDO2VBQ2QsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUk7ZUFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUk7ZUFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUk7ZUFDaEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7SUFDTCxDQUFDO0lBSVEsOEJBQVksR0FBckIsVUFBc0IsSUFBYztRQUNoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7ZUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSTtlQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSTtlQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSTtlQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztJQUNMLENBQUM7SUFFTCxjQUFDO0FBQUQsQ0FqTUEsQUFpTUMsQ0FqTTRCLDBCQUFXLEdBaU12QztBQWpNWSwwQkFBTyIsImZpbGUiOiJtb2RlbHMvdGVtcGVyLTguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgU2Vuc29yU3RhdGUgfSBmcm9tICcuL3NlbnNvci1zdGF0ZSc7XHJcbmltcG9ydCB7IFJlcG9ydFBhcnNlciB9IGZyb20gJy4vdXNiLWNvbnRyb2xsZXInO1xyXG5cclxuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi8uLi9sb2dnZXInO1xyXG5cclxuXHJcbi8vIFRlbXBlcjggcGFyc2VyIHVuZGVyc3RhbmRzIEhJRCByZXBvcnRzIGZyb20gVGVtcGVyOCBkZXZpY2VzXHJcbi8vIEluZGVwZW5kZW50IG9mIFVTQiBsaWIgdXNlZC5cclxuXHJcbmV4cG9ydCBjbGFzcyBUZW1wZXI4IGV4dGVuZHMgU2Vuc29yU3RhdGUgaW1wbGVtZW50cyBSZXBvcnRQYXJzZXIge1xyXG4gICAgLy8gRGV2aWNlIGhhcyA4IHBvcnRzLCBlYWNoIG9mIHdoaWNoIGNhbiBob2xkIGEgMS13aXJlIHRlbXBlcmF0dXJlIHNlbnNvclxyXG4gICAgLy8gVGhlIHNlbnNvcnMgYXJlIHBvbGxlZCBpbiBzZXF1ZW5jZSwgc3RhcnRpbmcgZnJvbSBwb3J0IDAgdG8gcG9ydCA3LlxyXG4gICAgLy8gV2UgZG8gbm90IGtub3cgaG93IG1hbnkgc2Vuc29ycyBhcmUgY29ubmVjdGVkIHVudGlsIHdlIHJlY2VpdmVkIHRoZSBjb25maWdcclxuICAgIC8vIGluIGEgVVNCIEhJRCByZXBvcnRcclxuXHJcbiAgICAvLyBUcmFjayB3aGF0IHNlbnNvciB3ZSBzaG91bGQgcmVxdWVzdCB2YWx1ZSBmcm9tIG5leHQgdGltZVxyXG4gICAgcHJvdGVjdGVkIG5leHRTZW5zb3I6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLy8gSW50ZXJmYWNlIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cclxuXHJcbiAgICBwdWJsaWMgaW5pdFJlcG9ydCgpOiBudW1iZXJbXVtdIHtcclxuICAgIC8vIFRoaXMgc3RhcnRzIHRoZSBwb2xsaW5nLiBGaXJzdCB3ZSBhc2sgdGhlIGRldmljZSBhYm91dCBzZW5zb3JzIGF0dGFjaGVkIGNvbmZpZ3VyYXRpb25cclxuICAgIC8vIFdlIGFsc28gcmVxdWVzdCB0ZW1wZXJhdHVyZSBmcm9tIHBvcnQgemVybyAoZm9yIHRoZSBzYWtlIG9mIGl0LCB1bmNsZWFyIHJlYXNvbilcclxuICAgICAgICB0aGlzLm5leHRTZW5zb3IgPSAwO1xyXG4gICAgICAgIHJldHVybiBbdGhpcy51c2VkUG9ydHNSZXF1ZXN0KCksIHRoaXMudGVtcGVyYXR1cmVSZXF1ZXN0KHRoaXMubmV4dFNlbnNvcildO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcGFyc2VzIGFsbCBpbnB1dCByZXBvcnRzIGFuZCBjaGVjayB3aGF0IHRvIGRvXHJcbiAgICAvLyBXZSBhcmUgaW50ZXJlc3RlZCBpbiB0d28gdHlwZXMgb2YgZGF0YSBmcm9tIHRoZSBkZXZpY2U6IHdoaWNoIHBvcnRzIGFyZSB1c2VkIGFuZFxyXG4gICAgLy8gdGhlIHRlbXBlcmF0dXJlIG9mIHRoZSBzZW5zb3JzIGNvbm5lY3RlZC5cclxuICAgIHB1YmxpYyBwYXJzZUlucHV0KGRhdGE6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hdGNoVXNlZFBvcnRzKGRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2cuZGVidWcoJysrKyBUZW1wZXI4Lm1hdGNoVXNlZFBvcnRzOicsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gdGhpcy50ZW1wZXJhdHVyZVJlcXVlc3QodGhpcy5zZW5zb3JzW3RoaXMubmV4dFNlbnNvcl0ucy5nZXRQb3J0KCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0U2Vuc29yICs9IDE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMubWF0Y2hUZW1wZXJhdHVyZShkYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCcrKysgVGVtcGVyOC5tYXRjaFRlbXBlcmF0dXJlOicsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm5leHRTZW5zb3IgPCB0aGlzLnNlbnNvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB0aGlzLnRlbXBlcmF0dXJlUmVxdWVzdCh0aGlzLnNlbnNvcnNbdGhpcy5uZXh0U2Vuc29yXS5zLiBnZXRQb3J0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFNlbnNvciArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dFNlbnNvciA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2swM1JlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoQ2hlY2swMyhkYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2swNVJlcXVlc3QoKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaENoZWNrMDUoZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrMERSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5tYXRjaENoZWNrMEQoZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm1hdGNoQ2hlY2tGRihkYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nLndhcm5pbmcoJyoqKiBUZW1wZXI4Lm1hdGNoQ2hlY2tGRjogcmVzdGFydD8nKTtcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgaW5kaWNhdGVzIGZhdWx0IGRldmljZVxyXG4gICAgICAgICAgICAgICAgLy8gRG9uJ3Qga25vdyB3aGV0aGVyIHRoZXJlIGlzIGEgd2F5IHRvIHJlY292ZXJcclxuICAgICAgICAgICAgICAgIC8vIE1heWJlIHJlc3RhcnRpbmcgdGhlIGRldmljZSBpcyBuZWNlc3NhcnkuXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcignKioqIFRlbXBlcjgubWF0Y2hDaGVja0ZGJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGxvZy5lcnJvcihlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRlbXBlciA4IHNwZWNpZmljIG1ldGhvZHNcclxuICAgIC8vIFBvbGwgdXNlZCBwb3J0c1xyXG4gICAgcHJpdmF0ZSB1c2VkUG9ydHNSZXF1ZXN0KCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gWzB4MDEsIDB4OEEsIDB4MDEsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDBdO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSAgbWF0Y2hVc2VkUG9ydHMoZGF0YTogbnVtYmVyW10pOiBib29sZWFuIHtcclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIGlucHV0IHJlcG9ydCBzdGF0ZXMgc2Vuc29yc1xyXG4gICAgICAgIC8vIGNvbm5lY3RlZCB0byB0aGUgdGhpcy4gVGhlc2UgaGV4IHZhbHVlcyB3ZXJlIGZvdW5kIGJ5IHVzaW5nIHVzaW5nIFVTQmx5emVyXHJcbiAgICAgICAgLy8gSS5lLiB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBvbiB5b3VyIERldmljZSBkZXZpY2VcclxuXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSA4XHJcbiAgICAgICAgICAgICYmIGRhdGFbMF0gPT09IDB4OEFcclxuICAgICAgICAgICAgJiYgZGF0YVsxXSA9PT0gMHgwOFxyXG4gICAgICAgICAgICAmJiBkYXRhWzJdID09PSAweDAxXHJcbiAgICAgICAgICAgICYmIGRhdGFbM10gPT09IDB4MDEpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIEJ5dGUgNCBjb250YWlucyBubyBvZiBzZW5zb3JzIGFuZFxyXG4gICAgICAgICAgICAvLyBCeXRlIDUgY29udGFpbnMgYSBiaXQgYXJyYXkgb2YgY29ubmVjdGVkIHNlbnNvcnNcclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0U2Vuc29ycyhkYXRhWzRdLCBkYXRhWzVdKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIFBvbGwgdGVtcGVyYXR1cmUgYW5kIHVwZGF0ZSBzZW5zb3IgZGF0YVxyXG4gICAgcHJpdmF0ZSB0ZW1wZXJhdHVyZVJlcXVlc3QocG9ydDogbnVtYmVyKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbMHgwMSwgMHg4MCwgMHgwMSwgMHgwMCwgMHgwMCwgcG9ydCwgMHgwMCwgMHgwMF07XHJcbiAgICB9XHJcbiAgICBwcml2YXRlICBtYXRjaFRlbXBlcmF0dXJlKGRhdGE6IG51bWJlcltdKSB7XHJcbiAgICAgICAgLy8gZ2V0IHRoZSB0ZW1wZXJhdHVyZSBhbmQgdXBkYXRlIHNlbnNvciB2YWx1ZVxyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIEhJRCBpbnB1dCByZXBvcnQgaXMgYSB0ZW1wZXJhdHVyZSByZXBvcnQsXHJcbiAgICAgICAgLy8gVGhlc2UgaGV4IHZhbHVlcyB3ZXJlIGZvdW5kIGJ5IGFuYWx5emluZyBVU0IgdXNpbmcgVVNCbHl6ZXIuXHJcbiAgICAgICAgLy8gSS5lLiB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBvbiB5b3VyIERldmljZSBkZXZpY2VcclxuICAgICAgICAvLyBieXRlIDQgY29udGFpbnMgdGhlIHBvcnQgbnVtYmVyLlxyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gOFxyXG4gICAgICAgICAgICAmJiBkYXRhWzBdID09PSAweDgwXHJcbiAgICAgICAgICAgICYmIGRhdGFbMV0gPT09IDB4MDhcclxuICAgICAgICAgICAgJiYgZGF0YVsyXSA9PT0gMHgwMSkge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJysrKyBtYXRjaFRlbXBlcmF0dXJlLCBkYXRhOiAlZCcsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICAgICAgY29uc3QgcG9ydDogbnVtYmVyID0gZGF0YVs0XTtcclxuICAgICAgICAgICAgY29uc3QgbXNiOiBudW1iZXIgPSBkYXRhWzVdO1xyXG4gICAgICAgICAgICBjb25zdCBsc2I6IG51bWJlciA9IGRhdGFbNl07XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBlcmF0dXJlQ2Vsc2l1czogbnVtYmVyID0gdGhpcy5HZXRUZW1wZXJhdHVyZShtc2IsIGxzYik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbnNvcihwb3J0LCB0ZW1wZXJhdHVyZUNlbHNpdXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSAgR2V0VGVtcGVyYXR1cmUobXNiOiBudW1iZXIsIGxzYjogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgdGVtcGVyYXR1cmU6IG51bWJlciA9IDAuMDtcclxuXHJcbiAgICAgICAgbGV0IHJlYWRpbmc6IG51bWJlciA9IChsc2IgJiAweEZGKSArIChtc2IgPDwgOCk7XHJcblxyXG4gICAgICAgIC8vIEFzc3VtZSBwb3NpdGl2ZSB0ZW1wZXJhdHVyZSB2YWx1ZVxyXG4gICAgICAgIGxldCByZXN1bHQ6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAgIGlmICgocmVhZGluZyAmIDB4ODAwMCkgPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIEJlbG93IHplcm9cclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBhYnNvbHV0ZSB2YWx1ZSBieSBjb252ZXJ0aW5nIHR3bydzIGNvbXBsZW1lbnRcclxuICAgICAgICAgICAgcmVhZGluZyA9IChyZWFkaW5nIF4gMHhmZmZmKSArIDE7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1lbWJlciBhIG5lZ2F0aXZlIHJlc3VsdFxyXG4gICAgICAgICAgICByZXN1bHQgPSAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoZSBlYXN0IHNpZ25pZmljYW50IGJpdCBpcyAyXi00IHNvIHdlIG5lZWQgdG8gZGl2aWRlIGJ5IDE2IHRvIGdldCBhYnNvbHV0ZSB0ZW1wZXJhdHVyZSBpbiBDZWxzaXVzXHJcbiAgICAgICAgLy8gTXVsdGlwbHkgaW4gdGhlIHJlc3VsdCB0byBnZXQgd2hldGhlciB0aGUgdGVtcGVyYXR1cmUgaXMgYmVsb3cgemVybyBkZWdyZWVzIGFuZCBjb252ZXJ0IHRvXHJcbiAgICAgICAgLy8gZmxvYXRpbmcgcG9pbnRcclxuICAgICAgICB0ZW1wZXJhdHVyZSA9IHJlc3VsdCAqIHJlYWRpbmcgLyAxNi4wO1xyXG5cclxuICAgICAgICByZXR1cm4gdGVtcGVyYXR1cmU7XHJcbiAgICB9XHJcbiAgICAvLyBQb2xsIGNoZWNrc1xyXG4gICAgcHJpdmF0ZSAgY2hlY2swM1JlcXVlc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIFsweDAxLCAweDhBLCAweDAxLCAweDAzLCAweDAwLCAweDAwLCAweDAwLCAweDAwXTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgIG1hdGNoQ2hlY2swMyhkYXRhOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gOFxyXG4gICAgICAgICAgICAmJiBkYXRhWzBdID09PSAweDhBXHJcbiAgICAgICAgICAgICYmIGRhdGFbMV0gPT09IDB4MDhcclxuICAgICAgICAgICAgJiYgZGF0YVsyXSA9PT0gMHgwMVxyXG4gICAgICAgICAgICAmJiBkYXRhWzNdID09PSAweDAzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNoZWNrMDVSZXF1ZXN0KCkge1xyXG4gICAgICAgIHJldHVybiBbMHgwMSwgMHg4QSwgMHgwMSwgMHgwNSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMF07XHJcbiAgICB9XHJcbiAgICBwcml2YXRlICBtYXRjaENoZWNrMDUoZGF0YTogbnVtYmVyW10pIHtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDhcclxuICAgICAgICAgICAgJiYgZGF0YVswXSA9PT0gMHg4QVxyXG4gICAgICAgICAgICAmJiBkYXRhWzFdID09PSAweDA4XHJcbiAgICAgICAgICAgICYmIGRhdGFbMl0gPT09IDB4MDFcclxuICAgICAgICAgICAgJiYgZGF0YVszXSA9PT0gMHgwNSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSAgY2hlY2swRFJlcXVlc3QoKSB7XHJcbiAgICAgICAgcmV0dXJuIFsweDAxLCAweDhBLCAweDAxLCAweDBELCAweDAwLCAweDAwLCAweDAwLCAweDAwXTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgIG1hdGNoQ2hlY2swRChkYXRhOiBudW1iZXJbXSkge1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gOFxyXG4gICAgICAgICAgICAmJiBkYXRhWzBdID09PSAweDhBXHJcbiAgICAgICAgICAgICYmIGRhdGFbMV0gPT09IDB4MDhcclxuICAgICAgICAgICAgJiYgZGF0YVsyXSA9PT0gMHgwMVxyXG4gICAgICAgICAgICAmJiBkYXRhWzNdID09PSAweDBEKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBwcml2YXRlICBjaGVja0ZGUmVxdWVzdCgpIHtcclxuICAgIC8vICAgICByZXR1cm4gWzB4RkYsIDB4RkYsIDB4RkYsIDB4RkYsIDB4RkYsIDB4RkYsIDB4RkYsIDB4RkZdO1xyXG4gICAgLy8gfVxyXG4gICAgcHJpdmF0ZSAgbWF0Y2hDaGVja0ZGKGRhdGE6IG51bWJlcltdKSB7XHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSA4XHJcbiAgICAgICAgICAgICYmIGRhdGFbMF0gPT09IDB4RkZcclxuICAgICAgICAgICAgJiYgZGF0YVsxXSA9PT0gMHhGRlxyXG4gICAgICAgICAgICAmJiBkYXRhWzJdID09PSAweEZGXHJcbiAgICAgICAgICAgICYmIGRhdGFbM10gPT09IDB4RkYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIl19
