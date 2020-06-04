"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var logger_1 = require("./../logger");
var Settings = (function () {
    function Settings() {
    }
    Settings.initialize = function () {
        Settings.add(Settings.SERIAL_NUMBER, 'Serial Number', config_1.conf.SERIAL_NUMBER, '', 'Serial Number (SN)', !Settings.READONLY);
        Settings.add(Settings.AZURE_CONNECTION_STRING, 'Azure connection string', config_1.conf.AZURE_CONNECTION_STRING, '', 'Connection string to AZURE IOT HUB', !Settings.READONLY);
        Settings.add(Settings.CONSOLE_LEVEL, 'Console log level', config_1.conf.CONSOLE_LEVEL, 'info', 'Event level logged on console: error | info | debug', !Settings.READONLY);
        Settings.add(Settings.ERROR_LEVEL, 'Error file log level', config_1.conf.ERROR_LEVEL, 'error', 'Event level logged on file: error | info | debug', !Settings.READONLY);
        Settings.add(Settings.ERROR_LOG_FILE, 'Application error log file', config_1.conf.ERROR_LOG_FILE, 'itemper-error.log', 'Name of the log file. You find it in the application root directory', Settings.READONLY);
        Settings.add(Settings.HOSTNAME, 'Hostname', config_1.conf.HOSTNAME, '', 'This device \'s hostname', Settings.READONLY);
        Settings.add(Settings.ITEMPER_URL, 'iTemper URL', config_1.conf.ITEMPER_URL, 'https://itemper.io', 'The device use\'s this URL when connecting to iTemper', !Settings.READONLY);
        Settings.add(Settings.POLL_INTERVAL, 'Sensor poll interval', config_1.conf.POLL_INTERVAL, 5000, 'Interval (ms) between polling the sensors', !Settings.READONLY);
        Settings.add(Settings.WS_ORIGIN, 'WebSocket origin', config_1.conf.WS_ORIGIN, 'https://itemper.io', 'Origin used when connecting to iTemper with WebSockets', !Settings.READONLY);
        Settings.add(Settings.WS_URL, 'WebSocket URL', config_1.conf.WS_URL, 'wss://itemper.io', 'WebSocket URL to iTemper', !Settings.READONLY);
        Settings.add(Settings.SHARED_ACCESS_KEY, 'Shared access key', config_1.conf.SHARED_ACCESS_KEY, '', 'Add the Shared key to a device on an itemper.io user account ' +
            ' to allow the this device to log sensor data on itemper.io', !Settings.READONLY);
        Settings.onChange(Settings.CONSOLE_LEVEL, function (setting) {
            logger_1.setLevel(setting.value.toString());
        });
    };
    Settings.onChange = function (settingName, publish) {
        logger_1.log.info('Settings.onChange: ' + settingName);
        Settings.listeners.push({ settingName: settingName, publish: publish });
        var setting = Settings.get(settingName);
        if (setting) {
            publish(setting);
        }
    };
    Settings.publish = function (setting) {
        for (var _i = 0, _a = Settings.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            if (listener.settingName === setting.name) {
                listener.publish(setting);
            }
        }
    };
    Settings.all = function () {
        var allSettings = [];
        Settings.forEach(function (setting) { return allSettings.push(setting); });
        return allSettings;
    };
    Settings.add = function (name, label, value, defaultValue, text, readonly) {
        var setting = Settings.create(name, label, value, defaultValue, text, readonly);
        Settings.set(setting);
        Settings.publish(setting);
    };
    Settings.create = function (name, label, value, defaultValue, text, readonly) {
        if (value) {
            return { name: name, label: label, value: value, defaultValue: defaultValue, text: text, readonly: readonly };
        }
        else {
            return { name: name, label: label, value: defaultValue, defaultValue: defaultValue, text: text, readonly: readonly };
        }
    };
    Settings.get = function (name) {
        var setting = Settings.map.get(name);
        if (setting) {
            return setting;
        }
        else {
            throw Error(name);
        }
    };
    Settings.toNum = function (setting) {
        return Number(setting.value);
    };
    Settings.prototype.toString = function (setting) {
        if (typeof setting.value === 'number') {
            return setting.value.toString();
        }
        else {
            return setting.value;
        }
    };
    Settings.has = function (name) {
        return Settings.map.has(name);
    };
    Settings.set = function (setting) {
        Settings.map.set(setting.name, setting);
        logger_1.log.info('Settings.set: ' + JSON.stringify(setting));
    };
    Settings.update = function (name, value, callback) {
        var setting = Settings.get(name);
        if (setting && !setting.readonly) {
            setting.value = value;
            logger_1.log.info('Settings.update: setting ' + name + ' has new value:' + setting.value);
            callback(true);
            this.publish(setting);
        }
        else {
            logger_1.log.error('Settings.update: Cannot update readonly setting' + name + ' to ' + value);
            callback(false);
        }
    };
    Settings.forEach = function (callbackfn) {
        Settings.map.forEach(callbackfn);
    };
    Settings.map = new Map();
    Settings.listeners = [];
    Settings.SERIAL_NUMBER = 'SERIAL_NUMBER';
    Settings.AZURE_CONNECTION_STRING = 'AZURE_CONNECTION_STRING';
    Settings.CONSOLE_LEVEL = 'CONSOLE_LEVEL';
    Settings.ERROR_LEVEL = 'ERROR_LEVEL';
    Settings.ERROR_LOG_FILE = 'ERROR_LOG_FILE';
    Settings.HOSTNAME = 'HOSTNAME';
    Settings.ITEMPER_URL = 'ITEMPER_URL';
    Settings.POLL_INTERVAL = 'POLL_INTERVAL';
    Settings.WS_ORIGIN = 'WS_ORIGIN';
    Settings.WS_URL = 'WS_URL';
    Settings.SHARED_ACCESS_KEY = 'SHARED_ACCESS_KEY';
    Settings.READONLY = true;
    return Settings;
}());
exports.Settings = Settings;
//# sourceMappingURL=settings.js.map