
import HID = require('node-hid');
import os = require('os');
import { SensorData } from './sensor-data';

// ReportParser allow SensorDevice to be independent on the specific
// Temper device connected.
export interface ReportParser {
    initReport(): number[][];
    parseInput(data: number[]): number[];
    addSensorDataListener(onSensorDataReceived: (sensor: SensorData[]) => void): void;
    addUnrecoverableErrorListener(onError: ()=> void): void;
}
// Handle a sensor device on the USB hub.
export class USBController {
    private  hid: HID.HID;

    private reportParser: ReportParser;

    private POLL_INTERVAL = 5000;

    private deviceInitialized = false;

    private interval: NodeJS.Timer;

    constructor(hid: HID.HID, parser: ReportParser) {
        this.hid = hid;
        this.reportParser = parser;
        this.initializeDevice();
        this.pollSensors();
    }

    public initializeDevice() {
        if (!this.deviceInitialized) {
            this.hid.on('data', this.parseInput);
            this.hid.on('error', this.parseError);
            this.setPollingInterval(this.POLL_INTERVAL);
            this.deviceInitialized = true;
        }
    }

    public close() {
        this.deviceInitialized = false;
        try {
            this.hid.pause();
            this.hid.close();
        } catch (e) {
            return;
        }
    }

    public setPollingInterval(ms: number) {
        this.POLL_INTERVAL = ms;
        clearInterval(this.interval);
        this.interval = setInterval(this.pollSensors, this.POLL_INTERVAL);
    }

    // This is were all starts when set interval time expires
    private pollSensors() {
        if (! this.deviceInitialized) {
            this.initializeDevice();
        } else {
            const initCommands = this.reportParser.initReport();
            for (const command of initCommands) {
                this.writeReport(command);
            }
        }
    }
    // Called from HID, Parses input from HID and writes any response messages
    // back to the device
    private parseInput(data: number[]): void  {
        try {
            const response = this.reportParser.parseInput(data);
            if (response) {
                this.writeReport(response);
            }
        } catch (e) {
            // TODO error handling if parse input error
            return;
        }
    }
    private parseError(_error: any) {
        return;
    }

    // Helper functions to write reports to the device
    private writeReport(data: number[]): void {

        if (os.platform() === 'win32') {
            data.unshift(0);  // prepend a throwaway byte
        }

        // Output report
        for (let i = 0; i < 1; i++) {
            try {
                this.hid.write(data);
            } catch (e) {
                console.log('-hid.write catch:&d', JSON.stringify(data));
                this.close();
            }

        }
    }



}
