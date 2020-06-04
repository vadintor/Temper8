"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var logger_1 = require("./../logger");
var settings_1 = require("./settings");
var isomorphic_ws_1 = __importDefault(require("isomorphic-ws"));
var SensorLog = (function () {
    function SensorLog(state) {
        this.retryCounter = 0;
        this.timestamp = 0;
        this.logging = false;
        this.MAX_TIME_DIFF = 5 * 60000;
        this.dataFilter = {
            resolution: 1,
            maxTimeDiff: this.MAX_TIME_DIFF
        };
        this.SHARED_ACCESS_KEY = '';
        this.WS_URL = '';
        this.WS_ORIGIN = '';
        this.ITEMPER_URL = '';
        logger_1.log.debug('SensorLog: SensorStateLogger, state:', JSON.stringify(state));
        this.timestamp = Date.now();
        this.logging = false;
        this.state = state;
        this.initSettings();
        this.state.addSensorDataListener(this.onDataReceived.bind(this), this.dataFilter);
        this.state.addSensorDataListener(this.onMonitor.bind(this));
        this.axios = this.createAxiosInstance();
        this.socket = this.openSocket();
    }
    SensorLog.prototype.createAxiosInstance = function () {
        return this.axios = axios_1.default.create({
            baseURL: this.ITEMPER_URL + '/sensors',
            headers: { 'Content-Type': 'application/json' }
        });
    };
    SensorLog.prototype.openSocket = function () {
        var wsTestUrl = this.WS_URL;
        var origin = this.WS_ORIGIN;
        var socket = new isomorphic_ws_1.default(wsTestUrl, { origin: origin, perMessageDeflate: false });
        socket.on('open', function () {
            logger_1.log.info('SensorLog: socket.on(open): Device.SensorLog connected to backend!');
        });
        socket.on('message', function (data) {
            logger_1.log.info('SensorLog: socket.on(message): ' + data);
        });
        socket.on('error', function (self, error) {
            logger_1.log.error('SensorLog: socket.on(error): ws=' + JSON.stringify(self));
            logger_1.log.error('SensorLog: socket.on(error): error=' + JSON.stringify(error));
        });
        socket.on('close', function (self, code, reason) {
            if (code === 404) {
                logger_1.log.info('SensorLog: socket.on(close): code: 404');
            }
            logger_1.log.info('SensorLog: socket.on(close): ws=' + JSON.stringify(self));
            logger_1.log.info('SensorLog: socket.on(close): code/reason=' + code + reason);
        });
        return socket;
    };
    SensorLog.prototype.initSettings = function () {
        var _this = this;
        this.SHARED_ACCESS_KEY = settings_1.Settings.get(settings_1.Settings.SHARED_ACCESS_KEY).value.toString();
        this.WS_URL = settings_1.Settings.get(settings_1.Settings.WS_URL).value.toString();
        this.WS_ORIGIN = settings_1.Settings.get(settings_1.Settings.WS_ORIGIN).value.toString();
        this.ITEMPER_URL = settings_1.Settings.get(settings_1.Settings.ITEMPER_URL).value.toString();
        settings_1.Settings.onChange('SHARED_ACCESS_KEY', function (setting) {
            _this.SHARED_ACCESS_KEY = setting.value.toString();
            logger_1.log.debug('SensorLog.settingChanged: SHARED_ACCESS_KEY=' + _this.SHARED_ACCESS_KEY);
        });
        settings_1.Settings.onChange('WS_URL', function (setting) {
            _this.WS_URL = setting.value.toString();
            logger_1.log.debug('SensorLog.settingChanged: WS_URL=' + _this.WS_URL);
            _this.socket = _this.openSocket();
        });
        settings_1.Settings.onChange('WS_ORIGIN', function (setting) {
            _this.WS_ORIGIN = setting.value.toString();
            logger_1.log.debug('SensorLog.settingChanged: WS_ORIGIN=' + _this.WS_ORIGIN);
            _this.socket = _this.openSocket();
        });
        settings_1.Settings.onChange('ITEMPER_URL', function (setting) {
            _this.ITEMPER_URL = setting.value.toString();
            logger_1.log.debug('SensorLog.settingChanged: ITEMPER_URL=' + _this.ITEMPER_URL);
            _this.axios = _this.createAxiosInstance();
        });
        settings_1.Settings.onChange('AZURE_CONNECTION_STRING', function (setting) {
            logger_1.log.info('settingChanged: AZURE_CONNECTION_STRING not implemented value=' + setting.value.toString());
        });
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
        logger_1.log.debug('SensorLog.startLogging');
        if (filter) {
            this.dataFilter = filter;
        }
        this.logging = true;
    };
    SensorLog.prototype.stopLogging = function () {
        logger_1.log.debug('SensorLog.stopLogging');
        this.logging = false;
    };
    SensorLog.prototype.onDataReceived = function (data) {
        var self = this;
        if (this.logging) {
            var desc = { SN: this.state.getAttr().SN, port: data.getPort() };
            var samples = [{ date: data.timestamp(), value: data.getValue() }];
            var sensorLog_1 = { desc: desc, samples: samples };
            var diff_1 = data.timestamp() - this.timestamp;
            this.timestamp = data.timestamp();
            var url_1 = '/' + desc.SN + '/' + desc.port;
            logger_1.log.debug('URL: ' + url_1);
            var Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;
            this.axios.post(url_1, sensorLog_1, { headers: { Authorization: Authorization } })
                .then(function (res) {
                logger_1.log.info('SensorLog.onSensorDataReceived: axios.post ' + url_1 + ' ' + res.statusText +
                    ' res.data: ' + JSON.stringify(sensorLog_1) + ' ms: ' + diff_1 +
                    ' date: ' + new Date(data.timestamp()).toLocaleString());
            })
                .catch(function (error) {
                if (error.response) {
                    logger_1.log.debug('SensorLog.onSensorDataReceived:' + error.response.status + ' - ' +
                        JSON.stringify(error.response.data));
                    if (error.response.status === 401) {
                        logger_1.log.debug('SensorLog.onDataReceived: ACCESS DENIED wrong shared access key: ');
                    }
                    else if (error.response.status === 308 ||
                        error.response.status === 404 ||
                        error.response.status === 422) {
                        var name_1 = error.response.data.name;
                        if (name_1) {
                            settings_1.Settings.update(settings_1.Settings.SERIAL_NUMBER, name_1, function (updated) {
                                if (!updated) {
                                    logger_1.log.error('SensorLog.onSensorDataReceived: cannot update serial number after redirect request from itemper ');
                                }
                            });
                        }
                        self.registerSensor(data);
                    }
                }
                else if (error.request) {
                    logger_1.log.error('SensorLog.onSensorDataReceived, request, no response:' + error.request);
                }
                else {
                    logger_1.log.error('SensorLog.onSensorDataReceived,  error.config:' + error.config);
                }
            });
        }
    };
    SensorLog.prototype.registerSensor = function (data) {
        var stateAttr = this.state.getAttr();
        var attr = { model: stateAttr.model,
            category: stateAttr.category.toString(),
            accuracy: stateAttr.accuracy,
            resolution: stateAttr.resolution,
            maxSampleRate: stateAttr.maxSampleRate };
        var desc = { SN: stateAttr.SN, port: data.getPort() };
        var body = { desc: desc, attr: attr };
        var url = '';
        var Authorization = 'Bearer ' + this.SHARED_ACCESS_KEY;
        this.axios.post(url, body, { headers: { Authorization: Authorization } })
            .then(function () {
            logger_1.log.info('SensorLog.registerSensor: axios.post - successful');
        })
            .catch(function (error) {
            try {
                logger_1.log.debug('SensorLog.registerSensor: catch sensor data:' + error.response);
                logger_1.log.info('SensorLog.registerSensor: trying registering the sensor');
                if (error.response) {
                    logger_1.log.debug('SensorLog.registerSensor:' + error.response.status + ' - ' +
                        JSON.stringify(error.response.data));
                    if (error.response.status === 401) {
                        logger_1.log.debug('SensorLog.registerSensor: ACCESS DENIED wrong shared access key: ');
                    }
                    else if (error.response.status === 503) {
                        logger_1.log.debug('SensorLog.registerSensor: itemper backend ' + this.ITEMPER_URL + ' + not available: ' +
                            JSON.stringify(desc));
                    }
                }
                else if (error.request) {
                    logger_1.log.error('SensorLog.registerSensor, request, no response:' + error.request.toString());
                }
                else {
                    logger_1.log.error('SensorLog.registerSensor,  error.config:' + error.config);
                }
            }
            catch (e) {
                logger_1.log.error('SensorLog.registerSensor: catch register: ' + e);
            }
        });
    };
    SensorLog.prototype.onMonitor = function (data) {
        logger_1.log.debug('SensorLog.onMonitor');
        var desc = { SN: this.state.getAttr().SN, port: data.getPort() };
        var samples = [{ date: data.timestamp(), value: data.getValue() }];
        var sensorLog = { desc: desc, samples: samples };
        if (this.socket && this.socket.readyState === isomorphic_ws_1.default.OPEN) {
            logger_1.log.debug('SensorLog.onMonitor: sensor log: ' + JSON.stringify(sensorLog));
            this.socket.send(JSON.stringify(sensorLog));
            logger_1.log.debug('SensorLog.onMonitor: sensor log sent');
        }
        else if (!this.socket || this.socket.readyState === isomorphic_ws_1.default.CLOSED) {
            logger_1.log.debug('SensorLog.onMonitor: socket closed, re-open');
            this.socket = this.openSocket();
        }
        else {
            logger_1.log.debug('SensorLog.onMonitor: socket not open yet');
        }
    };
    return SensorLog;
}());
exports.SensorLog = SensorLog;
//# sourceMappingURL=sensor-log.js.map