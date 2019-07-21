import { SensorAttributes } from '../models/sensor-attributes';
import { SensorState } from '../models/sensor-state';
export declare class SensorLog {
    private attr;
    private timestamp;
    private state;
    private logging;
    private MAX_TIME_DIFF;
    private axios;
    private socket;
    private open;
    private connectionString;
    private client;
    constructor(attr: SensorAttributes, state: SensorState);
    getAttr(): SensorAttributes;
    getState(): SensorState;
    startLogging(): void;
    stopLogging(): void;
    private printResultFor;
    private onSensorDataReceived;
    private onMonitor;
}
