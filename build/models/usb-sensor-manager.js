"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HID = require("node-hid");
var sensor_attributes_1 = require("./sensor-attributes");
var temper_8_1 = require("./temper-8");
var temper_gold_1 = require("./temper-gold");
var usb_controller_1 = require("./usb-controller");
var sensor_log_1 = require("./sensor-log");
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
            logger_1.log.debug('device: ', device);
            if (isTemperGold(device) && device.path !== undefined) {
                logger_1.log.info('Sensor TEMPer Gold found: ', device);
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
                var logger = new sensor_log_1.SensorLog(attr, temperGold);
                logger.startLogging();
                USBSensorManager.loggers.push(logger);
                var temperGoldDevice = new usb_controller_1.USBController(hid, temperGold);
                USBSensorManager.devices.push(temperGoldDevice);
            }
            else if (isTemper8(device) && device.path !== undefined) {
                logger_1.log.info('Sensor TEMPer 8 found: ', device);
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
                var logger = new sensor_log_1.SensorLog(attr, temper8);
                logger.startLogging();
                USBSensorManager.loggers.push(logger);
                var temper8Device = new usb_controller_1.USBController(hid, temper8);
                USBSensorManager.devices.push(temper8Device);
            }
            return false;
        });
        if (USBSensorManager.devices.length === 0) {
            logger_1.log.error('Found 0 devices');
        }
        else {
            logger_1.log.info('Found %d device(s)', USBSensorManager.devices.length);
        }
    };
    USBSensorManager.setPollingInterval = function (ms) {
        logger_1.log.debug('USBSensorManager.setPollingInterval:', ms);
        for (var _i = 0, _a = USBSensorManager.devices; _i < _a.length; _i++) {
            var device = _a[_i];
            logger_1.log.debug('USBSensorManager.setPollingInterval - device');
            device.setPollingInterval(ms);
        }
    };
    USBSensorManager.devices = [];
    USBSensorManager.loggers = [];
    return USBSensorManager;
}());
exports.USBSensorManager = USBSensorManager;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvdXNiLXNlbnNvci1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOEJBQWlDO0FBQ2pDLHlEQUFxRDtBQUVyRCx1Q0FBcUM7QUFDckMsNkNBQTJDO0FBQzNDLG1EQUFpRDtBQUVqRCwyQ0FBeUM7QUFFekMsc0NBQWtDO0FBRWxDO0lBQUE7SUFLSSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUxKLEFBS0ssSUFBQTtBQUxRLG9DQUFZO0FBT3pCLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQztBQUNuQixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUM7QUFDbkIsSUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDO0FBQ2pDLElBQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztBQUNoQyxJQUFNLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFHcEIsc0JBQTZCLE1BQWtCO0lBQzNDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssR0FBRztRQUMzQixNQUFNLENBQUMsU0FBUyxLQUFLLEdBQUc7UUFDeEIsTUFBTSxDQUFDLE9BQU8sS0FBSyxXQUFXO1FBQzlCLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUxELG9DQUtDO0FBRUQsbUJBQTBCLE1BQWtCO0lBQ3hDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssR0FBRztRQUMzQixNQUFNLENBQUMsU0FBUyxLQUFLLEdBQUc7UUFDeEIsTUFBTSxDQUFDLE9BQU8sS0FBSyxRQUFRO1FBQzNCLE1BQU0sQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUxELDhCQUtDO0FBQ0Q7SUFBQTtJQWtFQSxDQUFDO0lBOURpQiwyQkFBVSxHQUF4QjtRQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7SUFDcEMsQ0FBQztJQUVhLHdCQUFPLEdBQXJCO1FBQ0ksR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07WUFDckIsWUFBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDcEQsWUFBRyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDL0MsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsSUFBTSxVQUFVLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUM7Z0JBQ3BDLElBQU0sSUFBSSxHQUFHO29CQUNMLEVBQUUsRUFBRSxPQUFPO29CQUNYLEtBQUssRUFBRSxhQUFhO29CQUNwQixRQUFRLEVBQUUsa0NBQWMsQ0FBQyxXQUFXO29CQUNwQyxRQUFRLEVBQUUsR0FBRztvQkFDYixVQUFVLEVBQUUsQ0FBQztvQkFDYixhQUFhLEVBQUUsQ0FBQztpQkFDbkIsQ0FBQztnQkFDTixJQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3RCLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RDLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSw4QkFBYSxDQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDN0QsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBRXBELENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsWUFBRyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDNUMsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsSUFBTSxPQUFPLEdBQUcsSUFBSSxrQkFBTyxFQUFFLENBQUM7Z0JBQzlCLElBQU0sSUFBSSxHQUFHO29CQUNULEVBQUUsRUFBRSxTQUFTO29CQUNiLEtBQUssRUFBRSxVQUFVO29CQUNqQixRQUFRLEVBQUUsa0NBQWMsQ0FBQyxXQUFXO29CQUNwQyxRQUFRLEVBQUUsR0FBRztvQkFDYixVQUFVLEVBQUUsQ0FBQztvQkFDYixhQUFhLEVBQUUsR0FBRztpQkFDckIsQ0FBQztnQkFDRixJQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3RCLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RDLElBQU0sYUFBYSxHQUFHLElBQUksOEJBQWEsQ0FBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZELGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFakQsQ0FBQztZQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsWUFBRyxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFlBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BFLENBQUM7SUFFTCxDQUFDO0lBRWEsbUNBQWtCLEdBQWhDLFVBQWlDLEVBQVU7UUFDdkMsWUFBRyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN0RCxHQUFHLENBQUMsQ0FBaUIsVUFBd0IsRUFBeEIsS0FBQSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQXhCLGNBQXdCLEVBQXhCLElBQXdCO1lBQXhDLElBQU0sTUFBTSxTQUFBO1lBQ2IsWUFBRyxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1lBQzFELE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNqQztJQUNMLENBQUM7SUFoRWMsd0JBQU8sR0FBb0IsRUFBRSxDQUFDO0lBQzlCLHdCQUFPLEdBQWdCLEVBQUUsQ0FBQztJQWdFN0MsdUJBQUM7Q0FsRUQsQUFrRUMsSUFBQTtBQWxFWSw0Q0FBZ0IiLCJmaWxlIjoibW9kZWxzL3VzYi1zZW5zb3ItbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBISUQgPSByZXF1aXJlKCdub2RlLWhpZCcpO1xyXG5pbXBvcnQgeyBTZW5zb3JDYXRlZ29yeSB9IGZyb20gJy4vc2Vuc29yLWF0dHJpYnV0ZXMnO1xyXG5cclxuaW1wb3J0IHsgVGVtcGVyOCB9IGZyb20gJy4vdGVtcGVyLTgnO1xyXG5pbXBvcnQgeyBUZW1wZXJHb2xkIH0gZnJvbSAnLi90ZW1wZXItZ29sZCc7XHJcbmltcG9ydCB7IFVTQkNvbnRyb2xsZXIgfSBmcm9tICcuL3VzYi1jb250cm9sbGVyJztcclxuXHJcbmltcG9ydCB7IFNlbnNvckxvZyB9IGZyb20gJy4vc2Vuc29yLWxvZyc7XHJcblxyXG5pbXBvcnQgeyBsb2cgfSBmcm9tICcuLy4uL2xvZ2dlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgRGV2aWNlQ29uZmlnIHtcclxuICAgICAgICB2ZW5kb3JJZDogbnVtYmVyO1xyXG4gICAgICAgIHByb2R1Y3RJZDogbnVtYmVyO1xyXG4gICAgICAgIHByb2R1Y3Q6IHN0cmluZztcclxuICAgICAgICBpbnRlcmZhY2U6IG51bWJlcjtcclxuICAgIH1cclxuXHJcbmNvbnN0IFZJRCA9IDB4MEM0NTtcclxuY29uc3QgUElEID0gMHg3NDAxO1xyXG5jb25zdCBURU1QRVJfR09MRCA9ICdURU1QZXJWMS40JztcclxuY29uc3QgVEVNUEVSXzggPSAnVEVNUGVyOF9WMS41JztcclxuY29uc3QgSU5URVJGQUNFID0gMTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNUZW1wZXJHb2xkKGRldmljZTogSElELkRldmljZSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIChkZXZpY2UudmVuZG9ySWQgPT09IFZJRCAmJlxyXG4gICAgICAgIGRldmljZS5wcm9kdWN0SWQgPT09IFBJRCAmJlxyXG4gICAgICAgIGRldmljZS5wcm9kdWN0ID09PSBURU1QRVJfR09MRCAmJlxyXG4gICAgICAgIGRldmljZS5pbnRlcmZhY2UgPT09IElOVEVSRkFDRSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1RlbXBlcjgoZGV2aWNlOiBISUQuRGV2aWNlKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKGRldmljZS52ZW5kb3JJZCA9PT0gVklEICYmXHJcbiAgICAgICAgZGV2aWNlLnByb2R1Y3RJZCA9PT0gUElEICYmXHJcbiAgICAgICAgZGV2aWNlLnByb2R1Y3QgPT09IFRFTVBFUl84ICYmXHJcbiAgICAgICAgZGV2aWNlLmludGVyZmFjZSA9PT0gSU5URVJGQUNFKTtcclxufVxyXG5leHBvcnQgY2xhc3MgVVNCU2Vuc29yTWFuYWdlciB7XHJcbiAgICBwcml2YXRlIHN0YXRpYyBkZXZpY2VzOiBVU0JDb250cm9sbGVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgc3RhdGljIGxvZ2dlcnM6IFNlbnNvckxvZ1tdID0gW107XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXRMb2dnZXJzKCk6IFNlbnNvckxvZ1tdIHtcclxuICAgICAgICByZXR1cm4gVVNCU2Vuc29yTWFuYWdlci5sb2dnZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZmFjdG9yeSgpOiB2b2lkIHtcclxuICAgICAgICBISUQuZGV2aWNlcygpLmZpbmQoZGV2aWNlID0+IHtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKCdkZXZpY2U6ICcsIGRldmljZSk7XHJcbiAgICAgICAgICAgIGlmIChpc1RlbXBlckdvbGQoZGV2aWNlKSAmJiBkZXZpY2UucGF0aCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBsb2cuaW5mbygnU2Vuc29yIFRFTVBlciBHb2xkIGZvdW5kOiAnLCBkZXZpY2UpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGlkID0gbmV3IEhJRC5ISUQoZGV2aWNlLnBhdGgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcGVyR29sZCA9IG5ldyBUZW1wZXJHb2xkKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdHRyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTTjogJ1RHb2xkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWw6ICdUZW1wZXIgR29sZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBTZW5zb3JDYXRlZ29yeS5UZW1wZXJhdHVyZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWNjdXJhY3k6IDIuMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x1dGlvbjogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2FtcGxlUmF0ZTogMSxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbG9nZ2VyID0gbmV3IFNlbnNvckxvZyhhdHRyLCB0ZW1wZXJHb2xkKTtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci5zdGFydExvZ2dpbmcoKTtcclxuICAgICAgICAgICAgICAgIFVTQlNlbnNvck1hbmFnZXIubG9nZ2Vycy5wdXNoKGxvZ2dlcik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wZXJHb2xkRGV2aWNlID0gbmV3IFVTQkNvbnRyb2xsZXIgKGhpZCwgdGVtcGVyR29sZCk7XHJcbiAgICAgICAgICAgICAgICBVU0JTZW5zb3JNYW5hZ2VyLmRldmljZXMucHVzaCh0ZW1wZXJHb2xkRGV2aWNlKTtcclxuICAgICAgICAgICAgICAgIC8vIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzVGVtcGVyOChkZXZpY2UpICYmIGRldmljZS5wYXRoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGxvZy5pbmZvKCdTZW5zb3IgVEVNUGVyIDggZm91bmQ6ICcsIGRldmljZSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoaWQgPSBuZXcgSElELkhJRChkZXZpY2UucGF0aCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wZXI4ID0gbmV3IFRlbXBlcjgoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHIgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgU046ICdUZW1wZXI4JyxcclxuICAgICAgICAgICAgICAgICAgICBtb2RlbDogJ1RlbXBlciA4JyxcclxuICAgICAgICAgICAgICAgICAgICBjYXRlZ29yeTogU2Vuc29yQ2F0ZWdvcnkuVGVtcGVyYXR1cmUsXHJcbiAgICAgICAgICAgICAgICAgICAgYWNjdXJhY3k6IDAuNSxcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHV0aW9uOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIG1heFNhbXBsZVJhdGU6IDAuMixcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsb2dnZXIgPSBuZXcgU2Vuc29yTG9nKGF0dHIsIHRlbXBlcjgpO1xyXG4gICAgICAgICAgICAgICAgbG9nZ2VyLnN0YXJ0TG9nZ2luZygpO1xyXG4gICAgICAgICAgICAgICAgVVNCU2Vuc29yTWFuYWdlci5sb2dnZXJzLnB1c2gobG9nZ2VyKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBlcjhEZXZpY2UgPSBuZXcgVVNCQ29udHJvbGxlciAoaGlkLCB0ZW1wZXI4KTtcclxuICAgICAgICAgICAgICAgIFVTQlNlbnNvck1hbmFnZXIuZGV2aWNlcy5wdXNoKHRlbXBlcjhEZXZpY2UpO1xyXG4gICAgICAgICAgICAgICAvLyByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChVU0JTZW5zb3JNYW5hZ2VyLmRldmljZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGxvZy5lcnJvcignRm91bmQgMCBkZXZpY2VzJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9nLmluZm8oJ0ZvdW5kICVkIGRldmljZShzKScsIFVTQlNlbnNvck1hbmFnZXIuZGV2aWNlcy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzZXRQb2xsaW5nSW50ZXJ2YWwobXM6IG51bWJlcikge1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnVVNCU2Vuc29yTWFuYWdlci5zZXRQb2xsaW5nSW50ZXJ2YWw6JywgbXMpO1xyXG4gICAgICAgIGZvciAoY29uc3QgZGV2aWNlIG9mIFVTQlNlbnNvck1hbmFnZXIuZGV2aWNlcykge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJ1VTQlNlbnNvck1hbmFnZXIuc2V0UG9sbGluZ0ludGVydmFsIC0gZGV2aWNlJyk7XHJcbiAgICAgICAgICAgIGRldmljZS5zZXRQb2xsaW5nSW50ZXJ2YWwobXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=
