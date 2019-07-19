import { log } from './../logger';
import { SensorData } from './sensor-data';

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

    // or a humidity sensor, but the latter is out of scope.
    protected sensors: Sensor[] = [];
    // private  usedPorts: number[];
    protected sensorDataListeners: SensorDataListener[] = [];

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
    private round(data: SensorData, resolution: number): number {
        const multiplier = Math.pow(10, resolution || 0);
        return Math.round(data.getValue() * multiplier) / multiplier;
    }
    private valueDiff(sensorData: SensorData, previousData: SensorData, resolution: number): boolean {
        const valueDiff =  Math.abs(this.round(sensorData, resolution) - this.round(previousData, resolution));
        log.debug('value diff', valueDiff);
        return valueDiff > 0;
    }

    private timeDiff(sensorData: SensorData, previousData: SensorData, maxTimeDiff: number): boolean {
        const timeDiff = sensorData.timestamp() - previousData.timestamp();
        log.debug('Time diff: ', timeDiff);
        return timeDiff > maxTimeDiff;
    }
    private filterPort(sensorData: SensorData, filter: FilterConfig): boolean {
       return filter.ports? filter.ports.find(port => port === sensorData.getPort()) !== undefined: true;
    }
    private updateSensorDataListeners(sensorData: SensorData, previousData: SensorData) {
        log.debug('updateSensorDataListeners');
        for (const listener of this.sensorDataListeners) {
            log.debug('updateSensorDataListeners, filter:', listener.filter);
            if (!listener.filter) {
                log.debug('updateSensorDataListeners, no filter found');
                listener.publish(sensorData);
                Object.assign(previousData, sensorData);
                return;

            } else if (this.filterPort(sensorData, listener.filter) &&
                        listener.filter.resolution &&
                this.valueDiff(sensorData, previousData, listener.filter.resolution) && sensorData.valid()) {

                log.debug('updateSensorDataListeners, publish.filter.resolution');
                listener.publish(sensorData);
                Object.assign(previousData, sensorData);

            } else if (this.filterPort(sensorData, listener.filter) &&
                    listener.filter.maxTimeDiff && sensorData.valid() &&
                    this.timeDiff(sensorData, previousData, listener.filter.maxTimeDiff)) {
                log.debug('updateSensorDataListeners, publish.filter.maxTimeDiff');
                listener.publish(sensorData);
                Object.assign(previousData, sensorData);

            } else if (this.filterPort(sensorData, listener.filter)) {
                log.debug('updateSensorDataListeners, publish.filter.port');
                listener.publish(sensorData);
                Object.assign(previousData, sensorData);
            }
        }
    }
    protected updateSensor(port: number, temperature: number) {
        if (this.sensors !== null) {
            const sensor: Sensor | undefined = this.sensors.find(s => s.s.getPort() === port);
            if (sensor) {
                sensor.s.setValue(temperature);
                this.updateSensorDataListeners(sensor.s, sensor.p);
                log.debug('SensorState.updateSensor, port: %d, temperature %d', port, temperature);
            } else {
                log.error('*** SensorState.updateSensor, undefined, port: %d, temperature %d', port, temperature);
            }
        } else {
            log.error('*** SensorState.updateSensor, no sensors, port: %d, temperature %d', port, temperature);
        }
    }
    protected connectSensors(total: number, used: number) {
        log.debug('--- connectSensors, total:%d', total);
        if (this.sensors.length === 0) {

            this.sensors = new Array<Sensor>(total);
            log.debug('connectSensors, this.sensors.length: ', this.sensors.length);
            const bits: number[] = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80];
            let sensorIndex: number = 0;

            // Check the bit array for used ports, one bit at a time
            for (let bit = 0; bit < bits.length; bit++) {

                if ((used & bits[bit]) === bits[bit]) {
                    const port = bit;
                    log.debug('--- connectSensors, port: ', port);
                    this.sensors[sensorIndex] = { p: new SensorData(port), s: new SensorData(port) };
                    log.debug('+++ connectSensors, port: %d', port);
                    sensorIndex += 1;
                }
            }

            if (sensorIndex !== total) {
                // TODO: Error handling
                log.error('*** connectSensors, #sensors: %d !== total: %d', sensorIndex, total);
                return;
            }
        }

    }
}
