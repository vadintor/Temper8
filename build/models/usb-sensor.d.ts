import { Sensor } from './sensor';
export interface ReportParser {
    initReport(): number[][];
    parseInput(data: number[]): number[];
    getSensorData(): Sensor[];
    addSensorDataListener(onSensorDataReceived: (sensor: Sensor[]) => void): void;
    addUnrecoverableErrorListener(onError: () => void): void;
}
export declare class USBSensor {
    private hid;
    private reportParser;
    private POLL_INTERVAL;
    private deviceInitialized;
    private interval;
    private lastInputTime;
    constructor(devicePath: string, parser: ReportParser);
    initializeDevice(): void;
    close(): void;
    getSensorData(): Sensor[];
    setPollingInterval(ms: number): void;
    private pollSensors();
    private parseInput(data);
    private parseError(_error);
    private writeReport(data);
}
