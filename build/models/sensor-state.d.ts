import { SensorData } from './sensor-data';
export declare class SensorState {
    protected sensors: SensorData[];
    protected sensorDataListeners: Array<(sensor: SensorData[]) => void>;
    getSensorData(): SensorData[];
    addSensorDataListener(onSensorDataReceived: (sensor: SensorData[]) => void): void;
    protected updateSensorDataListeners(sensorData: SensorData[]): void;
    protected updateSensor(port: number, temperature: number): void;
    protected connectSensors(total: number, used: number): void;
}
