import { SensorData } from '../models/sensor-data';
import { FilterConfig, SensorState } from '../models/sensor-state';
export interface SensorLogData {
    desc: {
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
    private onSensorDataReceived;
    private onMonitor;
}
