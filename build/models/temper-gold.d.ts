import { SensorState } from './sensor-state';
import { USBReporter } from './usb-device';
export declare class TemperGold extends SensorState implements USBReporter {
    constructor();
    initWriteReport(): number[][];
    readReport(data: number[]): number[];
    private temperatureRequest;
    private matchTemperature;
    private GetTemperature;
}
