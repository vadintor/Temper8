import { DeviceData } from './device-data';
import { DeviceState } from './device-state';
export interface DeviceDataLog {
    data: DeviceData;
}
export declare class DeviceLog {
    retryCounter: number;
    private state;
    private timestamp;
    private logging;
    private axios;
    private SHARED_ACCESS_KEY;
    private ITEMPER_URL;
    private createAxiosInstance;
    constructor(state: DeviceState);
    private initSettings;
    getState(): DeviceState;
    islogging(): boolean;
    startLogging(): void;
    stopLogging(): void;
    private onDataReceived;
}
