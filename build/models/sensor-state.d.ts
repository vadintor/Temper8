import { SensorData } from './sensor-data';
export interface FilterConfig {
    resolution?: number;
    maxTimeDiff?: number;
    ports?: number[];
}
export interface SensorDataListener {
    listener: (sensor: SensorData) => void;
    filter?: FilterConfig;
}
export declare class Sensor {
    p: SensorData;
    s: SensorData;
}
export declare class SensorState {
    protected sensors: Sensor[];
    protected sensorDataListeners: SensorDataListener[];
    getSensorData(): SensorData[];
    addSensorDataListener(onSensorDataReceived: (sensor: SensorData) => void, filter?: FilterConfig): void;
    private round(data, resolution);
    private valueDiff(sensorData, previousData, resolution);
    private timeDiff(sensorData, previousData, maxTimeDiff);
    private updateSensorDataListeners(sensorData, previousData);
    protected updateSensor(port: number, temperature: number): void;
    protected connectSensors(total: number, used: number): void;
}
