"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var logger_1 = require("../logger");
var settings_1 = require("./settings");
var USBDevice = (function () {
    function USBDevice(hid, reporter) {
        this.interval = settings_1.Settings.get('POLL_INTERVAL');
        this.POLL_INTERVAL = this.interval ? Number(this.interval) : 5000;
        this.MAX_SAMPLE_RATE = 1 / this.POLL_INTERVAL;
        this.deviceInitialized = false;
        this.hid = hid;
        this.reporter = reporter;
        this.MAX_SAMPLE_RATE = reporter.maxSampleRate();
        if (this.sampleRate() > this.MAX_SAMPLE_RATE) {
            this.POLL_INTERVAL = 1000 * 1 / this.MAX_SAMPLE_RATE;
        }
        this.initializeDevice();
        this.pollSensors();
    }
    USBDevice.prototype.initializeDevice = function () {
        if (!this.deviceInitialized) {
            this.hid.on('data', this.parseInput.bind(this));
            this.hid.on('error', this.parseError.bind(this));
            this.setPollingInterval(this.POLL_INTERVAL);
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
        logger_1.log.info('USBDevice.setPollingInterval:' + ms);
    };
    USBDevice.prototype.getPollingInterval = function () {
        return this.POLL_INTERVAL;
    };
    USBDevice.prototype.pollSensors = function () {
        if (!this.deviceInitialized) {
            this.initializeDevice();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2RlbHMvdXNiLWRldmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHVCQUEwQjtBQUMxQixvQ0FBZ0M7QUFDaEMsdUNBQStDO0FBVS9DO0lBYUksbUJBQVksR0FBWSxFQUFFLFFBQXFCO1FBUnZDLGFBQVEsR0FBd0IsbUJBQVEsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDOUQsa0JBQWEsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBLENBQUMsQ0FBQSxJQUFLLENBQUM7UUFHbEUsb0JBQWUsR0FBRyxDQUFDLEdBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUN2QyxzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFJOUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNoRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQzFDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSyxHQUFHLENBQUMsR0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQ3ZEO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxvQ0FBZ0IsR0FBdkI7UUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFB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RSxFQUFFO1lBQ3hCLElBQUk7Z0JBQ0EsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JCLFlBQUcsQ0FBQyxLQUFLLENBQUMsK0JBQStCLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDcEQ7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixZQUFHLENBQUMsS0FBSyxDQUFDLGtEQUFrRCxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNwRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDaEI7U0FFSjtJQUNMLENBQUM7SUFDTCxnQkFBQztBQUFELENBOUdBLEFBOEdDLElBQUE7QUE5R1ksOEJBQVMiLCJmaWxlIjoibW9kZWxzL3VzYi1kZXZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IEhJRCA9IHJlcXVpcmUoJ25vZGUtaGlkJyk7XHJcbmltcG9ydCBvcyA9IHJlcXVpcmUoJ29zJyk7XHJcbmltcG9ydCB7IGxvZyB9IGZyb20gJy4uL2xvZ2dlcic7XHJcbmltcG9ydCB7IFNldHRpbmcsIFNldHRpbmdzIH0gZnJvbSAnLi9zZXR0aW5ncyc7XHJcblxyXG4vLyBSZXBvcnRQYXJzZXIgYWxsb3cgVVNCQ29udHJvbGxlciB0byBiZSBpbmRlcGVuZGVudCBvbiB0aGUgc3BlY2lmaWNcclxuLy8gVGVtcGVyIGRldmljZSBjb25uZWN0ZWQuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVVNCUmVwb3J0ZXIge1xyXG4gICAgaW5pdFdyaXRlUmVwb3J0KCk6IG51bWJlcltdW107XHJcbiAgICByZWFkUmVwb3J0KGRhdGE6IG51bWJlcltdKTogbnVtYmVyW107XHJcbiAgICBtYXhTYW1wbGVSYXRlKCk6IG51bWJlcjtcclxufVxyXG4vLyBIYW5kbGUgYSBzZW5zb3IgZGV2aWNlIG9uIHRoZSBVU0IgaHViLlxyXG5leHBvcnQgY2xhc3MgVVNCRGV2aWNlIHtcclxuICAgIHByaXZhdGUgIGhpZDogSElELkhJRDtcclxuXHJcbiAgICBwcml2YXRlIHJlcG9ydGVyOiBVU0JSZXBvcnRlcjtcclxuXHJcbiAgICBwcml2YXRlIGludGVydmFsOiBTZXR0aW5nIHwgdW5kZWZpbmVkID0gU2V0dGluZ3MuZ2V0KCdQT0xMX0lOVEVSVkFMJyk7XHJcbiAgICBwcml2YXRlIFBPTExfSU5URVJWQUw6IG51bWJlciA9IHRoaXMuaW50ZXJ2YWw/TnVtYmVyKHRoaXMuaW50ZXJ2YWwpOjVfMDAwO1xyXG5cclxuICAgIC8vIHByaXZhdGUgUE9MTF9JTlRFUlZBTDogbnVtYmVyID0gU2V0dGluZ3MuZ2V0KCdQT0xMX0lOVEVSVkFMJykudmFsdWUgfCA1MDAwO1xyXG4gICAgcHJpdmF0ZSBNQVhfU0FNUExFX1JBVEUgPSAxL3RoaXMuUE9MTF9JTlRFUlZBTDtcclxuICAgIHByaXZhdGUgZGV2aWNlSW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuXHJcbiAgICBwcml2YXRlIHRpbWVyOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihoaWQ6IEhJRC5ISUQsIHJlcG9ydGVyOiBVU0JSZXBvcnRlcikge1xyXG4gICAgICAgIHRoaXMuaGlkID0gaGlkO1xyXG4gICAgICAgIHRoaXMucmVwb3J0ZXIgPSByZXBvcnRlcjtcclxuICAgICAgICB0aGlzLk1BWF9TQU1QTEVfUkFURSA9IHJlcG9ydGVyLm1heFNhbXBsZVJhdGUoKTtcclxuICAgICAgICBpZiAodGhpcy5zYW1wbGVSYXRlKCkgPiB0aGlzLk1BWF9TQU1QTEVfUkFURSkge1xyXG4gICAgICAgICAgICB0aGlzLlBPTExfSU5URVJWQUwgPSAxXzAwMCAqIDEvdGhpcy5NQVhfU0FNUExFX1JBVEU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZURldmljZSgpO1xyXG4gICAgICAgIHRoaXMucG9sbFNlbnNvcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZURldmljZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGV2aWNlSW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5oaWQub24oJ2RhdGEnLCB0aGlzLnBhcnNlSW5wdXQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkLm9uKCdlcnJvcicsIHRoaXMucGFyc2VFcnJvci5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRQb2xsaW5nSW50ZXJ2YWwodGhpcy5QT0xMX0lOVEVSVkFMKTtcclxuICAgICAgICAgICAgdGhpcy5kZXZpY2VJbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGxvZy5pbmZvKCdVU0JEZXZpY2UuaW5pdGlhbGl6ZURldmljZSBkb25lJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9zZSgpIHtcclxuICAgICAgICB0aGlzLmRldmljZUluaXRpYWxpemVkID0gZmFsc2U7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5oaWQucGF1c2UoKTtcclxuICAgICAgICAgICAgdGhpcy5oaWQuY2xvc2UoKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzYW1wbGVSYXRlKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIDEvKHRoaXMuUE9MTF9JTlRFUlZBTC8xXzAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFBvbGxpbmdJbnRlcnZhbChtczogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5QT0xMX0lOVEVSVkFMID0gbXM7XHJcbiAgICAgICAgaWYgKHRoaXMuc2FtcGxlUmF0ZSgpID4gdGhpcy5NQVhfU0FNUExFX1JBVEUpIHtcclxuICAgICAgICAgICAgdGhpcy5QT0xMX0lOVEVSVkFMID0gMV8wMDAgKiAxL3RoaXMuTUFYX1NBTVBMRV9SQVRFO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMudGltZXIpO1xyXG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbCh0aGlzLnBvbGxTZW5zb3JzLmJpbmQodGhpcyksIHRoaXMuUE9MTF9JTlRFUlZBTCk7XHJcbiAgICAgICAgbG9nLmluZm8oJ1VTQkRldmljZS5zZXRQb2xsaW5nSW50ZXJ2YWw6JyArIG1zKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UG9sbGluZ0ludGVydmFsKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuUE9MTF9JTlRFUlZBTDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUaGlzIGlzIHdlcmUgYWxsIHN0YXJ0cyB3aGVuIHNldCBpbnRlcnZhbCB0aW1lIGV4cGlyZXNcclxuICAgIHByaXZhdGUgcG9sbFNlbnNvcnMoKSB7XHJcbiAgICAgICAgaWYgKCEgdGhpcy5kZXZpY2VJbml0aWFsaXplZCkge1xyXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVEZXZpY2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2cuZGVidWcoJysrKyBVU0JDb250cm9sbGVyLnBvbGxTZW5zb3JzJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGluaXRDb21tYW5kcyA9IHRoaXMucmVwb3J0ZXIuaW5pdFdyaXRlUmVwb3J0KCk7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY29tbWFuZCBvZiBpbml0Q29tbWFuZHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JpdGVSZXBvcnQoY29tbWFuZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBDYWxsZWQgZnJvbSBISUQsIFBhcnNlcyBpbnB1dCBmcm9tIEhJRCBhbmQgd3JpdGVzIGFueSByZXNwb25zZSBtZXNzYWdlc1xyXG4gICAgLy8gYmFjayB0byB0aGUgZGV2aWNlXHJcbiAgICBwcml2YXRlIHBhcnNlSW5wdXQoZGF0YTogbnVtYmVyW10pOiB2b2lkICB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB0aGlzLnJlcG9ydGVyLnJlYWRSZXBvcnQoZGF0YSk7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyaXRlUmVwb3J0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLy8gVE9ETyBlcnJvciBoYW5kbGluZyBpZiBwYXJzZSBpbnB1dCBlcnJvclxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwYXJzZUVycm9yKF9lcnJvcjogYW55KSB7XHJcbiAgICAgICAgbG9nLmVycm9yKCdwYXJzZUVycm9yOiAnLCBfZXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEhlbHBlciBmdW5jdGlvbnMgdG8gd3JpdGUgcmVwb3J0cyB0byB0aGUgZGV2aWNlXHJcbiAgICBwcml2YXRlIHdyaXRlUmVwb3J0KGRhdGE6IG51bWJlcltdKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGlmIChvcy5wbGF0Zm9ybSgpID09PSAnd2luMzInKSB7XHJcbiAgICAgICAgICAgIGRhdGEudW5zaGlmdCgwKTsgIC8vIHByZXBlbmQgYSB0aHJvd2F3YXkgYnl0ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gT3V0cHV0IHJlcG9ydFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZC53cml0ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZygnKysrIFVTQkNvbnRyb2xsZXIud3JpdGVSZXBvcnQnLCBkYXRhKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgbG9nLmVycm9yKCcqKiogVVNCQ29udHJvbGxlci53cml0ZVJlcG9ydCBoaWQud3JpdGUgY2F0Y2g6JmQnLCBkYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19
