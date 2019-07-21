import HID = require('node-hid');
export interface ReportParser {
    initReport(): number[][];
    parseInput(data: number[]): number[];
}
export declare class USBController {
    private hid;
    private reportParser;
    private POLL_INTERVAL;
    private deviceInitialized;
    private interval;
    constructor(hid: HID.HID, parser: ReportParser);
    initializeDevice(): void;
    close(): void;
    setPollingInterval(ms: number): void;
    private pollSensors;
    private parseInput;
    private parseError;
    private writeReport;
}
