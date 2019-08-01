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
var sensor_attributes_1 = require("./sensor-attributes");
var sensor_state_1 = require("./sensor-state");
var logger_1 = require("../logger");
var TemperGold = (function (_super) {
    __extends(TemperGold, _super);
    function TemperGold() {
        var _this = _super.call(this, new sensor_attributes_1.SensorAttributes('TGold', 'Temper Gold', sensor_attributes_1.SensorCategory.Temperature, 2.0, 1, 1)) || this;
        _this.connectSensors([0]);
        return _this;
    }
    TemperGold.prototype.initWriteReport = function () {
        return [this.temperatureRequest()];
    };
    TemperGold.prototype.readReport = function (data) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvdGVtcGVyLWdvbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EseURBQXVFO0FBQ3ZFLCtDQUE2QztBQUc3QyxvQ0FBZ0M7QUFNaEM7SUFBZ0MsOEJBQVc7SUFHdkM7UUFBQSxZQUNJLGtCQUFNLElBQUksb0NBQWdCLENBQ3RCLE9BQU8sRUFDUCxhQUFhLEVBQ2Isa0NBQWMsQ0FBQyxXQUFXLEVBQzFCLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FFbEI7UUFERyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7SUFDN0IsQ0FBQztJQUNNLG9DQUFlLEdBQXRCO1FBQ0ksT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLCtCQUFVLEdBQWpCLFVBQWtCLElBQWM7UUFDNUIsSUFBSTtZQUNBLFlBQUcsQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDOUIsWUFBRyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN2QztTQUNKO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBS08sdUNBQWtCLEdBQTFCO1FBQ0ksT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBR1EscUNBQWdCLEdBQXpCLFVBQTBCLElBQWM7UUFLcEMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7ZUFDZCxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSTtlQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ3JCLFlBQUcsQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFcEQsSUFBTSxHQUFHLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQU0sR0FBRyxHQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFNLGtCQUFrQixHQUFXLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRWpFLElBQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDNUMsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFNO1lBQ0gsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBQ1EsbUNBQWMsR0FBdkIsVUFBd0IsR0FBVyxFQUFFLEdBQVc7UUFDNUMsSUFBSSxXQUFXLEdBQVcsR0FBRyxDQUFDO1FBRTlCLElBQUksT0FBTyxHQUFXLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBR2hELElBQUksTUFBTSxHQUFXLENBQUMsQ0FBQztRQUV2QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUd4QixPQUFPLEdBQUcsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBR2pDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNmO1FBS0QsV0FBVyxHQUFHLE1BQU0sR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXZDLE9BQU8sV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFDTCxpQkFBQztBQUFELENBaEZBLEFBZ0ZDLENBaEYrQiwwQkFBVyxHQWdGMUM7QUFoRlksZ0NBQVUiLCJmaWxlIjoibW9kZWxzL3RlbXBlci1nb2xkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IFNlbnNvckF0dHJpYnV0ZXMsIFNlbnNvckNhdGVnb3J5IH0gZnJvbSAnLi9zZW5zb3ItYXR0cmlidXRlcyc7XHJcbmltcG9ydCB7IFNlbnNvclN0YXRlIH0gZnJvbSAnLi9zZW5zb3Itc3RhdGUnO1xyXG5pbXBvcnQgeyBVU0JSZXBvcnRlciB9IGZyb20gJy4vdXNiLWRldmljZSc7XHJcblxyXG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLi9sb2dnZXInO1xyXG5cclxuXHJcbi8vIFRlbXBlciBHb2xkIHBhcnNlciB1bmRlcnN0YW5kcyBISUQgcmVwb3J0cyBmcm9tIFRlbXBlcjggZGV2aWNlc1xyXG4vLyBJbmRlcGVuZGVudCBvZiBVU0IgbGliIHVzZWQuXHJcblxyXG5leHBvcnQgY2xhc3MgVGVtcGVyR29sZCBleHRlbmRzIFNlbnNvclN0YXRlIGltcGxlbWVudHMgVVNCUmVwb3J0ZXIge1xyXG4gICAgLy8gSW50ZXJmYWNlIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihuZXcgU2Vuc29yQXR0cmlidXRlcyAoXHJcbiAgICAgICAgICAgICdUR29sZCcsXHJcbiAgICAgICAgICAgICdUZW1wZXIgR29sZCcsXHJcbiAgICAgICAgICAgIFNlbnNvckNhdGVnb3J5LlRlbXBlcmF0dXJlLFxyXG4gICAgICAgICAgICAyLjAsIDEsIDEpKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3RTZW5zb3JzKFswXSk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaW5pdFdyaXRlUmVwb3J0KCk6IG51bWJlcltdW10ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy50ZW1wZXJhdHVyZVJlcXVlc3QoKV07XHJcbiAgICB9XHJcbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHBhcnNlcyBhbGwgaW5wdXQgcmVwb3J0cyBhbmQgY2hlY2sgd2hhdCB0byBkb1xyXG4gICAgcHVibGljIHJlYWRSZXBvcnQoZGF0YTogbnVtYmVyW10pOiBudW1iZXJbXSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKCctLS0gVGVtcGVyR29sZC5wYXJzZUlucHV0OicsIGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMubWF0Y2hUZW1wZXJhdHVyZShkYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nLndhcm5pbmcoJyoqKiBubyBtYXRjaDogJywgZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUG9sbCB0ZW1wZXJhdHVyZSBhbmQgdXBkYXRlIHNlbnNvciBkYXRhXHJcblxyXG4gICAgLy8gYnl0ZSBzdHJpbmcgZm9yIHJlcXVlc3RpbmcgdGhlIHRlbXBlcmF0dXJlIGZyb20gVGVtcGVyIEdvbGRcclxuICAgIHByaXZhdGUgdGVtcGVyYXR1cmVSZXF1ZXN0KCk6IG51bWJlcltdIHtcclxuICAgICAgICByZXR1cm4gWzB4MDEsIDB4ODAsIDB4MzMsIDB4MDEsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDBdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoaXMgbWV0aG9kcyB1cGRhdGUgc2Vuc29yIHN0YXRlIGlmIGRhdGEgY29udGFpbnMgdGhlIHRlbXBlcmF0dXJlIGJ5dGUgc3RyaW5nXHJcbiAgICBwcml2YXRlICBtYXRjaFRlbXBlcmF0dXJlKGRhdGE6IG51bWJlcltdKSB7XHJcblxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgaW5wdXQgcmVwb3J0IGlzIGEgdGVtcGVyYXR1cmUgcmVwb3J0LFxyXG4gICAgICAgIC8vIFRoZXNlIGhleCB2YWx1ZXMgd2VyZSBmb3VuZCBieSBhbmFseXppbmcgVVNCIHVzaW5nIFVTQmx5emVyLlxyXG4gICAgICAgIC8vIEkuZS4gdGhleSBtaWdodCBiZSBkaWZmZXJlbnQgb24geW91ciBEZXZpY2UgZGV2aWNlXHJcbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID09PSA4XHJcbiAgICAgICAgICAgICYmIGRhdGFbMF0gPT09IDB4ODBcclxuICAgICAgICAgICAgJiYgZGF0YVsxXSA9PT0gMHgwMikge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJysrKyBUZW1wZXJHb2xkLm1hdGNoVGVtcGVyYXR1cmU6JywgZGF0YSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtc2I6IG51bWJlciA9IGRhdGFbMl07XHJcbiAgICAgICAgICAgIGNvbnN0IGxzYjogbnVtYmVyID0gZGF0YVszXTtcclxuICAgICAgICAgICAgY29uc3QgdGVtcGVyYXR1cmVDZWxzaXVzOiBudW1iZXIgPSB0aGlzLkdldFRlbXBlcmF0dXJlKG1zYiwgbHNiKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBvcnQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNlbnNvcihwb3J0LCB0ZW1wZXJhdHVyZUNlbHNpdXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSAgR2V0VGVtcGVyYXR1cmUobXNiOiBudW1iZXIsIGxzYjogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgdGVtcGVyYXR1cmU6IG51bWJlciA9IDAuMDtcclxuXHJcbiAgICAgICAgbGV0IHJlYWRpbmc6IG51bWJlciA9IChsc2IgJiAweEZGKSArIChtc2IgPDwgOCk7XHJcblxyXG4gICAgICAgIC8vIEFzc3VtZSBwb3NpdGl2ZSB0ZW1wZXJhdHVyZSB2YWx1ZVxyXG4gICAgICAgIGxldCByZXN1bHQ6IG51bWJlciA9IDE7XHJcblxyXG4gICAgICAgIGlmICgocmVhZGluZyAmIDB4ODAwMCkgPiAwKSB7XHJcbiAgICAgICAgICAgIC8vIEJlbG93IHplcm9cclxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBhYnNvbHV0ZSB2YWx1ZSBieSBjb252ZXJ0aW5nIHR3bydzIGNvbXBsZW1lbnRcclxuICAgICAgICAgICAgcmVhZGluZyA9IChyZWFkaW5nIF4gMHhmZmZmKSArIDE7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1lbWJlciBhIG5lZ2F0aXZlIHJlc3VsdFxyXG4gICAgICAgICAgICByZXN1bHQgPSAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRoZSBsZWFzdCBzaWduaWZpY2FudCBiaXQgaXMgMl4tOCBzbyB3ZSBuZWVkIHRvIGRpdmlkZSBieSAyNTYgdG8gZ2V0IGFic29sdXRlIHRlbXBlcmF0dXJlIGluIENlbHNpdXNcclxuICAgICAgICAvLyBUaGVuIHdlIG11bHRpcGx5IGluIHRoZSByZXN1bHQgdG8gZ2V0IHdoZXRoZXIgdGhlIHRlbXBlcmF0dXJlIGlzIGJlbG93IHplcm8gZGVncmVlcy4gV2UgY29udmVydCB0b1xyXG4gICAgICAgIC8vIGZsb2F0aW5nIHBvaW50IGluIHRoZSBwcm9jZXNzLlxyXG4gICAgICAgIHRlbXBlcmF0dXJlID0gcmVzdWx0ICogcmVhZGluZyAvIDI1Ni4wO1xyXG5cclxuICAgICAgICByZXR1cm4gdGVtcGVyYXR1cmU7XHJcbiAgICB9XHJcbn1cclxuIl19
