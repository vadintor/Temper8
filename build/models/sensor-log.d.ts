import { SensorAttributes } from '../models/sensor-attributes';
import { SensorState } from '../models/sensor-state';
export declare class SensorLog {
    private attr;
    private timestamp;
    private state;
    private logging;
    private MAX_TIME_DIFF;
    private axios;
    constructor(attr: SensorAttributes, state: SensorState);
    getAttr(): SensorAttributes;
    getState(): SensorState;
    startLogging(): void;
    stopLogging(): void;
    private onSensorDataReceived(data);
}
