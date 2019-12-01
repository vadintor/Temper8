"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sensor_attributes_1 = require("./sensor-attributes");
var sensor_state_1 = require("./sensor-state");
var settings_1 = require("./settings");
var logger_1 = require("../logger");
var TemperGold = (function (_super) {
    __extends(TemperGold, _super);
    function TemperGold(config) {
        var _this = _super.call(this, new sensor_attributes_1.SensorAttributes(TemperGold.SN(config), TemperGold.model(config), sensor_attributes_1.SensorCategory.Temperature, 2.0, 1, 1)) || this;
        _this.connectSensors([0]);
        settings_1.Settings.onChange(settings_1.Settings.SERIAL_NUMBER, function (setting) {
            _this.attr.SN = setting.value.toString();
            logger_1.log.debug('TemperGold.settingChanged: SERIAL_NUMBER=' + _this.attr.SN);
        });
        return _this;
    }
    TemperGold.model = function (config) {
        return config.manufacturer || '' + config.product || 'Temper Gold';
    };
    TemperGold.SN = function (config) {
        return config.serialNumber || settings_1.Settings.get(settings_1.Settings.SERIAL_NUMBER).value.toString();
    };
    TemperGold.prototype.initWriteReport = function () {
        return [this.temperatureRequest()];
    };
    TemperGold.prototype.readReport = function (data) {
        try {
            logger_1.log.debug('TemperGold.readReport: data=', data);
            if (!this.matchTemperature(data)) {
                logger_1.log.warning('TemperGold.readReport: no match data=', data);
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
            logger_1.log.debug('TemperGold.matchTemperature: data=', data);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvdGVtcGVyLWdvbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseURBQXVFO0FBQ3ZFLCtDQUE2QztBQUc3Qyx1Q0FBNkM7QUFFN0Msb0NBQWdDO0FBTWhDO0lBQWdDLDhCQUFXO0lBSXZDLG9CQUFZLE1BQWlCO1FBQTdCLFlBQ0ksa0JBQU0sSUFBSSxvQ0FBZ0IsQ0FDdEIsVUFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFDckIsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFDeEIsa0NBQWMsQ0FBQyxXQUFXLEVBQzFCLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FNbEI7UUFMRyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixtQkFBUSxDQUFDLFFBQVEsQ0FBQyxtQkFBUSxDQUFDLGFBQWEsRUFBRSxVQUFDLE9BQWdCO1lBQ3ZELEtBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDeEMsWUFBRyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDOztJQUNQLENBQUM7SUFFYyxnQkFBSyxHQUFwQixVQUFxQixNQUFpQjtRQUNsQyxPQUFPLE1BQU0sQ0FBQyxZQUFZLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksYUFBYSxDQUFDO0lBQ3ZFLENBQUM7SUFFYyxhQUFFLEdBQWpCLFVBQWtCLE1BQWlCO1FBQy9CLE9BQU8sTUFBTSxDQUFDLFlBQVksSUFBSSxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxtQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN4RixDQUFDO0lBQ00sb0NBQWUsR0FBdEI7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRU0sK0JBQVUsR0FBakIsVUFBa0IsSUFBYztRQUM1QixJQUFJO1lBQ0EsWUFBRyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QixZQUFHLENBQUMsT0FBTyxDQUFDLHVDQUF1QyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzlEO1NBQ0o7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFLTyx1Q0FBa0IsR0FBMUI7UUFDSSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFHUSxxQ0FBZ0IsR0FBekIsVUFBMEIsSUFBYztRQUtwQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztlQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJO2VBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDckIsWUFBRyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUV0RCxJQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBTSxHQUFHLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQU0sa0JBQWtCLEdBQVcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFakUsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUksQ0FBQztTQUNmO2FBQU07WUFDSCxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7SUFDUSxtQ0FBYyxHQUF2QixVQUF3QixHQUFXLEVBQUUsR0FBVztRQUM1QyxJQUFJLFdBQVcsR0FBVyxHQUFHLENBQUM7UUFFOUIsSUFBSSxPQUFPLEdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFHaEQsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBR3hCLE9BQU8sR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFHakMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2Y7UUFLRCxXQUFXLEdBQUcsTUFBTSxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFdkMsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0E3RkEsQUE2RkMsQ0E3RitCLDBCQUFXLEdBNkYxQztBQTdGWSxnQ0FBVSIsImZpbGUiOiJtb2RlbHMvdGVtcGVyLWdvbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgU2Vuc29yQXR0cmlidXRlcywgU2Vuc29yQ2F0ZWdvcnkgfSBmcm9tICcuL3NlbnNvci1hdHRyaWJ1dGVzJztcclxuaW1wb3J0IHsgU2Vuc29yU3RhdGUgfSBmcm9tICcuL3NlbnNvci1zdGF0ZSc7XHJcbmltcG9ydCB7IFVTQkNvbmZpZywgVVNCUmVwb3J0ZXIgfSBmcm9tICcuL3VzYi1kZXZpY2UnO1xyXG5cclxuaW1wb3J0IHtTZXR0aW5nLCBTZXR0aW5nc30gZnJvbSAnLi9zZXR0aW5ncyc7XHJcblxyXG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLi9sb2dnZXInO1xyXG5cclxuXHJcbi8vIFRlbXBlciBHb2xkIHBhcnNlciB1bmRlcnN0YW5kcyBISUQgcmVwb3J0cyBmcm9tIFRlbXBlcjggZGV2aWNlc1xyXG4vLyBJbmRlcGVuZGVudCBvZiBVU0IgbGliIHVzZWQuXHJcblxyXG5leHBvcnQgY2xhc3MgVGVtcGVyR29sZCBleHRlbmRzIFNlbnNvclN0YXRlIGltcGxlbWVudHMgVVNCUmVwb3J0ZXIge1xyXG4gICAgLy8gSW50ZXJmYWNlIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoY29uZmlnOiBVU0JDb25maWcpIHtcclxuICAgICAgICBzdXBlcihuZXcgU2Vuc29yQXR0cmlidXRlcyAoXHJcbiAgICAgICAgICAgIFRlbXBlckdvbGQuU04oY29uZmlnKSxcclxuICAgICAgICAgICAgVGVtcGVyR29sZC5tb2RlbChjb25maWcpLFxyXG4gICAgICAgICAgICBTZW5zb3JDYXRlZ29yeS5UZW1wZXJhdHVyZSxcclxuICAgICAgICAgICAgMi4wLCAxLCAxKSk7XHJcbiAgICAgICAgdGhpcy5jb25uZWN0U2Vuc29ycyhbMF0pO1xyXG4gICAgICAgIFNldHRpbmdzLm9uQ2hhbmdlKFNldHRpbmdzLlNFUklBTF9OVU1CRVIsIChzZXR0aW5nOiBTZXR0aW5nKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXR0ci5TTiA9IHNldHRpbmcudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKCdUZW1wZXJHb2xkLnNldHRpbmdDaGFuZ2VkOiBTRVJJQUxfTlVNQkVSPScgKyB0aGlzLmF0dHIuU04pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIG1vZGVsKGNvbmZpZzogVVNCQ29uZmlnKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gY29uZmlnLm1hbnVmYWN0dXJlciB8fCAnJyArIGNvbmZpZy5wcm9kdWN0IHx8ICdUZW1wZXIgR29sZCc7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgU04oY29uZmlnOiBVU0JDb25maWcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBjb25maWcuc2VyaWFsTnVtYmVyIHx8IFNldHRpbmdzLmdldChTZXR0aW5ncy5TRVJJQUxfTlVNQkVSKS52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGluaXRXcml0ZVJlcG9ydCgpOiBudW1iZXJbXVtdIHtcclxuICAgICAgICByZXR1cm4gW3RoaXMudGVtcGVyYXR1cmVSZXF1ZXN0KCldO1xyXG4gICAgfVxyXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBwYXJzZXMgYWxsIGlucHV0IHJlcG9ydHMgYW5kIGNoZWNrIHdoYXQgdG8gZG9cclxuICAgIHB1YmxpYyByZWFkUmVwb3J0KGRhdGE6IG51bWJlcltdKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnVGVtcGVyR29sZC5yZWFkUmVwb3J0OiBkYXRhPScsIGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMubWF0Y2hUZW1wZXJhdHVyZShkYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nLndhcm5pbmcoJ1RlbXBlckdvbGQucmVhZFJlcG9ydDogbm8gbWF0Y2ggZGF0YT0nLCBkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBQb2xsIHRlbXBlcmF0dXJlIGFuZCB1cGRhdGUgc2Vuc29yIGRhdGFcclxuXHJcbiAgICAvLyBieXRlIHN0cmluZyBmb3IgcmVxdWVzdGluZyB0aGUgdGVtcGVyYXR1cmUgZnJvbSBUZW1wZXIgR29sZFxyXG4gICAgcHJpdmF0ZSB0ZW1wZXJhdHVyZVJlcXVlc3QoKTogbnVtYmVyW10ge1xyXG4gICAgICAgIHJldHVybiBbMHgwMSwgMHg4MCwgMHgzMywgMHgwMSwgMHgwMCwgMHgwMCwgMHgwMCwgMHgwMF07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhpcyBtZXRob2RzIHVwZGF0ZSBzZW5zb3Igc3RhdGUgaWYgZGF0YSBjb250YWlucyB0aGUgdGVtcGVyYXR1cmUgYnl0ZSBzdHJpbmdcclxuICAgIHByaXZhdGUgIG1hdGNoVGVtcGVyYXR1cmUoZGF0YTogbnVtYmVyW10pIHtcclxuXHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBpbnB1dCByZXBvcnQgaXMgYSB0ZW1wZXJhdHVyZSByZXBvcnQsXHJcbiAgICAgICAgLy8gVGhlc2UgaGV4IHZhbHVlcyB3ZXJlIGZvdW5kIGJ5IGFuYWx5emluZyBVU0IgdXNpbmcgVVNCbHl6ZXIuXHJcbiAgICAgICAgLy8gSS5lLiB0aGV5IG1pZ2h0IGJlIGRpZmZlcmVudCBvbiB5b3VyIERldmljZSBkZXZpY2VcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDhcclxuICAgICAgICAgICAgJiYgZGF0YVswXSA9PT0gMHg4MFxyXG4gICAgICAgICAgICAmJiBkYXRhWzFdID09PSAweDAyKSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnVGVtcGVyR29sZC5tYXRjaFRlbXBlcmF0dXJlOiBkYXRhPScsIGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbXNiOiBudW1iZXIgPSBkYXRhWzJdO1xyXG4gICAgICAgICAgICBjb25zdCBsc2I6IG51bWJlciA9IGRhdGFbM107XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBlcmF0dXJlQ2Vsc2l1czogbnVtYmVyID0gdGhpcy5HZXRUZW1wZXJhdHVyZShtc2IsIGxzYik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb3J0ID0gMDtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTZW5zb3IocG9ydCwgdGVtcGVyYXR1cmVDZWxzaXVzKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgIEdldFRlbXBlcmF0dXJlKG1zYjogbnVtYmVyLCBsc2I6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IHRlbXBlcmF0dXJlOiBudW1iZXIgPSAwLjA7XHJcblxyXG4gICAgICAgIGxldCByZWFkaW5nOiBudW1iZXIgPSAobHNiICYgMHhGRikgKyAobXNiIDw8IDgpO1xyXG5cclxuICAgICAgICAvLyBBc3N1bWUgcG9zaXRpdmUgdGVtcGVyYXR1cmUgdmFsdWVcclxuICAgICAgICBsZXQgcmVzdWx0OiBudW1iZXIgPSAxO1xyXG5cclxuICAgICAgICBpZiAoKHJlYWRpbmcgJiAweDgwMDApID4gMCkge1xyXG4gICAgICAgICAgICAvLyBCZWxvdyB6ZXJvXHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgYWJzb2x1dGUgdmFsdWUgYnkgY29udmVydGluZyB0d28ncyBjb21wbGVtZW50XHJcbiAgICAgICAgICAgIHJlYWRpbmcgPSAocmVhZGluZyBeIDB4ZmZmZikgKyAxO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVtZW1iZXIgYSBuZWdhdGl2ZSByZXN1bHRcclxuICAgICAgICAgICAgcmVzdWx0ID0gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUaGUgbGVhc3Qgc2lnbmlmaWNhbnQgYml0IGlzIDJeLTggc28gd2UgbmVlZCB0byBkaXZpZGUgYnkgMjU2IHRvIGdldCBhYnNvbHV0ZSB0ZW1wZXJhdHVyZSBpbiBDZWxzaXVzXHJcbiAgICAgICAgLy8gVGhlbiB3ZSBtdWx0aXBseSBpbiB0aGUgcmVzdWx0IHRvIGdldCB3aGV0aGVyIHRoZSB0ZW1wZXJhdHVyZSBpcyBiZWxvdyB6ZXJvIGRlZ3JlZXMuIFdlIGNvbnZlcnQgdG9cclxuICAgICAgICAvLyBmbG9hdGluZyBwb2ludCBpbiB0aGUgcHJvY2Vzcy5cclxuICAgICAgICB0ZW1wZXJhdHVyZSA9IHJlc3VsdCAqIHJlYWRpbmcgLyAyNTYuMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRlbXBlcmF0dXJlO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==
