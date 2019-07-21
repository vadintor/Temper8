"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var logger_1 = require("./../logger");
var Primus = require("primus");
var Socket = Primus.createSocket({ transformer: 'uws' });
var SensorLog = /** @class */ (function () {
    function SensorLog(attr, state) {
        this.timestamp = 0;
        this.logging = false;
        this.MAX_TIME_DIFF = 5 * 60000;
        this.dataFilter = {
            resolution: this.attr.resolution,
            maxTimeDiff: this.MAX_TIME_DIFF
        };
        this.open = false;
        logger_1.log.debug('--- SensorStateLogger:', state);
        this.timestamp = Date.now();
        this.logging = false;
        this.attr = attr;
        this.state = state;
        this.state.addSensorDataListener(this.onSensorDataReceived.bind(this), this.dataFilter);
        this.state.addSensorDataListener(this.onMonitor.bind(this));
        this.axios = axios_1["default"].create({
            baseURL: 'https://test.itemper.io/api/v1/sensors',
            headers: { 'Content-Type': 'application/json' }
        });
        var wsTestUrl = 'ws://itemper.vading.lan:3000/primus';
        var wsDevUrl = 'ws://localhost:3000/primus';
        this.socket = new Socket(wsTestUrl);
        var self = this;
        this.socket.on('open', function () {
            self.open = true;
            console.log('Device.SensorLog connected to backend!');
        });
        this.socket.on('data', function (data) {
            console.log('Data received from back-end');
        });
    }
    SensorLog.prototype.getAttr = function () {
        return this.attr;
    };
    SensorLog.prototype.getState = function () {
        return this.state;
    };
    SensorLog.prototype.getFilter = function () {
        return this.dataFilter;
    };
    SensorLog.prototype.islogging = function () {
        return this.logging;
    };
    SensorLog.prototype.startLogging = function (filter) {
        logger_1.log.debug('--- SensorStateLogger.startLogging');
        if (filter) {
            this.dataFilter = filter;
        }
        this.logging = true;
    };
    SensorLog.prototype.stopLogging = function () {
        logger_1.log.debug('--- SensorStateLogger.stopLogging');
        this.logging = false;
    };
    SensorLog.prototype.onSensorDataReceived = function (data) {
        if (this.logging) {
            var descr = { SN: this.attr.SN, port: data.getPort() };
            var samples = [{ date: data.timestamp(), value: data.getValue() }];
            var sensorLog_1 = { descr: descr, samples: samples };
            var diff_1 = data.timestamp() - this.timestamp;
            this.timestamp = data.timestamp();
            var url_1 = '/' + descr.SN + '/' + descr.port;
            logger_1.log.debug('URL: ', url_1);
            this.axios.post(url_1, sensorLog_1)
                .then(function (res) {
                logger_1.log.info('SensorLogger axios.post ' + url_1 + ' ' + res.statusText +
                    ' res.data: ' + JSON.stringify(sensorLog_1) + ' ms: ' + diff_1 +
                    ' date: ' + new Date(data.timestamp()).toLocaleString());
            })["catch"](function (e) {
                logger_1.log.error('catch error', e);
            });
        }
    };
    SensorLog.prototype.onMonitor = function (data) {
        logger_1.log.debug('SensorLog.onMonitor');
        var descr = { SN: this.attr.SN, port: data.getPort() };
        var samples = [{ date: data.timestamp(), value: data.getValue() }];
        var sensorLog = { descr: descr, samples: samples };
        this.socket.write(sensorLog);
    };
    return SensorLog;
}());
exports.SensorLog = SensorLog;
