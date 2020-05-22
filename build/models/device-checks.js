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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var device_data_1 = require("./device-data");
var device_state_1 = require("./device-state");
var os = __importStar(require("os"));
var logger_1 = require("../logger");
var DeviceChecks = (function (_super) {
    __extends(DeviceChecks, _super);
    function DeviceChecks() {
        return _super.call(this) || this;
    }
    DeviceChecks.prototype.check = function () {
        logger_1.log.debug('DeviceChecks.check');
        var data = new device_data_1.DeviceData();
        data.timestamp = Date.now();
        data.hostname = os.hostname();
        data.loadavg = os.loadavg();
        data.uptime = os.uptime();
        data.freemem = os.freemem();
        data.totalmem = os.totalmem();
        data.release = os.release();
        data.networkInterfaces = os.networkInterfaces();
        data.userInfo = os.userInfo();
        data.memoryUsage = process.memoryUsage();
        data.cpuUsage = process.cpuUsage();
        data.pid = process.pid;
        logger_1.log.debug('DeviceChecks.check data=' + JSON.stringify(data));
        this.updateDeviceData(data);
    };
    return DeviceChecks;
}(device_state_1.DeviceState));
exports.DeviceChecks = DeviceChecks;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvZGV2aWNlLWNoZWNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNkNBQTJDO0FBQzNDLCtDQUE2QztBQUU3QyxxQ0FBeUI7QUFFekIsb0NBQWdDO0FBRWhDO0lBQWtDLGdDQUFXO0lBR3pDO2VBQ0ksaUJBQU87SUFDWCxDQUFDO0lBRU0sNEJBQUssR0FBWjtRQUNJLFlBQUcsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUNoQyxJQUFNLElBQUksR0FBZSxJQUFJLHdCQUFVLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDaEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ3ZCLFlBQUcsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBR0wsbUJBQUM7QUFBRCxDQTNCQSxBQTJCQyxDQTNCaUMsMEJBQVcsR0EyQjVDO0FBM0JZLG9DQUFZIiwiZmlsZSI6Im1vZGVscy9kZXZpY2UtY2hlY2tzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IERldmljZURhdGEgfSBmcm9tICcuL2RldmljZS1kYXRhJztcclxuaW1wb3J0IHsgRGV2aWNlU3RhdGUgfSBmcm9tICcuL2RldmljZS1zdGF0ZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XHJcblxyXG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLi9sb2dnZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIERldmljZUNoZWNrcyBleHRlbmRzIERldmljZVN0YXRlIHtcclxuICAgIC8vIEludGVyZmFjZSBtZXRob2RzIGltcGxlbWVudGF0aW9uXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2hlY2soKTogdm9pZCB7XHJcbiAgICAgICAgbG9nLmRlYnVnKCdEZXZpY2VDaGVja3MuY2hlY2snKTtcclxuICAgICAgICBjb25zdCBkYXRhOiBEZXZpY2VEYXRhID0gbmV3IERldmljZURhdGEoKTtcclxuICAgICAgICBkYXRhLnRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgICAgICAgZGF0YS5ob3N0bmFtZSA9IG9zLmhvc3RuYW1lKCk7XHJcbiAgICAgICAgZGF0YS5sb2FkYXZnID0gb3MubG9hZGF2ZygpO1xyXG4gICAgICAgIGRhdGEudXB0aW1lID0gb3MudXB0aW1lKCk7XHJcbiAgICAgICAgZGF0YS5mcmVlbWVtID0gb3MuZnJlZW1lbSgpO1xyXG4gICAgICAgIGRhdGEudG90YWxtZW0gPSBvcy50b3RhbG1lbSgpO1xyXG4gICAgICAgIGRhdGEucmVsZWFzZSA9IG9zLnJlbGVhc2UoKTtcclxuICAgICAgICBkYXRhLm5ldHdvcmtJbnRlcmZhY2VzID0gb3MubmV0d29ya0ludGVyZmFjZXMoKTtcclxuICAgICAgICBkYXRhLnVzZXJJbmZvID0gb3MudXNlckluZm8oKTtcclxuICAgICAgICBkYXRhLm1lbW9yeVVzYWdlID0gcHJvY2Vzcy5tZW1vcnlVc2FnZSgpO1xyXG4gICAgICAgIGRhdGEuY3B1VXNhZ2UgPSBwcm9jZXNzLmNwdVVzYWdlKCk7XHJcbiAgICAgICAgZGF0YS5waWQgPSBwcm9jZXNzLnBpZDtcclxuICAgICAgICBsb2cuZGVidWcoJ0RldmljZUNoZWNrcy5jaGVjayBkYXRhPScgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVEZXZpY2VEYXRhKGRhdGEpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuIl19
