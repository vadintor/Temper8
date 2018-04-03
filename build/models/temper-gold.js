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
var TemperGold = (function (_super) {
    __extends(TemperGold, _super);
    function TemperGold() {
        var _this = _super.call(this) || this;
        _this.connectSensors(1, 1);
        return _this;
    }
    TemperGold.prototype.initReport = function () {
        return [this.temperatureRequest()];
    };
    TemperGold.prototype.parseInput = function (data) {
        try {
            logger_1.log.debug('--- TemperGold.parseInput:', JSON.stringify(data));
            if (!this.matchTemperature(data)) {
                logger_1.log.warning('*** no match: ', JSON.stringify(data));
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
            logger_1.log.debug('+++ TemperGold.matchTemperature:', JSON.stringify(data));
            var port = 0;
            var msb = data[2];
            var lsb = data[3];
            var temperatureCelsius = this.GetTemperature(msb, lsb);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvdGVtcGVyLWdvbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsK0NBQTZDO0FBRzdDLHNDQUFrQztBQU1sQztJQUFnQyw4QkFBVztJQUd2QztRQUFBLFlBQ0ksaUJBQU8sU0FFVjtRQURHLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUM5QixDQUFDO0lBQ00sK0JBQVUsR0FBakI7UUFDSSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSwrQkFBVSxHQUFqQixVQUFrQixJQUFjO1FBQzVCLElBQUksQ0FBQztZQUNELFlBQUcsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzlELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsWUFBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDeEQsQ0FBQztRQUNMLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixDQUFDO1FBQ0QsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFLTyx1Q0FBa0IsR0FBMUI7UUFDSSxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUdRLHFDQUFnQixHQUF6QixVQUEwQixJQUFjO1FBS3BDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztlQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJO2VBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLFlBQUcsQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNmLElBQU0sR0FBRyxHQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBTSxrQkFBa0IsR0FBVyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVqRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO0lBQ0wsQ0FBQztJQUNRLG1DQUFjLEdBQXZCLFVBQXdCLEdBQVcsRUFBRSxHQUFXO1FBQzVDLElBQUksV0FBVyxHQUFXLEdBQUcsQ0FBQztRQUU5QixJQUFJLE9BQU8sR0FBVyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUdoRCxJQUFJLE1BQU0sR0FBVyxDQUFDLENBQUM7UUFFdkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUd6QixPQUFPLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBR2pDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoQixDQUFDO1FBS0QsV0FBVyxHQUFHLE1BQU0sR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0EzRUEsQUEyRUMsQ0EzRStCLDBCQUFXLEdBMkUxQztBQTNFWSxnQ0FBVSIsImZpbGUiOiJtb2RlbHMvdGVtcGVyLWdvbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgU2Vuc29yU3RhdGUgfSBmcm9tICcuL3NlbnNvci1zdGF0ZSc7XHJcbmltcG9ydCB7IFJlcG9ydFBhcnNlciB9IGZyb20gJy4vdXNiLWNvbnRyb2xsZXInO1xyXG5cclxuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi8uLi9sb2dnZXInO1xyXG5cclxuXHJcbi8vIFRlbXBlciBHb2xkIHBhcnNlciB1bmRlcnN0YW5kcyBISUQgcmVwb3J0cyBmcm9tIFRlbXBlcjggZGV2aWNlc1xyXG4vLyBJbmRlcGVuZGVudCBvZiBVU0IgbGliIHVzZWQuXHJcblxyXG5leHBvcnQgY2xhc3MgVGVtcGVyR29sZCBleHRlbmRzIFNlbnNvclN0YXRlIGltcGxlbWVudHMgUmVwb3J0UGFyc2VyIHtcclxuICAgIC8vIEludGVyZmFjZSBtZXRob2RzIGltcGxlbWVudGF0aW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RTZW5zb3JzKDEsIDEpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGluaXRSZXBvcnQoKTogbnVtYmVyW11bXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLnRlbXBlcmF0dXJlUmVxdWVzdCgpXTtcclxuICAgIH1cclxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcGFyc2VzIGFsbCBpbnB1dCByZXBvcnRzIGFuZCBjaGVjayB3aGF0IHRvIGRvXHJcbiAgICBwdWJsaWMgcGFyc2VJbnB1dChkYXRhOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJy0tLSBUZW1wZXJHb2xkLnBhcnNlSW5wdXQ6JywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMubWF0Y2hUZW1wZXJhdHVyZShkYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nLndhcm5pbmcoJyoqKiBubyBtYXRjaDogJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBvbGwgdGVtcGVyYXR1cmUgYW5kIHVwZGF0ZSBzZW5zb3IgZGF0YVxyXG5cclxuICAgIC8vIGJ5dGUgc3RyaW5nIGZvciByZXF1ZXN0aW5nIHRoZSB0ZW1wZXJhdHVyZSBmcm9tIFRlbXBlciBHb2xkXHJcbiAgICBwcml2YXRlIHRlbXBlcmF0dXJlUmVxdWVzdCgpOiBudW1iZXJbXSB7XHJcbiAgICAgICAgcmV0dXJuIFsweDAxLCAweDgwLCAweDMzLCAweDAxLCAweDAwLCAweDAwLCAweDAwLCAweDAwXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUaGlzIG1ldGhvZHMgdXBkYXRlIHNlbnNvciBzdGF0ZSBpZiBkYXRhIGNvbnRhaW5zIHRoZSB0ZW1wZXJhdHVyZSBieXRlIHN0cmluZ1xyXG4gICAgcHJpdmF0ZSAgbWF0Y2hUZW1wZXJhdHVyZShkYXRhOiBudW1iZXJbXSkge1xyXG5cclxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIGlucHV0IHJlcG9ydCBpcyBhIHRlbXBlcmF0dXJlIHJlcG9ydCxcclxuICAgICAgICAvLyBUaGVzZSBoZXggdmFsdWVzIHdlcmUgZm91bmQgYnkgYW5hbHl6aW5nIFVTQiB1c2luZyBVU0JseXplci5cclxuICAgICAgICAvLyBJLmUuIHRoZXkgbWlnaHQgYmUgZGlmZmVyZW50IG9uIHlvdXIgRGV2aWNlIGRldmljZVxyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gOFxyXG4gICAgICAgICAgICAmJiBkYXRhWzBdID09PSAweDgwXHJcbiAgICAgICAgICAgICYmIGRhdGFbMV0gPT09IDB4MDIpIHtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKCcrKysgVGVtcGVyR29sZC5tYXRjaFRlbXBlcmF0dXJlOicsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICAgICAgY29uc3QgcG9ydCA9IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IG1zYjogbnVtYmVyID0gZGF0YVsyXTtcclxuICAgICAgICAgICAgY29uc3QgbHNiOiBudW1iZXIgPSBkYXRhWzNdO1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wZXJhdHVyZUNlbHNpdXM6IG51bWJlciA9IHRoaXMuR2V0VGVtcGVyYXR1cmUobXNiLCBsc2IpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTZW5zb3IocG9ydCwgdGVtcGVyYXR1cmVDZWxzaXVzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgIEdldFRlbXBlcmF0dXJlKG1zYjogbnVtYmVyLCBsc2I6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IHRlbXBlcmF0dXJlOiBudW1iZXIgPSAwLjA7XHJcblxyXG4gICAgICAgIGxldCByZWFkaW5nOiBudW1iZXIgPSAobHNiICYgMHhGRikgKyAobXNiIDw8IDgpO1xyXG5cclxuICAgICAgICAvLyBBc3N1bWUgcG9zaXRpdmUgdGVtcGVyYXR1cmUgdmFsdWVcclxuICAgICAgICBsZXQgcmVzdWx0OiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgICBpZiAoKHJlYWRpbmcgJiAweDgwMDApID4gMCkge1xyXG4gICAgICAgICAgICAvLyBCZWxvdyB6ZXJvXHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgYWJzb2x1dGUgdmFsdWUgYnkgY29udmVydGluZyB0d28ncyBjb21wbGVtZW50XHJcbiAgICAgICAgICAgIHJlYWRpbmcgPSAocmVhZGluZyBeIDB4ZmZmZikgKyAxO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVtZW1iZXIgYSBuZWdhdGl2ZSByZXN1bHRcclxuICAgICAgICAgICAgcmVzdWx0ID0gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGUgZWFzdCBzaWduaWZpY2FudCBiaXQgaXMgMl4tOCBzbyB3ZSBuZWVkIHRvIGRpdmlkZSBieSAyNTYgdG8gZ2V0IGFic29sdXRlIHRlbXBlcmF0dXJlIGluIENlbHNpdXNcclxuICAgICAgICAvLyBUaGVuIHdlIG11bHRpcGx5IGluIHRoZSByZXN1bHQgdG8gZ2V0IHdoZXRoZXIgdGhlIHRlbXBlcmF0dXJlIGlzIGJlbG93IHplcm8gZGVncmVlcyBhbmQgY29udmVydCB0b1xyXG4gICAgICAgIC8vIGZsb2F0aW5nIHBvaW50XHJcbiAgICAgICAgdGVtcGVyYXR1cmUgPSByZXN1bHQgKiByZWFkaW5nIC8gMjU2LjA7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZW1wZXJhdHVyZTtcclxuICAgIH1cclxufVxyXG4iXX0=
