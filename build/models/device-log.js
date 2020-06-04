"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var logger_1 = require("../logger");
var settings_1 = require("./settings");
var DeviceLog = (function () {
    function DeviceLog(state) {
        this.retryCounter = 0;
        this.timestamp = 0;
        this.logging = false;
        this.SHARED_ACCESS_KEY = '';
        this.ITEMPER_URL = '';
        this.timestamp = Date.now();
        this.logging = false;
        this.state = state;
        this.initSettings();
        this.state.addDeviceDataListener(this.onDataReceived.bind(this));
        this.axios = this.createAxiosInstance();
    }
    DeviceLog.prototype.createAxiosInstance = function () {
        return this.axios = axios_1.default.create({
            baseURL: this.ITEMPER_URL + '/device',
            headers: { 'Content-Type': 'application/json' }
        });
    };
    DeviceLog.prototype.initSettings = function () {
        var _this = this;
        this.SHARED_ACCESS_KEY = settings_1.Settings.get(settings_1.Settings.SHARED_ACCESS_KEY).value.toString();
        this.ITEMPER_URL = settings_1.Settings.get(settings_1.Settings.ITEMPER_URL).value.toString();
        settings_1.Settings.onChange('SHARED_ACCESS_KEY', function (setting) {
            _this.SHARED_ACCESS_KEY = setting.value.toString();
            logger_1.log.debug('DeviceLog.settingChanged: SHARED_ACCESS_KEY=' + _this.SHARED_ACCESS_KEY);
        });
        settings_1.Settings.onChange('ITEMPER_URL', function (setting) {
            _this.ITEMPER_URL = setting.value.toString();
            logger_1.log.debug('DeviceLog.settingChanged: ITEMPER_URL=' + _this.ITEMPER_URL);
            _this.axios = _this.createAxiosInstance();
        });
    };
    DeviceLog.prototype.getState = function () {
        return this.state;
    };
    DeviceLog.prototype.islogging = function () {
        return this.logging;
    };
    DeviceLog.prototype.startLogging = function () {
        logger_1.log.debug('DeviceLog.startLogging');
        this.logging = true;
    };
    DeviceLog.prototype.stopLogging = function () {
        logger_1.log.debug('DeviceLog.stopLogging');
        this.logging = false;
    };
    DeviceLog.prototype.onDataReceived = function (data) {
        if (this.logging) {
            var diff_1 = data.timestamp - this.timestamp;
            this.timestamp = data.timestamp;
            var deviceLog_1 = { data: data };
            var url_1 = '/status';
            logger_1.log.debug('DeviceLog.onDataReceived, URL: ' + url_1);
            var Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;
            this.axios.post(url_1, deviceLog_1, { headers: { Authorization: Authorization } })
                .then(function (res) {
                logger_1.log.info('DeviceLog.onDataReceived, post ' + url_1 + ' ' + res.statusText +
                    ' res.data: ' + JSON.stringify(deviceLog_1) + ' ms: ' + diff_1 +
                    ' date: ' + new Date(data.timestamp.toLocaleString()));
            })
                .catch(function (error) {
                if (error.response) {
                    logger_1.log.debug('DeviceLog.onDataReceived:' + error.response.status + ' - ' +
                        JSON.stringify(error.response.data));
                }
                else if (error.request) {
                    logger_1.log.error('DeviceLog.onDataReceived, request, no response:' + error.request);
                }
                else {
                    logger_1.log.error('DeviceLog.onDataReceived,  error.config:' + error.config);
                }
            });
        }
    };
    return DeviceLog;
}());
exports.DeviceLog = DeviceLog;
//# sourceMappingURL=device-log.js.map