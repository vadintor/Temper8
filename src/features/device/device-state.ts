import { DeviceData } from './device-data';

import { log } from '../../core/logger';
import { Setting, Settings  } from '../../core/settings';
export interface DeviceDataListener {
    publish: (status: DeviceData) => void;
}
export class DeviceState {
    protected deviceData: DeviceData;
    protected deviceDataListeners: DeviceDataListener[] = [];
    private previousData: DeviceData = new DeviceData();

    constructor() {
        Settings.onChange(Settings.HOSTNAME, this.hostnameChanged.bind(this));
    }
    public getDeviceData(): DeviceData {
        return this.deviceData;
    }
    public addDeviceDataListener(onDeviceDataReceived: (device: DeviceData) => void): void {
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
    private updateDeviceDataListeners(deviceData: DeviceData, previousData: DeviceData) {
        let published: boolean = false;
        log.debug('DeviceState.updateDeviceDataListeners: no filtering before publishing');
        for (const listener of this.deviceDataListeners) {
                listener.publish(deviceData);
                published = true;
                log.debug('DeviceState.updateDeviceDataListeners, previousData=' + previousData);
                log.debug('DeviceState.updateDeviceDataListeners, deviceData=' + deviceData);
                Object.assign(previousData, deviceData);
        }
        if (published) {
            log.info('DeviceState.updateDeviceDataListeners: Device data published to listener(s)');
        } else {
            log.debug('DeviceState.updateDeviceDataListeners: No device data published');
        }
    }
    protected updateDeviceData(data: DeviceData) {
        this.deviceData = data;
        this.updateDeviceDataListeners(data, this.previousData);
        log.info('DeviceState.updateDeviceData: device data updated' + data.timestamp);
    }
}
