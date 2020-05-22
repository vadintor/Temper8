import { DeviceData } from './device-data';
export interface DeviceDataListener {
    publish: (status: DeviceData) => void;
}
export declare class DeviceState {
    protected deviceData: DeviceData;
    protected deviceDataListeners: DeviceDataListener[];
    private previousData;
    constructor();
    getDeviceData(): DeviceData;
    addDeviceDataListener(onDeviceDataReceived: (device: DeviceData) => void): void;
    private hostnameChanged;
    private updateDeviceDataListeners;
    protected updateDeviceData(data: DeviceData): void;
}
