import { SensorData } from './sensor-data';

export class SensorState {
        // Device has 8 ports, each of which can hold a 1-wire temperature sensor
    // or a humidity sensor, but the latter is out of scope.
    protected sensors: SensorData[]= [];
    // private  usedPorts: number[];
    protected sensorDataListeners: Array<(sensor: SensorData[])=>void>;
    protected errorListeners: Array<()=>void>;
    protected unrecoverableError = false;

    // TODO: Common for all sensors => refactor
    public getSensorData(): SensorData[] {
        return this.sensors.slice();
    }
    public addSensorDataListener(onSensorDataReceived: (sensor: SensorData[]) => void): void {
        this.sensorDataListeners.push (onSensorDataReceived);
    }
    public addUnrecoverableErrorListener(onError: ()=> void): void {
        this.errorListeners.push(onError);
    }

    protected updateSensorDataListeners(sensorData: SensorData[]) {
        for (const publish of this.sensorDataListeners) {
            publish(sensorData);
        }
    }
    protected updateOnErrorListeners() {
        // Publish once only
        if (!this.unrecoverableError) {
            this.unrecoverableError = true;
            for (const publish of this.errorListeners) {
                publish();
            }
        }
    }
    protected updateSensor(port: number, temperature: number) {
        if (this.sensors != null) {
            const sensor: SensorData | undefined = this.sensors.find(s => s.getPort() === port);
            if (sensor) {
                sensor.setValue(temperature);
                this.updateSensorDataListeners([sensor]);
                console.log('+updateSensor, port: %d, temperature %d', port, temperature);
            } else {
                console.error('-updateSensor - sensor undefined, port: %d, temperature %d', port, temperature);
            }
        } else {
            console.error('-updateSensor - no sensors, port: %d, temperature %d', port, temperature);
        }
    }
    protected connectSensors(total: number, used: number) {
        console.log('connectSensors, total:%d', total);
        if (this.sensors.length === 0) {

            this.sensors = Array<SensorData>(total);
            const bits: number[] = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80];
            let sensor: number = 0;

            // Check the bit array for used ports, one bit at a time
            for (let port = 0; port < bits.length; port++) {

                if ((used & bits[port]) === bits[port]) {
                    this.sensors[sensor] = new SensorData(port);
                    console.log('connectSensors, port:%d', port);
                    sensor += 1;
                }
            }

            if (sensor !== total) {
                // TODO: Error handling
                return;
            }
        }

    }
}
