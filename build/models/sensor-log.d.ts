import { SensorData } from '../models/sensor-data';
import { FilterConfig, SensorState } from '../models/sensor-state';
export interface SensorLogData {
    descr: {
        SN: string;
        port: number;
    };
    samples: SensorData[];
}
export declare class SensorLog {
    private state;
    private timestamp;
    private logging;
    private MAX_TIME_DIFF;
    private dataFilter;
    private axios;
    private socket;
    private connectionString;
    private client;
    private openSocket;
    constructor(state: SensorState);
    getState(): SensorState;
    getFilter(): FilterConfig;
    islogging(): boolean;
    startLogging(filter?: FilterConfig): void;
    stopLogging(): void;
    private printResultFor;
    private onSensorDataReceived;
    private onMonitor;
}
