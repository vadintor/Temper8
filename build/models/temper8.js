"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HID = require("node-hid");
var os = require("os");
var Sensor = (function () {
    function Sensor(port, value) {
        if (port === void 0) { port = -1; }
        if (value === void 0) { value = 85.0; }
        this._port = -1;
        this._value = 85.0;
        this._port = port;
        this._value = value;
    }
    Sensor.prototype.value = function () {
        return this._value;
    };
    Sensor.prototype.valid = function () {
        return this._value < 85.0;
    };
    Sensor.prototype.setValue = function (value) {
        this._value = value;
    };
    Sensor.prototype.setPort = function (port) {
        this._port = port;
    };
    Sensor.prototype.port = function () {
        return this._port;
    };
    Sensor.prototype.isConnected = function () {
        return this._port >= 0;
    };
    return Sensor;
}());
exports.Sensor = Sensor;
var Device = (function () {
    function Device() {
        Device.initlialize();
    }
    Device.initlialize = function () {
        if (!Device._deviceInitlialized) {
            var _devices = HID.devices();
            var deviceInfo = _devices.find(function (d) {
                var VID = 0x0C45;
                var PID = 0x7401;
                var isTemper = d.vendorId === VID && d.productId === PID;
                return isTemper && d.interface === 1;
            });
            if ((deviceInfo !== undefined) && (deviceInfo.path !== undefined)) {
                Device._hid1 = new HID.HID(deviceInfo.path);
                Device._hid1.on('data', Device.parseInput);
                Device._hid1.on('error', Device.parseError);
                Device._interval = setInterval(Device.pollSensors, Device.POLL_INTERVALL);
                Device._deviceInitlialized = true;
                Device.writeUsedPortsRequest();
                Device.WriteTemperatureRequest(0);
                console.log('+initlialized');
            }
        }
    };
    Device.close = function () {
        Device._nextSensor = 0;
        Device._deviceInitlialized = false;
        try {
            Device._hid1.pause();
            Device._hid1.close();
        }
        catch (e) {
            return;
        }
    };
    Device.pollSensors = function () {
        if (!Device._deviceInitlialized) {
            Device.initlialize();
        }
        else {
            Device.writeUsedPortsRequest();
            if (Date.now() - Device._lastInputTime > 2 * Device.POLL_INTERVALL) {
                Device.WriteTemperatureRequest(0);
            }
        }
    };
    Device.getSensorData = function () {
        return Device._sensors.slice();
    };
    Device.parseError = function (_error) {
        return;
    };
    Device.parseInput = function (data) {
        Device._lastInputTime = Date.now();
        try {
            if (Device.matchUsedPorts(data)) {
                Device.WriteTemperatureRequest(Device._sensors[Device._nextSensor].port());
                Device._nextSensor += 1;
            }
            else if (Device.matchTemperature(data)) {
                if (Device._nextSensor < Device._sensors.length) {
                    Device.WriteTemperatureRequest(Device._sensors[Device._nextSensor].port());
                    Device._nextSensor += 1;
                }
                else {
                    Device._nextSensor = 0;
                    Device.writeCheck03Request();
                }
            }
            else if (Device.matchCheck03(data)) {
                Device.writeCheck05Request();
            }
            else if (Device.matchCheck05(data)) {
                Device.writeCheck0DRequest();
            }
            else if (Device.matchCheck0D(data)) {
                return;
            }
            else if (Device.matchCheckFF(data)) {
                Device.writeCheckFFRequest();
                console.log('--matchCheckFF: restart');
                return;
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    Device.writeRequest = function (data) {
        if (os.platform() === 'win32') {
            data.unshift(0);
        }
        for (var i = 0; i < 1; i++) {
            try {
                Device._hid1.write(data);
            }
            catch (e) {
                console.log('-_hid1.write catch:&d', JSON.stringify(data));
                Device.close();
            }
        }
    };
    Device.writeUsedPortsRequest = function () {
        var data = [0x01, 0x8A, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00];
        this.writeRequest(data);
    };
    Device.matchUsedPorts = function (data) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x01) {
            Device.connectSensors(data[4], data[5]);
            return true;
        }
        else {
            return false;
        }
    };
    Device.connectSensors = function (total, used) {
        console.log('connectSensors, total:%d', total);
        if (Device._sensors.length === 0) {
            Device._sensors = Array(total);
            var bits = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80];
            var sensor = 0;
            for (var port = 0; port < bits.length; port++) {
                if ((used & bits[port]) === bits[port]) {
                    Device._sensors[sensor] = new Sensor(port);
                    console.log('connectSensors, port:%d', port);
                    sensor += 1;
                }
            }
            if (sensor !== total) {
                return;
            }
        }
    };
    Device.WriteTemperatureRequest = function (port) {
        var data = [0x01, 0x80, 0x01, 0x00, 0x00, port, 0x00, 0x00];
        Device.writeRequest(data);
    };
    Device.matchTemperature = function (data) {
        if (data.length === 8
            && data[0] === 0x80
            && data[1] === 0x08
            && data[2] === 0x01) {
            console.log('+matchTemperature, data: %d', JSON.stringify(data));
            var port = data[4];
            var msb = data[5];
            var lsb = data[6];
            var temperatureCelsius = this.GetTemperature(msb, lsb);
            Device.updateSensor(port, temperatureCelsius);
            return true;
        }
        else {
            return false;
        }
    };
    Device.GetTemperature = function (msb, lsb) {
        var temperature = 0.0;
        var reading = (lsb & 0xFF) + (msb << 8);
        var result = 1;
        if ((reading & 0x8000) > 0) {
            reading = (reading ^ 0xffff) + 1;
            result = -1;
        }
        temperature = result * reading / 16.0;
        return temperature;
    };
    Device.updateSensor = function (port, temperature) {
        if (Device._sensors != null) {
            var sensor = Device._sensors.find(function (s) { return s.port() === port; });
            if (sensor) {
                sensor.setValue(temperature);
                console.log('+updateSensor, port: %d, temperature %d', port, temperature);
            }
            else {
                console.error('-updateSensor - sensor undefined, port: %d, temperature %d', port, temperature);
            }
        }
        else {
            console.error('-updateSensor - no sensors, port: %d, temperature %d', port, temperature);
        }
    };
    Device.writeCheck03Request = function () {
        var data = [0x01, 0x8A, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00];
        this.writeRequest(data);
    };
    Device.matchCheck03 = function (data) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x03) {
            return true;
        }
        else {
            return false;
        }
    };
    Device.writeCheck05Request = function () {
        var data = [0x01, 0x8A, 0x01, 0x05, 0x00, 0x00, 0x00, 0x00];
        this.writeRequest(data);
    };
    Device.matchCheck05 = function (data) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x05) {
            return true;
        }
        else {
            return false;
        }
    };
    Device.writeCheck0DRequest = function () {
        var data = [0x01, 0x8A, 0x01, 0x0D, 0x00, 0x00, 0x00, 0x00];
        this.writeRequest(data);
    };
    Device.matchCheck0D = function (data) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x0D) {
            return true;
        }
        else {
            return false;
        }
    };
    Device.writeCheckFFRequest = function () {
        var data = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
        this.writeRequest(data);
    };
    Device.matchCheckFF = function (data) {
        if (data.length === 8
            && data[0] === 0xFF
            && data[1] === 0xFF
            && data[2] === 0xFF
            && data[3] === 0xFF) {
            return true;
        }
        else {
            return false;
        }
    };
    Device.POLL_INTERVALL = 5000;
    Device._sensors = [];
    Device._deviceInitlialized = false;
    Device._nextSensor = 0;
    Device._lastInputTime = Date.now();
    return Device;
}());
exports.Device = Device;
//# sourceMappingURL=temper8.js.map