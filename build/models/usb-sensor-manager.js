"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HID = require("node-hid");
var sensor_attributes_1 = require("./sensor-attributes");
var temper_8_1 = require("./temper-8");
var temper_gold_1 = require("./temper-gold");
var usb_controller_1 = require("./usb-controller");
var sensor_logger_1 = require("./../services/sensor-logger");
var logger_1 = require("./../logger");
var DeviceConfig = (function () {
    function DeviceConfig() {
    }
    return DeviceConfig;
}());
exports.DeviceConfig = DeviceConfig;
var VID = 0x0C45;
var PID = 0x7401;
var TEMPER_GOLD = 'TEMPerV1.4';
var TEMPER_8 = 'TEMPer8_V1.5';
var INTERFACE = 1;
function isTemperGold(device) {
    return (device.vendorId === VID &&
        device.productId === PID &&
        device.product === TEMPER_GOLD &&
        device.interface === INTERFACE);
}
exports.isTemperGold = isTemperGold;
function isTemper8(device) {
    return (device.vendorId === VID &&
        device.productId === PID &&
        device.product === TEMPER_8 &&
        device.interface === INTERFACE);
}
exports.isTemper8 = isTemper8;
var USBSensorManager = (function () {
    function USBSensorManager() {
    }
    USBSensorManager.getLoggers = function () {
        return USBSensorManager.loggers;
    };
    USBSensorManager.factory = function () {
        HID.devices().find(function (device) {
            if (isTemperGold(device) && device.path !== undefined) {
                logger_1.log.info('Sensor TEMPer Gold found');
                var hid = new HID.HID(device.path);
                var temperGold = new temper_gold_1.TemperGold();
                var attr = {
                    SN: 'TGold',
                    model: 'Temper Gold',
                    category: sensor_attributes_1.SensorCategory.Temperature,
                    accuracy: 2.0,
                    resolution: 1,
                    maxSampleRate: 1,
                };
                var logger = new sensor_logger_1.SensorLogger(attr, temperGold);
                logger.startLogging();
                USBSensorManager.loggers.push(logger);
                var temperGoldDevice = new usb_controller_1.USBController(hid, temperGold);
                USBSensorManager.devices.push(temperGoldDevice);
            }
            else if (isTemper8(device) && device.path !== undefined) {
                logger_1.log.info('Sensor TEMPer 8 found');
                var hid = new HID.HID(device.path);
                var temper8 = new temper_8_1.Temper8();
                var attr = {
                    SN: 'Temper8',
                    model: 'Temper 8',
                    category: sensor_attributes_1.SensorCategory.Temperature,
                    accuracy: 0.5,
                    resolution: 1,
                    maxSampleRate: 0.2,
                };
                var logger = new sensor_logger_1.SensorLogger(attr, temper8);
                logger.startLogging();
                USBSensorManager.loggers.push(logger);
                var temper8Device = new usb_controller_1.USBController(hid, temper8);
                USBSensorManager.devices.push(temper8Device);
            }
            return false;
        });
    };
    USBSensorManager.devices = [];
    USBSensorManager.loggers = [];
    return USBSensorManager;
}());
exports.USBSensorManager = USBSensorManager;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvdXNiLXNlbnNvci1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOEJBQWlDO0FBQ2pDLHlEQUFxRDtBQUVyRCx1Q0FBcUM7QUFDckMsNkNBQTJDO0FBQzNDLG1EQUFpRDtBQUVqRCw2REFBMkQ7QUFFM0Qsc0NBQWtDO0FBRWxDO0lBQUE7SUFLSSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUxKLEFBS0ssSUFBQTtBQUxRLG9DQUFZO0FBT3pCLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQztBQUNuQixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUM7QUFDbkIsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDO0FBQ2pDLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztBQUNoQyxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFHcEIsc0JBQTZCLE1BQWtCO0lBQzNDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssR0FBRztRQUMzQixNQUFNLENBQUMsU0FBUyxLQUFLLEdBQUc7UUFDeEIsTUFBTSxDQUFDLE9BQU8sS0FBSyxXQUFXO1FBQzlCLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUxELG9DQUtDO0FBRUQsbUJBQTBCLE1BQWtCO0lBQ3hDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssR0FBRztRQUMzQixNQUFNLENBQUMsU0FBUyxLQUFLLEdBQUc7UUFDeEIsTUFBTSxDQUFDLE9BQU8sS0FBSyxRQUFRO1FBQzNCLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUxELDhCQUtDO0FBQ0Q7SUFBQTtJQW1EQSxDQUFDO0lBL0NpQiwyQkFBVSxHQUF4QjtRQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7SUFDcEMsQ0FBQztJQUVhLHdCQUFPLEdBQXJCO1FBQ0ksR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07WUFDckIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsWUFBRyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO2dCQUNyQyxJQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQyxJQUFNLFVBQVUsR0FBRyxJQUFJLHdCQUFVLEVBQUUsQ0FBQztnQkFDcEMsSUFBTSxJQUFJLEdBQUc7b0JBQ0wsRUFBRSxFQUFFLE9BQU87b0JBQ1gsS0FBSyxFQUFFLGFBQWE7b0JBQ3BCLFFBQVEsRUFBRSxrQ0FBYyxDQUFDLFdBQVc7b0JBQ3BDLFFBQVEsRUFBRSxHQUFHO29CQUNiLFVBQVUsRUFBRSxDQUFDO29CQUNiLGFBQWEsRUFBRSxDQUFDO2lCQUNuQixDQUFDO2dCQUNOLElBQU0sTUFBTSxHQUFHLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdEIsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEMsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLDhCQUFhLENBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUM3RCxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFcEQsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxZQUFHLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ2xDLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JDLElBQU0sT0FBTyxHQUFHLElBQUksa0JBQU8sRUFBRSxDQUFDO2dCQUM5QixJQUFNLElBQUksR0FBRztvQkFDVCxFQUFFLEVBQUUsU0FBUztvQkFDYixLQUFLLEVBQUUsVUFBVTtvQkFDakIsUUFBUSxFQUFFLGtDQUFjLENBQUMsV0FBVztvQkFDcEMsUUFBUSxFQUFFLEdBQUc7b0JBQ2IsVUFBVSxFQUFFLENBQUM7b0JBQ2IsYUFBYSxFQUFFLEdBQUc7aUJBQ3JCLENBQUM7Z0JBQ0YsSUFBTSxNQUFNLEdBQUcsSUFBSSw0QkFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUN0QixnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0QyxJQUFNLGFBQWEsR0FBRyxJQUFJLDhCQUFhLENBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN2RCxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRWpELENBQUM7WUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQWhEYyx3QkFBTyxHQUFvQixFQUFFLENBQUM7SUFDOUIsd0JBQU8sR0FBbUIsRUFBRSxDQUFDO0lBaURoRCx1QkFBQztDQW5ERCxBQW1EQyxJQUFBO0FBbkRZLDRDQUFnQiIsImZpbGUiOiJtb2RlbHMvdXNiLXNlbnNvci1tYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhJRCA9IHJlcXVpcmUoJ25vZGUtaGlkJyk7XHJcbmltcG9ydCB7IFNlbnNvckNhdGVnb3J5IH0gZnJvbSAnLi9zZW5zb3ItYXR0cmlidXRlcyc7XHJcbmltcG9ydCB7IFNlbnNvclN0YXRlIH0gZnJvbSAnLi9zZW5zb3Itc3RhdGUnO1xyXG5pbXBvcnQgeyBUZW1wZXI4IH0gZnJvbSAnLi90ZW1wZXItOCc7XHJcbmltcG9ydCB7IFRlbXBlckdvbGQgfSBmcm9tICcuL3RlbXBlci1nb2xkJztcclxuaW1wb3J0IHsgVVNCQ29udHJvbGxlciB9IGZyb20gJy4vdXNiLWNvbnRyb2xsZXInO1xyXG5cclxuaW1wb3J0IHsgU2Vuc29yTG9nZ2VyIH0gZnJvbSAnLi8uLi9zZXJ2aWNlcy9zZW5zb3ItbG9nZ2VyJztcclxuXHJcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4vLi4vbG9nZ2VyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBEZXZpY2VDb25maWcge1xyXG4gICAgICAgIHZlbmRvcklkOiBudW1iZXI7XHJcbiAgICAgICAgcHJvZHVjdElkOiBudW1iZXI7XHJcbiAgICAgICAgcHJvZHVjdDogc3RyaW5nO1xyXG4gICAgICAgIGludGVyZmFjZTogbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuY29uc3QgVklEID0gMHgwQzQ1O1xyXG5jb25zdCBQSUQgPSAweDc0MDE7XHJcbmNvbnN0IFRFTVBFUl9HT0xEID0gJ1RFTVBlclYxLjQnO1xyXG5jb25zdCBURU1QRVJfOCA9ICdURU1QZXI4X1YxLjUnO1xyXG5jb25zdCBJTlRFUkZBQ0UgPSAxO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RlbXBlckdvbGQoZGV2aWNlOiBISUQuRGV2aWNlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKGRldmljZS52ZW5kb3JJZCA9PT0gVklEICYmXHJcbiAgICAgICAgZGV2aWNlLnByb2R1Y3RJZCA9PT0gUElEICYmXHJcbiAgICAgICAgZGV2aWNlLnByb2R1Y3QgPT09IFRFTVBFUl9HT0xEICYmXHJcbiAgICAgICAgZGV2aWNlLmludGVyZmFjZSA9PT0gSU5URVJGQUNFKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVGVtcGVyOChkZXZpY2U6IEhJRC5EZXZpY2UpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAoZGV2aWNlLnZlbmRvcklkID09PSBWSUQgJiZcclxuICAgICAgICBkZXZpY2UucHJvZHVjdElkID09PSBQSUQgJiZcclxuICAgICAgICBkZXZpY2UucHJvZHVjdCA9PT0gVEVNUEVSXzggJiZcclxuICAgICAgICBkZXZpY2UuaW50ZXJmYWNlID09PSBJTlRFUkZBQ0UpO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBVU0JTZW5zb3JNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGRldmljZXM6IFVTQkNvbnRyb2xsZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9nZ2VyczogU2Vuc29yTG9nZ2VyW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldExvZ2dlcnMoKTogU2Vuc29yTG9nZ2VyW10ge1xyXG4gICAgICAgIHJldHVybiBVU0JTZW5zb3JNYW5hZ2VyLmxvZ2dlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBmYWN0b3J5KCk6IHZvaWQge1xyXG4gICAgICAgIEhJRC5kZXZpY2VzKCkuZmluZChkZXZpY2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNUZW1wZXJHb2xkKGRldmljZSkgJiYgZGV2aWNlLnBhdGggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbG9nLmluZm8oJ1NlbnNvciBURU1QZXIgR29sZCBmb3VuZCcpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGlkID0gbmV3IEhJRC5ISUQoZGV2aWNlLnBhdGgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcGVyR29sZCA9IG5ldyBUZW1wZXJHb2xkKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTTjogJ1RHb2xkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWw6ICdUZW1wZXIgR29sZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBTZW5zb3JDYXRlZ29yeS5UZW1wZXJhdHVyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjdXJhY3k6IDIuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x1dGlvbjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2FtcGxlUmF0ZTogMSxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9nZ2VyID0gbmV3IFNlbnNvckxvZ2dlcihhdHRyLCB0ZW1wZXJHb2xkKTtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci5zdGFydExvZ2dpbmcoKTtcclxuICAgICAgICAgICAgICAgIFVTQlNlbnNvck1hbmFnZXIubG9nZ2Vycy5wdXNoKGxvZ2dlcik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wZXJHb2xkRGV2aWNlID0gbmV3IFVTQkNvbnRyb2xsZXIgKGhpZCwgdGVtcGVyR29sZCk7XHJcbiAgICAgICAgICAgICAgICBVU0JTZW5zb3JNYW5hZ2VyLmRldmljZXMucHVzaCh0ZW1wZXJHb2xkRGV2aWNlKTtcclxuICAgICAgICAgICAgICAgIC8vIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzVGVtcGVyOChkZXZpY2UpICYmIGRldmljZS5wYXRoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGxvZy5pbmZvKCdTZW5zb3IgVEVNUGVyIDggZm91bmQnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhpZCA9IG5ldyBISUQuSElEKGRldmljZS5wYXRoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBlcjggPSBuZXcgVGVtcGVyOCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXR0ciA9IHtcclxuICAgICAgICAgICAgICAgICAgICBTTjogJ1RlbXBlcjgnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsOiAnVGVtcGVyIDgnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBTZW5zb3JDYXRlZ29yeS5UZW1wZXJhdHVyZSxcclxuICAgICAgICAgICAgICAgICAgICBhY2N1cmFjeTogMC41LFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdXRpb246IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4U2FtcGxlUmF0ZTogMC4yLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxvZ2dlciA9IG5ldyBTZW5zb3JMb2dnZXIoYXR0ciwgdGVtcGVyOCk7XHJcbiAgICAgICAgICAgICAgICBsb2dnZXIuc3RhcnRMb2dnaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBVU0JTZW5zb3JNYW5hZ2VyLmxvZ2dlcnMucHVzaChsb2dnZXIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcGVyOERldmljZSA9IG5ldyBVU0JDb250cm9sbGVyIChoaWQsIHRlbXBlcjgpO1xyXG4gICAgICAgICAgICAgICAgVVNCU2Vuc29yTWFuYWdlci5kZXZpY2VzLnB1c2godGVtcGVyOERldmljZSk7XHJcbiAgICAgICAgICAgICAgIC8vIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19
