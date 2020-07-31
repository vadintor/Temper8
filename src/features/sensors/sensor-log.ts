
import { SensorData } from './sensor-data';
import { FilterConfig, SensorState } from './sensor-state';

import { log } from '../../core/logger';

import { Category, Descriptor, ISensorLogService, SensorLogError } from './sensor-log-service';

enum LogStatus { Unregistered, Registering, Registered}

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
export class SensorLog {
    private logging: boolean = false;
    private status: LogStatus = LogStatus.Unregistered;
    private MAX_TIME_DIFF = 60_000;
    private dataFilter: FilterConfig= {
        resolution: 1,
        maxTimeDiff: this.MAX_TIME_DIFF};

    constructor(private state: SensorState, private logService: ISensorLogService) {
        this.logging = false;
        this.state.addSensorDataListener(this.onDataReceived.bind(this));
        this.state.addSensorDataListener(this.onMonitor.bind(this));
    }

    public getState(): SensorState {
        return this.state;
    }

    public getFilter(): FilterConfig {
        return this.dataFilter;
    }
    public islogging(): boolean {
        return this.logging;
    }
    public startLogging(filter?: FilterConfig): void {
        log.info('SensorLog.startLogging');
        if (filter) {
            this.dataFilter = filter;
        }
        this.logging = true;
    }
    public stopLogging(): void {
        log.info('SensorLog.stopLogging');
        this.logging = false;
    }

    private onDataReceived(data: SensorData): void {
        if (this.status !== LogStatus.Registered) {
            this.registerSensor(data);
        } else if (this.logging) {
            const desc = { SN: this.state.getAttr().SN, port: data.getPort()};
            const samples = [{date: data.timestamp(), value: data.getValue()}];
            const sensorLogData: SensorLogData = { desc, samples };
            this.logService.PostSensorLog(sensorLogData)
            .then((desc: Descriptor) => {
                log.info('sensor-log.onDataReceived: postSensorLog successful, desc=' + JSON.stringify(desc));
            })
            .catch((error: SensorLogError) => {
                log.error('sensor-log.onDataReceived: ' + JSON.stringify(error));
                if (error.status === 404) {
                    this.status = LogStatus.Unregistered;
                    this.registerSensor(data);
                }
            });
        } else {
            const debug = {status: LogStatus[this.status], logging: this.logging, data };
            log.error('sensor-log.onDataReceived: ' + JSON.stringify(debug));
        }
    }
    private registerSensor(data: SensorData): void {
        const stateAttr = this.state.getAttr();
        const attr = { model: stateAttr.model,
                        category: Category[stateAttr.category],
                        accuracy: stateAttr.accuracy,
                        resolution: stateAttr.resolution,
                        maxSampleRate: stateAttr.maxSampleRate};
        const desc = { SN: stateAttr.SN, port: data.getPort()};
        const registration = { desc, attr };
        log.error('sensor-log.registerSensor: desc=' + JSON.stringify(desc));
        if (this.status !== LogStatus.Registered) {
            const self = this;
            this.logService.registerSensor(registration)
            .then (function() {
                self.status = LogStatus.Registered;
                log.error('sensor-log.registerSensor: successful, desc=' + JSON.stringify(desc));
            })
            .catch(function(error: SensorLogError) {
                log.error('sensor-log.registerSensor: ' + JSON.stringify(error));
                self.status = LogStatus.Registering;
            });
        }
    }
    private onMonitor(data: SensorData): void {
        const desc = { SN: this.state.getAttr().SN, port: data.getPort()};
        const samples = [{date: data.timestamp(), value: data.getValue()}];
        const sensorLog = { desc, samples };
        this.logService.writeSensorLog(sensorLog);
    }
}
