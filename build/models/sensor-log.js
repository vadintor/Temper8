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
        this.state.addSensorDataListener(this.onSensorDataReceived.bind(this), this.dataFilter);
        this.state.addSensorDataListener(this.onMonitor.bind(this));
        this.axios = this.createAxiosInstance();
        this.socket = this.openSocket();
    }
    SensorLog.prototype.createAxiosInstance = function () {
        return this.axios = axios_1.default.create({
            baseURL: this.ITEMPER_URL,
            headers: { 'Content-Type': 'application/json' }
        });
    };
    SensorLog.prototype.openSocket = function () {
        var wsTestUrl = this.WS_URL;
        var origin = this.WS_ORIGIN;
        var socket = new isomorphic_ws_1.default(wsTestUrl, { origin: origin });
        socket.on('open', function () {
            logger_1.log.info('SensorLog: socket.on(open): Device.SensorLog connected to backend!');
        });
        socket.on('message', function (data) {
            logger_1.log.info('SensorLog: socket.on(message): received from back-end' + JSON.stringify(data));
        });
        socket.on('message', function (data) {
            logger_1.log.info('SensorLog: socket.on(message): received from back-end' + JSON.stringify(data));
        });
        socket.on('error', function () {
            logger_1.log.info('SensorLog: socket.on(error): ');
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
    SensorLog.prototype.onSensorDataReceived = function (data) {
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
                logger_1.log.debug('SensorLog.onSensorDataReceived: catch sensor data:' + error.response);
                logger_1.log.info('SensorLog.onSensorDataReceived: trying registering the sensor');
                if (error.response) {
                    logger_1.log.debug('SensorLog.onSensorDataReceived:' + error.response.status + ' - ' +
                        JSON.stringify(error.response.data));
                    if (error.response.status === 404) {
                        logger_1.log.debug('SensorLog.onSensorDataReceived: trying register sensor: ' +
                            JSON.stringify(sensorLog_1.desc));
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
                    if (error.response.status === 503) {
                        logger_1.log.debug('SensorLog.registerSensor: trying register sensor again: ' +
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvc2Vuc29yLWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF5RDtBQUl6RCxzQ0FBa0M7QUFFbEMsdUNBQTZDO0FBRTdDLGdFQUFzQztBQWV0QztJQWdESSxtQkFBWSxLQUFrQjtRQS9DdkIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFHaEIsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUN0QixZQUFPLEdBQVksS0FBSyxDQUFDO1FBQ3pCLGtCQUFhLEdBQUcsQ0FBQyxHQUFDLEtBQU0sQ0FBQztRQUN6QixlQUFVLEdBQWdCO1lBQzlCLFVBQVUsRUFBRSxDQUFDO1lBQ2IsV0FBVyxFQUFFLElBQUksQ0FBQyxhQUFhO1NBQUMsQ0FBQztRQUc3QixzQkFBaUIsR0FBVyxFQUFFLENBQUM7UUFDL0IsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBQ3ZCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBa0M3QixZQUFHLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFNUQsSUFB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QUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUM7UUFDbEUsSUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDbkUsSUFBTSxTQUFTLEdBQUcsRUFBRSxJQUFJLE1BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDO1FBQ3BDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsS0FBSyx1QkFBUyxDQUFDLElBQUksRUFBRTtZQUMxRCxZQUFHLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUMzRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsWUFBRyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1NBQ3JEO2FBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssdUJBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDcEUsWUFBRyxDQUFDLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ25DO2FBQU07WUFDSCxZQUFHLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7U0FDekQ7SUFDTCxDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQXZQQSxBQXVQQyxJQUFBO0FBdlBZLDhCQUFTIiwiZmlsZSI6Im1vZGVscy9zZW5zb3ItbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGF4aW9zLCB7IEF4aW9zRXJyb3IsIEF4aW9zSW5zdGFuY2UgfSBmcm9tICdheGlvcyc7XHJcbmltcG9ydCB7IFNlbnNvckRhdGEsIH0gZnJvbSAnLi4vbW9kZWxzL3NlbnNvci1kYXRhJztcclxuaW1wb3J0IHsgRmlsdGVyQ29uZmlnLCBTZW5zb3JTdGF0ZSB9IGZyb20gJy4uL21vZGVscy9zZW5zb3Itc3RhdGUnO1xyXG5cclxuaW1wb3J0IHsgbG9nIH0gZnJvbSAnLi8uLi9sb2dnZXInO1xyXG5cclxuaW1wb3J0IHtTZXR0aW5nLCBTZXR0aW5nc30gZnJvbSAnLi9zZXR0aW5ncyc7XHJcblxyXG5pbXBvcnQgV2ViU29ja2V0IGZyb20gJ2lzb21vcnBoaWMtd3MnO1xyXG5leHBvcnQgaW50ZXJmYWNlIFNhbXBsZSB7XHJcbiAgICBkYXRlOiBudW1iZXI7XHJcbiAgICB2YWx1ZTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNlbnNvckRlc2NyaXB0b3Ige1xyXG4gICAgU046IHN0cmluZztcclxuICAgIHBvcnQ6IG51bWJlcjtcclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIFNlbnNvckxvZ0RhdGEge1xyXG4gICAgZGVzYzogU2Vuc29yRGVzY3JpcHRvcjtcclxuICAgIHNhbXBsZXM6IFNhbXBsZVtdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2Vuc29yTG9nIHtcclxuICAgIHB1YmxpYyByZXRyeUNvdW50ZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBzdGF0ZTogU2Vuc29yU3RhdGU7XHJcblxyXG4gICAgcHJpdmF0ZSB0aW1lc3RhbXA6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGxvZ2dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHByaXZhdGUgTUFYX1RJTUVfRElGRiA9IDUqNjBfMDAwO1xyXG4gICAgcHJpdmF0ZSBkYXRhRmlsdGVyOiBGaWx0ZXJDb25maWc9IHtcclxuICAgICAgICByZXNvbHV0aW9uOiAxLFxyXG4gICAgICAgIG1heFRpbWVEaWZmOiB0aGlzLk1BWF9USU1FX0RJRkZ9O1xyXG5cclxuICAgIHByaXZhdGUgYXhpb3M6IEF4aW9zSW5zdGFuY2U7XHJcbiAgICBwcml2YXRlIFNIQVJFRF9BQ0NFU1NfS0VZOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgV1NfVVJMOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgV1NfT1JJR0lOOiBzdHJpbmcgPSAnJztcclxuICAgIHByaXZhdGUgSVRFTVBFUl9VUkw6IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIHByaXZhdGUgc29ja2V0OiBXZWJTb2NrZXQ7XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVBeGlvc0luc3RhbmNlKCk6IEF4aW9zSW5zdGFuY2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmF4aW9zID0gYXhpb3MuY3JlYXRlKHtcclxuICAgICAgICAgICAgYmFzZVVSTDogdGhpcy5JVEVNUEVSX1VSTCxcclxuICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9fSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvcGVuU29ja2V0KCk6IFdlYlNvY2tldCB7XHJcbiAgICAgICAgLy8gY29uc3Qgd3NUZXN0VXJsID0gJ3dzczovL3Rlc3QuaXRlbXBlci5pby93cyc7XHJcbiAgICAgICAgY29uc3Qgd3NUZXN0VXJsID0gdGhpcy5XU19VUkw7XHJcbiAgICAgICAgY29uc3Qgb3JpZ2luID0gdGhpcy5XU19PUklHSU47XHJcbiAgICAgICAgY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldCAod3NUZXN0VXJsLCB7IG9yaWdpbiB9KTtcclxuXHJcbiAgICAgICAgc29ja2V0Lm9uKCdvcGVuJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2cuaW5mbygnU2Vuc29yTG9nOiBzb2NrZXQub24ob3Blbik6IERldmljZS5TZW5zb3JMb2cgY29ubmVjdGVkIHRvIGJhY2tlbmQhJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgKGRhdGE6IFdlYlNvY2tldC5EYXRhKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGxvZy5pbmZvKCdTZW5zb3JMb2c6IHNvY2tldC5vbihtZXNzYWdlKTogcmVjZWl2ZWQgZnJvbSBiYWNrLWVuZCcgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc29ja2V0Lm9uKCdtZXNzYWdlJywgKGRhdGE6IFdlYlNvY2tldC5EYXRhKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGxvZy5pbmZvKCdTZW5zb3JMb2c6IHNvY2tldC5vbihtZXNzYWdlKTogcmVjZWl2ZWQgZnJvbSBiYWNrLWVuZCcgKyBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHNvY2tldC5vbignZXJyb3InLCAoKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGxvZy5pbmZvKCdTZW5zb3JMb2c6IHNvY2tldC5vbihlcnJvcik6ICcpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc29ja2V0O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHN0YXRlOiBTZW5zb3JTdGF0ZSkge1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yTG9nOiBTZW5zb3JTdGF0ZUxvZ2dlciwgc3RhdGU6JywgSlNPTi5zdHJpbmdpZnkoc3RhdGUpKTtcclxuICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5sb2dnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgIHRoaXMuaW5pdFNldHRpbmdzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkU2Vuc29yRGF0YUxpc3RlbmVyKHRoaXMub25TZW5zb3JEYXRhUmVjZWl2ZWQuYmluZCh0aGlzKSwgdGhpcy5kYXRhRmlsdGVyKTtcclxuICAgICAgICB0aGlzLnN0YXRlLmFkZFNlbnNvckRhdGFMaXN0ZW5lcih0aGlzLm9uTW9uaXRvci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgdGhpcy5heGlvcyA9IHRoaXMuY3JlYXRlQXhpb3NJbnN0YW5jZSgpO1xyXG4gICAgICAgIHRoaXMuc29ja2V0ID0gdGhpcy5vcGVuU29ja2V0KCk7XHJcblxyXG4gICAgICAgIC8vIEFaVVJFIElPVFxyXG4gICAgICAgIC8vIHRoaXMuY29ubmVjdGlvblN0cmluZyA9IEFaVVJFX0NPTk5FQ1RJT05fU1RSSU5HICsgJyc7XHJcbiAgICAgICAgLy8gdGhpcy5jbGllbnQgPSBDbGllbnQuZnJvbUNvbm5lY3Rpb25TdHJpbmcodGhpcy5jb25uZWN0aW9uU3RyaW5nLCBNcXR0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRTZXR0aW5ncygpIHtcclxuICAgICAgICB0aGlzLlNIQVJFRF9BQ0NFU1NfS0VZID0gU2V0dGluZ3MuZ2V0KFNldHRpbmdzLlNIQVJFRF9BQ0NFU1NfS0VZKS52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuV1NfVVJMID0gU2V0dGluZ3MuZ2V0KFNldHRpbmdzLldTX1VSTCkudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICB0aGlzLldTX09SSUdJTiA9IFNldHRpbmdzLmdldChTZXR0aW5ncy5XU19PUklHSU4pLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdGhpcy5JVEVNUEVSX1VSTCA9IFNldHRpbmdzLmdldChTZXR0aW5ncy5JVEVNUEVSX1VSTCkudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAvLyB0aGlzLkFaVVJFX0NPTk5FQ1RJT05fU1RSSU5HID0gU2V0dGluZ3MuZ2V0KFNldHRpbmdzLkFaVVJFX0NPTk5FQ1RJT05fU1RSSU5HKS52YWx1ZS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICBTZXR0aW5ncy5vbkNoYW5nZSgnU0hBUkVEX0FDQ0VTU19LRVknLCAoc2V0dGluZzogU2V0dGluZykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLlNIQVJFRF9BQ0NFU1NfS0VZID0gc2V0dGluZy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJ1NlbnNvckxvZy5zZXR0aW5nQ2hhbmdlZDogU0hBUkVEX0FDQ0VTU19LRVk9JyArIHRoaXMuU0hBUkVEX0FDQ0VTU19LRVkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIFNldHRpbmdzLm9uQ2hhbmdlKCdXU19VUkwnLCAoc2V0dGluZzogU2V0dGluZyk9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuV1NfVVJMID0gc2V0dGluZy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJ1NlbnNvckxvZy5zZXR0aW5nQ2hhbmdlZDogV1NfVVJMPScgKyB0aGlzLldTX1VSTCk7XHJcbiAgICAgICAgICAgIHRoaXMuc29ja2V0ID0gdGhpcy5vcGVuU29ja2V0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgU2V0dGluZ3Mub25DaGFuZ2UoJ1dTX09SSUdJTicsIChzZXR0aW5nOiBTZXR0aW5nKT0+IHtcclxuICAgICAgICAgICAgdGhpcy5XU19PUklHSU4gPSBzZXR0aW5nLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yTG9nLnNldHRpbmdDaGFuZ2VkOiBXU19PUklHSU49JyArIHRoaXMuV1NfT1JJR0lOKTtcclxuICAgICAgICAgICAgLy8gaWYgKHRoaXMuc29ja2V0Lk9QRU4pIHtcclxuICAgICAgICAgICAgLy8gICAgIHRoaXMuc29ja2V0LmNsb3NlKCk7XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgdGhpcy5zb2NrZXQgPSB0aGlzLm9wZW5Tb2NrZXQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBTZXR0aW5ncy5vbkNoYW5nZSgnSVRFTVBFUl9VUkwnLCAoc2V0dGluZzogU2V0dGluZyk9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuSVRFTVBFUl9VUkwgPSBzZXR0aW5nLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yTG9nLnNldHRpbmdDaGFuZ2VkOiBJVEVNUEVSX1VSTD0nICsgIHRoaXMuSVRFTVBFUl9VUkwpO1xyXG4gICAgICAgICAgICB0aGlzLmF4aW9zID0gdGhpcy5jcmVhdGVBeGlvc0luc3RhbmNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgU2V0dGluZ3Mub25DaGFuZ2UoJ0FaVVJFX0NPTk5FQ1RJT05fU1RSSU5HJywgKHNldHRpbmc6IFNldHRpbmcpPT4ge1xyXG4gICAgICAgICAgICBsb2cuaW5mbygnc2V0dGluZ0NoYW5nZWQ6IEFaVVJFX0NPTk5FQ1RJT05fU1RSSU5HIG5vdCBpbXBsZW1lbnRlZCB2YWx1ZT0nICsgc2V0dGluZy52YWx1ZS50b1N0cmluZygpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3RhdGUoKTogU2Vuc29yU3RhdGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRGaWx0ZXIoKTogRmlsdGVyQ29uZmlnIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhRmlsdGVyO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGlzbG9nZ2luZygpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sb2dnaW5nO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXJ0TG9nZ2luZyhmaWx0ZXI/OiBGaWx0ZXJDb25maWcpOiB2b2lkIHtcclxuICAgICAgICBsb2cuZGVidWcoJ1NlbnNvckxvZy5zdGFydExvZ2dpbmcnKTtcclxuICAgICAgICBpZiAoZmlsdGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YUZpbHRlciA9IGZpbHRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2luZyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0b3BMb2dnaW5nKCk6IHZvaWQge1xyXG4gICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yTG9nLnN0b3BMb2dnaW5nJyk7XHJcbiAgICAgICAgdGhpcy5sb2dnaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJpbnQgQVpVUkUgSU9UIHJlc3VsdHMuXHJcbi8vICAgICBwcml2YXRlIHByaW50UmVzdWx0Rm9yKG9wOiBzdHJpbmcpOiBhbnkge1xyXG4vLyAgICAgICAgIHJldHVybiBmdW5jdGlvbiBwcmludFJlc3VsdChlcnI6IGFueSwgcmVzOiBhbnkpIHtcclxuLy8gICAgICAgICBpZiAoZXJyKSB7XHJcbi8vICAgICAgICAgICAgIGxvZy5lcnJvcihvcCArICcgQVpVUkUgSU9UIGVycm9yOiAnICsgZXJyLnRvU3RyaW5nKCkpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBpZiAocmVzKSB7XHJcbi8vICAgICAgICAgICAgIGxvZy5pbmZvKG9wICsgJyBBWlVSRSBJT1Qgc3RhdHVzOiAnICsgcmVzLmNvbnN0cnVjdG9yLm5hbWUpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH07XHJcbi8vICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25TZW5zb3JEYXRhUmVjZWl2ZWQoZGF0YTogU2Vuc29yRGF0YSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLmxvZ2dpbmcpIHtcclxuICAgICAgICAgICAgY29uc3QgZGVzYyA9IHsgU046IHRoaXMuc3RhdGUuZ2V0QXR0cigpLlNOLCBwb3J0OiBkYXRhLmdldFBvcnQoKX07XHJcbiAgICAgICAgICAgIGNvbnN0IHNhbXBsZXMgPSBbe2RhdGU6IGRhdGEudGltZXN0YW1wKCksIHZhbHVlOiBkYXRhLmdldFZhbHVlKCl9XTtcclxuICAgICAgICAgICAgY29uc3Qgc2Vuc29yTG9nOiBTZW5zb3JMb2dEYXRhID0geyBkZXNjLCBzYW1wbGVzIH07XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSBkYXRhLnRpbWVzdGFtcCgpIC0gdGhpcy50aW1lc3RhbXA7XHJcbiAgICAgICAgICAgIHRoaXMudGltZXN0YW1wID0gZGF0YS50aW1lc3RhbXAoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVybCA9ICcvJyArIGRlc2MuU04gKyAnLycrIGRlc2MucG9ydDtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKCdVUkw6ICcgKyB1cmwpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHRoaXMuU0hBUkVEX0FDQ0VTU19LRVk7XHJcbiAgICAgICAgICAgIHRoaXMuYXhpb3MucG9zdDxTZW5zb3JMb2dEYXRhPih1cmwsIHNlbnNvckxvZywge2hlYWRlcnM6IHsgQXV0aG9yaXphdGlvbiB9fSlcclxuICAgICAgICAgICAgLnRoZW4gKGZ1bmN0aW9uKHJlcykge1xyXG4gICAgICAgICAgICAgICAgbG9nLmluZm8oJ1NlbnNvckxvZy5vblNlbnNvckRhdGFSZWNlaXZlZDogYXhpb3MucG9zdCAnICsgdXJsICsgJyAnICsgcmVzLnN0YXR1c1RleHQgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgcmVzLmRhdGE6ICcgKyBKU09OLnN0cmluZ2lmeShzZW5zb3JMb2cpICsgJyBtczogJyArIGRpZmYgK1xyXG4gICAgICAgICAgICAgICAgICAgICcgZGF0ZTogJyArIG5ldyBEYXRlKGRhdGEudGltZXN0YW1wKCkpLnRvTG9jYWxlU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3I6IEF4aW9zRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yTG9nLm9uU2Vuc29yRGF0YVJlY2VpdmVkOiBjYXRjaCBzZW5zb3IgZGF0YTonKyAgZXJyb3IucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgbG9nLmluZm8oJ1NlbnNvckxvZy5vblNlbnNvckRhdGFSZWNlaXZlZDogdHJ5aW5nIHJlZ2lzdGVyaW5nIHRoZSBzZW5zb3InKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IucmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcmVxdWVzdCB3YXMgbWFkZSBhbmQgdGhlIHNlcnZlciByZXNwb25kZWQgd2l0aCBhIHN0YXR1cyBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhhdCBmYWxscyBvdXQgb2YgdGhlIHJhbmdlIG9mIDJ4eFxyXG4gICAgICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yTG9nLm9uU2Vuc29yRGF0YVJlY2VpdmVkOicgKyAgZXJyb3IucmVzcG9uc2Uuc3RhdHVzICsgJyAtICcgK1xyXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGVycm9yLnJlc3BvbnNlLmRhdGEpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IucmVzcG9uc2Uuc3RhdHVzID09PSA0MDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nLmRlYnVnKCdTZW5zb3JMb2cub25TZW5zb3JEYXRhUmVjZWl2ZWQ6IHRyeWluZyByZWdpc3RlciBzZW5zb3I6ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc2Vuc29yTG9nLmRlc2MpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWdpc3RlclNlbnNvcihkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvci5yZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHJlcXVlc3Qgd2FzIG1hZGUgYnV0IG5vIHJlc3BvbnNlIHdhcyByZWNlaXZlZFxyXG4gICAgICAgICAgICAgICAgICAgIGxvZy5lcnJvcignU2Vuc29yTG9nLm9uU2Vuc29yRGF0YVJlY2VpdmVkLCByZXF1ZXN0LCBubyByZXNwb25zZTonICsgZXJyb3IucmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvbWV0aGluZyBoYXBwZW5lZCBpbiBzZXR0aW5nIHVwIHRoZSByZXF1ZXN0IHRoYXQgdHJpZ2dlcmVkIGFuIEVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgbG9nLmVycm9yKCdTZW5zb3JMb2cub25TZW5zb3JEYXRhUmVjZWl2ZWQsICBlcnJvci5jb25maWc6JyArIGVycm9yLmNvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gQVpVUkUgSU9UXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IG1lc3NhZ2UgPSBuZXcgTWVzc2FnZShKU09OLnN0cmluZ2lmeShzZW5zb3JMb2cpKTtcclxuICAgICAgICAgICAgLy8gbWVzc2FnZS5wcm9wZXJ0aWVzLmFkZCgnRGVsdGEgdGltZScsIGRpZmYudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuY2xpZW50LnNlbmRFdmVudChtZXNzYWdlLCB0aGlzLnByaW50UmVzdWx0Rm9yKCdzZW5kJykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlZ2lzdGVyU2Vuc29yKGRhdGE6IFNlbnNvckRhdGEpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBzdGF0ZUF0dHIgPSB0aGlzLnN0YXRlLmdldEF0dHIoKTtcclxuICAgICAgICBjb25zdCBhdHRyID0geyAgbW9kZWw6IHN0YXRlQXR0ci5tb2RlbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IHN0YXRlQXR0ci5jYXRlZ29yeS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY2N1cmFjeTogc3RhdGVBdHRyLmFjY3VyYWN5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHV0aW9uOiBzdGF0ZUF0dHIucmVzb2x1dGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF4U2FtcGxlUmF0ZTogc3RhdGVBdHRyLm1heFNhbXBsZVJhdGV9O1xyXG4gICAgICAgIGNvbnN0IGRlc2M6IFNlbnNvckRlc2NyaXB0b3IgPSB7IFNOOiBzdGF0ZUF0dHIuU04sIHBvcnQ6IGRhdGEuZ2V0UG9ydCgpfTtcclxuICAgICAgICBjb25zdCBib2R5ID0geyBkZXNjLCBhdHRyIH07XHJcbiAgICAgICAgY29uc3QgdXJsID0gJyc7XHJcblxyXG4gICAgICAgIGNvbnN0IEF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyB0aGlzLlNIQVJFRF9BQ0NFU1NfS0VZO1xyXG5cclxuICAgICAgICB0aGlzLmF4aW9zLnBvc3QodXJsLCBib2R5LCB7aGVhZGVyczogeyBBdXRob3JpemF0aW9uIH19KVxyXG4gICAgICAgIC50aGVuIChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbG9nLmluZm8oJ1NlbnNvckxvZy5yZWdpc3RlclNlbnNvcjogYXhpb3MucG9zdCAtIHN1Y2Nlc3NmdWwnKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcjogQXhpb3NFcnJvcikge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnKCdTZW5zb3JMb2cucmVnaXN0ZXJTZW5zb3I6IGNhdGNoIHNlbnNvciBkYXRhOicgKyAgZXJyb3IucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgbG9nLmluZm8oJ1NlbnNvckxvZy5yZWdpc3RlclNlbnNvcjogdHJ5aW5nIHJlZ2lzdGVyaW5nIHRoZSBzZW5zb3InKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IucmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgcmVxdWVzdCB3YXMgbWFkZSBhbmQgdGhlIHNlcnZlciByZXNwb25kZWQgd2l0aCBhIHN0YXR1cyBjb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhhdCBmYWxscyBvdXQgb2YgdGhlIHJhbmdlIG9mIDJ4eFxyXG4gICAgICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yTG9nLnJlZ2lzdGVyU2Vuc29yOicgKyAgZXJyb3IucmVzcG9uc2Uuc3RhdHVzICsgJyAtICcgK1xyXG4gICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGVycm9yLnJlc3BvbnNlLmRhdGEpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IucmVzcG9uc2Uuc3RhdHVzID09PSA1MDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nLmRlYnVnKCdTZW5zb3JMb2cucmVnaXN0ZXJTZW5zb3I6IHRyeWluZyByZWdpc3RlciBzZW5zb3IgYWdhaW46ICcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoZGVzYykpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3IucmVxdWVzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSByZXF1ZXN0IHdhcyBtYWRlIGJ1dCBubyByZXNwb25zZSB3YXMgcmVjZWl2ZWRcclxuICAgICAgICAgICAgICAgICAgICBsb2cuZXJyb3IoJ1NlbnNvckxvZy5yZWdpc3RlclNlbnNvciwgcmVxdWVzdCwgbm8gcmVzcG9uc2U6JyArIGVycm9yLnJlcXVlc3QudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvbWV0aGluZyBoYXBwZW5lZCBpbiBzZXR0aW5nIHVwIHRoZSByZXF1ZXN0IHRoYXQgdHJpZ2dlcmVkIGFuIEVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgbG9nLmVycm9yKCdTZW5zb3JMb2cucmVnaXN0ZXJTZW5zb3IsICBlcnJvci5jb25maWc6JyArIGVycm9yLmNvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2cuZXJyb3IoJ1NlbnNvckxvZy5yZWdpc3RlclNlbnNvcjogY2F0Y2ggcmVnaXN0ZXI6ICcgKyBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Nb25pdG9yKGRhdGE6IFNlbnNvckRhdGEpOiB2b2lkIHtcclxuICAgICAgICBsb2cuZGVidWcoJ1NlbnNvckxvZy5vbk1vbml0b3InKTtcclxuICAgICAgICBjb25zdCBkZXNjID0geyBTTjogdGhpcy5zdGF0ZS5nZXRBdHRyKCkuU04sIHBvcnQ6IGRhdGEuZ2V0UG9ydCgpfTtcclxuICAgICAgICBjb25zdCBzYW1wbGVzID0gW3tkYXRlOiBkYXRhLnRpbWVzdGFtcCgpLCB2YWx1ZTogZGF0YS5nZXRWYWx1ZSgpfV07XHJcbiAgICAgICAgY29uc3Qgc2Vuc29yTG9nID0geyBkZXNjLCBzYW1wbGVzIH07XHJcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOKSB7XHJcbiAgICAgICAgICAgIGxvZy5kZWJ1ZygnU2Vuc29yTG9nLm9uTW9uaXRvcjogc2Vuc29yIGxvZzogJyArIEpTT04uc3RyaW5naWZ5KHNlbnNvckxvZykpO1xyXG4gICAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHNlbnNvckxvZykpO1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJ1NlbnNvckxvZy5vbk1vbml0b3I6IHNlbnNvciBsb2cgc2VudCcpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuc29ja2V0IHx8IHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5DTE9TRUQpIHtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKCdTZW5zb3JMb2cub25Nb25pdG9yOiBzb2NrZXQgY2xvc2VkLCByZS1vcGVuJyk7XHJcbiAgICAgICAgICAgIHRoaXMuc29ja2V0ID0gdGhpcy5vcGVuU29ja2V0KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbG9nLmRlYnVnKCdTZW5zb3JMb2cub25Nb25pdG9yOiBzb2NrZXQgbm90IG9wZW4geWV0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==
