import { SensorState } from './sensor-state';
import { ReportParser } from './usb-controller';
export declare class Temper8 extends SensorState implements ReportParser {
    protected nextSensor: number;
    initReport(): number[][];
    parseInput(data: number[]): number[];
    private usedPortsRequest;
    private matchUsedPorts;
    private temperatureRequest;
    private matchTemperature;
    private GetTemperature;
    private check03Request;
    private matchCheck03;
    private check05Request;
    private matchCheck05;
    private check0DRequest;
    private matchCheck0D;
    private matchCheckFF;
}
