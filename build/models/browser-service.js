"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = __importStar(require("ws"));
var logger_1 = require("../logger");
var settings_1 = require("./settings");
var usb_controller_1 = require("./usb-controller");
var wss;
function broadcast(ws, message, includeSelf) {
    logger_1.log.debug('browser-Service.broadcast: sending message=' + JSON.stringify(message));
    wss.clients.forEach(function each(client) {
        if ((client !== ws || includeSelf) && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
            logger_1.log.debug('browser-Service.broadcast: message sent');
        }
    });
}
function broadcastAll(message) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
    logger_1.log.debug('browser-Service.broadcastAll: message sent');
}
function initOutboundMessageService(server) {
    wss = server;
}
exports.initOutboundMessageService = initOutboundMessageService;
function parseInboundMessage(ws, data) {
    var message = JSON.parse(data.toString());
    logger_1.log.debug('browser-service.parseInboundMessage: received message=' + message);
    switch (message.command) {
        case 'getSensors':
            getSensors(ws);
            break;
        case 'getSettings':
            getSettings(ws);
            break;
        case 'startMonitor':
            message.data = message.data;
            startMonitor(ws, message.data);
            break;
        case 'stopMonitor':
            message.data = message.data;
            stopMonitor(ws, message.data);
            break;
        case 'saveSetting':
            message.data = message.data;
            saveSetting(ws, message.data);
            break;
    }
}
exports.parseInboundMessage = parseInboundMessage;
function description(attr, data) {
    return { SN: attr.SN, port: data.getPort() };
}
function sensorSample(data) {
    return { value: data.getValue(), date: data.timestamp() };
}
function AddSensorLogs(sensorLogs, state) {
    var attr = state.getAttr();
    var sensorData = state.getSensorData();
    for (var _i = 0, sensorData_1 = sensorData; _i < sensorData_1.length; _i++) {
        var sensor = sensorData_1[_i];
        var samples = [];
        samples.push(sensorSample(sensor));
        sensorLogs.push({ desc: description(attr, sensor), attr: attr, samples: samples });
    }
}
function getSensors(ws) {
    var loggers = usb_controller_1.USBController.getLoggers();
    var command = 'sensors';
    var data = [];
    for (var _i = 0, loggers_1 = loggers; _i < loggers_1.length; _i++) {
        var logger = loggers_1[_i];
        var state = logger.getState();
        AddSensorLogs(data, state);
    }
    var message = JSON.stringify({ command: command, data: data });
    ws.send(message);
    logger_1.log.info('browser-services.getSensors, sent: ' + message);
}
exports.getSensors = getSensors;
function getSettings(ws) {
    var data = settings_1.Settings.all();
    var message = JSON.stringify({ command: 'settings', data: data });
    ws.send(message);
    logger_1.log.info('browser-service.getSettings: sends settings to client' + message);
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var setting = data_1[_i];
        settings_1.Settings.onChange(setting.name, publishSetting);
    }
    logger_1.log.info('browser-service.getSettings: subscribed to future setting changes');
}
exports.getSettings = getSettings;
function publishSetting(setting) {
    var data = [setting];
    var message = { command: 'settings', data: data };
    broadcastAll(message);
}
exports.publishSetting = publishSetting;
function saveSetting(ws, setting) {
    logger_1.log.debug('browser-service.saveSetting: ' + JSON.stringify(setting));
    if (setting.name && setting.value) {
        settings_1.Settings.update(setting.name, setting.value, function (updated) {
            if (updated) {
                var command = 'settings';
                var data = [];
                data.push(setting);
                var message = { command: command, data: data };
                broadcast(ws, message, true);
            }
        });
    }
}
exports.saveSetting = saveSetting;
var MonitoringClients = new Set();
var logTimer;
function startMonitor(ws, desc) {
    logger_1.log.info('browser-service.startMonitor: has not implemented filter on Desc yet: ' + JSON.stringify(desc));
    if (!MonitoringClients.has(ws)) {
        MonitoringClients.add(ws);
    }
    if (MonitoringClients.size === 1) {
        logTimer = setInterval(logSensorData, usb_controller_1.USBController.getPollingInterval());
    }
    logger_1.log.info('Browser-service.startMonitor: ' + MonitoringClients.size + ' clients');
}
exports.startMonitor = startMonitor;
function stopMonitor(ws, desc) {
    logger_1.log.info('browser-service.stopMonitor: has not implemented filter on Descr yet: ' + JSON.stringify(desc));
    if (MonitoringClients.has(ws)) {
        MonitoringClients.delete(ws);
    }
    if (MonitoringClients.size === 0) {
        clearTimeout(logTimer);
    }
    logger_1.log.info('Browser-service.stopMonitor: ' + MonitoringClients.size + ' clients');
}
exports.stopMonitor = stopMonitor;
function logSensorData() {
    var loggers = usb_controller_1.USBController.getLoggers();
    var command = 'log';
    var data = [];
    for (var _i = 0, loggers_2 = loggers; _i < loggers_2.length; _i++) {
        var logger = loggers_2[_i];
        var state = logger.getState();
        AddSensorLogs(data, state);
    }
    var message = JSON.stringify({ command: command, data: data });
    MonitoringClients.forEach(function (ws) {
        if (ws.readyState === ws.OPEN) {
            ws.send(message);
        }
        if (ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING) {
            MonitoringClients.delete(ws);
        }
    });
    logger_1.log.info('Browser-service.logSensorData: sent to ' + MonitoringClients.size + ' clients, message: ' + message);
}
//# sourceMappingURL=browser-service.js.map