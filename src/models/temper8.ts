
import HID = require('node-hid');
import os = require('os');


export class Sensor {
    private _port: number = -1;     // The sensor knows which port it is connected to.
    private _value: number = 85.0;         // Temperature value in degrees celsius

    constructor(port: number = -1, value: number = 85.0) {
        this._port = port;
        this._value = value;
    }

    value(): number {
        return this._value;
    }

    valid(): boolean {
        return this._value < 85.0;
    }

    setValue(value: number) {
        this._value = value;
    }

    setPort(port: number) {
        this._port = port;
    }

    port(): number {
        return this._port;
    }

    isConnected(): boolean {
        return this._port >= 0;
    }
}

export class Device {
    private static _hid1: HID.HID;  // representing HID Interface 1 on Device

    // Device has 8 ports, each of which can hold a 1-wire temperature sensor
    // or a humidity sensor, but the latter is out of scope.

    private static readonly POLL_INTERVALL = 5000;
    private static _sensors: Sensor[]= [];
    // private static _usedPorts: number[];

    private static _deviceInitlialized = false;
    private static _nextSensor: number = 0;
    private static _interval: NodeJS.Timer;
    private static _lastInputTime = Date.now();


    constructor() {
        Device.initlialize();
    }

    public static initlialize() {
        if (!Device._deviceInitlialized) {

            const _devices: HID.Device[] = HID.devices();

            const deviceInfo: HID.Device | undefined = _devices.find(d => {

                const VID = 0x0C45;
                const PID = 0x7401;

                const isTemper: boolean = d.vendorId === VID && d.productId === PID;
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

    }

    private static close() {
        Device._nextSensor = 0;
        Device._deviceInitlialized = false;
        try {
            Device._hid1.pause();
            Device._hid1.close();
        } catch (e) {
            return;
        }
    }

    // Polls the device by doing the following write and reads cyclically
    // 1. Write a request and read used ports, i.e. which ports have a sensor connected?
    // 2. Write a request and read the temperature from each sensor starting from port 0 up to 7
    // 4. repeat at regular intervalls
    // A temperature read of a sensor takes approx 820 ms. ie the more sensor the longer tiem between poliing
    // each intervall

    // This function drives the polling cycle
    public static pollSensors() {
        if (! Device._deviceInitlialized) {
            Device.initlialize();
        } else {
            Device.writeUsedPortsRequest();
            if (Date.now() - Device._lastInputTime > 2 * Device.POLL_INTERVALL) {
                Device.WriteTemperatureRequest(0);
            }
        }

    }
    public static getSensorData(): Sensor[] {
        return Device._sensors.slice();
    }

    private static parseError(_error: any) {
        return;
    }
    // This function parses all input reports and check whatto di
    // We are interested in two types of data from the device: which ports are used and
    // the temperature of the sensors connected.
    private static parseInput(data: number[]) {
        Device._lastInputTime = Date.now();
        try {
            if (Device.matchUsedPorts(data)) {
                Device.WriteTemperatureRequest(Device._sensors[Device._nextSensor].port());
                Device._nextSensor += 1;

            } else if (Device.matchTemperature(data)) {
                if (Device._nextSensor < Device._sensors.length) {
                    Device.WriteTemperatureRequest(Device._sensors[Device._nextSensor].port());
                    Device._nextSensor += 1;

                } else {
                    Device._nextSensor = 0;
                    Device.writeCheck03Request();
                }
            } else if (Device.matchCheck03(data)) {
                Device.writeCheck05Request();

            } else if (Device.matchCheck05(data)) {
                Device.writeCheck0DRequest();

            } else if (Device.matchCheck0D(data)) {
                return;
                // Device.writeUsedPortsRequest();
            } else if (Device.matchCheckFF(data)) {
                Device.writeCheckFFRequest();
                console.log('--matchCheckFF: restart');
                return;
            }
        } catch (e) {
            console.log(e);
        }
    }

    // Helper functions to write reports to the device
    private static writeRequest(data: number[]) {

        if (os.platform() === 'win32') {
            data.unshift(0);  // prepend a throwaway byte
        }

        // Output report
        for (let i = 0; i < 1; i++) {
            try {
                Device._hid1.write(data);
            } catch (e) {
                console.log('-_hid1.write catch:&d', JSON.stringify(data));
                Device.close();
            }

        }
    }

    // Poll used ports
    private static writeUsedPortsRequest() {
        const data: number[] = [0x01, 0x8A, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00];
        this.writeRequest(data);
    }

    private static matchUsedPorts(data: number[]): boolean {
        // Make sure the input report states sensors
        // connected to the device. These hex values were found by using using USBlyzer
        // I.e. they might be different on your Device device

        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x01) {
            // Byte 4 contains no of sensors and
            // Byte 5 contains a bit array of connected sensors
            Device.connectSensors(data[4], data[5]);
            return true;
        } else {
            return false;
        }
    }

    private static connectSensors(total: number, used: number) {
        console.log('connectSensors, total:%d', total);
        if (Device._sensors.length === 0) {

            Device._sensors = Array<Sensor>(total);
            const bits: number[] = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80];
            let sensor: number = 0;

            // Check the bit array for used ports, one bit at a time
            for (let port = 0; port < bits.length; port++) {

                if ((used & bits[port]) === bits[port]) {
                    Device._sensors[sensor] = new Sensor(port);
                    console.log('connectSensors, port:%d', port);
                    sensor += 1;
                }
            }

            if (sensor !== total) {
                // TODO: Error handling
                return;
            }
        }

    }

    // Poll temperature and update sensor data
    private static WriteTemperatureRequest(port: number) {
        const data: number[] = [0x01, 0x80, 0x01, 0x00, 0x00, port, 0x00, 0x00];
        Device.writeRequest(data);
    }

    private static matchTemperature(data: number[]) {
        // get the temperature and update sensor value

        // Make sure the HID input report is a temperature report,
        // These hex values were found by analyzing USB using USBlyzer.
        // I.e. they might be different on your Device device
        // byte 4 contains the port number.
        if (data.length === 8
            && data[0] === 0x80
            && data[1] === 0x08
            && data[2] === 0x01) {
            console.log('+matchTemperature, data: %d', JSON.stringify(data));
            const port: number = data[4];
            const msb: number = data[5];
            const lsb: number = data[6];
            const temperatureCelsius: number = this.GetTemperature(msb, lsb);

            Device.updateSensor(port, temperatureCelsius);
            return true;
        } else {
            return false;
        }
    }

    private static GetTemperature(msb: number, lsb: number): number {
        let temperature: number = 0.0;

        let reading: number = (lsb & 0xFF) + (msb << 8);

        // Asume positive temperature value
        let result: number = 1;

        if ((reading & 0x8000) > 0) {
            // Below zero
            // get the absolute value by converting two's complement
            reading = (reading ^ 0xffff) + 1;

            // Remember a negative result
            result = -1;
        }

        // The east significant bit is 2^-4 so we need to devide by 16 to get absolute temperature in Celsius
        // Multiply in the result to get whether the temperature is below zero degrees and convert to
        // floating point
        temperature = result * reading / 16.0;

        return temperature;
    }

    private static updateSensor(port: number, temperature: number) {
        if (Device._sensors != null) {
            const sensor: Sensor | undefined = Device._sensors.find(s => s.port() === port);

            if (sensor) {
                sensor.setValue(temperature);
                console.log('+updateSensor, port: %d, temperature %d', port, temperature);
            } else {
                console.error('-updateSensor - sensor undefined, port: %d, temperature %d', port, temperature);
            }
        } else {
            console.error('-updateSensor - no sensors, port: %d, temperature %d', port, temperature);
        }
    }

    // Poll checks
    private static writeCheck03Request() {
        const data: number[] = [0x01, 0x8A, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00];
        this.writeRequest(data);
    }
    private static matchCheck03(data: number[]) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x03) {
            return true;
        } else {
            return false;
        }
    }
    private static writeCheck05Request() {
        const data: number[] = [0x01, 0x8A, 0x01, 0x05, 0x00, 0x00, 0x00, 0x00];
        this.writeRequest(data);
    }
    private static matchCheck05(data: number[]) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x05) {
            return true;
        } else {
            return false;
        }
    }
    private static writeCheck0DRequest() {
        const data: number[] = [0x01, 0x8A, 0x01, 0x0D, 0x00, 0x00, 0x00, 0x00];
        this.writeRequest(data);
    }
    private static matchCheck0D(data: number[]) {
        if (data.length === 8
            && data[0] === 0x8A
            && data[1] === 0x08
            && data[2] === 0x01
            && data[3] === 0x0D) {
            return true;
        } else {
            return false;
        }
    }

    private static writeCheckFFRequest() {
        const data: number[] = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];
        this.writeRequest(data);
    }
    private static matchCheckFF(data: number[]) {
        if (data.length === 8
            && data[0] === 0xFF
            && data[1] === 0xFF
            && data[2] === 0xFF
            && data[3] === 0xFF) {
            return true;
        } else {
            return false;
        }
    }

}
