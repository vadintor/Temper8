import HID = require('node-hid');
export interface USBConfig extends HID.Device {
}
export interface USBReporter {
    initWriteReport(): number[][];
    readReport(data: number[]): number[];
    maxSampleRate(): number;
}
export declare class USBDevice {
    private hid;
    private reporter;
    private POLL_INTERVAL;
    private MAX_SAMPLE_RATE;
    private deviceInitialized;
    private timer;
    constructor(hid: HID.HID, reporter: USBReporter);
    private pollIntervalChanged;
    initialize(): void;
    close(): void;
    private sampleRate;
    setPollingInterval(ms: number): void;
    getPollingInterval(): number;
    private pollSensors;
    private parseInput;
    private parseError;
    private writeReport;
}
