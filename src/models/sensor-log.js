"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var logger_1 = require("./../logger");
var Primus = require("primus");
// Import Azure
var azure_iot_device_1 = require("azure-iot-device");
var azure_iot_device_mqtt_1 = require("azure-iot-device-mqtt");
var Socket = Primus.createSocket({ transformer: 'uws' });
var SensorLog = /** @class */ (function () {
    function SensorLog(attr, state) {
        this.timestamp = 0;
        this.logging = false;
        this.MAX_TIME_DIFF = 5 * 60000;
        this.dataFilter = {
            resolution: 1,
            maxTimeDiff: this.MAX_TIME_DIFF
        };
        this.open = false;
        // Azure IOT
        // tslint:disable-next-line:max-line-length
        this.connectionString = '';
        logger_1.log.debug('--- SensorStateLogger, state:', state);
        logger_1.log.debug('--- SensorStateLogger, attr:', attr);
        this.timestamp = Date.now();
        this.logging = false;
        this.attr = attr;
        this.state = state;
        if (this.open) {
            this.open = true;
        }
        this.state.addSensorDataListener(this.onSensorDataReceived.bind(this), this.dataFilter);
        this.state.addSensorDataListener(this.onMonitor.bind(this));
        this.axios = axios_1["default"].create({
            baseURL: 'https://test.itemper.io/api/v1/sensors',
            headers: { 'Content-Type': 'application/json' }
        });
        var wsTestUrl = 'ws://itemper.vading.lan:3000/primus';
        // const wsDevUrl = 'ws://localhost:3000/primus';
        this.socket = new Socket(wsTestUrl);
        var self = this;
        this.socket.on('open', function () {
            self.open = true;
            logger_1.log.info('--- socket.on: Device.SensorLog connected to backend!');
        });
        this.socket.on('data', function (data) {
            logger_1.log.info('--- socket.on: Data received from back-end' + data);
        });
        // AZURE IOT
        this.connectionString = 'HostName=iothubiotlabs.azure-devices.net;DeviceId=twilight-sound-798cd80;' +
            'SharedAccessKey=7jobimPqYZEFvfsjSYZMmRjkk7xIs6cs721AIRYHpMU=';
        this.client = azure_iot_device_1.Client.fromConnectionString(this.connectionString, azure_iot_device_mqtt_1.Mqtt);
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
    // Print AZURE IOT results.
    SensorLog.prototype.printResultFor = function (op) {
        return function printResult(err, res) {
            if (err) {
                logger_1.log.error(op + ' AZURE IOT error: ' + err.toString());
            }
            if (res) {
                logger_1.log.info(op + ' AZURE IOT status: ' + res.constructor.name);
            }
        };
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
            })["catch"](function () {
                logger_1.log.error('onSensorDataReceived axios.post catch error');
            });
            // AZURE IOT
            var message = new azure_iot_device_1.Message(JSON.stringify(sensorLog_1));
            message.properties.add('Delta time', diff_1.toString());
            this.client.sendEvent(message, this.printResultFor('send'));
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
