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
//# sourceMappingURL=device-checks.js.map