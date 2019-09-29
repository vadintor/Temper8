import { SensorState } from './sensor-state';
import { USBConfig, USBReporter } from './usb-device';
export declare class TemperGold extends SensorState implements USBReporter {
    constructor(config: USBConfig);
    private static model;
    private static SN;
    initWriteReport(): number[][];
    readReport(data: number[]): number[];
    private temperatureRequest;
    private matchTemperature;
    private GetTemperature;
}
