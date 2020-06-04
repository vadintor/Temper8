"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var logger_1 = require("../logger");
var settings_1 = require("./settings");
var USBDevice = (function () {
    function USBDevice(hid, reporter) {
        this.POLL_INTERVAL = 5000;
        this.MAX_SAMPLE_RATE = 1 / this.POLL_INTERVAL;
        this.deviceInitialized = false;
        this.hid = hid;
        this.reporter = reporter;
        this.MAX_SAMPLE_RATE = reporter.maxSampleRate();
        if (this.sampleRate() > this.MAX_SAMPLE_RATE) {
            this.POLL_INTERVAL = 1000 * 1 / this.MAX_SAMPLE_RATE;
        }
        settings_1.Settings.onChange(settings_1.Settings.POLL_INTERVAL, this.pollIntervalChanged.bind(this));
        this.initialize();
        this.pollSensors();
    }
    USBDevice.prototype.pollIntervalChanged = function (setting) {
        var pollInterval = setting.value;
        var sampleRate = 1 / (pollInterval / 1000);
        if (sampleRate < this.MAX_SAMPLE_RATE) {
            this.POLL_INTERVAL = pollInterval;
            logger_1.log.info('USBDevice.pollIntervalChanged to' + pollInterval);
        }
    };
    USBDevice.prototype.initialize = function () {
        if (!this.deviceInitialized) {
            this.hid.on('data', this.parseInput.bind(this));
            this.hid.on('error', this.parseError.bind(this));
            this.setPollingInterval(this.POLL_INTERVAL);
            logger_1.log.debug('USBDevice.initializeDevice POLLING INTERVAL=' + this.POLL_INTERVAL);
            this.deviceInitialized = true;
            logger_1.log.info('USBDevice.initializeDevice done');
        }
    };
    USBDevice.prototype.close = function () {
        this.deviceInitialized = false;
        try {
            this.hid.pause();
            this.hid.close();
        }
        catch (e) {
            return;
        }
    };
    USBDevice.prototype.sampleRate = function () {
        return 1 / (this.POLL_INTERVAL / 1000);
    };
    USBDevice.prototype.setPollingInterval = function (ms) {
        this.POLL_INTERVAL = ms;
        if (this.sampleRate() > this.MAX_SAMPLE_RATE) {
            this.POLL_INTERVAL = 1000 * 1 / this.MAX_SAMPLE_RATE;
        }
        clearInterval(this.timer);
        this.timer = setInterval(this.pollSensors.bind(this), this.POLL_INTERVAL);
        logger_1.log.info('USBDevice.setPollingInterval: ' + ms + 'ms');
    };
    USBDevice.prototype.getPollingInterval = function () {
        return this.POLL_INTERVAL;
    };
    USBDevice.prototype.pollSensors = function () {
        if (!this.deviceInitialized) {
            this.initialize();
        }
        else {
            logger_1.log.debug('+++ USBController.pollSensors');
            var initCommands = this.reporter.initWriteReport();
            for (var _i = 0, initCommands_1 = initCommands; _i < initCommands_1.length; _i++) {
                var command = initCommands_1[_i];
                this.writeReport(command);
            }
        }
    };
    USBDevice.prototype.parseInput = function (data) {
        try {
            var response = this.reporter.readReport(data);
            if (response.length > 0) {
                this.writeReport(response);
            }
        }
        catch (e) {
            return;
        }
    };
    USBDevice.prototype.parseError = function (_error) {
        logger_1.log.error('parseError: ', _error);
    };
    USBDevice.prototype.writeReport = function (data) {
        if (os.platform() === 'win32') {
            data.unshift(0);
        }
        for (var i = 0; i < 1; i++) {
            try {
                this.hid.write(data);
                logger_1.log.debug('+++ USBController.writeReport', data);
            }
            catch (e) {
                logger_1.log.error('*** USBController.writeReport hid.write catch:&d', data);
                this.close();
            }
        }
    };
    return USBDevice;
}());
exports.USBDevice = USBDevice;
//# sourceMappingURL=usb-device.js.map