import { log } from './../logger';
import { SensorAttributes } from './sensor-attributes';
import { SensorData } from './sensor-data';

import { Setting, Settings  } from './settings';

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
        log.info('SensorState.SNChanged to' + sn);
    }
    private round(data: SensorData, resolution: number): number {
        const multiplier = Math.pow(10, resolution || 0);
        return Math.round(data.getValue() * multiplier) / multiplier;
    }
    private valueDiff(sensorData: SensorData, previousData: SensorData, resolution: number): boolean {
        const valueDiff =  Math.abs(this.round(sensorData, resolution) - this.round(previousData, resolution));
        log.debug('SensorState.valueDiff: diff=' + valueDiff);
        return valueDiff > 0;
    }

    private timeDiff(sensorData: SensorData, previousData: SensorData, maxTimeDiff: number): boolean {
        const timeDiff = sensorData.timestamp() - previousData.timestamp();
        log.debug('SensorState.timeDiff diff=' + timeDiff);
        return timeDiff > maxTimeDiff;
    }
    private filterPort(sensorData: SensorData, filter: FilterConfig): boolean {
       return filter.ports? filter.ports.find(port => port === sensorData.getPort()) !== undefined: true;
    }
    private updateSensorDataListeners(sensorData: SensorData, previousData: SensorData) {
        let published: boolean = false;
        log.debug('SensorState.updateSensorDataListeners: filtering before publishing');
        for (const listener of this.sensorDataListeners) {
            log.debug('SensorState.updateSensorDataListeners: filter:' + JSON.stringify(listener.filter));
            if (!listener.filter) {
                log.debug('SensorState.updateSensorDataListeners: no filter found');
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
                log.debug('SensorState.updateSensorDataListeners: publish.filter.maxTimeDiff');
                listener.publish(sensorData);
                published = true;
                Object.assign(previousData, sensorData);

            } else if (this.filterPort(sensorData, listener.filter)) {
                log.debug('SensorState.updateSensorDataListeners: publish.filter.port');
                listener.publish(sensorData);
                published = true;
                Object.assign(previousData, sensorData);
            }
        }
        if (published) {
            log.info('SensorState.updateSensorDataListeners: Sensor data published to listener(s)');
        } else {
            log.debug('SensorState.updateSensorDataListeners: No sensor data published');
        }

    }
    protected updateSensor(port: number, temperature: number) {
        if (this.sensors !== null) {
            const sensor: Sensor | undefined = this.sensors.find(s => s.s.getPort() === port);
            if (sensor) {
                sensor.s.setValue(temperature);
                this.updateSensorDataListeners(sensor.s, sensor.p);
                log.info('SensorState.updateSensor: sensor updated, port=' + port + ', temperature=' + temperature);
            } else {
                log.error('SensorState.updateSensor: undefined port=' + port + ', temperature=' + temperature);
            }
        } else {
            log.error('SensorState.updateSensor: no sensors, port=' + port + ', temperature=' + temperature);
        }
    }

    protected connectSensors(ports: number[]) {
        log.debug('SensorState.connectSensors: ports=' + JSON.stringify(ports));
        if (this.sensors.length === 0) {

            this.sensors = new Array<Sensor>(ports.length);

            for (let port = 0; port < ports.length; port++) {
                this.sensors[port] = { p: new SensorData(ports[port]), s: new SensorData(ports[port]) };
            }
        }

    }
}
