import { log } from '../../core/logger';
import { SensorAttributes } from './sensor-attributes';
import { SensorData } from './sensor-data';

import { Setting, Settings  } from '../../core/settings';

export interface FilterConfig {
    resolution?: number;
    maxTimeDiff?: number;
    ports?: number[];
}

export interface SensorDataListener {
    publish: (sensor: SensorData) => void;
    filter?: FilterConfig;
}
export class Sensor { public p: SensorData; public s: SensorData;}
export class SensorState {
    protected attr: SensorAttributes;
    protected sensors: Sensor[] = [];
    private updateSensorError = false;

    protected sensorDataListeners: SensorDataListener[] = [];

    constructor(attr: SensorAttributes) {
        this.attr = attr;
        Settings.onChange(Settings.SERIAL_NUMBER, this.SNChanged.bind(this));
    }

    public getAttr(): SensorAttributes {
        return this.attr;
    }

    public setAttr(attr: SensorAttributes): void {
        this.attr = attr;
    }

    public maxSampleRate(): number {
        return this.attr.maxSampleRate;
    }

    public getSensorData(): SensorData[] {
        const sensorData: SensorData[] = [];
        for (const sensor of this.sensors) {
            sensorData.push(sensor.s);
        }
        return sensorData.slice();
    }
    public addSensorDataListener(onSensorDataReceived: (sensor: SensorData) => void, filter?: FilterConfig): void {
        this.sensorDataListeners.push ({publish: onSensorDataReceived, filter});
    }
    private SNChanged(setting: Setting) {
        const sn = <string>setting.value;
        this.attr.SN = sn;
        log.info('SensorState.SNChanged to ' + sn);
    }
    private round(data: SensorData, resolution: number): number {
        const multiplier = Math.pow(10, resolution || 0);
        return Math.round(data.getValue() * multiplier) / multiplier;
    }
    private valueDiff(sensorData: SensorData, previousData: SensorData, resolution: number): boolean {
        const valueDiff =  Math.abs(this.round(sensorData, resolution) - this.round(previousData, resolution));
        return valueDiff > 0;
    }

    private timeDiff(sensorData: SensorData, previousData: SensorData, maxTimeDiff: number): boolean {
        const timeDiff = sensorData.timestamp() - previousData.timestamp();
        return timeDiff > maxTimeDiff;
    }
    private filterPort(sensorData: SensorData, filter: FilterConfig): boolean {
       return filter.ports? filter.ports.find(port => port === sensorData.getPort()) !== undefined: true;
    }
    private updateSensorDataListeners(sensorData: SensorData, previousData: SensorData) {
        let published: boolean = false;
        for (const listener of this.sensorDataListeners) {
            if (!listener.filter) {
                listener.publish(sensorData);
                published = true;
                Object.assign(previousData, sensorData);

            } else if (this.filterPort(sensorData, listener.filter) &&
                        listener.filter.resolution &&
                this.valueDiff(sensorData, previousData, listener.filter.resolution) && sensorData.valid()) {

                listener.publish(sensorData);
                published = true;
                Object.assign(previousData, sensorData);

            } else if (this.filterPort(sensorData, listener.filter) &&
                    listener.filter.maxTimeDiff && sensorData.valid() &&
                    this.timeDiff(sensorData, previousData, listener.filter.maxTimeDiff)) {
                listener.publish(sensorData);
                published = true;
                Object.assign(previousData, sensorData);

            } else if (this.filterPort(sensorData, listener.filter)) {
                listener.publish(sensorData);
                published = true;
                Object.assign(previousData, sensorData);
            }
        }
        if (published) {
            log.debug('SensorState.updateSensorDataListeners: Sensor data published to listener(s)');
        }
    }
    protected updateSensor(port: number, sampleValue: number) {
        if (this.sensors !== null) {
            const sensor: Sensor | undefined = this.sensors.find(s => s.s.getPort() === port);
            if (sensor) {
                sensor.s.setValue(sampleValue);
                this.updateSensorDataListeners(sensor.s, sensor.p);
                this.updateSensorError = false;
                log.debug('SensorState.updateSensor: sensor updated, port=' + port + ', sampleValue=' + sampleValue);
            } else {
                if (!this.updateSensorError) {
                    this.updateSensorError = true;
                    log.error('SensorState.updateSensor: undefined port=' + port + ', sampleValue=' + sampleValue);
                }
            }
        } else {
            if (!this.updateSensorError) {
                this.updateSensorError = true;
                log.error('SensorState.updateSensor: no sensors, port=' + port + ', sampleValue=' + sampleValue);
            }
        }
    }

    protected connectSensors(ports: number[]) {
        if (this.sensors.length === 0) {
            this.sensors = new Array<Sensor>(ports.length);
            for (let port = 0; port < ports.length; port++) {
                this.sensors[port] = { p: new SensorData(ports[port]), s: new SensorData(ports[port]) };
            }
        }
    }
}
