import { FilterConfig, SensorState } from '../models/sensor-state';
export interface Sample {
    date: number;
    value: number;
}
export interface SensorDescriptor {
    SN: string;
    port: number;
}
export interface SensorLogData {
    desc: SensorDescriptor;
    samples: Sample[];
}
export declare class SensorLog {
    retryCounter: number;
    private state;
    private timestamp;
    private logging;
    private MAX_TIME_DIFF;
    private dataFilter;
    private axios;
    private SHARED_ACCESS_KEY;
    private WS_URL;
    private WS_ORIGIN;
    private ITEMPER_URL;
    private socket;
    private createAxiosInstance;
    private openSocket;
    constructor(state: SensorState);
    private initSettings;
    getState(): SensorState;
    getFilter(): FilterConfig;
    islogging(): boolean;
    startLogging(filter?: FilterConfig): void;
    stopLogging(): void;
    private onDataReceived;
    private registerSensor;
    private onMonitor;
}
