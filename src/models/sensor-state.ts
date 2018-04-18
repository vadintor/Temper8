import { log } from './../logger';
import { SensorData } from './sensor-data';export interface FilterConfig {
    resolution?: number;
    maxTimeDiff?: number;
    ports?: number[];
}

export interface SensorDataListener {
    listener: (sensor: SensorData) => void;
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
    public addSensorDataListener(onSensorDataReceived: (sensor: SensorData) => void, filter: FilterConfig = {}): void {
        this.sensorDataListeners.push ({listener: onSensorDataReceived, filter});
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
        log.info('Time diff: ', timeDiff);
        return timeDiff > maxTimeDiff;
    }
    private updateSensorDataListeners(sensorData: SensorData, previousData: SensorData) {
        log.debug('updateSensorDataListeners');
        for (const publish of this.sensorDataListeners) {
            log.debug('updateSensorDataListeners, filter:', publish.filter);
            if (!publish.filter) {
                log.info('updateSensorDataListeners, no filter found');
                publish.listener(sensorData);
                Object.assign(previousData, sensorData);
            } else if (publish.filter.resolution &&
                this.valueDiff(sensorData, previousData, publish.filter.resolution) && sensorData.valid()) {
                log.info('updateSensorDataListeners, publish.filter.resolution');
                publish.listener(sensorData);
                Object.assign(previousData, sensorData);
            } else if (publish.filter.maxTimeDiff && sensorData.valid() &&
                this.timeDiff(sensorData, previousData, publish.filter.maxTimeDiff)) {
                log.info('updateSensorDataListeners, publish.filter.maxTimeDiff');
                publish.listener(sensorData);
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
