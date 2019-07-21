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
export declare class Sensor {
    p: SensorData;
    s: SensorData;
}
export declare class SensorState {
    protected sensors: Sensor[];
    protected sensorDataListeners: SensorDataListener[];
    getSensorData(): SensorData[];
    addSensorDataListener(onSensorDataReceived: (sensor: SensorData) => void, filter?: FilterConfig): void;
    private round;
    private valueDiff;
    private timeDiff;
    private filterPort;
    private updateSensorDataListeners;
    protected updateSensor(port: number, temperature: number): void;
    protected connectSensors(total: number, used: number): void;
}
