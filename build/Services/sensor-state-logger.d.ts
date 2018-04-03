import { SensorState } from '../models/sensor-state';
export declare class SensorStateLogger {
    private sensorStates;
    private logging;
    constructor(sensorStates: SensorState[]);
    startLogging(): void;
    stopLogging(): void;
    private onSensorDataReceived(sensorData);
}
