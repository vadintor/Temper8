"use strict";
exports.__esModule = true;
var os = require("os");
var logger_1 = require("./../logger");
// Handle a sensor device on the USB hub.
var USBController = /** @class */ (function () {
    function USBController(hid, parser) {
        this.POLL_INTERVAL = 5000;
        this.deviceInitialized = false;
        this.hid = hid;
        this.reportParser = parser;
        this.initializeDevice();
        this.pollSensors();
    }
    USBController.prototype.initializeDevice = function () {
        if (!this.deviceInitialized) {
            this.hid.on('data', this.parseInput.bind(this));
            this.hid.on('error', this.parseError.bind(this));
            this.setPollingInterval(this.POLL_INTERVAL);
            this.deviceInitialized = true;
            logger_1.log.info('USBController.initializeDevice done');
        }
    };
    USBController.prototype.close = function () {
        this.deviceInitialized = false;
        try {
            this.hid.pause();
            this.hid.close();
        }
        catch (e) {
            return;
        }
    };
    USBController.prototype.setPollingInterval = function (ms) {
        this.POLL_INTERVAL = ms;
        clearInterval(this.interval);
        this.interval = setInterval(this.pollSensors.bind(this), this.POLL_INTERVAL);
        logger_1.log.info('USB Controller.setPollingInterval: %d', ms);
    };
    // This is were all starts when set interval time expires
    USBController.prototype.pollSensors = function () {
        if (!this.deviceInitialized) {
            this.initializeDevice();
        }
        else {
            logger_1.log.debug('+++ USBController.pollSensors');
            var initCommands = this.reportParser.initReport();
            for (var _i = 0, initCommands_1 = initCommands; _i < initCommands_1.length; _i++) {
                var command = initCommands_1[_i];
                this.writeReport(command);
            }
        }
    };
    // Called from HID, Parses input from HID and writes any response messages
    // back to the device
    USBController.prototype.parseInput = function (data) {
        try {
            var response = this.reportParser.parseInput(data);
            if (response.length > 0) {
                this.writeReport(response);
            }
        }
        catch (e) {
            // TODO error handling if parse input error
            return;
        }
    };
    USBController.prototype.parseError = function (_error) {
        logger_1.log.error('parseError: ', _error);
    };
    // Helper functions to write reports to the device
    USBController.prototype.writeReport = function (data) {
        if (os.platform() === 'win32') {
            data.unshift(0); // prepend a throwaway byte
        }
        // Output report
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
    return USBController;
}());
exports.USBController = USBController;
