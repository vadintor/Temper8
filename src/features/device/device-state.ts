import { DeviceStatus } from './device-status';

import { log } from '../../core/logger';
import { Setting, Settings  } from '../../core/settings';
export interface DeviceDataListener {
    publish: (status: DeviceStatus) => void;
}
export class DeviceState {
    protected deviceData: DeviceStatus;
    protected deviceDataListeners: DeviceDataListener[] = [];
    private previousData: DeviceStatus = new DeviceStatus();

    constructor() {
        Settings.onChange(Settings.HOSTNAME, this.hostnameChanged.bind(this));
    }
    public getDeviceData(): DeviceStatus {
        return this.deviceData;
    }
    public addDeviceDataListener(onDeviceDataReceived: (device: DeviceStatus) => void): void {
        this.deviceDataListeners.push ({publish: onDeviceDataReceived});
    }
    private hostnameChanged(setting: Setting) {
        const hostname = <string>setting.value;
        log.info('DeviceState. hostnameChanged to ' + hostname);
    }
    // private timeDiff(deviceData: DeviceData, previousData: DeviceData, maxTimeDiff: number): boolean {
    //     const timeDiff = deviceData.timestamp - previousData.timestamp;
    //     log.debug('deviceState.timeDiff diff=' + timeDiff);
    //     return timeDiff > maxTimeDiff;
    // }
    private updateDeviceDataListeners(deviceData: DeviceStatus, previousData: DeviceStatus) {
        let published: boolean = false;
        for (const listener of this.deviceDataListeners) {
                listener.publish(deviceData);
                published = true;
                Object.assign(previousData, deviceData);
        }
        if (published) {
            log.debug('DeviceState.updateDeviceDataListeners: Device data published to listener(s)');
        } else {
            log.debug('DeviceState.updateDeviceDataListeners: No device data published');
        }
    }
    protected updateDeviceData(data: DeviceStatus) {
        this.deviceData = data;
        this.updateDeviceDataListeners(data, this.previousData);
    }
}
