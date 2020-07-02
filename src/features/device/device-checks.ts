
import { DeviceData } from './device-data';
import { DeviceState } from './device-state';

import * as os from 'os';

import { log } from '../../core/logger';

export class DeviceChecks extends DeviceState {
    // Interface methods implementation

    constructor() {
        super();
    }

    public check(): void {
        log.debug('DeviceChecks.check');
        const data: DeviceData = new DeviceData();
        data.timestamp = Date.now();
        data.hostname = os.hostname();
        data.loadavg = os.loadavg();
        data.uptime = os.uptime();
        data.freemem = os.freemem();
        data.totalmem = os.totalmem();
        data.release = os.release();
        data.networkInterfaces = os.networkInterfaces();
        data.userInfo = os.userInfo();
        data.memoryUsage = process.memoryUsage();
        data.cpuUsage = process.cpuUsage();
        data.pid = process.pid;
        log.debug('DeviceChecks.check data=' + JSON.stringify(data));
        this.updateDeviceData(data);
    }


}
