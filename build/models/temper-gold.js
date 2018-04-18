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
            logger_1.log.debug('--- TemperGold.parseInput:', data);
            if (!this.matchTemperature(data)) {
                logger_1.log.warning('*** no match: ', data);
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
            logger_1.log.debug('+++ TemperGold.matchTemperature:', data);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvdGVtcGVyLWdvbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsK0NBQTZDO0FBRzdDLHNDQUFrQztBQU1sQztJQUFnQyw4QkFBVztJQUd2QztRQUFBLFlBQ0ksaUJBQU8sU0FFVjtRQURHLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUM5QixDQUFDO0lBQ00sK0JBQVUsR0FBakI7UUFDSSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSwrQkFBVSxHQUFqQixVQUFrQixJQUFjO1FBQzVCLElBQUksQ0FBQztZQUNELFlBQUcsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixZQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hDLENBQUM7UUFDTCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBS08sdUNBQWtCLEdBQTFCO1FBQ0ksTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFHUSxxQ0FBZ0IsR0FBekIsVUFBMEIsSUFBYztRQUtwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7ZUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSTtlQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixZQUFHLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BELElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNmLElBQU0sR0FBRyxHQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBTSxrQkFBa0IsR0FBVyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVqRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO0lBQ0wsQ0FBQztJQUNRLG1DQUFjLEdBQXZCLFVBQXdCLEdBQVcsRUFBRSxHQUFXO1FBQzVDLElBQUksV0FBVyxHQUFXLEdBQUcsQ0FBQztRQUU5QixJQUFJLE9BQU8sR0FBVyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUdoRCxJQUFJLE1BQU0sR0FBVyxDQUFDLENBQUM7UUFFdkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUd6QixPQUFPLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBR2pDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoQixDQUFDO1FBS0QsV0FBVyxHQUFHLE1BQU0sR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0EzRUEsQUEyRUMsQ0EzRStCLDBCQUFXLEdBMkUxQztBQTNFWSxnQ0FBVSIsImZpbGUiOiJtb2RlbHMvdGVtcGVyLWdvbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgU2Vuc29yU3RhdGUgfSBmcm9tICcuL3NlbnNvci1zdGF0ZSc7XHJcbmltcG9ydCB7IFJlcG9ydFBhcnNlciB9IGZyb20gJy4vdXNiLWNvbnRyb2xsZXInO1xyXG5cclxuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi8uLi9sb2dnZXInO1xyXG5cclxuXHJcbi8vIFRlbXBlciBHb2xkIHBhcnNlciB1bmRlcnN0YW5kcyBISUQgcmVwb3J0cyBmcm9tIFRlbXBlcjggZGV2aWNlc1xyXG4vLyBJbmRlcGVuZGVudCBvZiBVU0IgbGliIHVzZWQuXHJcblxyXG5leHBvcnQgY2xhc3MgVGVtcGVyR29sZCBleHRlbmRzIFNlbnNvclN0YXRlIGltcGxlbWVudHMgUmVwb3J0UGFyc2VyIHtcclxuICAgIC8vIEludGVyZmFjZSBtZXRob2RzIGltcGxlbWVudGF0aW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RTZW5zb3JzKDEsIDEpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGluaXRSZXBvcnQoKTogbnVtYmVyW11bXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLnRlbXBlcmF0dXJlUmVxdWVzdCgpXTtcclxuICAgIH1cclxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcGFyc2VzIGFsbCBpbnB1dCByZXBvcnRzIGFuZCBjaGVjayB3aGF0IHRvIGRvXHJcbiAgICBwdWJsaWMgcGFyc2VJbnB1dChkYXRhOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJy0tLSBUZW1wZXJHb2xkLnBhcnNlSW5wdXQ6JywgZGF0YSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaFRlbXBlcmF0dXJlKGRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2cud2FybmluZygnKioqIG5vIG1hdGNoOiAnLCBkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQb2xsIHRlbXBlcmF0dXJlIGFuZCB1cGRhdGUgc2Vuc29yIGRhdGFcclxuXHJcbiAgICAvLyBieXRlIHN0cmluZyBmb3IgcmVxdWVzdGluZyB0aGUgdGVtcGVyYXR1cmUgZnJvbSBUZW1wZXIgR29sZFxyXG4gICAgcHJpdmF0ZSB0ZW1wZXJhdHVyZVJlcXVlc3QoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbMHgwMSwgMHg4MCwgMHgzMywgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMF07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhpcyBtZXRob2RzIHVwZGF0ZSBzZW5zb3Igc3RhdGUgaWYgZGF0YSBjb250YWlucyB0aGUgdGVtcGVyYXR1cmUgYnl0ZSBzdHJpbmdcclxuICAgIHByaXZhdGUgIG1hdGNoVGVtcGVyYXR1cmUoZGF0YTogbnVtYmVyW10pIHtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBpbnB1dCByZXBvcnQgaXMgYSB0ZW1wZXJhdHVyZSByZXBvcnQsXHJcbiAgICAgICAgLy8gVGhlc2UgaGV4IHZhbHVlcyB3ZXJlIGZvdW5kIGJ5IGFuYWx5emluZyBVU0IgdXNpbmcgVVNCbHl6ZXIuXHJcbiAgICAgICAgLy8gSS5lLiB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBvbiB5b3VyIERldmljZSBkZXZpY2VcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDhcclxuICAgICAgICAgICAgJiYgZGF0YVswXSA9PT0gMHg4MFxyXG4gICAgICAgICAgICAmJiBkYXRhWzFdID09PSAweDAyKSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnKysrIFRlbXBlckdvbGQubWF0Y2hUZW1wZXJhdHVyZTonLCBkYXRhKTtcclxuICAgICAgICAgICAgY29uc3QgcG9ydCA9IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IG1zYjogbnVtYmVyID0gZGF0YVsyXTtcclxuICAgICAgICAgICAgY29uc3QgbHNiOiBudW1iZXIgPSBkYXRhWzNdO1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wZXJhdHVyZUNlbHNpdXM6IG51bWJlciA9IHRoaXMuR2V0VGVtcGVyYXR1cmUobXNiLCBsc2IpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTZW5zb3IocG9ydCwgdGVtcGVyYXR1cmVDZWxzaXVzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgIEdldFRlbXBlcmF0dXJlKG1zYjogbnVtYmVyLCBsc2I6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IHRlbXBlcmF0dXJlOiBudW1iZXIgPSAwLjA7XHJcblxyXG4gICAgICAgIGxldCByZWFkaW5nOiBudW1iZXIgPSAobHNiICYgMHhGRikgKyAobXNiIDw8IDgpO1xyXG5cclxuICAgICAgICAvLyBBc3N1bWUgcG9zaXRpdmUgdGVtcGVyYXR1cmUgdmFsdWVcclxuICAgICAgICBsZXQgcmVzdWx0OiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgICBpZiAoKHJlYWRpbmcgJiAweDgwMDApID4gMCkge1xyXG4gICAgICAgICAgICAvLyBCZWxvdyB6ZXJvXHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgYWJzb2x1dGUgdmFsdWUgYnkgY29udmVydGluZyB0d28ncyBjb21wbGVtZW50XHJcbiAgICAgICAgICAgIHJlYWRpbmcgPSAocmVhZGluZyBeIDB4ZmZmZikgKyAxO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVtZW1iZXIgYSBuZWdhdGl2ZSByZXN1bHRcclxuICAgICAgICAgICAgcmVzdWx0ID0gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGUgZWFzdCBzaWduaWZpY2FudCBiaXQgaXMgMl4tOCBzbyB3ZSBuZWVkIHRvIGRpdmlkZSBieSAyNTYgdG8gZ2V0IGFic29sdXRlIHRlbXBlcmF0dXJlIGluIENlbHNpdXNcclxuICAgICAgICAvLyBUaGVuIHdlIG11bHRpcGx5IGluIHRoZSByZXN1bHQgdG8gZ2V0IHdoZXRoZXIgdGhlIHRlbXBlcmF0dXJlIGlzIGJlbG93IHplcm8gZGVncmVlcyBhbmQgY29udmVydCB0b1xyXG4gICAgICAgIC8vIGZsb2F0aW5nIHBvaW50XHJcbiAgICAgICAgdGVtcGVyYXR1cmUgPSByZXN1bHQgKiByZWFkaW5nIC8gMjU2LjA7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZW1wZXJhdHVyZTtcclxuICAgIH1cclxufVxyXG4iXX0=
