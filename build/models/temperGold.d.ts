import { Sensor } from './sensor';
export declare class Device {
    private static _hid1;
    private static readonly POLL_INTERVALL;
    private static _sensors;
    private static _deviceInitialized;
    private static _nextSensor;
    private static _interval;
    private static _lastInputTime;
    private static _temperGold;
    constructor();
    static initialize(): void;
    private static close();
    static pollSensors(): void;
    static getSensorData(): Sensor[];
    private static parseError(_error);
    private static parseInput(data);
    private static writeRequest(data);
    private static connectSensors(total, used);
    private static WriteTemperatureRequest(port);
    private static matchTemperature(data);
    private static GetTemperature(msb, lsb);
    private static updateSensor(port, temperature);
}
