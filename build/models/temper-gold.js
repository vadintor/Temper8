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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvdGVtcGVyLWdvbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsK0NBQTZDO0FBRzdDLHNDQUFrQztBQU1sQztJQUFnQyw4QkFBVztJQUd2QztRQUFBLFlBQ0ksaUJBQU8sU0FFVjtRQURHLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUM5QixDQUFDO0lBQ00sK0JBQVUsR0FBakI7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRU0sK0JBQVUsR0FBakIsVUFBa0IsSUFBYztRQUM1QixJQUFJO1lBQ0EsWUFBRyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QixZQUFHLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3ZDO1NBQ0o7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFLTyx1Q0FBa0IsR0FBMUI7UUFDSSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFHUSxxQ0FBZ0IsR0FBekIsVUFBMEIsSUFBYztRQUtwQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztlQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJO2VBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDckIsWUFBRyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVwRCxJQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBTSxHQUFHLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQU0sa0JBQWtCLEdBQVcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFakUsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUksQ0FBQztTQUNmO2FBQU07WUFDSCxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7SUFDUSxtQ0FBYyxHQUF2QixVQUF3QixHQUFXLEVBQUUsR0FBVztRQUM1QyxJQUFJLFdBQVcsR0FBVyxHQUFHLENBQUM7UUFFOUIsSUFBSSxPQUFPLEdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFHaEQsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBR3hCLE9BQU8sR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFHakMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2Y7UUFLRCxXQUFXLEdBQUcsTUFBTSxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFdkMsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0E1RUEsQUE0RUMsQ0E1RStCLDBCQUFXLEdBNEUxQztBQTVFWSxnQ0FBVSIsImZpbGUiOiJtb2RlbHMvdGVtcGVyLWdvbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgU2Vuc29yU3RhdGUgfSBmcm9tICcuL3NlbnNvci1zdGF0ZSc7XHJcbmltcG9ydCB7IFJlcG9ydFBhcnNlciB9IGZyb20gJy4vdXNiLWNvbnRyb2xsZXInO1xyXG5cclxuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi8uLi9sb2dnZXInO1xyXG5cclxuXHJcbi8vIFRlbXBlciBHb2xkIHBhcnNlciB1bmRlcnN0YW5kcyBISUQgcmVwb3J0cyBmcm9tIFRlbXBlcjggZGV2aWNlc1xyXG4vLyBJbmRlcGVuZGVudCBvZiBVU0IgbGliIHVzZWQuXHJcblxyXG5leHBvcnQgY2xhc3MgVGVtcGVyR29sZCBleHRlbmRzIFNlbnNvclN0YXRlIGltcGxlbWVudHMgUmVwb3J0UGFyc2VyIHtcclxuICAgIC8vIEludGVyZmFjZSBtZXRob2RzIGltcGxlbWVudGF0aW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RTZW5zb3JzKDEsIDEpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGluaXRSZXBvcnQoKTogbnVtYmVyW11bXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLnRlbXBlcmF0dXJlUmVxdWVzdCgpXTtcclxuICAgIH1cclxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcGFyc2VzIGFsbCBpbnB1dCByZXBvcnRzIGFuZCBjaGVjayB3aGF0IHRvIGRvXHJcbiAgICBwdWJsaWMgcGFyc2VJbnB1dChkYXRhOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJy0tLSBUZW1wZXJHb2xkLnBhcnNlSW5wdXQ6JywgZGF0YSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaFRlbXBlcmF0dXJlKGRhdGEpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2cud2FybmluZygnKioqIG5vIG1hdGNoOiAnLCBkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQb2xsIHRlbXBlcmF0dXJlIGFuZCB1cGRhdGUgc2Vuc29yIGRhdGFcclxuXHJcbiAgICAvLyBieXRlIHN0cmluZyBmb3IgcmVxdWVzdGluZyB0aGUgdGVtcGVyYXR1cmUgZnJvbSBUZW1wZXIgR29sZFxyXG4gICAgcHJpdmF0ZSB0ZW1wZXJhdHVyZVJlcXVlc3QoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbMHgwMSwgMHg4MCwgMHgzMywgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMF07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhpcyBtZXRob2RzIHVwZGF0ZSBzZW5zb3Igc3RhdGUgaWYgZGF0YSBjb250YWlucyB0aGUgdGVtcGVyYXR1cmUgYnl0ZSBzdHJpbmdcclxuICAgIHByaXZhdGUgIG1hdGNoVGVtcGVyYXR1cmUoZGF0YTogbnVtYmVyW10pIHtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBpbnB1dCByZXBvcnQgaXMgYSB0ZW1wZXJhdHVyZSByZXBvcnQsXHJcbiAgICAgICAgLy8gVGhlc2UgaGV4IHZhbHVlcyB3ZXJlIGZvdW5kIGJ5IGFuYWx5emluZyBVU0IgdXNpbmcgVVNCbHl6ZXIuXHJcbiAgICAgICAgLy8gSS5lLiB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBvbiB5b3VyIERldmljZSBkZXZpY2VcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDhcclxuICAgICAgICAgICAgJiYgZGF0YVswXSA9PT0gMHg4MFxyXG4gICAgICAgICAgICAmJiBkYXRhWzFdID09PSAweDAyKSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnKysrIFRlbXBlckdvbGQubWF0Y2hUZW1wZXJhdHVyZTonLCBkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1zYjogbnVtYmVyID0gZGF0YVsyXTtcclxuICAgICAgICAgICAgY29uc3QgbHNiOiBudW1iZXIgPSBkYXRhWzNdO1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wZXJhdHVyZUNlbHNpdXM6IG51bWJlciA9IHRoaXMuR2V0VGVtcGVyYXR1cmUobXNiLCBsc2IpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcG9ydCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2Vuc29yKHBvcnQsIHRlbXBlcmF0dXJlQ2Vsc2l1cyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlICBHZXRUZW1wZXJhdHVyZShtc2I6IG51bWJlciwgbHNiOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCB0ZW1wZXJhdHVyZTogbnVtYmVyID0gMC4wO1xyXG5cclxuICAgICAgICBsZXQgcmVhZGluZzogbnVtYmVyID0gKGxzYiAmIDB4RkYpICsgKG1zYiA8PCA4KTtcclxuXHJcbiAgICAgICAgLy8gQXNzdW1lIHBvc2l0aXZlIHRlbXBlcmF0dXJlIHZhbHVlXHJcbiAgICAgICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMTtcclxuXHJcbiAgICAgICAgaWYgKChyZWFkaW5nICYgMHg4MDAwKSA+IDApIHtcclxuICAgICAgICAgICAgLy8gQmVsb3cgemVyb1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGFic29sdXRlIHZhbHVlIGJ5IGNvbnZlcnRpbmcgdHdvJ3MgY29tcGxlbWVudFxyXG4gICAgICAgICAgICByZWFkaW5nID0gKHJlYWRpbmcgXiAweGZmZmYpICsgMTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbWVtYmVyIGEgbmVnYXRpdmUgcmVzdWx0XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdCBpcyAyXi04IHNvIHdlIG5lZWQgdG8gZGl2aWRlIGJ5IDI1NiB0byBnZXQgYWJzb2x1dGUgdGVtcGVyYXR1cmUgaW4gQ2Vsc2l1c1xyXG4gICAgICAgIC8vIFRoZW4gd2UgbXVsdGlwbHkgaW4gdGhlIHJlc3VsdCB0byBnZXQgd2hldGhlciB0aGUgdGVtcGVyYXR1cmUgaXMgYmVsb3cgemVybyBkZWdyZWVzLiBXZSBjb252ZXJ0IHRvXHJcbiAgICAgICAgLy8gZmxvYXRpbmcgcG9pbnQgaW4gdGhlIHByb2Nlc3MuXHJcbiAgICAgICAgdGVtcGVyYXR1cmUgPSByZXN1bHQgKiByZWFkaW5nIC8gMjU2LjA7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZW1wZXJhdHVyZTtcclxuICAgIH1cclxufVxyXG4iXX0=
