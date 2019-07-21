import { SensorState } from './sensor-state';
import { ReportParser } from './usb-controller';
export declare class TemperGold extends SensorState implements ReportParser {
    constructor();
    initReport(): number[][];
    parseInput(data: number[]): number[];
    private temperatureRequest;
    private matchTemperature;
    private GetTemperature;
}
