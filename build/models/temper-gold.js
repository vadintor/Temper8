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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvdGVtcGVyLWdvbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseURBQXVFO0FBQ3ZFLCtDQUE2QztBQUc3Qyx1Q0FBNkM7QUFFN0Msb0NBQWdDO0FBTWhDO0lBQWdDLDhCQUFXO0lBSXZDLG9CQUFZLE1BQWlCO1FBQTdCLFlBQ0ksa0JBQU0sSUFBSSxvQ0FBZ0IsQ0FDdEIsVUFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFDckIsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFDeEIsa0NBQWMsQ0FBQyxXQUFXLEVBQzFCLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FNbEI7UUFMRyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixtQkFBUSxDQUFDLFFBQVEsQ0FBQyxtQkFBUSxDQUFDLGFBQWEsRUFBRSxVQUFDLE9BQWdCO1lBQ3ZELEtBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDeEMsWUFBRyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLENBQUMsQ0FBQyxDQUFDOztJQUNQLENBQUM7SUFFYyxnQkFBSyxHQUFwQixVQUFxQixNQUFpQjtRQUNsQyxPQUFPLE1BQU0sQ0FBQyxZQUFZLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksYUFBYSxDQUFDO0lBQ3ZFLENBQUM7SUFFYyxhQUFFLEdBQWpCLFVBQWtCLE1BQWlCO1FBQy9CLE9BQU8sTUFBTSxDQUFDLFlBQVksSUFBSSxtQkFBUSxDQUFDLEdBQUcsQ0FBQyxtQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN4RixDQUFDO0lBQ00sb0NBQWUsR0FBdEI7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRU0sK0JBQVUsR0FBakIsVUFBa0IsSUFBYztRQUM1QixJQUFJO1lBQ0EsWUFBRyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QixZQUFHLENBQUMsT0FBTyxDQUFDLHVDQUF1QyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzlEO1NBQ0o7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFLTyx1Q0FBa0IsR0FBMUI7UUFDSSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFHUSxxQ0FBZ0IsR0FBekIsVUFBMEIsSUFBYztRQUtwQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztlQUNkLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJO2VBQ2hCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDckIsWUFBRyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUV0RCxJQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBTSxHQUFHLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQU0sa0JBQWtCLEdBQVcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFakUsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUksQ0FBQztTQUNmO2FBQU07WUFDSCxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7SUFDUSxtQ0FBYyxHQUF2QixVQUF3QixHQUFXLEVBQUUsR0FBVztRQUM1QyxJQUFJLFdBQVcsR0FBVyxHQUFHLENBQUM7UUFFOUIsSUFBSSxPQUFPLEdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFHaEQsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBR3hCLE9BQU8sR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFHakMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2Y7UUFLRCxXQUFXLEdBQUcsTUFBTSxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFdkMsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0E3RkEsQUE2RkMsQ0E3RitCLDBCQUFXLEdBNkYxQztBQTdGWSxnQ0FBVSIsImZpbGUiOiJtb2RlbHMvdGVtcGVyLWdvbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgU2Vuc29yQXR0cmlidXRlcywgU2Vuc29yQ2F0ZWdvcnkgfSBmcm9tICcuL3NlbnNvci1hdHRyaWJ1dGVzJztcclxuaW1wb3J0IHsgU2Vuc29yU3RhdGUgfSBmcm9tICcuL3NlbnNvci1zdGF0ZSc7XHJcbmltcG9ydCB7IFVTQkNvbmZpZywgVVNCUmVwb3J0ZXIgfSBmcm9tICcuL3VzYi1kZXZpY2UnO1xyXG5cclxuaW1wb3J0IHtTZXR0aW5nLCBTZXR0aW5nc30gZnJvbSAnLi9zZXR0aW5ncyc7XHJcblxyXG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLi9sb2dnZXInO1xyXG5cclxuXHJcbi8vIFRlbXBlciBHb2xkIHBhcnNlciB1bmRlcnN0YW5kcyBISUQgcmVwb3J0cyBmcm9tIFRlbXBlciBHb2xkIGRldmljZXNcclxuLy8gSW5kZXBlbmRlbnQgb2YgVVNCIGxpYiB1c2VkLlxyXG5cclxuZXhwb3J0IGNsYXNzIFRlbXBlckdvbGQgZXh0ZW5kcyBTZW5zb3JTdGF0ZSBpbXBsZW1lbnRzIFVTQlJlcG9ydGVyIHtcclxuICAgIC8vIEludGVyZmFjZSBtZXRob2RzIGltcGxlbWVudGF0aW9uXHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZzogVVNCQ29uZmlnKSB7XHJcbiAgICAgICAgc3VwZXIobmV3IFNlbnNvckF0dHJpYnV0ZXMgKFxyXG4gICAgICAgICAgICBUZW1wZXJHb2xkLlNOKGNvbmZpZyksXHJcbiAgICAgICAgICAgIFRlbXBlckdvbGQubW9kZWwoY29uZmlnKSxcclxuICAgICAgICAgICAgU2Vuc29yQ2F0ZWdvcnkuVGVtcGVyYXR1cmUsXHJcbiAgICAgICAgICAgIDIuMCwgMSwgMSkpO1xyXG4gICAgICAgIHRoaXMuY29ubmVjdFNlbnNvcnMoWzBdKTtcclxuICAgICAgICBTZXR0aW5ncy5vbkNoYW5nZShTZXR0aW5ncy5TRVJJQUxfTlVNQkVSLCAoc2V0dGluZzogU2V0dGluZykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmF0dHIuU04gPSBzZXR0aW5nLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnVGVtcGVyR29sZC5zZXR0aW5nQ2hhbmdlZDogU0VSSUFMX05VTUJFUj0nICsgdGhpcy5hdHRyLlNOKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBtb2RlbChjb25maWc6IFVTQkNvbmZpZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZy5tYW51ZmFjdHVyZXIgfHwgJycgKyBjb25maWcucHJvZHVjdCB8fCAnVGVtcGVyIEdvbGQnO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIFNOKGNvbmZpZzogVVNCQ29uZmlnKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gY29uZmlnLnNlcmlhbE51bWJlciB8fCBTZXR0aW5ncy5nZXQoU2V0dGluZ3MuU0VSSUFMX05VTUJFUikudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBpbml0V3JpdGVSZXBvcnQoKTogbnVtYmVyW11bXSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLnRlbXBlcmF0dXJlUmVxdWVzdCgpXTtcclxuICAgIH1cclxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcGFyc2VzIGFsbCBpbnB1dCByZXBvcnRzIGFuZCBjaGVjayB3aGF0IHRvIGRvXHJcbiAgICBwdWJsaWMgcmVhZFJlcG9ydChkYXRhOiBudW1iZXJbXSk6IG51bWJlcltdIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJ1RlbXBlckdvbGQucmVhZFJlcG9ydDogZGF0YT0nLCBkYXRhKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm1hdGNoVGVtcGVyYXR1cmUoZGF0YSkpIHtcclxuICAgICAgICAgICAgICAgIGxvZy53YXJuaW5nKCdUZW1wZXJHb2xkLnJlYWRSZXBvcnQ6IG5vIG1hdGNoIGRhdGE9JywgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUG9sbCB0ZW1wZXJhdHVyZSBhbmQgdXBkYXRlIHNlbnNvciBkYXRhXHJcblxyXG4gICAgLy8gYnl0ZSBzdHJpbmcgZm9yIHJlcXVlc3RpbmcgdGhlIHRlbXBlcmF0dXJlIGZyb20gVGVtcGVyIEdvbGRcclxuICAgIHByaXZhdGUgdGVtcGVyYXR1cmVSZXF1ZXN0KCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gWzB4MDEsIDB4ODAsIDB4MzMsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDBdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoaXMgbWV0aG9kcyB1cGRhdGUgc2Vuc29yIHN0YXRlIGlmIGRhdGEgY29udGFpbnMgdGhlIHRlbXBlcmF0dXJlIGJ5dGUgc3RyaW5nXHJcbiAgICBwcml2YXRlICBtYXRjaFRlbXBlcmF0dXJlKGRhdGE6IG51bWJlcltdKSB7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgaW5wdXQgcmVwb3J0IGlzIGEgdGVtcGVyYXR1cmUgcmVwb3J0LFxyXG4gICAgICAgIC8vIFRoZXNlIGhleCB2YWx1ZXMgd2VyZSBmb3VuZCBieSBhbmFseXppbmcgVVNCIHVzaW5nIFVTQmx5emVyLlxyXG4gICAgICAgIC8vIEkuZS4gdGhleSBtaWdodCBiZSBkaWZmZXJlbnQgb24geW91ciBEZXZpY2UgZGV2aWNlXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSA4XHJcbiAgICAgICAgICAgICYmIGRhdGFbMF0gPT09IDB4ODBcclxuICAgICAgICAgICAgJiYgZGF0YVsxXSA9PT0gMHgwMikge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJ1RlbXBlckdvbGQubWF0Y2hUZW1wZXJhdHVyZTogZGF0YT0nLCBkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1zYjogbnVtYmVyID0gZGF0YVsyXTtcclxuICAgICAgICAgICAgY29uc3QgbHNiOiBudW1iZXIgPSBkYXRhWzNdO1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wZXJhdHVyZUNlbHNpdXM6IG51bWJlciA9IHRoaXMuR2V0VGVtcGVyYXR1cmUobXNiLCBsc2IpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcG9ydCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2Vuc29yKHBvcnQsIHRlbXBlcmF0dXJlQ2Vsc2l1cyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlICBHZXRUZW1wZXJhdHVyZShtc2I6IG51bWJlciwgbHNiOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCB0ZW1wZXJhdHVyZTogbnVtYmVyID0gMC4wO1xyXG5cclxuICAgICAgICBsZXQgcmVhZGluZzogbnVtYmVyID0gKGxzYiAmIDB4RkYpICsgKG1zYiA8PCA4KTtcclxuXHJcbiAgICAgICAgLy8gQXNzdW1lIHBvc2l0aXZlIHRlbXBlcmF0dXJlIHZhbHVlXHJcbiAgICAgICAgbGV0IHJlc3VsdDogbnVtYmVyID0gMTtcclxuXHJcbiAgICAgICAgaWYgKChyZWFkaW5nICYgMHg4MDAwKSA+IDApIHtcclxuICAgICAgICAgICAgLy8gQmVsb3cgemVyb1xyXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGFic29sdXRlIHZhbHVlIGJ5IGNvbnZlcnRpbmcgdHdvJ3MgY29tcGxlbWVudFxyXG4gICAgICAgICAgICByZWFkaW5nID0gKHJlYWRpbmcgXiAweGZmZmYpICsgMTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbWVtYmVyIGEgbmVnYXRpdmUgcmVzdWx0XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGhlIGxlYXN0IHNpZ25pZmljYW50IGJpdCBpcyAyXi04IHNvIHdlIG5lZWQgdG8gZGl2aWRlIGJ5IDI1NiB0byBnZXQgYWJzb2x1dGUgdGVtcGVyYXR1cmUgaW4gQ2Vsc2l1c1xyXG4gICAgICAgIC8vIFRoZW4gd2UgbXVsdGlwbHkgaW4gdGhlIHJlc3VsdCB0byBnZXQgd2hldGhlciB0aGUgdGVtcGVyYXR1cmUgaXMgYmVsb3cgemVybyBkZWdyZWVzLiBXZSBjb252ZXJ0IHRvXHJcbiAgICAgICAgLy8gZmxvYXRpbmcgcG9pbnQgaW4gdGhlIHByb2Nlc3MuXHJcbiAgICAgICAgdGVtcGVyYXR1cmUgPSByZXN1bHQgKiByZWFkaW5nIC8gMjU2LjA7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZW1wZXJhdHVyZTtcclxuICAgIH1cclxufVxyXG4iXX0=
