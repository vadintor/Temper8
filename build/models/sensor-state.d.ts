import { SensorAttributes } from './sensor-attributes';
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
    protected attr: SensorAttributes;
    protected sensors: Sensor[];
    protected sensorDataListeners: SensorDataListener[];
    constructor(attr: SensorAttributes);
    getAttr(): SensorAttributes;
    setAttr(attr: SensorAttributes): void;
    maxSampleRate(): number;
    getSensorData(): SensorData[];
    addSensorDataListener(onSensorDataReceived: (sensor: SensorData) => void, filter?: FilterConfig): void;
    private SNChanged;
    private round;
    private valueDiff;
    private timeDiff;
    private filterPort;
    private updateSensorDataListeners;
    protected updateSensor(port: number, temperature: number): void;
    protected connectSensors(ports: number[]): void;
}
